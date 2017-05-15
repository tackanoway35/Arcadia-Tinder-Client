import {Injectable} from "@angular/core"

@Injectable()

export class GoogleService {
    public lat : number;
    public lng : number;
    public address : string;
    
    SetAddress(address : string , lat : number, lng : number)
    {
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }
    
    GetLat()
    {
        return this.lat;
    }
    
    GetLng(){
        return this.lng;
    }
    
    GetAddress(){
        return this.address;
    }
}


