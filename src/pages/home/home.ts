import { Component, AfterViewInit } from '@angular/core';
import {NavController, AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { FacebookService } from '../../services/facebook';
import {FacebookFriendlist} from '../facebook_friendlist/friendlist';
import {UserProfile} from '../user_profile/user_profile';
import {LoginTinder} from '../login_tinder/login_tinder';

import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AppAccountValidator} from '../../validators/login_app_account';
import {GoogleService} from '../../services/google';
import {ActionStatusService} from '../../services/action_status';
import {Image} from '../image/image';
import {RequireInformation} from '../require_information/require_information';
import {md5} from '../../vendors/md5';
import {ContactPage} from '../contact/contact';
declare var google : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AppAccountValidator]
})
export class HomePage implements AfterViewInit{
    //Status to check logged in
    private loggedIn : number = 0;
    //Store member information
    private user : Object = {
        name : '',
        avatar : '',
    };
    
    public fb_friendlist : any[] = [];
    public logged_in_facebook : number = 0;
    public logged_in_gmail : number = 0;
    public fb_user : Object;
    public g_user : Object;
    
    //App tinder
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
    public address : any;
    
    public si_username : any;
    public si_password : any;
    constructor(
        public navCtrl: NavController,
        private fb: Facebook,
        private googlePlus: GooglePlus,
        private facebookService: FacebookService,
        public alertCtrl : AlertController,
        
        private formBuilder: FormBuilder,
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
            address: ['', Validators.required],
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
        this.address = this.signUpForm.controls['address'];
        
        
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
        if (this.actionStatusService.member_id != 0) //Logged in
        {
            this.loggedIn = 1;
            //Get information about member
            let url = 'http://webbase.com.vn/tinder/member-api/' + this.actionStatusService.member_id + '?expand=image';
            this.facebookService.httpGet(url).subscribe(
                (vwsuccess) => {
                    this.title = vwsuccess.name;
                    this.user['name'] = vwsuccess.name;
                    if(vwsuccess.image.length > 0 && vwsuccess.image[0].avatar)
                    {
                        this.user['avatar'] =  vwsuccess.image[0].avatar;
                    }
                    
                }
            );
        }
        document.querySelector(".tabbar")['style'].display = 'none';
    }
    
    ionViewWillLeave() {
        document.querySelector(".tabbar")['style'].display = 'flex';
    }
    loginFacebook(){
        this.fb.login(['public_profile', 'user_friends', 'email'])
            .then(
                (success) => {
                    this.logged_in_facebook = 1;
                    this.fb.getLoginStatus()
                        .then(
                            (success) => {
                                if (success.status == 'connected')
                                {
                                    this.fb.api('/' + success.authResponse.userID + '?fields=name,id,email,gender,picture.width(200).height(200)', [])
                                        .then(
                                            (res) => {
                                                this.facebookService.facebook_id = res.id;
                                                //Check account facebook already or not
                                                let check_url = 'http://webbase.com.vn/tinder/member-api/check-unique-login-facebook/'+res.id;
                                                this.facebookService.httpGet(check_url).subscribe(
                                                    (response) => {
                                                        //Case 1 : account has already -> get infomation
                                                        if(response.message == 'exit') //Exit
                                                        {
                                                            //Get information about this account
                                                            let url = 'http://webbase.com.vn/tinder/member-api/' + response.id;
                                                            this.facebookService.httpGet(url).subscribe(
                                                                (eresponse) => {
                                                                    let salert = this.alertCtrl.create({
                                                                        title : 'Login Successfull',
                                                                        subTitle : '<p>You can upload avatar and photo by clicking Gallery</p><p>Click Agree to use app</p>',
                                                                        buttons : [
                                                                            {
                                                                                text : 'Gallery',
                                                                                handler : () => {
                                                                                    this.actionStatusService.ActionLoginFacebook(eresponse.facebook_id, eresponse.gender, eresponse.id);
                                                                                    this.actionStatusService.member_id = eresponse.id;
                                                                                    this.actionStatusService.gender = eresponse.gender;
                                                                                    this.navCtrl.push(
                                                                                        Image,
                                                                                        {
                                                                                            member_id : eresponse.id
                                                                                        }
                                                                                    )
                                                                                }
                                                                            },
                                                                            {
                                                                                text : 'Agree',
                                                                                handler : () => {
                                                                                    this.actionStatusService.ActionLoginFacebook(eresponse.facebook_id, eresponse.gender, eresponse.id);
                                                                                    this.actionStatusService.member_id = eresponse.id;
                                                                                    this.actionStatusService.gender = eresponse.gender;
//                                                                                    this.navCtrl.push(ContactPage);
                                                                                    this.navCtrl.parent.select(2); //Change tab to Contact
                                                                                }
                                                                            }
                                                                        ]
                                                                    });
                                                                    salert.present();
                                                                },
                                                                (error) => {
                                                                    console.log(error);
                                                                }
                                                            )
                                                        }else//Case 2 : account not already -> get information from facebook to default
                                                        {
                                                            this.fb_user = {
                                                                faceboook_id : res.id,
                                                                email : res.email,
                                                                gender : res.gender,
                                                                name : res.name,
//                                                                image : success.picture.data.url
                                                            };
                                                            let salert = this.alertCtrl.create({
                                                                title: 'Success',
                                                                subTitle: '<p>This is the first time use app!</p><p>You should update your profile</p><p>Click Agree to do this</p>',
                                                                buttons: [
                                                                    {
                                                                        text: 'Agree',
                                                                        handler: () => {

                                                                            this.navCtrl.push(UserProfile, {
                                                                                fb_user: this.fb_user
                                                                            })
                                                                        }
                                                                    },
                                                                ]
                                                            });
                                                            salert.present();
                                                        }
                                                        
                                                    },
                                                    (error) => {
                                                        console.log(error);
                                                    }
                                                );

                                            },
                                            (error) => {
                                                let ealert = this.alertCtrl.create({
                                                    title : 'Error',
                                                    subTitle : 'Have an error while logging facebook. Please try again!',
                                                    buttons : ['OK']
                                                });
                                                ealert.present();
                                            }
                                        )
                                }else
                                {
                                    alert("Not logged in!");
                                }
                            },
                            (error)  => {
                                alert(error);
                            }
                        )
                },
                (error) => {
                    alert("Error");
                }
            )
    }
    
