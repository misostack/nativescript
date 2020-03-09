import { Injectable } from '@angular/core';

import { StripeConfig } from "nativescript-stripe/standard";
import { environment } from '@environments/environment';

export const publishableKey = environment.stripe.publishedKey;

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor() { }
}
