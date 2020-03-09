import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { publishableKey } from '@app/services/stripe.service';
import { environment } from '@environments/environment';
import { CreditCardView, PaymentMethod, Stripe, Token, Card } from "nativescript-stripe";
import { registerElement } from "nativescript-angular/element-registry";

@Component({
  selector: 'nts-creditcardview',
  templateUrl: './creditcardview.component.html',
  styleUrls: ['./creditcardview.component.scss']
})
export class CreditcardviewComponent implements OnInit {
  token: string;
  payment: string;
  private stripe: Stripe;
  @ViewChild('card', {read: true, static: true}) private card : ElementRef

  constructor(
    public changeDetectionRef: ChangeDetectorRef
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
      this.changeDetectionRef.detectChanges();
    });
  }

  createPaymentMethod(cardView: CreditCardView): void {
    this.payment = "Fetching payment method...";
    this.stripe.createPaymentMethod(cardView.card, (error, pm) => {
      this.payment = error ? error.message : this.formatPaymentMethod(pm);
      this.changeDetectionRef.detectChanges();
    });
  }

  private formatToken(token: Token): string {
    return `\n\nToken:\nID: ${token.id}\nCard: ${token.card.brand} (...${token.card.last4})`;
  }

  private formatPaymentMethod(pm: PaymentMethod): string {
    return `\n\nPayment Method:\nType: ${pm.type}\nID: ${pm.id}\nCard: ${pm.card.brand} (...${pm.card.last4})` +
      `\nCreated: ${new Date(pm.created).toTimeString()}`;
  }  
}