    logoutFacebook(){
        this.fb.logout()
            .then(
                (success) => {
                    if(this.actionStatusService.ActionLogoutFacebook())
                    {
                        this.facebookService.facebook_id = 0;
                        let salert = this.alertCtrl.create({
                            title: "Log out successful",
                            subTitle: "You are logged out",
                            buttons: [{
                                text: 'Login',
                                handler: () => {
//                                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                    window.location.reload();
                                }
                            }]
                        });
                        salert.present();
                    }else
                    {
                        let ealert = this.alertCtrl.create({
                            title: "Log out failed",
                            subTitle: "Please try again",
                            buttons: ['OK']
                        });
                        ealert.present();
                    }
                    
                },
                (error)  => {
                    alert(error);
                }
            )
    }
    
    loginGmail(){
        this.googlePlus.login({
            
        })
            .then(
                (success) => {
                    this.logged_in_gmail = 1;
                    this.g_user = {
                        'id' : success.userId,
                        'email' : success.email,
                        'name' : success.displayName,
                        'image' : success.imageUrl
                    };
                },
                (error) => {
                    alert(error);
                }
            )
    }
    
    logoutGmail(){
        this.googlePlus.logout()
            .then(
                (success) => {
                    alert("Logged out!");
                    this.logged_in_gmail = 0;
                },
                (error) => {
                    alert(error);
                }
            )
    }
    
    getFacebookFriendList()
    {
        this.fb.api('/me/taggable_friends?fields=id,name,picture.width(100).height(100)', [])
            .then(
                (success) => {
                    //Store facebook friendlist into FacebookService
                    this.fb_friendlist = success.data;
                    this.facebookService.setFriendlist(this.fb_friendlist);
                    this.facebookService.sendFriendList(this.facebookService.fb_friendlist);
                    this.navCtrl.push(FacebookFriendlist);
                },
                (error) => {
                    alert(error);
                }
            )
    }
    
    getFriendList(){
        this.fb.getLoginStatus()
            .then(
                (success) => {
                    if(success.status == 'connected')//Connected facebook
                    {
                        this.getFacebookFriendList();
                    }else
                    {
                        alert("You are not logged in. Please log in!");
                        this.loginFacebook();
                    }
                },
                (error) => {
                    alert(error);
                }
            )
    }
    
    loginTinder(){
        this.navCtrl.push(LoginTinder);
    }
    
    //App tinder
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
        //Address
        let lat = this.googleService.GetLat();
        let lng = this.googleService.GetLng();
        let formatted_address = this.googleService.GetAddress();
        let address = {
            address: formatted_address,
            lat: lat,
            lng: lng
        };
        formData.append('address', JSON.stringify(address));
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
        
        this.facebookService.httpPost(create_user_url, formData).subscribe(
            (success) => {
                let salert = this.alertCtrl.create({
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
                        let salert = this.alertCtrl.create({
                            title: 'Login successfull',
                            subTitle: '<p>Click Agree to use app</p><p>Gallery to upload your image</p>',
                            buttons: [
                                {
                                    text: 'Gallery',
                                    handler: () => {
                                        this.actionStatusService.ActionLoginAppAccount(success.id, value.si_username, success.gender);
                                        this.actionStatusService.member_id = success.id;
                                        this.actionStatusService.gender = success.gender;
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
                                        this.actionStatusService.member_id = success.id;
                                        this.actionStatusService.gender = success.gender;
                                        this.facebookService.facebook_id = 0; //Logged by app
                                        this.navCtrl.parent.select(2);
                                    }
                                }
                            ]
                        });
                        salert.present();
                    }
                    else if (success.require_information == 0) //Chưa cập nhật thông tin tìm kiếm -> go to require_information
                    {
                        let salert = this.alertCtrl.create({
                            title: 'Login successfull',
                            subTitle: '<p>This is the first time using app</p><p>You should provide information to search friend</p><p>Click agree to do this</p>',
                            buttons: [
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
                    let ealert = this.alertCtrl.create({
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
    
    //Function go to contact page
    GoToContactPage()
    {
        this.navCtrl.push(ContactPage);
    }
    
    //Function log out
    LogOutApp()
    {
        //Log out logged in facebook
        if (this.facebookService.facebook_id != 0) //Log in facebook
        {
            this.logoutFacebook();
        }else
        {
            console.log(this.actionStatusService.member_id);
            if (this.actionStatusService.ActionLogoutAppAccount())
            {
                let salert = this.alertCtrl.create({
                    title: "Log out successful",
                    subTitle: "You are logged out",
                    buttons: [{
                        text: 'Login',
                        handler: () => {
//                            this.navCtrl.setRoot(this.navCtrl.getActive().component);
                            window.location.reload();
                        }
                    }]
                });
                salert.present();
            }else
            {
                let ealert = this.alertCtrl.create({
                    title: "Log out failed",
                    subTitle: "Please try again",
                    buttons: ['OK']
                });
                ealert.present();
            }
        }
    }
}
