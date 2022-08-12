import { startAfter } from '@angular/fire/firestore';
import { DocumentReference, limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { Identifiable } from '../models/identifiable.model';
import { PageData } from '../models/page-data.model';
import { FirestoreService } from './firestore.service';

export abstract class CrudService<I extends Identifiable, E extends Identifiable> {
  private concatPagelastId: string;
  private concatPageData: PageData<E>;

  constructor(
    private collectionPathPostfix: string,
    protected orderByField: string,
    protected authService: AuthService,
    protected firestoreService: FirestoreService
  ) {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  create(data: Partial<E>): Observable<DocumentReference<any> | void> {
    return this.firestoreService
      .add(this.collectionPath(), this.convertToInternal(data))
      .pipe(tap(() => this.resetConcatenated()));
  }

  read(id: string): Observable<E> {
    return this.firestoreService.get<I>(`${this.collectionPath()}/${id}`).pipe(map((data) => this.convertFromInternal(data)));
  }

  update(id: string, data: Partial<E>) {
    return this.firestoreService
      .update(`${this.collectionPath()}/${id}`, this.convertToInternal(data))
      .pipe(tap(() => this.resetConcatenated()));
  }

  delete(id: string): Observable<void> {
    return this.firestoreService
      .delete(`${this.collectionPath()}/${id}`)
      .pipe(tap(() => this.resetConcatenated()));
  }

  listCollection(queryConstraint: QueryConstraint[]): Observable<E[]> {
    return this.firestoreService.list<I>(`${this.collectionPath()}`, ...queryConstraint).pipe(map((data) => this.convertAllFromInternal(data)));
  }

  listConcatenated(pageSize: number): Observable<PageData<E>> {
    return this.listSinglePage(pageSize, this.concatPagelastId).pipe(
      map((newDatas): PageData<E> => {
        this.concatPageData.data = this.concatPageData.data.concat(
          newDatas.filter(
            (
              newData // add only elements which IDs are not already there
            ) => !this.elementInArray(newData)
          )
        );
        this.concatPagelastId =
          this.concatPageData.data.length > 0
            ? this.concatPageData.data[this.concatPageData.data.length - 1].id
            : '';
        this.concatPageData.hasMore = newDatas.length > 0 && newDatas.length >= pageSize;

        return this.concatPageData;
      })
    );
  }

  resetConcatenated(): void {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  protected abstract convertToInternal(data: Partial<E>): Partial<I>;

  protected abstract convertFromInternal(data: I): E;

  protected convertAllFromInternal(data: I[]): E[] {
    return data.map((seizure) => this.convertFromInternal(seizure));
  }

  protected collectionPath(): string {
    return `users/${this.authService.user().uid}/${this.collectionPathPostfix}`;
  }

  private elementInArray(element: Identifiable): boolean {
    return this.concatPageData.data.some((data) => data.id === element.id);
  }

  private listSinglePage(pageSize: number, startAfterId: string): Observable<E[]> {
    let queryConstraint: QueryConstraint[] = [orderBy(this.orderByField, 'desc'), limit(pageSize)];

    let listCollection$: Observable<E[]>;
    if (startAfterId) {
      listCollection$ = this.firestoreService
        .getRaw(`${this.collectionPath()}/${startAfterId}`)
        .pipe(
          switchMap((startAfterDoc) =>
            this.listCollection([...queryConstraint, startAfter(startAfterDoc)])
          )
        );
    } else {
      listCollection$ = this.listCollection(queryConstraint);
    }

    return listCollection$;
  }
}
