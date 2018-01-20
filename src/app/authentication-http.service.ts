/**
 * Created by hildebrandosegundo on 08/06/17.
 */
import {Injectable } from '@angular/core';
import { Request, Response, XHRBackend, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AlertController, App, NavController} from "ionic-angular";
import {HomePage} from "../pages/home/home";
@Injectable()
export class AuthenticationHttpService extends Http {
  private navCtrl: NavController;
  constructor (
        backend: XHRBackend,
        public defaultOptions: RequestOptions,
        private app:App,
        private alertCtrl: AlertController,
    ) {
        super(backend, defaultOptions);
        //this.loading = this.loadingCtrl.create();
        this.navCtrl = this.app.getActiveNav();
        let access_token = localStorage['access_token'] || {};
        if (access_token) {
            this.setAccessToken(access_token);
        }
    }
  showAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'Opa!',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
    request(url: string | Request, options:RequestOptionsArgs) : Observable<any> {
      console.log('My new request');
      return super.request(url, options).catch((error: Response) => {
        console.log('request: '+ error.status);
            if(error.status===500){
              this.showAlert(error.text())
            }
            if (error.status === 401) {

                this.refreshToken()
                    .then((response) => {
                        if (response) {
                            let access_token = localStorage['access_token'] ? JSON.parse(localStorage['access_token']) : {};
                            if (access_token) {
                                this.setAccessToken(access_token);
                                //alert('Login atualizado, refaça o último passo');
                            }
                        } else {
                            this.navCtrl.push(HomePage);
                        }
                    });
            }
            if (error.status === 0){
              this.showAlert(JSON.stringify(error))
              //this.showAlert('Por favor, necessário conectar a uma rede com internet.');
            }
            return Observable.throw(error);
        });
    }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    console.log('My new get...');
    //let c = '';
    //if(url.indexOf('?') !== -1){c = '&'}else {c = '?'}
    //return super.get(url + c + 'rand=' + Math.floor((1 + Math.random()) * 0x10000), options);
    return super.get(url, options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    console.log('My new post...');
    return super.post(url, body, options);
  }
    protected setAccessToken(token: string) {
        let header = new Headers({'Authorization': 'Bearer ' + token});
        this._defaultOptions.headers = header;
    }

    protected refreshToken() {
        let refresh_token = localStorage['refresh_tokens'] ? JSON.parse(localStorage['refresh_tokens']) : {};
        if (refresh_token) {
            return this.get('https://onespotapi.herokuapp.com?refresh_token='+refresh_token)
                .toPromise()
                .then((res) => {
                    let result = res.json() || {};
                    localStorage['access_token'] = result.access_token;
                    console.log('access_token: '+ result.access_token);
                    return result.refresh_token !== undefined;
                });
        }
        return new Promise((resolve, reject) => {
            return resolve(false);
        });
    }
}
