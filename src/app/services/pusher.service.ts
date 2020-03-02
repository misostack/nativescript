import { Injectable } from '@angular/core';

import { environment } from '~/environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected'
}

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
      this.__subscribeToChannel('global')
      this._connectionState$.next(CONNECTION_STATUS.CONNECTED)
    }, 2000)
    
  }

  private __disconnected(){
    this._connectionState$.next(CONNECTION_STATUS.DISCONNECTED)
  }

  private __newMessage(msg){
    this._newMessage$.next(msg)
  }

  private __subscribeToChannel(channelName) {
    console.log(`Subscribe to Channel ${channelName}`)
    setInterval(() => {
      this._newMessage$.next(`A new message at ${Date.now().toString()}`)
    }, 5000)
  }

  public onNewMessage() : Observable<string>{
    return this._newMessage$.asObservable().pipe(delay(250))
  }

  public onConnectionState(): Observable<string>{
    return this._connectionState$.asObservable().pipe(delay(100))
  }
}
