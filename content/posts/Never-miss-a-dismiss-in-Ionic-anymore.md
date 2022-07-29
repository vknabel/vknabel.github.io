---
title: Never miss a dismiss in Ionic anymore
aliases: [/pages/Never-miss-a-dismiss-in-Ionic-anymore/]
date: 2017-09-26
tags: [web]
---

Have you ever experienced, that some loading indicators just don’t want to dismiss and literally stay forever? Maybe while users tried to login? The short story: you probably forgot to dismiss a loading indicator in some cases.

Within this blogpost you will learn how to declaratively present loading indicators and how to prevent forgetting to dismissing it again.

In our showcase we have a login page, that shall present a [loading](https://ionicframework.com/docs/components/#loading) indicator while the user will be authenticated. The page itself only consists of inputs for our credentials and a login button calling `LoginPage.submitLogin` on click inside `ion-content`.

```html
<ion-content padding>
  <ion-input [(ngModel)]="username" type="text" value=""></ion-input>
  <ion-input [(ngModel)]="password" type="password" value=""></ion-input>
  <button ion-button (click)="submitLogin()"></button>
</ion-content>
```

Our `LoginPage` relies on an `AuthenticationService`, mocked as follows.

```javascript
export abstract class AuthenticationService {
  public abstract login(username: string, password: string): Observable<void>;
}
```

Once the user clicked on the login button, we will create a `Loading` using the `LoadingController`, present it and perform the login itself. Thereafter we need to dismiss the same `Loading` again.

```javascript
@IonicPage()
@Component({
  templateUrl: "./login.page.html"
})
export class LoginPage {
  public username: string;
  public password: string;

  constructor(
    private readonly authentication: AuthenticationService,
    private readonly navCtrl: NavController,
    private readonly loadingCtrl: LoadingController
  ) {}

  public submitLogin() {
    // configure loading spinner
    const loading = this.loadingCtrl.create();
    // present it
    loading.present().then(() =>
      // perform login
      this.authentication
        .login(this.username, this.password)
        .toPromise()
        // on success dismiss
        .then(() => loading.dismiss())
        // and apply successful login
        .then(() => this.navCtrl.setRoot("MyEntryPage"))
    );
  }
}
```

You might have noticed, but we already introduced a bug: if the login fails, our promise rejects and `.then(() => loading.dismiss())` will never be called, our `Loading` will still be presented and the user will be forced to restart the whole app in order to try the correct credentials.
The most obvious fix would be to just insert a `catch` which dismissed the loading, too. But this would not prevent any other usages of `Loading` from being presented forever.

In order to solve this problem, we will create a new controller, which will present loadings and automatically dismisses them once a given promise resolves or rejects.
We want our `submitLogin` to be completely free from all `loading.dismiss()` calls and even the requirement to even keep our `loading` variable. Additionally we don’t want to be forced to either subscribe to an observable nor to convert it to a promise.

The code we want inside `LoginPage.submitLogin` should be focused and compact.

```javascript
public submitLogin() {
  // present while ...
  this.activityCtrl
    .presentWhile(
      // ... logging in
      this.authentication.login(this.username, this.password)
    )
    // on success, apply login
    .then(() => this.navCtrl.setRoot("MyEntryPage"));
}
```

Our `presentWhile` will be implemented inside a service called `ActivityController` and will either work with promises or observables. It handles dismissing our loading spinner and returns a new promise resolving to the same value (or rejecting to the same error).

```javascript
@Injectable()
export class ActivityController {
  constructor(private readonly loadingCtrl: LoadingController) {}

  public presentWhile<T>(
    active: Promise<T> | Observable<T>,
    options?: LoadingOptions
  ): Promise<T> {
    // create loading using optionally given options
    const spinner = this.loadingCtrl.create(options);
    return (
      spinner
        .present()
        // convert observables to promises
        .then(
          () => (active instanceof Observable ? active.toPromise() : active)
        )
        // dismiss and keep result
        .then(result => spinner.dismiss().then(() => result))
        // keep the error, but dismiss
        .catch(error => spinner.dismiss().then(() => Promise.reject(error)))
    );
  }
}
```

In order to actually use `ActivityController` in our `LoginPage`, we need to inject it. As there Ionic’s controllers (`LoadingController`, `NavController`, etc.) will be injected for each page separately, we need to do the same for each page, too.
Inside your unit tests, you can [override providers](https://angular.io/guide/testing#component-override).

```javascript
@IonicPage()
@Component({
  templateUrl: "./login.page.html",
  // add provider to component
  provders: [ActivityController]
})
export class LoginPage {
  // username, password

  constructor(
    private readonly authentication: AuthenticationService,
    private readonly navCtrl: NavController,
    private readonly activityCtrl: ActivityController
  ) {}

  // submitLogin()
}
```

Within this blogpost you have seen which problems may occur when using loading spinners and how to solve them in general. Furthermore you learnt how to create a new controller for Ionic and how to use it.

Do you have more ideas for using a pattern like this?
