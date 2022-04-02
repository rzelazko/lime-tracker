# Lime Tracker

Lime Tracker empowers people with epilepsy for better understanding of sickness development.
Application is an extensive seizure tracker, helping to understand epilepsy changes through data visualization.

## Technologies Used

Angular version: 13.x
NodeJS version: 16.x
NPM version: 8.x
Angular Fire: 7.x
Firebase SDK: 9.x

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Production build

Run `ng build` to build the project for production deployment. The build artifacts will be stored in the `dist/` directory.

## Links to used project and libraries

- [Angular CLI Overview and Command Reference](https://angular.io/cli)
- [Angular Material Components](https://material.angular.io/components/categories)
- [Angular Flex Layout](https://github.com/angular/flex-layout)
- [Moment.js](https://momentjs.com/)
- [Angular Fire](https://github.com/angular/angularfire)
- [Firebase API - Reference](https://firebase.google.com/docs/reference/js)
- [ApexCharts - Examples](https://apexcharts.com/angular-chart-demos/)

## TODO 

- Add authentication persistance (via Firebase browser persistance)
- Add some Rodo, privacy policy, etc. on login & dashboard (add footer?)
- Add user profile management
- Add reset passoword
- Move URLs to single place
- Cancel button on form go back to either dashboard or table (not always table)
- Add screenshot and better description to README (ex. run firebase emulator on local)
- Favicon, app manifest, etc
- I18N (rememeber: default seizure types)
- Setup custom domain for hosting
- Create valid [firestore.rules](firestore.rules)
- Change `emailVerificationDate` to indicate it is sending date (not verification) & edit emulator users
- Use Firestore instead of dummy data - dashboard
- Use Firestore instead of dummy data - charts
- Use Firestore instead of dummy data - reports
  - Remove `console.log` in `reports.service`
  - Report for last 12 months instead of calendar year
  - Replace paginator with years selector
- Verify if user details do not have nested collection
