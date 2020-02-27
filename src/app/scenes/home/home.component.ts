import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventData } from "tns-core-modules/data/observable";
import { Button } from "tns-core-modules/ui/button";

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

	title: string
	description: string
	htmlString: string
	slides: Array<{}>
  countries: Array<{name: string, code: string}>
  imageUri: string

  constructor(
    private http: HttpClient
    ) {
  	// initial default value
  	this.title = 'NativeScript App2'
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

  }


  onTap(args: EventData) {
    let button = args.object as Button;
    this.imageUri = "~/assets/images/logo.png"
    // execute your custom logic here...
    // this.getCountries().subscribe((countries) => {
    //   this.bindCountries(countries)      
    // }, error => console.error(error))
  }
}
