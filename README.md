# Lime Tracker

Lime Tracker empowers people with epilepsy for better understanding of sickness development.
It is available as [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installing) on **[lime-tracker.com](https://lime-tracker.com/)**.

[Lime Tracker](https://lime-tracker.com/) is an extensive seizure tracker, helping to understand epilepsy changes through data visualization.

Sample screenshots:

<img src="/screens/01-register.png" width="180" height="388"> <img src="/screens/02-dashboard.png" width="180" height="388"> 
<img src="/screens/03-menu.png" width="180" height="388"> <img src="/screens/04-charts.webp" width="180" height="388"> 
<img src="/screens/05-add-seizures.png" width="180" height="388"> <img src="/screens/06-reports.png" width="180" height="388"> 
<img src="/screens/07-app-icon.png" width="180" height="388"> <img src="/screens/08-medications.png" width="180" height="388"> 

## Technologies used

- Angular
- Firebase SDK
- NodeJS version: [.nvmrc](.nvmrc), [Firebase Merge flow](.github/workflows/firebase-hosting-merge.yml), [Firebase Pull Request flow](.github/workflows/firebase-hosting-pull-request.yml), [Firebase Version Increment flow](.github/workflows/version.yml)

### Development server

Run Firebase Emulator: `npm run firebase-emulator`. View Emulator UI at `http://localhost:4000`. In order to persists emulator data run in separate console: `npx firebase emulators:export test-data`.
User accounts available in emulator (password is `123qwe`):

- `janka@webperfekt.pl` - female user with some data
- `jan.kowalski@webperfekt.pl` - user with some data
- `not.verified@webperfekt.pl` - email has not been verified
- `empty@webperfekt.pl` - no data

Run in separte console `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### I18N

Extract translation: `npm run i18n-extract`.

Install Visual Studio Code extension: [Angular Localization Helper](https://marketplace.visualstudio.com/items?itemName=manux54.angular-localization-helper). Use command pallete run `Angular i18n: Merge`

Current version of Angular i18n doesn't allow to translate PWA manifest files. As a workaround [manifest.webmanifest](./src/manifest.webmanifest) contains values with `@@` prefix.
Those values are replaced by external `postbuild` script [postbuild.js](./scripts/postbuild.js) with keys from `src/locale/messages.XX.xlf`. \
Translation units comes from [template-page-title.strategy.ts](./src/app/template-page-title.strategy.ts) file (as values in manifest are ignored by Angular i18n extraction task).

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Production build

Prerequisite for production deployment is to have Firebase CLI installed (`firebase-tools` are part of dev dependencies).

Login to the CLI with `firebase login`.

Verify connection to the Firebase project with `firebase use`.

Run `ng build` to build the project for production deployment. The build artifacts will be stored in the `dist/` directory.

Run `firebase hosting:channel:deploy beta` to create and deploy to a preview channel.

Perform full deplyment (hosting, security rules, etc.) with `firebase deploy` or `firebase deploy --only hosting` to have only frontend deployed.

## Progressive Web Application

[Lime Tracker](https://lime-tracker.com/) is a [Progressive Web Application](https://angular.io/guide/service-worker-devops). It can be installed on the end user device.
Debugging information about NGSW can be found under URLs:

- [https://lime-tracker.com/pl/ngsw/state](https://lime-tracker.com/pl/ngsw/state)
- [https://lime-tracker.com/en/ngsw/state](https://lime-tracker.com/en/ngsw/state)

## Links to used project and libraries

- [Angular CLI Overview and Command Reference](https://angular.io/cli)
- [Angular Material Components](https://material.angular.io/components/categories)
- ~[Angular Flex Layout](https://github.com/angular/flex-layout)~ - project is dead, required features integrated into Lime Tracker
- [Moment.js](https://momentjs.com/)
- ~[Angular Fire](https://github.com/angular/angularfire)~ - project is rarely updated, use Firebase API directly
- [Firebase API - Reference](https://firebase.google.com/docs/reference/js)
- [ApexCharts - Examples](https://apexcharts.com/angular-chart-demos/)
