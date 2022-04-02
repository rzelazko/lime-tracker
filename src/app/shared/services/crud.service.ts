import { startAfter } from '@angular/fire/firestore';
import { limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Identifiable } from '../models/identifiable.model';
import { PageData } from '../models/page-data.model';
import { FirestoreService } from './firestore.service';

export class CrudService<T extends Identifiable> {
  private concatPagelastId: string;
  private concatPageData: PageData<T>;

  constructor(
    private collectionPath: string,
    private orderByField: string,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  create(data: Partial<T>) {
    return this.firestoreService
      .add(`users/${this.authService.user().uid}/${this.collectionPath}`, data)
      .pipe(tap(() => this.resetConcatenated()));
  }

  read(id: string) {
    return this.firestoreService.get<T>(
      `users/${this.authService.user().uid}/${this.collectionPath}/${id}`
    );
  }

  update(id: string, data: Partial<T>) {
    return this.firestoreService
      .set(`users/${this.authService.user().uid}/${this.collectionPath}/${id}`, data)
      .pipe(tap(() => this.resetConcatenated()));
  }

  delete(id: string) {
    return this.firestoreService
      .delete(`users/${this.authService.user().uid}/${this.collectionPath}/${id}`)
      .pipe(
        map(
          (): PageData<T> => ({
            hasMore: this.concatPageData.hasMore,
            data: this.concatPageData.data.filter((data) => data.id !== id),
          })
        )
      );
  }

  listCollection(queryConstraint: QueryConstraint[]) {
    return this.firestoreService.list<T>(
      `users/${this.authService.user().uid}/${this.collectionPath}`,
      ...queryConstraint
    );
  }

  listSinglePage(pageSize: number, startAfterId: string) {
    let queryConstraint: QueryConstraint[] = [orderBy(this.orderByField, 'desc'), limit(pageSize)];

    let listCollection$: Observable<T[]>;
    if (startAfterId) {
      listCollection$ = this.firestoreService
        .getRaw(`users/${this.authService.user().uid}/${this.collectionPath}/${startAfterId}`)
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

  private elementInArray(element: Identifiable) {
    return this.concatPageData.data.some((data) => data.id === element.id);
  }
}
