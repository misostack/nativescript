import { Component, OnInit } from "@angular/core";
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";

const firebase = require("nativescript-plugin-firebase");

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html",
})

export class AppComponent implements OnInit {
  // using async-await just for show
  async ngOnInit(): Promise<void> {
    try {
      await firebase.init({
        persist: false,
        analyticsCollectionEnabled: true,
      });
      console.log(">>>>> Firebase initialized");
    } catch (err) {
      console.log(">>>>> Firebase init error: " + err);
    }
  }
}