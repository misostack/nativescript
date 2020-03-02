import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventData, Observable } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";

// capture photo
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";

// sample env

import { environment } from '@environments/environment';

import { ApplozicChat } from 'nativescript-applozic-chat';

import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

enum AL_AUTHTYPE {
  Development = 0,
  Distribution = 1,
}

enum IS_LOGGED {
  NO = 0,
  YES = 1
}

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
  logs : string
  
  isLogged: boolean

  applozicChat: ApplozicChat

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
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
    this.logs = ''
    this.log('ApplozicChat:', typeof(ApplozicChat))
    
    this.applozicChat = new ApplozicChat()
  }

  log(...messages: string[]) {
    messages.forEach(m => this.logs += `${m}` + ' ');
    this.logs += '\n'
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
    this.isLoggedIn().then(isLogged => {
      this.log('isLogged', JSON.stringify(isLogged))
      this.updateIsLoggedStatus(isLogged)
      this.log('isLoggedParam', JSON.stringify(this.isLogged))
    }, error => console.log(error))
  }

  updateIsLoggedStatus(status: boolean) {
    this.isLogged = status
    this.cdr.detectChanges()
  }

  onClean() {
    this.logs = ''
  }

  onLogin(formData) {
    this.doLogin = this.doLogin.bind(this)
    // debug
    this.log('onLogin:', 'tapped')
    this.isLoggedIn().then(isLogged => {
      this.log('isLogged', JSON.stringify(isLogged))
      if(isLogged === true){
        this.log('[APPLOZICCHAT][LOGGEDIN]', 'already logged in')
      }else{
        this.doLogin(formData)
        .then(success => {
          this.log(JSON.stringify(success))
          this.updateIsLoggedStatus(true)
        })
        .catch(error => this.log(JSON.stringify(error)))
      }      
    }, error => this.log(JSON.stringify(error)))
  }
  
  doLogin(formData) : Promise<any>{
    this.log('[doLogin]', 'triggered')
    let alUser = {
      ...formData,
      authenticationTypeId: 1,
      deviceApnsType: AL_AUTHTYPE.Development
    } 
    // should use promise
    return new Promise((resolve, reject) => {      
      this.applozicChat.login(
        alUser,
        (success) => resolve(success),
        error => reject(error)
      )
    })          
    
  }

  onLogout(){
    this.log('Logout')
    this.doLogout()
    .then(success => { 
      this.log(JSON.stringify(success)); this.updateIsLoggedStatus(false) 
    })
    .catch(error => this.log(JSON.stringify(error)))
  }

  doLogout() : Promise<any>{
    return new Promise((resolve, reject) => {
      this.applozicChat.logout(
        success => resolve(success),
        error => reject(error),
      )      
    })
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.applozicChat.isLoggedIn(isLogged => {
        resolve(isLogged)
      }, error => reject(error))
    })
  }

  takePicture() {
    var options = {width: 1280, keepAspectRatio: true, saveToGallery: false};
    camera.takePicture(options)
    .then(imageAsset => {
        const source = new ImageSource();
        console.log("Result is an image asset instance", imageAsset);
        source.fromAsset(imageAsset).then(source => {
          let fingerImage = <Image>this.fingerImageRef.nativeElement;
          fingerImage.imageSource = source;          
        })
    }).catch(function (err) {
        console.log("Error -> " + err.message);
    });
  }


  onTap(args: EventData) {
    let button = args.object as Button;
    // this.imageUri = "~/assets/images/logo.png"
    camera.requestCameraPermissions().then(success => {
      console.log(success)
      if(success){        
        this.takePicture()
      }
    }).catch(err => {
      console.error(err)
    })
  }
}
