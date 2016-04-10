# Ambient Workspace
[![Build Status](https://travis-ci.org/bennicholes/AmbientWorkspace.svg?branch=master)](https://travis-ci.org/bennicholes/AmbientWorkspace)
[![codecov.io](https://codecov.io/github/bennicholes/AmbientWorkspace/coverage.svg?branch=master)](https://codecov.io/github/bennicholes/AmbientWorkspace?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/bennicholes/AmbientWorkspace.svg)](https://david-dm.org/bennicholes/AmbientWorkspace)
[![devDependency Status](https://david-dm.org/bennicholes/AmbientWorkspace/dev-status.svg)](https://david-dm.org/bennicholes/AmbientWorkspace#info=devDependencies)

## Install & Start

### Prerequisites:

1)
```bash
npm install -g ionic@beta
npm install -g cordova
```

2) [Optional for now]

Get the [Android SDK](http://developer.android.com/sdk/index.html). Currently using API 23, but trying to figure out how to go down to API 22.

3) [Optional]

After installing the Android SDK, set up the default emulator with
```
android avd
```

### Installation:
```bash
npm install
ionic platform add android
```

### Running:
```bash
ionic serve
# or
ionic run android
```


## Useful links

[Ionic 2 Documentation](http://ionicframework.com/docs/v2/components/#overview)

[Hue API](http://www.developers.meethue.com/philips-hue-api)

### Angular 2
[Documentation](https://angular.io/docs/ts/latest/)

[Angular Cheat Sheet](https://angular.io/docs/ts/latest/cheatsheet.html)

[TypeScript Cheat Sheet](https://www.sitepen.com/blog/2013/12/31/typescript-cheat-sheet/)


## Resources

### Tutorials

http://gonehybrid.com/build-your-first-mobile-app-with-ionic-2-angular-2-part-4/

https://auth0.com/blog/2015/09/03/angular2-series-working-with-pipes/

https://auth0.com/blog/2015/09/17/angular-2-series-part-2-domain-models-and-dependency-injection/

https://medium.com/google-developer-experts/angular-2-introduction-to-new-http-module-1278499db2a0#.l6pubi679

https://www.thepolyglotdeveloper.com/2016/01/make-http-requests-in-an-ionic-2-android-and-ios-app/

https://auth0.com/blog/2015/10/15/angular-2-series-part-3-using-http/

http://blog.ionic.io/ionic-2-and-auth0/

### Example apps

You can see the difference between the official ones here https://devdactic.com/ionic-cheatsheet/

[Starter sidemenu](https://github.com/driftyco/ionic2-starter-sidemenu)

[Starter tabs](https://github.com/driftyco/ionic2-starter-tabs)

[Starter tutorial](https://github.com/driftyco/ionic2-starter-tutorial)

https://github.com/jkuri/ionic2-rxjs-socketio-chat

https://github.com/lathonez/clicker

https://github.com/driftyco/ionic-conference-app

https://github.com/ccoenraets/ionic2-realty

https://github.com/ccoenraets/ionic2-employee-directory

### Other resources

https://github.com/AngularClass/awesome-angular2

https://github.com/timjacobi/angular2-education

https://github.com/AngularClass/angular2-webpack-starter This doesn't have Ionic, it's an angular 2 starter for web. But, this has a *really* good development setup.


### Testing for future reference

http://mcgivery.com/unit-testing-ionic-app/ I don't think it'll be any different with Angular 2.

http://lathonez.github.io/2016/ionic-2-unit-testing/

http://gonehybrid.com/how-to-write-automated-tests-for-your-ionic-app-part-2/

https://bradb.net/blog/unit-testing-with-the-ionic-framework/

https://developers.livechatinc.com/blog/testing-angular-2-apps-part-1-beginning/

http://twofuckingdevelopers.com/2016/01/testing-angular-2-with-karma-and-jasmine/

[Testing Angular 2 official docs](https://angular.io/docs/ts/latest/testing/)
