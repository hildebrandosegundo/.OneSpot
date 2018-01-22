import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Searchbar, ViewController} from 'ionic-angular';
import {Login} from "../login/login";
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Player} from "../player/player";
let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(localStorage['access_token']);
@Component({
  selector: 'page-home',
  templateUrl: 'music_playlist.html'
})
export class Music_playlist {
  @ViewChild(Searchbar) searchbar:Searchbar;
  public tracks: any;
  public playlist_id: any;
  public album_cid: any;
  public val: any;
  public prev_track: any;
  public album_img: any;
  public album_name: any;
  constructor(public navParam: NavParams, public navCtrl: NavController, private viewCtrl: ViewController) {

  }
  ngOnInit(){
    this.tracks = this.navParam.get('tracks');
    this.playlist_id = this.navParam.get('playlist_id');
  }
  goPlayer(track:any){
    let album_img = '';
    if (track.track.album.images[0]){
      album_img = track.track.album.images[0].url;
    }else{
      album_img = 'assets/icon/inter.png';
    }
    this.navCtrl.push(Player,{track:track.track,album_img: album_img, album_name: track.track.album.name})
  }
  getTrackPlaylist(){
    spotifyApi.setAccessToken(localStorage['access_token']);
    console.log(localStorage['access_token']);
    spotifyApi.getPlaylistTracks(JSON.parse(localStorage['user']).id, this.playlist_id)
      .then((data) =>{
        this.tracks = data;
      }, (err) => {
        console.error(JSON.stringify(err));
      })
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

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

  getItems(ev: any) {
    // Reset items back to all of the items
    if (ev.target.value=='') {
      this.getTrackPlaylist();
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
