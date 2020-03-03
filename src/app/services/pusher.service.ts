import { Injectable, NgZone } from '@angular/core';

import { environment } from '~/environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pusher } from 'nativescript-pusher';

const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
}
const PUSHER_ENV = environment.PUSHER

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private _pusher: Pusher = null

  private _connectionState$: BehaviorSubject<string> = new BehaviorSubject(CONNECTION_STATUS.DISCONNECTED)  
  private _newMessage$: BehaviorSubject<string> = new BehaviorSubject("") 

  constructor(    
    private ngZone: NgZone
  ) {
    console.log('PusherService Init')
    // this.__connect()
  }

  private __connect(){    
    console.log('Connecting Pusher', PUSHER_ENV)
    
    if(this._pusher == null){
      this._pusher = new Pusher(
        PUSHER_ENV.API_KEY,
        PUSHER_ENV.OPTIONS
      )
      this.__subscribeToChannel(PUSHER_ENV.GLOBAL_CHANNEL, PUSHER_ENV.GLOBAL_EVENTS)
    }   
    this._pusher.connect((state) => {
      // no errors
      console.log(state)
      if(state === null){        
        this._connectionState$.next(CONNECTION_STATUS.CONNECTED)        
      }else{
        this.__newMessage(`Error when connection: ${state}`)
      }
    })
    
  }

  private __disconnect(){
    // this.__unsubscribeToChannel(PUSHER_ENV.GLOBAL_CHANNEL)
    try {
      this._pusher.disconnect()
      setTimeout(() => {      
        this._connectionState$.next(CONNECTION_STATUS.DISCONNECTED)
      }, 2000)            
    } catch (error) {
      this.__newMessage(`Error when disconnecting: ${JSON.stringify(error)}`)
    }  
  }

  private __newMessage(msg){
    const now = Date.now().toLocaleString()
    this._newMessage$.next(`${now}: ${msg}`)
  }

  private __subscribeToChannel(channelName, events = [PUSHER_ENV.DEFAULT_EVENT]) {
    events.map(event => {      
      this.__newMessage(`Subscribe to ${channelName} - ${event} !`)
      this._pusher.subscribeToChannelEvent(channelName, event, (error, data) => {
        this.ngZone.run(() => {
          if(error != null){
            this.__newMessage(`Error when subcribed: ${JSON.stringify(error)}`)
          }else{
            this.__newMessage(JSON.stringify(data))
          }
        })        
      })
    })
    // setInterval(() => {
    //   this.__newMessage(`A new message at ${Date.now().toLocaleString()}`)
    // }, 5000)
  }

  private __unsubscribeToChannel(channelName, events = [PUSHER_ENV.DEFAULT_EVENT]) {
    console.log(`Unsubscribe to Channel ${channelName} - Events : ${events}`)
  }

  public onNewMessage() : Observable<string>{
    return this._newMessage$.asObservable().pipe(delay(250))
  }

  public onConnectionState(): Observable<string>{
    return this._connectionState$.asObservable().pipe(delay(100))
  }

  public disConnect() {
    console.log('disconnecting')
    setTimeout(() => {
      this.__disconnect()
    }, 2000)
  }

  public connect() {
    this.__connect()
  }
}
