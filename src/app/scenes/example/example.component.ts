import { Component, OnInit } from '@angular/core';
import { PusherService } from '~/app/services/pusher.service';

@Component({
  selector: 'nts-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  constructor(
    private chatService: PusherService
  ) { }

  ngOnInit(): void {
  }

}
