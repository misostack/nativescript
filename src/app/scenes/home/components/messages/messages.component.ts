import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nts-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @Input('messages') messages: Array<string>;

  constructor() { }

  ngOnInit(): void {
  }

}
