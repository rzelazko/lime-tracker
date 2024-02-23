import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    const appTitle = $localize`:@@app-title:Lime Tracker - Epilepsy Journal`;
    const appShortTitle = $localize`:@@app-short-title:Lime Tracker`;
    if (title) {
      this.title.setTitle(`${appShortTitle} | ${title}`);
    } else {
      this.title.setTitle(appTitle);
    }
  }

  /**
   * This is workaround for i18n limitation which doesn't allow to translate manifest file.
   * We keep translation in Angular's i18n Xliff files and use them in custom postbuild script.
   */
  translationsForManifestFile() {
    const appDescription = $localize`:@@app-description:Track seizure events, medications, and identify triggers. This app helps people with epilepsy log and analyze seizures, medication, and potential triggers. The goal is to uncover patterns and insights to improve quality of life.`;
  }
}
