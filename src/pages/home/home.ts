import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController, PopoverController} from 'ionic-angular';
import {Logout} from "../logout/logout";

/**
 * infelizmente a api do spotify para js não possui o suporte a retorno de valor pelo objeto
 */
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Search} from "../search/search";
let spotifyApi = new SpotifyWebApi();

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: any;
  public playlist: any;
  public user: any;
  constructor(private modalCtrl: ModalController, public popoverCtrl: PopoverController, public navCtrl: NavController, public loadingCtrl: LoadingController) {

  }
  showLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: ''
      });
      this.loading.present();
    }
  }

  dismissLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  ngOnInit(){
    if (localStorage['user'])
    this.user = JSON.parse(localStorage['user']);

    this.getPlayList();
  }
  presentPopover(ev:any) {
    let popover = this.popoverCtrl.create(Logout);
    popover.present({
      ev: ev
    });
  }
  getPlayList(){
    this.showLoading();
    spotifyApi.setAccessToken(localStorage['access_token']);
    console.log(localStorage['access_token']);
    spotifyApi.getUserPlaylists(JSON.parse(localStorage['user']).id)
      .then((data) =>{
        this.dismissLoading();
        this.playlist = data;
      }, (err) => {
        console.error(JSON.stringify(err));
        this.dismissLoading();
      });
  }
  search(){
    let modal = this.modalCtrl.create(Search);
    modal.present();
  }

}
