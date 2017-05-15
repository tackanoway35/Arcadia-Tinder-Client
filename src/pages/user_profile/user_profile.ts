import { Component, AfterViewInit } from "@angular/core";

import { NavController, NavParams, AlertController } from "ionic-angular";
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {FacebookService} from '../../services/facebook';
import {GoogleService} from "../../services/google";
import {ActionStatusService} from "../../services/action_status";
import {Image} from '../../pages/image/image';
import {ContactPage} from '../contact/contact';
import {RequireInformation} from '../require_information/require_information';

declare var google : any;

@Component({
    selector : 'page-user-profile',
    templateUrl : 'user_profile.html',
    
})

export class UserProfile implements AfterViewInit{
    private userForm : FormGroup;
    public name : any;
    public email : any;
    public gender : any;
    public address : any;
    public fb_user : Object;
    public facebook_id : number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
        public alertCtrl : AlertController,
        private formBuilder: FormBuilder,
        private facebookService: FacebookService,
        private googleService : GoogleService,
        private actionStatusService : ActionStatusService
    )
    {
        if (this.navParams.get('fb_user')) //Create new facebook account
        {
            //Format birthday convert to integer to Date
            if(this.navParams.get('fb_user').birthday)
            {
                let birthday = new Date(this.navParams.get('fb_user').birthday*1000);
                let isoDate = birthday.toISOString();
                this.navParams.get('fb_user').birthday = isoDate.substr(0, 10);
            }
            //Format birthday convert to Json to Object
            if(this.navParams.get('fb_user').address)
            {
                let address = JSON.parse(this.navParams.get('fb_user').address);
                this.navParams.get('fb_user').address = address.address;
            }
            
            this.fb_user = this.navParams.get('fb_user');
            
            //Create and validate form
            this.userForm = this.formBuilder.group({
                email: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.email
                    ])
                ],
                name: ['', Validators.required],
                gender: ['', Validators.required],
                tel : [''],
                birthday : [''],
                job : [''],
                educational_level : [''],
                about_yourself : [''],
                personalities : [''],
                address: ['', Validators.required],
            });
            
            //KB formControlName
            this.name = this.userForm.controls['name'];
            this.email = this.userForm.controls['email'];
            this.gender = this.userForm.controls['gender'];
            this.address = this.userForm.controls['address'];
        }
    }
    
    ngAfterViewInit()
    {
        let input_address = document.getElementById('useraddress').getElementsByTagName('input')[0];
        let options = {
            types : [],
            componentRestrictions: {
                country: 'vn'
            }
        };
        
        let address = new google.maps.places.Autocomplete(input_address, options);
        let self = this;
        
        google.maps.event.addListener(address, 'place_changed', function(){
            let place = address.getPlace();
            let geometry = place.geometry;
            if( geometry !== undefined)
            {
                //Save address to GoogleService
                self.googleService.SetAddress(place.formatted_address, geometry.location.lat(), geometry.location.lng());
                console.log(self.googleService.GetAddress());
            }
        })
    }
    
    EditProfile(value : any)
    {
        this.facebook_id = this.facebookService.facebook_id;
        let url = 'http://webbase.com.vn/tinder/member-api';
        let formData: FormData = new FormData();
        formData.append('facebook_id', this.facebook_id);
        formData.append('name', value.name);
        formData.append('email', value.email);
        formData.append('gender', value.gender);
        //Addres
        let address_obj = {
            address: this.googleService.GetAddress(),
            lat: this.googleService.GetLat(),
            lng: this.googleService.GetLng()
        }
        formData.append('address', JSON.stringify(address_obj));
        if(value.tel != undefined)
        {
            formData.append('tel', value.tel);
        }
        if(value.job != undefined)
        {
            formData.append('job', value.job);
        }
        if(value.educational_level != undefined)
        {
            formData.append('educational_level', value.educational_level);
        }
        if(value.personalities != undefined)
        {
            formData.append('personalities', value.personalities);
        }
        if(value.birthday != undefined)
        {
            formData.append('birthday', Date.parse(value.birthday)/1000);
        }
        if(value.about_yourself != undefined)
        {
            formData.append('about_yourself', value.about_yourself);
        }
        
        //Create new for first time
        this.facebookService.httpPost(url, formData).subscribe(
            (response) => {
                //Save member_id into FacebookService
                this.facebookService.member_id = response.id;
                let salert = this.alertCtrl.create(
                    {
                        title: 'Successfull',
                        subTitle: '<p>Next step you should update require information to search friend</p><p>Click Agree to do this</p>',
                        buttons: [
                            {
                                text: 'Agree',
                                handler: () => {
                                    this.actionStatusService.ActionLoginFacebook(this.facebook_id, response.gender, response.id);
                                    this.navCtrl.push(
                                        RequireInformation,
                                        {
                                            type: 'create'
                                        }
                                    );
                                }
                            }
                        ]
                    }
                )
                salert.present();
            },
            (error) => {
                console.log("Error");
                console.log(error);
            }
        )
    }
    
//    GoToGallery(){
//        //Check member has already or not
//        this.facebook_id = this.facebookService.facebook_id;
//        let check_url = 'http://webbase.com.vn/tinder/member-api/check-unique-login-facebook/' + this.facebook_id;
//        this.facebookService.httpGet(check_url).subscribe(
//            (success) => {
//                if(success.message == 'exit') //Member exit
//                {
//                    this.navCtrl.push(
//                        Image,
//                        {
//                            member_id : success.id
//                        }
//                    )
//                }else //Member not exit
//                {
//                    this.navCtrl.push(Image)
//                }
//            }
//        );
//    }
}