import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {AppBase64Service} from "../../app/app-base64.service";
declare var window: any;
@Component({
  selector: 'page-home',
  templateUrl: 'login.html'
})
export class Login {
public user: any;
  constructor(public navCtrl: NavController, private base64: AppBase64Service) {

  }

  /** A funcao abre o Browser para efetuar o login no spotify *
   *  OBS: não foi possível fazer request com as credenciais de login e senha pelo app
   *  A API utiliza OAuth2, foi usado um servidor nodeJs para realizar a conexão com o Spotify e recuperar dados de
   *  usuario e token
   */

  public spotifyLogin(): Promise<any> {
    return new Promise(function(resolve, reject) {
      var browserRef = window.cordova.InAppBrowser.open("https://onespotapi.herokuapp.com/login", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
      browserRef.addEventListener("loadstart", (event) => {
        if ((event.url).indexOf("https://onespotapi.herokuapp.com/#") === 0) {
          browserRef.removeEventListener("exit", (event) => {});
          browserRef.close();
          var responseParameters = ((event.url).split("#")[1]).split("&");
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("Ocorreu um erro ao realizar login pelo Spotify");
          }
        }
      });
      browserRef.addEventListener("exit", function(event) {
        reject("Login pelo Spotify foi cancelado");
      });
    });
  }

  /** Após o login é guardado as informações do user e token em localStorage, após isso é encaminhado
   * para a page home
   */
  goHome(){
      this.spotifyLogin().then(success => {
        localStorage['access_token'] = success.access_token;
        localStorage['refresh_token'] = success.refresh_token;
        localStorage['user'] = this.base64.decode(success.user);
        localStorage['favorite'] = JSON.stringify({items:[]});
        this.navCtrl.push(HomePage, {success: success});
      }, (error) => {
        alert(error);
      });
  }

}
