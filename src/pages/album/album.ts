import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Searchbar, ViewController} from 'ionic-angular';
import {Login} from "../login/login";
import * as SpotifyWebApi from "../../app/spotify-web-api-js";
import {Music} from "../music/music";
let spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(localStorage['access_token']);
@Component({
  selector: 'page-home',
  templateUrl: 'album.html'
})
export class Album {
  @ViewChild(Searchbar) searchbar:Searchbar;
  public albuns: any;
  public val: any;
  public prev_album: any;
  constructor(public navParam: NavParams, public navCtrl: NavController, private viewCtrl: ViewController) {

  }
  ngOnInit(){
    this.getAlbumsArtist();
  }
  getAlbumsArtist(){
    let vm = this;
    this.prev_album = spotifyApi.getArtistAlbums(this.navParam.get('artist_Id'), {limit: 10});
    this.prev_album.then(function(data) {
      console.log('Albuns de artista: '+JSON.stringify(data));
      vm.albuns = data;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
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
  cancel() {
    this.viewCtrl.dismiss();
  }

  nextprevAlbuns(offset:any){
    let vm = this;
    this.prev_album = spotifyApi.next(offset);
    this.prev_album.then(function(data) {
      console.log('Track: '+JSON.stringify(data));
      vm.albuns = data;
    }, function(err) {
      console.error(JSON.stringify(err));
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    if (ev.target.value=='') {
      this.getAlbumsArtist();
      setTimeout(() => {
        this.searchbar.setFocus();
      },1000);
    }
    // set val to the value of the searchbar
    this.val = ev.target.value;
    let vm = this;
    // if the value is an empty string don't filter the items
    if (this.val && this.val.trim() != '') {
      this.albuns.items = this.albuns.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.val.toLowerCase()) > -1);
      })
    }
  }


}
