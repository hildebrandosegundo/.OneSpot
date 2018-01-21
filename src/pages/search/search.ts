import {Component, ViewChild} from '@angular/core';
import {NavController, Searchbar, ViewController} from 'ionic-angular';
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Music} from "../music/music";
import {Album} from "../album/album";
import {Player} from "../player/player";
let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(localStorage['access_token']);
@Component({
  selector: 'page-home',
  templateUrl: 'search.html'
})
export class Search {
  @ViewChild(Searchbar) searchbar:Searchbar;
  public artists: any;
  public tracks: any;
  public albuns: any;
  public val: any;
  public prev_artist: any;
  public prev_album: any;
  public prev_track: any;
  constructor(public navCtrl: NavController, private viewCtrl: ViewController) {

  }
  ngOnInit(){

  }
  goAlbums(artist:any){
    this.navCtrl.push(Album, {artist_Id: artist.id})
  }
  goMusics(album: any){
    let img;
    if (album.images[0]){
      img = album.images[0].url;
    }else{
      img = 'assets/icon/inter.png'
    }
    this.navCtrl.push(Music, {album_Id: album.id, album_img: img, album_name: album.name})
  }
  goPlayer(track:any){
    let album_img: any;
    if (track.album.images[0]) {
      album_img = track.album.images[0].url;
    } else{
      album_img = 'assets/icon/inter.png';
    }
    this.navCtrl.push(Player,{track:track,album_img: album_img, album_name: track.album.name})
  }
  cancel() {
    this.viewCtrl.dismiss();
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    },500);
  }
  nextprevArt(offset:any){
    let vm = this;
    this.prev_artist = spotifyApi.next(offset);
    this.prev_artist.then(function(data) {
      console.log('Artist: '+JSON.stringify(data));
      vm.artists = data.artists;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }
  nextprevTrack(offset:any){
    let vm = this;
    this.prev_track = spotifyApi.next(offset);
    this.prev_track.then(function(data) {
      console.log('Track: '+JSON.stringify(data));
      vm.tracks = data.tracks;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }
  nextprevAlbuns(offset:any){
    let vm = this;
    this.prev_album = spotifyApi.next(offset);
    this.prev_album.then(function(data) {
      console.log('Album: '+JSON.stringify(data));
      vm.albuns = data.albums;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    if (ev.target.value=='') {
      setTimeout(() => {
        this.searchbar.setFocus();
      },500);
    }
    // set val to the value of the searchbar
    this.val = ev.target.value;
    let vm = this;
    // if the value is an empty string don't filter the items
    if (this.val && this.val.trim() != '') {
      this.prev_track = spotifyApi.searchTracks(this.val, {limit: 5});
      this.prev_track.then(function(data) {
        console.log('Track: '+JSON.stringify(data));
        vm.tracks = data.tracks;
        }, function(err) {
        console.error(err);
      });
      this.prev_artist = spotifyApi.searchArtists(this.val, {limit:5});
      this.prev_artist.then(function(data) {
        console.log('Artist: '+JSON.stringify(data));
        vm.artists = data.artists;
      }, function(err) {
        console.error(JSON.stringify(err));
      });
      this.prev_album = spotifyApi.searchAlbums(this.val, {limit: 5});
      this.prev_album.then(function(data) {
        console.log('Album: ' +JSON.stringify(data));
        vm.albuns = data.albums;
      }, function(err) {
        console.error(err);
      });
    }
  }


}
