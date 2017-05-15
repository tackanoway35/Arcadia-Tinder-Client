import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FacebookService{
    public test : Object;
    public unique : number = 0;
    public fb_friendlist : any[] = [];
    public facebook_id : number;
    public member_id : number;
    private subject = new Subject<any>();
    constructor(private http: Http)
    {
        
    }
    //Function Http post
    httpPost(url: string, body : any): Observable<any>{
        return this.http.post(url, body).map(
            (res : Response) => res.json()
        )
    }
    //Function Http get
    httpGet(url): Observable<any>{
        return this.http.get(url).map(
            (res : Response) => res.json()
        )
    }
    //Function Http put
//    httpPut(url: string, body: any): Observable<any>{
//        return this.http.put(url, body).map(
//            (res : Response) => res.json()
//        )
//    }
    
    
    setFriendlist(param : any[]){
        this.fb_friendlist = param;
    }
    
    sendFriendList(friendlist : any[]){
        this.subject.next({
            fblist: friendlist
        })
    }
    
    getFriendList(): Observable<any[]>{
        return this.subject.asObservable();
    }
    
    clearFriendList()
    {
        this.subject.next();
    }
}