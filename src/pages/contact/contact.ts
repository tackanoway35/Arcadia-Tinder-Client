import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {ActionStatusService} from '../../services/action_status';
import {FacebookService} from '../../services/facebook';
import {Observable} from 'rxjs/Observable';
import {ObservableService} from '../../services/observable';
import {MemberInformation} from '../member_information/member_information';
declare var google: any;

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage{
    public address: Object[];
    public friendlist: string = 'result';
    private loading : any;
    private require: Object;
    constructor
        (
        public navCtrl: NavController,
        private actionStatusService: ActionStatusService,
        private facebookService: FacebookService,
        private observableService: ObservableService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
        ) {
//        this.navCtrl.parent.select(2); //Set contact page to root tab
        //Check logged by member_id
        if (this.actionStatusService.member_id != 0)
        {
            this.loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });

            this.loading.present();
            
            
            
            //Search friend
            //Step 1 : Get Current user id from api where username = this.actionStatusService.appAccount['username']
            let get_id_url = 'http://webbase.com.vn/tinder/member-api/check-unique/' + this.actionStatusService.member_id;
            this.facebookService.httpGet(get_id_url).subscribe(
                (success) => {
                    if (success.message == 'exit') {
                        //Step 2 : Get all member # current member
                        let get_member_url = 'http://webbase.com.vn/tinder/member-api/get-contact/' + success.id + '?expand=image';
                        this.facebookService.httpGet(get_member_url).subscribe(
                            (res) => {
                                //Step 3 : Get distance search current member
                                let get_distance_url = 'http://webbase.com.vn/tinder/require-api/get-distance/' + success.id;
                                this.facebookService.httpGet(get_distance_url).subscribe(
                                    (rsuccess) => {
                                        //Step 4 : Loop for calculate distance
                                        var contact = [];
                                        for (let value of res) {
                                            let origin_address = JSON.parse(success.address).address;
                                            let destination_address = JSON.parse(value.address).address;

                                            let service = new google.maps.DistanceMatrixService;
                                            service.getDistanceMatrix({
                                                origins: [origin_address],
                                                destinations: [destination_address],
                                                travelMode: 'DRIVING',
                                                unitSystem: google.maps.UnitSystem.METRIC,
                                                avoidHighways: false,
                                                avoidTolls: false
                                            }, (response, status) => {
                                                if (status === 'OK') {
                                                    var job = '';
                                                    var address = '';
                                                    var distance = '';
                                                    var distance_number = 0;
                                                    var avatar = 'assets/uploads/icons/avatar_default.png';
                                                    if (value.job) {
                                                        job = value.job;
                                                    }
                                                    if (value.address) {
                                                        address = JSON.parse(value.address).address;
                                                        distance = response.rows[0].elements[0].distance.text;
                                                        distance_number = response.rows[0].elements[0].distance.value;
                                                    }
                                                    if (value.image.length > 0) //Đã thêm ảnh
                                                    {
                                                        avatar = value.image[0].avatar;

                                                    }

                                                    //Check distance require search
                                                    if (distance_number / 1000 > 0 && distance_number / 1000 <= rsuccess.distance) {
                                                        var member = {
                                                            id: value.id,
                                                            name: value.name,
                                                            address: address,
                                                            job: job,
                                                            distance: distance,
                                                            avatar: avatar
                                                        };
                                                        contact.push(member);
                                                    }

                                                } else {
                                                    console.log("Error from google server");
                                                }
                                            });
                                        };
                                        this.address = contact;
//                                        setTimeout(() => {
//                                            this.friendlist = 'result';
//                                            this.loading.dismiss();
//
//                                        }, 1000);    
                                        this.loading.dismiss();
                                        //Require Information form
                                        let require_url = 'http://webbase.com.vn/tinder/require-api/get-detail/' + this.actionStatusService.member_id;
                                        this.facebookService.httpGet(require_url).subscribe(
                                            (rsuccess) => {
                                                this.require = rsuccess;
                                            },
                                            (error) => {
                                                console.log(error);
                                            }
                                        );
                                        //End require information form
                                        
                                    },
                                    (error) => {
                                        console.log(error)
                                    }
                                )
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
            //End search friend
        }
    }
    
    //Function get friend information
    GetFriendInformation(id : any)
    {
        this.navCtrl.push(
            MemberInformation,
            {
                member_id : id
            }
        )
    }
    
    //Function edit require search information
    RequireForm()
    {
        let require_update_url = 'http://webbase.com.vn/tinder/require-api/update-require-information';
        let formData = new FormData();
        formData.append('member_id', this.require['member_id']);
        formData.append('gender', this.require['gender']);
        formData.append('job', this.require['job']);
        formData.append('personalities', this.require['personalities']);
        formData.append('educational_level', this.require['educational_level']);
        formData.append('distance', this.require['distance']);
        
        this.facebookService.httpPost(require_update_url, formData).subscribe(
            (success) => {
                if(success.row_updated > 0)
                {
                    this.navCtrl.parent.select(2);
                }else
                {
                    let ealert = this.alertCtrl.create({
                        title : 'Upload failed',
                        subTitle : '<p>Upload information fail</p><p>Please try again</p>',
                        buttons : ['OK']
                    });
                    ealert.present();
                }
            },
            (error) => {
                console.log(error);
            }
        )
    }
}
