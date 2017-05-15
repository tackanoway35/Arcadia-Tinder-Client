import {Component, AfterViewInit} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {ActionStatusService} from '../../services/action_status';
import {FacebookService} from '../../services/facebook';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from "@ionic-native/camera";
import {GoogleService} from '../../services/google';

declare var google : any;

@Component({
    selector : 'page-edit-profile',
    templateUrl : 'edit_profile.html',
    providers: [Camera]
})

export class EditProfile implements AfterViewInit
{
    public profile : string = "information";
    
    private userForm : FormGroup;
    public name : any;
    public email : any;
    public gender : any;
    public address : any;
    
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
        address : ''
    };
    public photo : Object = {
        avatar : 'assets/uploads/icons/upload-icon.jpg',
        image1 : 'assets/uploads/icons/upload-icon.jpg',
        image2 : 'assets/uploads/icons/upload-icon.jpg',
        image3 : 'assets/uploads/icons/upload-icon.jpg',
        image4 : 'assets/uploads/icons/upload-icon.jpg',
        image5 : 'assets/uploads/icons/upload-icon.jpg',
        image6 : 'assets/uploads/icons/upload-icon.jpg'
    };
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private facebookService : FacebookService,
        private actionStatusService: ActionStatusService,
        private formBuilder: FormBuilder,
        private camera: Camera,
        private googleService: GoogleService
    )
    {
        if (this.navParams.get('type') == 'edit')
        {
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
                tel: [''],
                birthday: [''],
                job: [''],
                educational_level: [''],
                about_yourself: [''],
                personalities: [''],
                address: ['', Validators.required],
            });

            //KB formControlName
            this.name = this.userForm.controls['name'];
            this.email = this.userForm.controls['email'];
            this.gender = this.userForm.controls['gender'];
            this.address = this.userForm.controls['address'];
            
            //Get information
            let url = 'http://webbase.com.vn/tinder/member-api/' + this.actionStatusService.member_id + '?expand=image';
            this.facebookService.httpGet(url).subscribe(
                (success) => {
                    
                    if(success.address)
                    {
                        let address = JSON.parse(success.address)
                        this.member['address'] = address.address;
                    }
                    //Lấy ra toàn bộ thông tin
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
                        if(success.image[0].avatar)
                        {
                            this.photo['avatar'] = success.image[0].avatar;
                        }
                        if(success.image[0].image1)
                        {
                            this.photo['image1'] = success.image[0].image1;
                        }
                        if(success.image[0].image2)
                        {
                            this.photo['image2'] = success.image[0].image2;
                        }
                        if(success.image[0].image3)
                        {
                            this.photo['image3'] = success.image[0].image3;
                        }
                        if(success.image[0].image4)
                        {
                            this.photo['image4'] = success.image[0].image4;
                        }
                        if(success.image[0].image5)
                        {
                            this.photo['image5'] = success.image[0].image5;
                        }
                        if(success.image[0].image6)
                        {
                            this.photo['image6'] = success.image[0].image6;
                        }
                    }
                    
                    
                },
                (error) => {
                    console.log(error);
                }
            )
        }
    }
    
    takeToLibrary(value : string) {
        let formData = new FormData();
        let member_id = this.actionStatusService.member_id;
        formData.append('member_id', member_id);
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE
        }).then(
                (success) => {
                    if(value == 'avatar')
                    {
                        this.photo['avatar'] = 'data:image/jpeg;base64,' + success;
                        formData.append('avatar', this.photo['avatar']);
                    }else if(value == 'image1')
                    {
                        this.photo['image1'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image1', this.photo['image1']);
                    }else if(value == 'image2')
                    {
                        this.photo['image2'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image2', this.photo['image2']);
                    }else if(value == 'image3')
                    {
                        this.photo['image3'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image3', this.photo['image3']);
                    }
                    else if(value == 'image4')
                    {
                        this.photo['image4'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image4', this.photo['image4']);
                    }
                    else if(value == 'image5')
                    {
                        this.photo['image5'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image5', this.photo['image5']);
                    }
                    else if(value == 'image6')
                    {
                        this.photo['image6'] = 'data:image/jpeg;base64,' + success;
                        formData.append('image6', this.photo['image6']);
                    }
                    //Added into image table
                    
                    let check_image_url = 'http://webbase.com.vn/tinder/image-api/check-image-exit/' + member_id;
                    this.facebookService.httpGet(check_image_url).subscribe(
                        (success) => {
                            if(success.message == 'exit') //Has member added photo and avatar
                            {
                                //Update
                                let update_image_url = 'http://webbase.com.vn/tinder/image-api/update-image'
                                this.facebookService.httpPost(update_image_url, formData).subscribe(
                                    (success) => {
                                        //Update success
                                        if(success.row_updated > 0)
                                        {
                                            let salert = this.alertCtrl.create({
                                                title: 'Upload successfull',
                                                buttons: ['OK']
                                            });
                                            salert.present();
                                        }else
                                        {
                                            let ealert = this.alertCtrl.create({
                                                title : 'Upload failed',
                                                subTitle : 'Upload failed. Please try again',
                                                buttons : ['Reupload']
                                            });
                                            ealert.present();
                                        }
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            }else //Member hasn't added photo and avatar
                            {
                                //Create new
                                let url = 'http://webbase.com.vn/tinder/image-api';
                                this.facebookService.httpPost(url, formData).subscribe(
                                    (success) => {
                                        let salert = this.alertCtrl.create({
                                            title : 'Upload successfull',
                                            buttons : ['OK']
                                        });
                                        salert.present();
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            }
                        }
                    );
                },
                (error) => {
                    console.log(error);
                }
            )
    }
    
    ngAfterViewInit()
    {
        let input_address = document.getElementById('editaddress').getElementsByTagName('input')[0];
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
    
    //Function update profile
    EditProfile(value : any)
    {
        let url = 'http://webbase.com.vn/tinder/member-api/update-member';
        let formData = new FormData();
        formData.append('member_id', this.actionStatusService.member_id);
        formData.append('name', value.name);
        formData.append('email', value.email);
        formData.append('gender', value.gender);
        //Address
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
        if(value.birthday != undefined && value.birthday != '')
        {
            formData.append('birthday', Date.parse(value.birthday)/1000);
        }
        if(value.about_yourself != undefined)
        {
            formData.append('about_yourself', value.about_yourself);
        }
        
        //Update by using API
        this.facebookService.httpPost(url, formData).subscribe(
            (success) => {
                let salert = this.alertCtrl.create({
                    title : 'Successfull',
                    subTitle : '<p>Your profile is updated</p><p>You can use app now</p>',
                    buttons : ['OK']
                });
                let ealert = this.alertCtrl.create({
                    title : 'Update failed',
                    subTitle : '<p>Have error while updating your information</p><p>Please try again</p>',
                    buttons : ['OK']
                });
                if(success.row_updated > 0)
                {
                    salert.present();
                }else
                {
                    ealert.present();
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }
}