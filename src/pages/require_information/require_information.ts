import {Component} from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import {ActionStatusService} from '../../services/action_status';
import {FacebookService} from '../../services/facebook';
import {ContactPage} from '../contact/contact';
import {Image} from '../image/image';

@Component({
    selector : 'require-information',
    templateUrl : 'require_information.html'
})

export class RequireInformation
{
    private informationForm: FormGroup;
    public gender : any;
    private user: Object;
    public member_id : any;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private actionStatusService : ActionStatusService,
        private facebookService: FacebookService
    )
    {
        if (this.navParams.get('type') == 'create') //Create new
        {
            this.user = {
                distance : 5,
                education_level : '',
                job : '',
                personalities : '',
            };
            //Create form Group to validate
            this.informationForm = formBuilder.group({
                distance: [''],
                educational_level: [''],
                personalities: [''],
                job: [''],
            });
            this.gender = this.informationForm.controls['gender'];
            
            //Check logged in by app account
            if (this.actionStatusService.CheckLoginAppAccount()) //Logged in by app account
            {
                this.actionStatusService.member_id = this.actionStatusService.appAccount['member_id'];
                this.actionStatusService.gender = this.actionStatusService.appAccount['gender'];
            }
            else if (this.actionStatusService.CheckLoginFacebook()) {
                this.actionStatusService.member_id = this.actionStatusService.facebookAccount['member_id'];
                this.actionStatusService.gender = this.actionStatusService.facebookAccount['gender'];
            }
        }
        
    }
    
    Save(value : any)
    {
        //Get value and append to formData
        let formData = new FormData();
        formData.append('member_id', this.actionStatusService.member_id);
        if (this.actionStatusService.gender == 'male')
        {
            formData.append('gender', 'female');
        } else if (this.actionStatusService.gender == 'female')
        {
            formData.append('gender', 'male');
        }
        
        if(value.job != undefined)
        {
            formData.append('job', value.job);
        }
        if (value.personalities != undefined)
        {
            formData.append('personalities', value.personalities);
        }
        if(value.educational_level != undefined) 
        {
            formData.append('educational_level', value.educational_level);
        }
        if(value.distance != undefined)
        {
            formData.append('distance', value.distance);
        }
        
        //Check create or edit
        let check_unique_url = 'http://webbase.com.vn/tinder/require-api/check-unique-require-information/' + this.actionStatusService.member_id;
        this.facebookService.httpGet(check_unique_url).subscribe(
            (success) => {
                if(success.message == 'exit') //Edit
                {
                    let edit_url = 'http://webbase.com.vn/tinder/require-api/update-require-information';
                    this.facebookService.httpPost(edit_url, formData).subscribe(
                        (res) => {
                            //Successfull go to Contact page
                            let salert = this.alertCtrl.create({
                                title: 'Successfull',
                                subTitle: '<p>You can upload your photo by clicking Gallery</p><p>Click Agree to use app now</p>',
                                buttons: [
                                    {
                                        text: 'Gallery',
                                        handler: () => {
                                            this.navCtrl.push(
                                                Image,
                                                {
                                                    member_id: success.id
                                                }
                                            );
                                        }
                                    },
                                    {
                                        text: 'Agree',
                                        handler: () => {
                                            this.navCtrl.push(ContactPage);
                                        }
                                    }
                                ]
                            });
                            salert.present();
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                }else //Create new
                {
                    let url = 'http://webbase.com.vn/tinder/require-api';
                    this.facebookService.httpPost(url, formData).subscribe(
                        (response) => {
                            //Set require_information in member table to 1
                            let fData = new FormData();
                            fData.append('member_id', this.actionStatusService.member_id);
                            let require_url = 'http://webbase.com.vn/tinder/member-api/set-require-information';
                            this.facebookService.httpPost(require_url, fData).subscribe(
                                (success) => {
                                    //Successfull go to Contact page
                                    let salert = this.alertCtrl.create({
                                        title : 'Successfull',
                                        subTitle: '<p>You can upload your photo by clicking Gallery</p><p>Click Agree to use app now</p>',
                                        buttons : [
                                            {
                                                text: 'Gallery',
                                                handler: () => {
                                                    this.navCtrl.push(
                                                        Image,
                                                        {
                                                            member_id: this.actionStatusService.member_id
                                                        }
                                                    );
                                                }
                                            },
                                            {
                                                text : 'Agree',
                                                handler: () => {
                                                    this.navCtrl.push(ContactPage);
                                                }
                                            }
                                        ]
                                    });
                                    salert.present();
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
                }
            },
            (error) => {
                
            }
        )
    }
}