import {Component} from "@angular/core";
import {FacebookService} from '../../services/facebook';
import {ActionStatusService} from '../../services/action_status';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {EditProfile} from '../edit_profile/edit_profile';
@Component({
    selector : 'page-profile',
    templateUrl : 'profile.html'
})
export class Profile
{
    public member : Object = {
        name : '',
        email : '',
        gender : '',
        job : '',
        personalities : '',
        tel : '',
        educational_level : '',
        birthday : '',
        about_yourself : '',
        avatar : '',
        age : ''
    };
    
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private facebookService: FacebookService,
        private actionStatusService: ActionStatusService
    )
    {
        if (this.actionStatusService.member_id != 0) //logged in
        {
            //Get all information
            let url = 'http://webbase.com.vn/tinder/member-api/' + this.actionStatusService.member_id + '?expand=image';
            this.facebookService.httpGet(url).subscribe(
                (success) => {
                    if(success.name)
                    {
                        this.member['name'] = success.name;
                    }
                    if(success.email)
                    {
                        this.member['email'] = success.email;
                    }
                    if(success.gender)
                    {
                        this.member['gender'] = success.gender;
                    }
                    if(success.personalities)
                    {
                        this.member['personalities'] = success.personalities;
                    }
                    if(success.job)
                    {
                        this.member['job'] = success.job;
                    }
                    if(success.educational_level)
                    {
                        this.member['educational_level'] = success.educational_level;
                    }
                    if(success.tel)
                    {
                        this.member['tel'] = success.tel;
                    }
                    if(success.about_yourself)
                    {
                        this.member['about_yourself'] = success.about_yourself;
                    }
                    
                    if(success.image.length > 0 && success.image[0].avatar)//Đã thêm ảnh
                    {
                        this.member['avatar'] = success.image[0].avatar;
                    }
                    if(success.birthday)
                    {
                        let birthday = new Date(success.birthday*1000);
                        let isoDate = birthday.toISOString();
                        success.birthday = isoDate.substr(0, 10);
                        let date = new Date(success.birthday);
                        let birthYear = date.getFullYear();
                        let currentDate = new Date();
                        let currentYear = currentDate.getFullYear();
                        this.member['age'] = (currentYear - birthYear) + 1;
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
    
    //Function Go to update profile page
    UpdateProfile()
    {
        this.navCtrl.push(
            EditProfile,
            {
                type : 'edit'
            }
        )
    }
}