# Lime Tracker

Lime Tracker empowers people with epilepsy for better understanding of sickness development.
It is available as [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installing) on **[lime-tracker.com](https://lime-tracker.com/)**.

[Lime Tracker](https://lime-tracker.com/) is an extensive seizure tracker, helping to understand epilepsy changes through data visualization.

Sample data:

- Dashboard:<br>
  <img src="/docs/app-dashboard.png" width="350">
- Application menu:<br>
  <img src="/docs/app-menu.png" width="350">
- Add seizure form:<br>
  <img src="/docs/app-seizure-form.png" width="350">
- Charts:<br>
  <img src="/docs/app-charts.png" width="350">
- Reports:<br>
  <img src="/docs/app-reports.png" width="350">

## Technologies used

Angular version: 13.x
NodeJS version: 16.x
NPM version: 8.x
Angular Fire: 7.x
Firebase SDK: 9.x

### Development server

Run Firebase Emulator: `npm run firebase-emulator`. View Emulator UI at `http://localhost:4000`. In order to persists emulator data run in separate console: `firebase emulators:export test-data`.
User accounts available in emulator (password is `123qwe`):

- `jan.kowalski@webperfekt.pl` - user with some data
- `not.verified@webperfekt.pl` - email has not been verified
- `empty@webperfekt.pl` - no data

Run in separte console `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### I18N

Extract translation: `ng extract-i18n --output-path src/locale`.

Install Visual Studio Code extension: [Angular Localization Helper](https://marketplace.visualstudio.com/items?itemName=manux54.angular-localization-helper). Use command pallete run `Angular i18n: Sync`

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Production build

Prerequisite for production deployment is to have Firebase CLI installed: `npm install -g firebase-tools`.

Verify connection to the Firebase project with `firebase use`.

Run `ng build` to build the project for production deployment. The build artifacts will be stored in the `dist/` directory.

Run `firebase hosting:channel:deploy beta` to create and deploy to a preview channel.

Perform full deplyment (hosting, security rules, etc.) with `firebase deploy` or `firebase deploy --only hosting` to have only frontend deployed.

## Progressive Web Application

[Lime Tracker](https://lime-tracker.com/) is a [Progressive Web Application](https://angular.io/guide/service-worker-devops). It can be installed on customer device.
Debugging information about NGSW can be found under URLs:

- [https://lime-tracker.com/pl/ngsw/state](https://lime-tracker.com/pl/ngsw/state)
- [https://lime-tracker.com/en/ngsw/state](https://lime-tracker.com/en/ngsw/state)

## Links to used project and libraries

- [Angular CLI Overview and Command Reference](https://angular.io/cli)
- [Angular Material Components](https://material.angular.io/components/categories)
- [Angular Flex Layout](https://github.com/angular/flex-layout)
- [Moment.js](https://momentjs.com/)
- [Angular Fire](https://github.com/angular/angularfire)
- [Firebase API - Reference](https://firebase.google.com/docs/reference/js)
- [ApexCharts - Examples](https://apexcharts.com/angular-chart-demos/)

## TODO 

- Add user profile management
- Add gender information - and show / hide period tracking option
- Add reset passoword
- Add chart to show seizures by hour
- Add chart to show seizures during period
- Add chart to compare seizures in the same month for previous year (only if the are enough data)
- Dashboard redesign - 4 cards with action buttons below instead on top:
  - Seizures - nothing change
  - Medicaments - compacted list (one line name & doses)
  - Events - list of last events
  - Period - time from last period, or how long current one is
  - Other improvements:
    - Dashboard in case of no medicaments place link or button to add some
    - Dashboard in case of no seizures place link or button to add some
- Update app screenshots
- Cancel button on form go back to either dashboard or table (not always table)
- Add install PWA menu item:
  Detect we are not in standalone mode. If it is a case then:
  - On iOS - put custom message to install manually from Safari
    ([sample1](https://dockyard.com/blog/2017/09/27/encouraging-pwa-installation-on-ios),
     [sample2](https://javascript.plainenglish.io/creating-a-browser-agnostic-pwa-install-button-41039f312fbe))
  - On non-iOS Chrome use [beforeinstallprompt](https://medium.com/poka-techblog/turn-your-angular-app-into-a-pwa-in-4-easy-steps-543510a9b626) trick
  - On other put info about supported browsers
- Add landing page with install PWA button
- Add some Rodo, privacy policy, etc. on login & dashboard (add footer?)
- Add schema validation to [firestore.rules](firestore.rules)
