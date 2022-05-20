import { startAfter } from '@angular/fire/firestore';
import { DocumentReference, limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { Identifiable } from '../models/identifiable.model';
import { PageData } from '../models/page-data.model';
import { FirestoreService } from './firestore.service';

export class CrudService<T extends Identifiable> {
  private concatPagelastId: string;
  private concatPageData: PageData<T>;

  constructor(
    private collectionPathPostfix: string,
    protected orderByField: string,
    protected authService: AuthService,
    protected firestoreService: FirestoreService
  ) {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  create(data: Partial<T>): Observable<DocumentReference<any> | void> {
    return this.firestoreService
      .add(this.collectionPath(), data)
      .pipe(tap(() => this.resetConcatenated()));
  }

  read(id: string) {
    return this.firestoreService.get<T>(`${this.collectionPath()}/${id}`);
  }

  update(id: string, data: Partial<T>) {
    return this.firestoreService
      .update(`${this.collectionPath()}/${id}`, data)
      .pipe(tap(() => this.resetConcatenated()));
  }

  delete(id: string) {
    return this.firestoreService
      .delete(`${this.collectionPath()}/${id}`)
      .pipe(tap(() => this.resetConcatenated()));
  }

  listCollection(queryConstraint: QueryConstraint[]) {
    return this.firestoreService.list<T>(`${this.collectionPath()}`, ...queryConstraint);
  }

  listConcatenated(pageSize: number) {
    return this.listSinglePage(pageSize, this.concatPagelastId).pipe(
      map((newDatas): PageData<T> => {
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

  resetConcatenated() {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  protected collectionPath() {
    return `users/${this.authService.user().uid}/${this.collectionPathPostfix}`;
  }

  private elementInArray(element: Identifiable) {
    return this.concatPageData.data.some((data) => data.id === element.id);
  }

  private listSinglePage(pageSize: number, startAfterId: string) {
    let queryConstraint: QueryConstraint[] = [orderBy(this.orderByField, 'desc'), limit(pageSize)];

    let listCollection$: Observable<T[]>;
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
