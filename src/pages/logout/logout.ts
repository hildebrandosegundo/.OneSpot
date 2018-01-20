import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Login} from "../login/login";

@Component({
  template: `<div><button (click)="logout()" block clear ion-button class="button-bg">
      <ion-icon name="exit"></ion-icon> Sair</button></div>`

})
export class Logout {
  constructor(private navCtrl: NavController) {}
  logout(){
    localStorage.clear();
    this.navCtrl.push(Login);
  }
}
