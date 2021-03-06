import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Searchbar, ViewController} from 'ionic-angular';
import {Login} from "../login/login";
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Player} from "../player/player";
let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(localStorage['access_token']);
@Component({
  selector: 'page-home',
  templateUrl: 'music.html'
})
export class Music {
  @ViewChild(Searchbar) searchbar:Searchbar;
  public tracks: any;
  public artist_id: any;
  public album_cid: any;
  public val: any;
  public prev_track: any;
  public album_img: any;
  public album_name: any;
  constructor(public navParam: NavParams, public navCtrl: NavController, private viewCtrl: ViewController) {

  }
  ngOnInit(){
    this.album_img = this.navParam.get('album_img');
    this.album_name = this.navParam.get('album_name');
    this.album_cid = this.navParam.get('album_cid');
    this.getTracksAlbum();
  }
  /** redireciona para o player **/
  goPlayer(track:any, album_img:any){
    this.navCtrl.push(Player,{track:track,album_img: album_img, album_name: this.album_name})
  }
  /** busca musicas de um determinado album de artista **/
  getTracksAlbum(){
    let vm = this;
    this.prev_track = spotifyApi.getAlbumTracks(this.navParam.get('album_Id'), {limit: 10});
    this.prev_track.then(function(data) {
      console.log('Track de musica: '+JSON.stringify(data));
      vm.tracks = data;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  /** realiza o carregamento da parte anterior ou posterior da lista de musica **/
  nextprevTrack(offset:any){
    let vm = this;
    this.prev_track = spotifyApi.next(offset);
    this.prev_track.then(function(data) {
      console.log('Track: '+JSON.stringify(data));
      vm.tracks = data;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }
  /** filtra o conteudo do array this.track.items **/
  getItems(ev: any) {
    // Reset items back to all of the items
    if (ev.target.value=='') {
      this.getTracksAlbum();
      setTimeout(() => {
        this.searchbar.setFocus();
      },500);
    }
    // set val to the value of the searchbar
    this.val = ev.target.value;
    let vm = this;
    // if the value is an empty string don't filter the items
    if (this.val && this.val.trim() != '') {
      this.tracks.items = this.tracks.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
      })
    }
  }


}
