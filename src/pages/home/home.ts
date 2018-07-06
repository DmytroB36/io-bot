import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public name;
  constructor(public navCtrl: NavController) {
    this.name = 'Human';
  }
}
