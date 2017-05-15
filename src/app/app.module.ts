import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { MyApp } from './app.component';
import {HttpModule} from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import {FacebookFriendlist} from '../pages/facebook_friendlist/friendlist';
import {UserProfile} from '../pages/user_profile/user_profile';
import {Image} from '../pages/image/image';
import {LoginTinder} from '../pages/login_tinder/login_tinder';
import {RequireInformation} from '../pages/require_information/require_information';
import {MemberInformation} from '../pages/member_information/member_information';
import {Profile} from '../pages/profile/profile';
import {EditProfile} from '../pages/edit_profile/edit_profile';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FacebookService } from '../services/facebook';
import {GoogleService} from '../services/google';
import {ActionStatusService} from '../services/action_status';
import {ObservableService} from '../services/observable';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    FacebookFriendlist,
    UserProfile,
    Image,
    LoginTinder,
    RequireInformation,
    MemberInformation,
    Profile,
    EditProfile
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    FacebookFriendlist,
    TabsPage,
    UserProfile,
    Image,
    LoginTinder,
    RequireInformation,
    MemberInformation,
    Profile,
    EditProfile
  ],
  providers: [
    FacebookService,
    GoogleService,
    ActionStatusService,
    ObservableService,
    GooglePlus,
    Facebook,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
