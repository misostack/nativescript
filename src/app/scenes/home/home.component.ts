import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import * as firebase from 'nativescript-plugin-firebase';


// capture photo
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";

// sample env

import { environment } from '@environments/environment';
import { PusherService } from '~/app/services/pusher.service';
import { delay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '~/app/services/http.service';

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
  userSubject$: BehaviorSubject<firebase.User> = new BehaviorSubject(null);
  user$: Observable<firebase.User>;
  messagesSubject$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  messages$: Observable<Array<{uid:string, message: string, timestamp:number}>>;
  messages: Array<{uid:string, message: string, timestamp:number}> = []

  cameraStatus : Boolean = false
  imageAsset: string = ''
  user: firebase.User = null
  chatForm: FormGroup = new FormGroup({
    message: new FormControl('message')
  })
  authResponse$: Observable<any>;

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
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
    this.user$ = this.userSubject$.asObservable();
    this.user$.subscribe( u => this.user = u)
    this.messages$ = this.messagesSubject$.asObservable()
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

  onLogout() {
    firebase.logout().then(success => {
      this.userSubject$.next(null)
    }, error => this.log(JSON.stringify(error)))
  }

  onLogin() {
    // {
    //   type: firebase.LoginType.PASSWORD,
    //   passwordOptions: {
    //     email: 'misostack.com@gmail.com',
    //     password: '123456'
    //   }
    // }    
    //firebase
    this.authResponse$ = this.httpService.post('/auth/request', {
      email: environment.mock.user, 
      password: environment.mock.password
    });
    this.authResponse$.subscribe(token => {
      console.log('token', token);
      if (token) {
        const opts = {
          type: firebase.LoginType.CUSTOM,
          customOptions: {
            token: token
          }
        }
        firebase.login(opts)
          .then(user => {
            this.userSubject$.next(user)
            console.log(JSON.stringify(user))
          })
          .catch(error => console.log(error));    
      }
    });    
  }

  prepareMessage = (message: string) => {
    return {
      uid: this.user.uid,
      message: message,
      timestamp: Date.now() * 1000 // milliseconds
    }
  }

  onSendMessage = () => {    
    const { message } = this.chatForm.value
    const messagePayload = this.prepareMessage(message)
    console.log('SEND MESSAGE', messagePayload)
    firebase.push('messages', messagePayload)
    .then( res => console.log(res.key, res))
  }

  onNewMessage(msg : string) {
    
    this.log('New Message:', msg)
  }

  newMessages = (messages, concat = false) => {
    if(concat){
      this.messages = [...this.messages, ...messages]
    }else{
      this.messages = messages
    }
    // sort message
    this.messages.sort((a,b) => b.timestamp - a.timestamp)
    this.messagesSubject$.next(this.messages)
  }

  onQueryEvent = (result) => {
    if (!result.error) {
      console.log("Event type: " + result.type);
      console.log("Key: " + result.key);
      console.log("Value: " + JSON.stringify(result.value)); // a JSON object
      console.log("Children: " + JSON.stringify(result.children)); // an array, added in plugin v 8.0.0
      if(result.type == 'ChildAdded'){
        if(Array.isArray(result.value)){
          this.newMessages(result.value.filter(m => m!==null))
        }else{
          this.newMessages([result.value], true)
        }
      }
    }    
  }

  fetchChatMessages = () => {
    this._ngZOne.runOutsideAngular(() => {
      firebase.query(
        (data => {
          this._ngZOne.run(() => {
            console.log(data)
            this.onQueryEvent(data) 
          })
        }),
        '/messages',
        {
          singleEvent: false,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: 'timestamp'          
          },        
        }
      )
    })
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
