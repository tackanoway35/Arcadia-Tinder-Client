import {Injectable} from "@angular/core";

@Injectable()
export class ActionStatusService 
{
    public onlineStatus : boolean = false;
    public loginStatus : boolean = false;
    public appAccount : Object = {};
    public facebookAccount : Object = {};
    
    public member_id : number = 0; //Using to store member_id in RequireInformation
    public gender : string; //Using to store gender in RequireInformation
    
    ActionLoginAppAccount(id : number ,username : string, gender : string)
    {
        this.loginStatus = true;
        this.appAccount = {
            member_id : id,
            username : username,
            gender: gender
        };
    }
    
    ActionLoginFacebook(facebookId : number, gender:string, id : number)
    {
        this.loginStatus = true;
        this.facebookAccount = {
            facebookId: facebookId,
            gender: gender,
            member_id : id
        };
    }
    
    ActionLogoutFacebook()
    {
        this.loginStatus = false;
        this.facebookAccount = {};
        this.member_id = 0;
        return true;
    }
    
    ActionLogoutAppAccount()
    {
        this.loginStatus = false;
        this.appAccount = {};
        this.member_id = 0;
        return true;
    }
    
    
    CheckLoginAppAccount()
    {
        if (this.loginStatus == true && this.appAccount['member_id'])
        {
            return true;
        }
            return false;
    }
    
    CheckLoginFacebook()
    {
        if (this.loginStatus && this.facebookAccount['member_id'])
        {
            return true;
        }
            return false;
    }
}