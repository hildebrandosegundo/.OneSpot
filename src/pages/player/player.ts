import {Component, ElementRef, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, PopoverController, Searchbar, ViewController} from 'ionic-angular';
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import { SocialSharing } from '@ionic-native/social-sharing';
import {Logout} from "../logout/logout";
import {Search} from "../search/search";
declare var window: any;
//import spot  from "../../app/spotify-player.js";
let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(localStorage['access_token']);
@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class Player {
  @ViewChild(Searchbar) searchbar:Searchbar;
  @ViewChild('player') _player:ElementRef;
  @ViewChild('seek_obj') _seek_obj:ElementRef;
  @ViewChild('player_container') _player_container:ElementRef;
  @ViewChild('play_btn') _play_btn:ElementRef;
  public _end_time:string;
  public _start_time:string;
  public _prog_val:number = 0;
  public _length:number;

  public album_img: any;
  public album_name: any;
  public favorite: any;
  public togglefav: any = false;

  public track: any;
  public repeat: any = false;
  public isPlaying: any = false;
  constructor(private socialSharing: SocialSharing, private modalCtrl: ModalController, public popoverCtrl: PopoverController,public navParam: NavParams, public navCtrl: NavController, private viewCtrl: ViewController) {}
  ngOnInit(){
    this.album_img = this.navParam.get('album_img');
    this.album_name = this.navParam.get('album_name');
    this.track = this.navParam.get('track');
    this.favorite = JSON.parse(localStorage['favorite']);
    for(let i=0;i<this.favorite.items.length;i++){
      if (this.favorite.items[i].track.id ===this.track.id){
        this.togglefav = true;
        break;
      }
    }
  }
  /** popover de sair **/
  presentPopover(ev:any) {
    let popover = this.popoverCtrl.create(Logout);
    popover.present({
      ev: ev
    });
  }
  /** repete a musica **/
  repeatMusic(){
    if (this._player.nativeElement.loop) {
      this.repeat = false;
      this._player.nativeElement.loop = false;
    }else{
      this.repeat = true;
      this._player.nativeElement.loop = true;
    }
  }
  /** funcao responsavel por chamar o plugin de compartilhamento **/
  shareMusic(){
// Check if sharing via email is supported
    this.socialSharing.share('.OneSpot share test', 'OneSpot',[this.album_img], this.track.external_urls.spotify || '').then((res) => {
      // Sharing via email is possible
      console.log('success');
      console.log(res);
    }).catch((err) => {
      // Sharing via email is not possible
      console.log('erro: '+ JSON.stringify(err))
    });
    this.initProgressBar();
  }
  search(){
    let modal = this.modalCtrl.create(Search);
    modal.present();
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  /** realiza o procedimento de calculo do tempo atual da faixa e atualiza o progressbar **/
  initProgressBar() {
    var player = this._player;
    this._length = player.nativeElement.duration;
    var current_time = player.nativeElement.currentTime;
    // calculate tempo total
    var totalLength = this.calculateTotalValue(this._length);
    this._end_time = totalLength;

    // calcula o tempo atual
    var currentTime = this.calculateCurrentValue(current_time);
    this._start_time = currentTime;

    this._prog_val = player.nativeElement.currentTime;

  };
  /** funcao busca o id da musica para retirar do favorito, caso não encontre acrecenta no localstorage de favoritos **/
  toogleFavorite(){
    let del = false;
    for(let i=0;i<this.favorite.items.length;i++){
      if (this.favorite.items[i].track.id ===this.track.id){
        this.favorite.items.splice(i,1);
        del = true;
        this.togglefav = false;
        break;
      }
    }
    if (!del) {
      this.togglefav = true;
      this.favorite.items.push({
        track: {
          id: this.track.id,
          name: this.track.name,
          external_urls: {spotify:this.track.external_urls.spotify},
          preview_url: this.track.preview_url,
          album: {
            images: [{url: this.album_img}],
            name: this.album_name
          },
          artists: this.track.artists
        }
      });
    }
    localStorage['favorite'] = JSON.stringify(this.favorite);
  }
  /** funcao responsavel por realizar o pause e play **/
  togglePlay() {
    if (this._player.nativeElement.paused === false) {
      this._player.nativeElement.pause();
      this.isPlaying = false;

    } else {
      this._player.nativeElement.play();
      this.isPlaying = true;
    }
  }
  /** calcula o tempo total da musica **/
  calculateTotalValue(length:any) {
    var minutes = Math.floor(length / 60),
      seconds_int = length - minutes * 60,
      seconds_str = seconds_int.toString(),
      seconds = seconds_str.substr(0, 2),
      time = minutes + ':' + seconds;

    return time;
  }
  /** calcula o tempo atual da musica **/
  calculateCurrentValue(currentTime:any) {
    var current_hour = (currentTime / 3600) % 24,
      current_minute = parseInt(((currentTime/60 ) % 60).toFixed(2)),
      current_seconds_long = currentTime % 60,
      current_seconds = parseInt(current_seconds_long.toFixed(2)),
      current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

    return current_time;
  }



}
