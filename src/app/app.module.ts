import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Login} from "../pages/login/login";
import {AuthenticationHttpService} from "./authentication-http.service";
import {Http, HttpModule} from "@angular/http";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {AppBase64Service} from "./app-base64.service";
import {Logout} from "../pages/logout/logout";
import {Search} from "../pages/search/search";
import {Music} from "../pages/music/music";
import {Album} from "../pages/album/album";
import {Player} from "../pages/player/player";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    Logout,
    Search,
    Music,
    Album,
    Player
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    Logout,
    Search,
    Music,
    Album,
    Player
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AppBase64Service,
    { provide: Http,
      useClass: AuthenticationHttpService
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
