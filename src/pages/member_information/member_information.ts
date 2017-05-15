import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, Slides} from 'ionic-angular';
import {FacebookService} from '../../services/facebook';

@Component({
    selector : 'member-information',
    templateUrl : 'member_information.html'
})

export class MemberInformation
{
    @ViewChild(Slides) slides: Slides;
    public member_id : number;
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
    };
    public photo : string[];
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private facebookService: FacebookService
    )
    {
        if (this.navParams.get('member_id'))
        {
            this.member_id = this.navParams.get('member_id');
            //Get information
            let url = 'http://webbase.com.vn/tinder/member-api/' + this.member_id + '?expand=image';
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
                    //Birthday
                    if(success.birthday)
                    {
                        let birthday = new Date(success.birthday*1000);
                        let isoDate = birthday.toISOString();
                        success.birthday = isoDate.substr(0, 10);
                        this.member['birthday'] = success.birthday;
                    }
                    
                    //Get array photo
                    if(success.image.length > 0)
                    {
                        var photo = [];
                        if(success.image[0].avatar)
                        {
                            photo.push(success.image[0].avatar);
                        }
                        if(success.image[0].image1)
                        {
                            photo.push(success.image[0].image1);
                        }
                        if(success.image[0].image2)
                        {
                            photo.push(success.image[0].image2);
                        }
                        if(success.image[0].image3)
                        {
                            photo.push(success.image[0].image3);
                        }
                        if(success.image[0].image4)
                        {
                            photo.push(success.image[0].image4);
                        }
                        if(success.image[0].image5)
                        {
                            photo.push(success.image[0].image5);
                        }
                        if(success.image[0].image6)
                        {
                            photo.push(success.image[0].image6);
                        }
                        this.photo = photo;
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
        }
    }
}