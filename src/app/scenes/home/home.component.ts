import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isAndroid, isIOS } from "tns-core-modules/platform";


// capture photo
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";

// sample env

import { environment } from '@environments/environment';
import { PusherService } from '~/app/services/pusher.service';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';

const SLIDES = [
	{
		title: 'Component',
		description: `
			Basically is a set of function ( implemented as a class with decoration ) which instructs NgModules render the associated HTML
		`,
	},
	{
		title: 'Template',
		description: `HTML files, also includes Angular Directives and Binding Markup`,
		bullets: [
			`Interpolation: Using expression '{{value}}' to interpolate value properties in component into HTML`
		]
	}
];

@Component({
  selector: 'nts-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild("fingerImage", {static: false}) fingerImageRef: ElementRef;

	title: string
	description: string
	htmlString: string
	slides: Array<{}>
  countries: Array<{name: string, code: string}>
  imageUri: any
  logMessages: Array<string> = []
  connectionState : string
  newMessage$: Observable<string>

  cameraStatus : Boolean = false
  imageAsset: string = ''

  constructor(
    private http: HttpClient,
    private chatService: PusherService,
    private _ngZOne: NgZone
    ) {
  	// initial default value
  	this.title = 'NativeScript App - ' + environment.name
  	this.slides = SLIDES
  	this.description = `In NativeScript App, the runtimes enable you to call APIs in the
  	Android and IOS frameworks using Javascript code.
  	 `
  	this.htmlString = `
  		<ul>
  			<li>Android Runtimes: <strong>V8 VM</strong></li>
  			<li>IOS Runtimes: <strong>JavascriptCore VM</strong></li> 
  		</ul>
    `
    this.logMessages = []
  }

  private createRequestHeader() {
      // set headers here e.g.
      let headers = new HttpHeaders({
          "AuthKey": "my-key",
          "AuthToken": "my-token",
          "Content-Type": "application/json",
       });

      return headers;
  }

  getCountries() {
    let headers = this.createRequestHeader();
    return this.http.get('~/assets/data/countries.json', { headers: headers });    
  }

  bindCountries(countries) {
    this.countries = countries
  }

  ngOnInit(): void {
    this.log('Sample log')
    this.chatService.onConnectionState().subscribe(connectionState => {
      this.updateConnectionState(connectionState)      
    })    
    this.newMessage$ = this.chatService.onNewMessage()
    this.newMessage$.pipe(delay(100)).subscribe(msg => {
      this.onNewMessage(msg)
    })
    this.onRequestPermission()
  }

  onNewMessage(msg : string) {
    
    this.log('New Message:', msg)
  }

  onDisconnect() {
    this.chatService.disConnect()
  }

  onConnect() {
    this.chatService.connect()
  }

  updateConnectionState(state: string) {
    this.connectionState = state
  }

  log(...messages: string[]){
    messages.forEach(m => this.logMessages.push(m))
    console.log(this.logMessages.length)    
    console.log(messages)
    
  }

  onClearLogs(){
    this.logMessages = []
  }

  onRequestPermission() {
    this._ngZOne.runOutsideAngular(() => {
      this.requestPermission((success) => {
        this._ngZOne.run(() => {
          this.log(success)
          this.cameraStatus = camera.isAvailable()
        })
      }, (error) => {
        this.log(error)
        this.cameraStatus = camera.isAvailable()
      })
    })
  }

  onTakePhoto(){
    const options : camera.CameraOptions = {
      width: 250,
      height: 250,
      keepAspectRatio: true,      
      saveToGallery: false,
      allowsEditing: false,  
      /**
       * The initial camera. Default "rear".
       * The current implementation doesn't work on all Android devices, in which case it falls back to the default behavior.
       */
      // cameraFacing: "front" | "rear"      
    }
    camera.takePicture(options).then(
      imageAsset => {
            const source = new ImageSource();
            console.log("Result is an image asset instance", imageAsset);
            source.fromAsset(imageAsset).then(source => {
               let fingerImage = <Image>this.fingerImageRef.nativeElement;
               fingerImage.imageSource = source;          
            })
      }
      ).then( err => console.log(err))  
    return;
  }

  //

  requestPermission(successCallBack: (data) => void, errorCallBack: (err) => void) {
    camera.requestPermissions().then(
      success => successCallBack(success)
    ).then( err => errorCallBack(err))
  }

  takePhoto(successCallBack: (data) => void, errorCallBack: (err) => void){
    const options : camera.CameraOptions = {
      width: 250,
      height: 250,
      keepAspectRatio: true,      
      saveToGallery: false,
      allowsEditing: false,  
      /**
       * The initial camera. Default "rear".
       * The current implementation doesn't work on all Android devices, in which case it falls back to the default behavior.
       */
      // cameraFacing: "front" | "rear"      
    }
    camera.takePicture(options).then(
      success => successCallBack(success)
      ).then( err => errorCallBack(err))
  }
}
