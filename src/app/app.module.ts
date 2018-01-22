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
import {SocialSharing} from "@ionic-native/social-sharing";
import {Music_playlist} from "../pages/music_playlist/music_playlist";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    Logout,
    Search,
    Music,
    Album,
    Player,
    Music_playlist
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
    Player,
    Music_playlist
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AppBase64Service,
    SocialSharing,
    { provide: Http,
      useClass: AuthenticationHttpService
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
