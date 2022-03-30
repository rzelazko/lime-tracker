import { Injectable } from '@angular/core';
import { startAfter } from '@angular/fire/firestore';
import { limit, orderBy, QueryConstraint } from 'firebase/firestore';
import { map } from 'rxjs';
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
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.add(`users/${uid}/${this.collectionPath}`, data)),
      tap(() => this.resetConcatenatedPage())
    );
  }

  read(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.get<T>(`users/${uid}/${this.collectionPath}/${id}`))
    );
  }

  update(id: string, data: Partial<T>) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) =>
        this.firestoreService.set(`users/${uid}/${this.collectionPath}/${id}`, data)
      ),
      tap(() => this.resetConcatenatedPage())
    );
  }

  delete(id: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => this.firestoreService.delete(`users/${uid}/${this.collectionPath}/${id}`)),
      map(
        (): PageData<T> => ({
          hasMore: this.concatPageData.hasMore,
          data: this.concatPageData.data.filter((data) => data.id !== id),
        })
      )
    );
  }

  listSinglePage(pageSize: number, startAfterId: string) {
    return this.authService.authenticatedUserId$.pipe(
      switchMap((uid) => {
        let queryConstraint: QueryConstraint[] = [
          orderBy(this.orderByField, 'desc'),
          limit(pageSize),
        ];

        if (startAfterId) {
          return this.firestoreService
            .getRaw(`users/${uid}/${this.collectionPath}/${startAfterId}`)
            .pipe(
              switchMap((startAfterDoc) => {
                queryConstraint.push(startAfter(startAfterDoc));
                return this.firestoreService.list<T>(
                  `users/${uid}/${this.collectionPath}`,
                  ...queryConstraint
                );
              })
            );
        } else {
          return this.firestoreService.list<T>(
            `users/${uid}/${this.collectionPath}`,
            ...queryConstraint
          );
        }
      })
    );
  }

  listConcatenated(pageSize: number) {
    return this.listSinglePage(pageSize, this.concatPagelastId).pipe(
      map((newDatas): PageData<T> => {
        this.concatPageData.data = this.concatPageData.data.concat(
          newDatas.filter(
            (
              newData // add only elements which IDs are not already there
            ) => !this.concatPageData.data.some((data) => data.id === newData.id)
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

  resetConcatenatedPage() {
    this.concatPagelastId = '';
    this.concatPageData = { hasMore: false, data: [] };
  }
}
