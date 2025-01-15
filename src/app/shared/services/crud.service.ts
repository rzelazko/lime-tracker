import { inject } from '@angular/core';
import { startAfter } from '@angular/fire/firestore';
import { DocumentReference, limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './../../shared/services/auth.service';
import { Identifiable } from './../models/identifiable.model';
import { PageData } from './../models/page-data.model';
import { FirestoreService } from './firestore.service';

export abstract class CrudService<I extends Identifiable, E extends Identifiable> {
  private concatPagelastId: string;
  private concatPageData: PageData<E>;
  protected authService: AuthService = inject(AuthService);
  protected firestoreService: FirestoreService = inject(FirestoreService);

  constructor(private collectionPathPostfix: string, protected orderByField: string) {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }

  create(data: Partial<E>): Observable<DocumentReference<any> | void> {
    return this.collectionPath().pipe(
      switchMap((path) => this.firestoreService.add(path, this.convertToInternal(data))),
      tap(() => this.resetConcatenated())
    );
  }

  read(id: string): Observable<E> {
    return this.collectionPath().pipe(
      switchMap((path) => this.firestoreService.get<I>(`${path}/${id}`)),
      map((data) => this.convertFromInternal(data))
    );
  }

  update(id: string, data: Partial<E>) {
    return this.collectionPath().pipe(
      switchMap((path) =>
        this.firestoreService.update(`${path}/${id}`, this.convertToInternal(data))
      ),
      tap(() => this.resetConcatenated())
    );
  }

  delete(id: string): Observable<void> {
    return this.collectionPath().pipe(
      switchMap((path) => this.firestoreService.delete(`${path}/${id}`)),
      tap(() => this.resetConcatenated())
    );
  }

  listCollection(queryConstraint: QueryConstraint[]): Observable<E[]> {
    return this.collectionPath().pipe(
      switchMap((path) => this.firestoreService.list<I>(path, ...queryConstraint)),
      map((data) => this.convertAllFromInternal(data))
    );
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

  protected collectionPath(): Observable<string> {
    return this.authService.userIdProvider$().pipe(
      filter((id) => !!id),
      map((userId) => `users/${userId}/${this.collectionPathPostfix}`)
    );
  }

  private elementInArray(element: Identifiable): boolean {
    return this.concatPageData.data.some((data) => data.id === element.id);
  }

  private listSinglePage(pageSize: number, startAfterId: string): Observable<E[]> {
    let queryConstraint: QueryConstraint[] = [orderBy(this.orderByField, 'desc'), limit(pageSize)];

    if (startAfterId) {
      return this.collectionPath().pipe(
        switchMap((path) => this.firestoreService.getRaw(`${path}/${startAfterId}`)),
        switchMap((startAfterDoc) =>
          this.listCollection([...queryConstraint, startAfter(startAfterDoc)])
        )
      );
    }

    return this.listCollection(queryConstraint);
  }
}
