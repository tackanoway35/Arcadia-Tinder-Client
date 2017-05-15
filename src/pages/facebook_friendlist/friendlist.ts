import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FacebookService } from '../../services/facebook';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'facebook-friendlist',
  templateUrl: 'friendlist.html',
})
export class FacebookFriendlist {
    public fb_friendlist : any[] = [];
    public subscription: Subscription;
    constructor(public navCtrl: NavController, private facebookService: FacebookService) {
        this.subscription = this.facebookService.getFriendList().subscribe(
            (response) => {
                this.fb_friendlist = response;
            }
        )
    }
}
