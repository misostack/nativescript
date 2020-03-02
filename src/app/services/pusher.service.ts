import { Injectable } from '@angular/core';

import { environment } from '~/environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
}

const GLOBAL_CHANNEL = environment.pusher.global_channel
@Injectable({
  providedIn: 'root'
})
export class PusherService {

  private _connectionState$: BehaviorSubject<string> = new BehaviorSubject(CONNECTION_STATUS.DISCONNECTED)  
  private _newMessage$: BehaviorSubject<string> = new BehaviorSubject("") 

  constructor(    
  ) {
    console.log('PusherService Init')
    this.__connect()
  }

  private __connect(){
    const pusher_env = environment.pusher
    console.log('Connecting Pusher', pusher_env)
    setTimeout(() => {
      this.__subscribeToChannel(GLOBAL_CHANNEL)
      this._connectionState$.next(CONNECTION_STATUS.CONNECTED)
    }, 2000)
    
  }

  private __disconnect(){
    setTimeout(() => {
      this.__unsubscribeToChannel(GLOBAL_CHANNEL)
      this._connectionState$.next(CONNECTION_STATUS.DISCONNECTED)
    }, 2000)        
  }

  private __newMessage(msg){
    this._newMessage$.next(msg)
  }

  private __subscribeToChannel(channelName) {
    console.log(`Subscribe to Channel ${channelName}`)
    // setInterval(() => {
    //   this._newMessage$.next(`A new message at ${Date.now().toString()}`)
    // }, 5000)
  }

  private __unsubscribeToChannel(channelName) {
    console.log(`Unsubscribe to Channel ${channelName}`)
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
