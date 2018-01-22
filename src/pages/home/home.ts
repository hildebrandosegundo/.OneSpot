import { Component } from '@angular/core';
import {LoadingController, ModalController, NavController, PopoverController} from 'ionic-angular';
import {Logout} from "../logout/logout";

/**
 * infelizmente a api do spotify para js não possui o suporte a retorno de valor pelo objeto
 */
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Search} from "../search/search";
import {Music} from "../music/music";
import {Music_playlist} from "../music_playlist/music_playlist";
declare var window: any;
declare var Spotify: any;
let spotifyApi = new SpotifyWebApi();
//import "../../app/spotify-player.js";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: any;
  public playlist: any;
  public user: any;
  public favorite: any;
  constructor(private modalCtrl: ModalController, public popoverCtrl: PopoverController, public navCtrl: NavController, public loadingCtrl: LoadingController) {

  }
  /** mostra o loading **/
  showLoading() {
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        content: ''
      });
      this.loading.present();
    }
  }
  /** esconde o loading **/
  dismissLoading(){
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  ngOnInit(){
    if (localStorage['user'])
    this.user = JSON.parse(localStorage['user']);
    if (localStorage['favorite'])
      this.favorite = JSON.parse(localStorage['favorite']);
    this.getPlayList();

  }
  /** execulta sempre que carrega a page **/
  ionViewWillEnter(){
    if (localStorage['user'])
      this.user = JSON.parse(localStorage['user']);
    if (localStorage['favorite'])
      this.favorite = JSON.parse(localStorage['favorite']);
    this.getPlayList();
  }
  /** popover de sair **/
  presentPopover(ev:any) {
    let popover = this.popoverCtrl.create(Logout);
    popover.present({
      ev: ev
    });
  }
  /** função responsavel por buscar playlists do usuário**/
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
  /** função responsavel por buscar musicas do playlist e encaminhar para a page music_playlist **/
  goPlaylist(playlist:any){
    this.showLoading();
    spotifyApi.setAccessToken(localStorage['access_token']);
    spotifyApi.getPlaylistTracks(JSON.parse(localStorage['user']).id, playlist.id)
      .then((data) =>{
        this.dismissLoading();
        this.navCtrl.push(Music_playlist, {tracks: data, playlist_id: playlist.id})
      }, (err) => {
        console.error(JSON.stringify(err));
        this.dismissLoading();
      })
  }
  /** redireciona para page de musicas (music_playlist) contidas no favorito **/
  goFavoritePlayList(){
    this.navCtrl.push(Music_playlist, {tracks: this.favorite})
  }
  /** Função de encamihar para a page search**/
  search(){
    let modal = this.modalCtrl.create(Search);
    modal.present();
  }

}
