import {FormControl} from "@angular/forms";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AppAccountValidator 
{
    
    constructor(private http: Http){
        
    }
    
    UniqueUsernameValidator(control: FormControl){
        if(control.value)
        {
            let check_unique_username_url = 'http://webbase.com.vn/tinder/member-api/check-unique-username/' + control.value;
            return new Observable((obs) => {
                this.http.get(check_unique_username_url)
                .map(
                    (response: Response) => response.json()
                )                
                .subscribe(
                    (success) => {
                        if(success.message == 'exit')
                        {
                            obs.next({ unique : true });
                            obs.complete();
                        }else
                        {
                            obs.next(null);
                            obs.complete();
                        }
                    }
                )
            })
        }
        
    }
}