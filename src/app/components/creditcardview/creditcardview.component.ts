import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { publishableKey } from '@app/services/stripe.service';
import { environment } from '@environments/environment';
import { CreditCardView, PaymentMethod, Stripe, Token, Card } from "nativescript-stripe";
import { registerElement } from "nativescript-angular/element-registry";
import { HttpService } from '~/app/services/http.service';
import { Observable } from 'rxjs';
import { isAndroid, isIOS } from "tns-core-modules/platform";

@Component({
  selector: 'nts-creditcardview',
  templateUrl: './creditcardview.component.html',
  styleUrls: ['./creditcardview.component.scss']
})
export class CreditcardviewComponent implements OnInit {
  token: string;
  payment: string;
  payment$: Observable<any>;
  private stripe: Stripe;
  @ViewChild('card', {read: true, static: true}) private card : ElementRef

  constructor(
    public changeDetectionRef: ChangeDetectorRef,
    private httpService: HttpService
  ) {
    this.stripe = new Stripe(publishableKey);
  }

  ngOnInit(): void {
    registerElement("CreditCardView", () => require("nativescript-stripe").CreditCardView);
    if (-1 !== publishableKey.indexOf(environment.stripe.publishedKey)) {
      throw new Error("publishableKey must be changed from placeholder");
    }
    
  }

  createToken(cardView: CreditCardView): void {
    
    this.token = "Fetching token...";
    this.stripe.createToken(cardView.card, (error, token) => {
      this.token = error ? error.message : this.formatToken(token);
      this.processPayment(token.id)
      this.changeDetectionRef.detectChanges();
    });
  }

  processPayment(source) {
    this.payment$ = this.httpService.post('/payment/process', 
    {source, description: 'Example Payment on ' + (isAndroid ? 'Android' : 'IOS')})
    this.payment$.subscribe(payment => {
      this.payment = `ID: ${payment.id} --- paid: ${payment.paid} --- status: ${payment.status} -- amount: ${payment.amount}`
      this.changeDetectionRef.detectChanges();
    })
  }

  private formatToken(token: Token): string {
    return `\n\nToken:\nID: ${token.id}\nCard: ${token.card.brand} (...${token.card.last4})`;
  }

  private formatPaymentMethod(pm: PaymentMethod): string {
    return `\n\nPayment Method:\nType: ${pm.type}\nID: ${pm.id}\nCard: ${pm.card.brand} (...${pm.card.last4})` +
      `\nCreated: ${new Date(pm.created).toTimeString()}`;
  }  
}
