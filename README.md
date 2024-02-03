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

- Angular version: 17.x
- Angular Fire: 17.x
- Firebase SDK: 10.x
- NodeJS version: [.nvmrc](.nvmrc), [Firebase Merge flow](.github/workflows/firebase-hosting-merge.yml), [Firebase Pull Request flow](.github/workflows/firebase-hosting-pull-request.yml)

### Development server

Run Firebase Emulator: `npm run firebase-emulator`. View Emulator UI at `http://localhost:4000`. In order to persists emulator data run in separate console: `firebase emulators:export test-data`.
User accounts available in emulator (password is `123qwe`):

- `janka@webperfekt.pl` - female user with some data
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

[Lime Tracker](https://lime-tracker.com/) is a [Progressive Web Application](https://angular.io/guide/service-worker-devops). It can be installed on the end user device.
Debugging information about NGSW can be found under URLs:

- [https://lime-tracker.com/pl/ngsw/state](https://lime-tracker.com/pl/ngsw/state)
- [https://lime-tracker.com/en/ngsw/state](https://lime-tracker.com/en/ngsw/state)

## Links to used project and libraries

- [Angular CLI Overview and Command Reference](https://angular.io/cli)
- [Angular Material Components](https://material.angular.io/components/categories)
- ~[Angular Flex Layout](https://github.com/angular/flex-layout)~ - project is dead, required features integrated into Lime Tracker
- [Moment.js](https://momentjs.com/)
- [Angular Fire](https://github.com/angular/angularfire)
- [Firebase API - Reference](https://firebase.google.com/docs/reference/js)
- [ApexCharts - Examples](https://apexcharts.com/angular-chart-demos/)
