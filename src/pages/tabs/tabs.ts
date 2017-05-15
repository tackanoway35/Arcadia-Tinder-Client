import { Component } from '@angular/core';
import {NavController, App} from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {Profile} from '../profile/profile';
import {FacebookFriendlist} from '../facebook_friendlist/friendlist';
import {ActionStatusService} from '../../services/action_status';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = Profile;
  tab3Root = ContactPage;
  

  constructor(private actionStatusService: ActionStatusService, private navCtrl: NavController, private appCtrl: App) {
    
  }
}
