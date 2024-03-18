import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  /**
   * Unsued constants here are a workaround for i18n limitation which doesn't allow to translate manifest file.
   * We keep translation in Angular's i18n Xliff files and use them in custom postbuild script.
   */
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    const appTitle = $localize`:@@app-title:Lime Tracker - Epilepsy Journal`;
    const appShortTitle = $localize`:@@app-short-title:Lime Tracker`;
    const appDescription = $localize`:@@app-description:Track seizure events, medications, and identify triggers. This app helps people with epilepsy log and analyze seizures, medication, and potential triggers. The goal is to uncover patterns and insights to improve quality of life.`;
    const appLang = $localize`:@@app-lang:en`;
    const screenshotWide = $localize`:@@app-screenshot-wide:assets/screenshots/en/1280x800-screenshot.png`;
    const screenshotNarrow = $localize`:@@app-screenshot-narrow:assets/screenshots/en/750x1334-screenshot.png`;

    if (title) {
      this.title.setTitle(`${appShortTitle} | ${title}`);
    } else {
      this.title.setTitle(appTitle);
    }
  }
}
