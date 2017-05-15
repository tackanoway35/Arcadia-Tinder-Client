import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';

@Injectable()

export class ObservableService
{
    public observable: Observable<any>;
    CreateObservable(value: any)
    {
        this.observable = Observable.create(function(obs){
            obs.next(value);
            obs.complete();
        })
    }
    
    GetObservable()
    {
        return this.observable;
    }
}