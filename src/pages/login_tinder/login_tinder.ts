import {Component, AfterViewInit} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AppAccountValidator} from '../../validators/login_app_account';
import {FacebookService} from '../../services/facebook';
import {GoogleService} from '../../services/google';
import {ActionStatusService} from '../../services/action_status';
import {Image} from '../image/image';
import {RequireInformation} from '../require_information/require_information';
import {md5} from '../../vendors/md5';
import {ContactPage} from '../contact/contact';
declare var google : any;

@Component({
    selector : 'login-tinder',
    templateUrl : './login_tinder.html',
    providers: [AppAccountValidator]
})

export class LoginTinder implements AfterViewInit
{
    private title :string = 'Sign In';
    private signInStatus : number = 1;
    private signUpStatus : number = 0;
    
    private signUpForm: FormGroup;
    private signInForm: FormGroup;
    public name : any;
    public email : any;
    public gender : any;
    public password : any;
    public username : any;
    
    public si_username : any;
    public si_password : any;
    
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private alert: AlertController,
        private formBuilder: FormBuilder,
        private facebookService: FacebookService,
        private googleService: GoogleService,
        private actionStatusService : ActionStatusService,
        private appAccountValidator: AppAccountValidator
    )
    {
        //Validate form signUp
        this.signUpForm = formBuilder.group({
            name : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(30)
                ])
            ],
            username : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(30),
//                    this.appAccountValidator.UniqueUsernameValidator.bind(this.appAccountValidator)
                ]),
                this.appAccountValidator.UniqueUsernameValidator.bind(this.appAccountValidator)
            ],
            email : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(30)
                ])
            ],
            address : [''],
            gender : [
                '',
                Validators.required
            ],
            password : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(30)
                ])
            ],
            tel : [''],
            birthday: [''],
            job: [''],
            educational_level: [''],
            about_yourself: [''],
            personalities: [''],
        });
        
        this.name = this.signUpForm.controls['name'];
        this.email = this.signUpForm.controls['email'];
        this.gender = this.signUpForm.controls['gender'];
        this.password = this.signUpForm.controls['password'];
        this.username = this.signUpForm.controls['username'];
        
        
        
        //Validate form signIn
        this.signInForm = formBuilder.group({
            si_username : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(30)
                ])
            ],
            si_password : [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(30)
                ])
            ]
        })
        this.si_username = this.signInForm.controls['si_username'];
        this.si_password = this.signInForm.controls['si_password'];
    }
    
    ngAfterViewInit(){
        let input_address = document.getElementById('address').getElementsByTagName('input')[0];
        let options = {
            types : [],
            componentRestrictions: {
                country: 'vn'
            }
        };
        let self = this; //Must have. If haven't U can't called this.googleService -> Failed
        let address = new google.maps.places.Autocomplete(input_address, options);
        google.maps.event.addListener(address, 'place_changed', function () {
            let place = address.getPlace();
            let geometry = place.geometry;
            if ((geometry) !== undefined) {
                //Save to GoogleService
                self.googleService.SetAddress(place.formatted_address, geometry.location.lat(), geometry.location.lng());
            }
        });
    }
    
    ionViewWillEnter()
    {
        document.querySelector('.tabbar')['style'].display = 'none';
    }
    ionViewWillLeave()
    {
        document.querySelector('.tabbar')['style'].display = 'flex';
    }
    
    GoToSignUp(){
        this.signUpStatus = 1;
        this.signInStatus = 0;
        this.title = 'Sign in here';
    }
    
    GoToSignIn(){
        this.signUpStatus = 0;
        this.signInStatus = 1;
        this.title = 'Sign In';
    }
    
    SignUp(value : any)
    {
        let create_user_url = 'http://webbase.com.vn/tinder/member-api';
        let formData = new FormData();
        formData.append('username', value.username);
        formData.append('password', md5(value.password));
        formData.append('name', value.name);
        formData.append('email', value.email);
        formData.append('gender', value.gender);
        if(value.address != undefined)
        {
            let lat = this.googleService.GetLat();
            let lng = this.googleService.GetLng();
            let formatted_address = this.googleService.GetAddress();
            let address = {
                address: formatted_address,
                lat: lat,
                lng: lng
            };
            formData.append('address', JSON.stringify(address));
        }
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
        
        this.facebookService.httpPost(create_user_url, formData).subscribe(
            (success) => {
                let salert = this.alert.create({
                    title : 'Successfull!',
                    subTitle : 'Create new account successful!\n\
Click to Agree to using app\n\
Click to Disagree to create another account',
                    buttons : [
                        {
                            text : 'Disagree',
                            handler : () => {
                                console.log('Signup another account')
                            }
                        },
                        {
                            text : 'Agree',
                            handler : () => {
                                this.GoToSignIn();
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
    }
    
    SignIn(value : any)
    {
        let login_url = 'http://webbase.com.vn/tinder/member-api/login-by-app';
        let formData = new FormData();
        formData.append('username', value.si_username);
        formData.append('password', md5(value.si_password));
        
        this.facebookService.httpPost(login_url, formData).subscribe(
            (success) => {
                if(success.message == 'success') //Login successful
                {
                    if(success.require_information == 1) //Đã cập nhật thông tin tìm kiếm -> go to app
                    {
                        let salert = this.alert.create({
                            title: 'Login successfull',
                            subTitle: '<p>Click Agree to use app</p><p>Gallery to upload your image</p>',
                            buttons: [
                                {
                                    text: 'Gallery',
                                    handler: () => {
                                        this.actionStatusService.ActionLoginAppAccount(success.id, value.si_username, success.gender);
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
                                        this.actionStatusService.ActionLoginAppAccount(success.id, value.si_username, success.gender);
                                        this.navCtrl.push(ContactPage);
                                    }
                                }
                            ]
                        });
                        salert.present();
                    }
                    else if (success.require_information == 0) //Chưa cập nhật thông tin tìm kiếm -> go to require_information
                    {
                        let salert = this.alert.create({
                            title: 'Login successfull',
                            subTitle: '<p>This is the first time using app</p><p>You must provider information to search friend</p><p>Click agree to do this</p>',
                            buttons: [
                                {
                                    text : 'Cancel',
                                    handler : () => {
                                        
                                    }
                                },
                                {
                                    text: 'Agree',
                                    handler: () => {
                                        this.actionStatusService.ActionLoginAppAccount(success.id, value.si_username, success.gender);
                                        this.navCtrl.push(
                                            RequireInformation,
                                            {
                                                type : 'create'
                                            }
                                        );
                                    }
                                }
                                
                            ]
                        });
                        salert.present();
                    }
                    
                }else if (success.message == 'error')
                {
                    let ealert = this.alert.create({
                        title : 'Login failed',
                        subTitle : 'Username or Password is not correct.\n\
Please try again.',
                        buttons : ['Relogin']
                    });
                    ealert.present();
                }
                
            },
            (error) => {
                console.log(error);
            }
        );
    }
}