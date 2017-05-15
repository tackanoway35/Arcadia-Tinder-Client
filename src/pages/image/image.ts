import {Component} from "@angular/core";
import { Camera } from "@ionic-native/camera";
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {FacebookService} from '../../services/facebook';
import {ContactPage} from '../contact/contact';

@Component({
    selector : 'page-image',
    templateUrl : './image.html',
    providers: [Camera]
})

export class Image {
    public member_id: number ;
    public avatar : string = 'assets/uploads/icons/upload-icon.jpg';
    public image1 : string = 'assets/uploads/icons/upload-icon.jpg';
    public image2 : string = 'assets/uploads/icons/upload-icon.jpg';
    public image3 : string = 'assets/uploads/icons/upload-icon.jpg';
    public image4 : string = 'assets/uploads/icons/upload-icon.jpg';
    public image5 : string = 'assets/uploads/icons/upload-icon.jpg';
    public image6 : string = 'assets/uploads/icons/upload-icon.jpg';
    constructor(private camera: Camera, private facebookService: FacebookService, private navParams: NavParams, private alertCtrl: AlertController, private navCtrl: NavController)
    {
        if(this.navParams.get('member_id'))
        {
            console.log(this.navParams.get('member_id'));
            this.member_id = this.navParams.get('member_id');
            this.facebookService.member_id = this.member_id;
            //Check user added photo and avatar or not
            let check_image_url = 'http://webbase.com.vn/tinder/image-api/check-image-exit/' + this.member_id;
            this.facebookService.httpGet(check_image_url).subscribe(
                (response) => {
                    if(response.message == 'exit') //Has member added photo and avatar
                    {
                        //Get all member's images
                        let get_member_image_url = 'http://webbase.com.vn/tinder/image-api/get-member-image/' + this.member_id;
                        this.facebookService.httpGet(get_member_image_url).subscribe(
                            (success) => {
                                if(success.avatar)
                                {
                                    this.avatar = success.avatar;
                                }
                                if(success.image1)
                                {
                                    this.image1 = success.image1;
                                }
                                if(success.image2)
                                {
                                    this.image2 = success.image2;
                                }
                                if(success.image3)
                                {
                                    this.image3 = success.image3;
                                }
                                if(success.image4)
                                {
                                    this.image4 = success.image4;
                                }
                                if(success.image5)
                                {
                                    this.image5 = success.image5;
                                }
                                if(success.image6)
                                {
                                    this.image6 = success.image6;
                                }
                            },
                            (error) => {
                                console.log(error);
                            }
                        ); 
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
    
    takeToLibrary(value : string) {
        let formData = new FormData();
        let member_id = this.facebookService.member_id;
        formData.append('member_id', member_id);
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE
        }).then(
                (success) => {
                    if(value == 'avatar')
                    {
                        this.avatar = 'data:image/jpeg;base64,' + success;
                        formData.append('avatar', this.avatar);
                    }else if(value == 'image1')
                    {
                        this.image1 = 'data:image/jpeg;base64,' + success;
                        formData.append('image1', this.image1);
                    }else if(value == 'image2')
                    {
                        this.image2 = 'data:image/jpeg;base64,' + success;
                        formData.append('image2', this.image2);
                    }else if(value == 'image3')
                    {
                        this.image3 = 'data:image/jpeg;base64,' + success;
                        formData.append('image3', this.image3);
                    }
                    else if(value == 'image4')
                    {
                        this.image4 = 'data:image/jpeg;base64,' + success;
                        formData.append('image4', this.image4);
                    }
                    else if(value == 'image5')
                    {
                        this.image5 = 'data:image/jpeg;base64,' + success;
                        formData.append('image5', this.image5);
                    }
                    else if(value == 'image6')
                    {
                        this.image6 = 'data:image/jpeg;base64,' + success;
                        formData.append('image6', this.image6);
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

//    takeToCamera() {
//        this.camera.getPicture({
//            sourceType: this.camera.PictureSourceType.CAMERA,
//            destinationType: this.camera.DestinationType.DATA_URL,
//            mediaType: this.camera.MediaType.PICTURE
//        }).then(
//            (success) => {
//                this.imgCamera = 'data:image/jpeg;base64,' + success;
//                this.photoSelected = false;
//                this.photoTaken = true;
//            },
//            (error) => {
//                alert(error);
//            }
//            )
//    }
    
    GoFriendList()
    {
        this.navCtrl.push(ContactPage);
    }
}