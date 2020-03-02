import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from '~/environments/environment'

@Component({
  selector: 'nts-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {

  @Output('onLogin') onLogin = new EventEmitter<any>();

  loginForm = new FormGroup({
    userId: new FormControl(environment.appLozic.userId),
    password: new FormControl(environment.appLozic.password),
    applicationId: new FormControl(environment.appLozic.applicationId),
  });

  constructor() { }

  ngOnInit(): void {
    
  }

  onLoginHandle() {
    this.onLogin.emit(this.loginForm.value)
  }

}
