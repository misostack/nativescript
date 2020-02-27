# Details

- NativeScript Team's plugins : https://market.nativescript.org/author/tns-bot

## Basic

- Route
- Component
- Sass : https://ultimatecourses.com/blog/supercharge-your-style-with-nativescripts-core-theme

```bash


```

## Capture Image Function

### Add Plugin

```bash
tns plugin add nativescript-camera
```

### Requesting Permissions

> Both Android and iOS require explicit permissions in order for the application to have access to the camera and save photos to the device. Once the user has granted permissions the camera module can be used.

- https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage

Issues may get, if you want to use ng generate command:

- https://github.com/NativeScript/nativescript-schematics/issues/130
- https://stackoverflow.com/questions/57181909/how-to-prevent-system-font-size-changing-effects-to-nativescript-angular-android
- https://tutorialmore.com/questions-1840776.htm

```bash
yarn add @schematics/angular @nativescript/schematics -D

# test
ng g c scenes/home
```

**Add schematic configs**

- Base on : https://angular.io/cli/generate
- In angular.json

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "cli": {
    "defaultCollection": "@nativescript/schematics"
  },
  "projects": {
    "hello-world": {
      "root": "",
      "sourceRoot": "src",
      "projectType": "application",
      "prefix": "ns",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "skipTests": true
        },
        "@schematics/angular:service": {
          "skipTests": false
        },        
      }      
    }
  },
  "defaultProject": "hello-world"
}
```

**Feature-based architecture**: In this pattern, we organize the code based on what it does from the functional perspective. It is a vertical slicing. We group together code related to a certain feature. High Cohesion

> In a component-based architecture, we can have **layered architecture** wrapped inside the component. For example, a payment service (component) can have three classes: controller, service, and model layers. In this case, the layered architecture is not about the structure it is rather an implementation detail.

- Sample : https://www.sitepoint.com/understanding-component-architecture-angular/

> Low Coupling and High Cohesion
> Important : Functional Cohesion

From : https://thebojan.ninja/2015/04/08/high-cohesion-loose-coupling/

- Another : https://www.tutorialspoint.com/sdlc/sdlc_rad_model.htm