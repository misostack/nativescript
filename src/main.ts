// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

// https://stackoverflow.com/questions/57181909/how-to-prevent-system-font-size-changing-effects-to-nativescript-angular-android
import { isAndroid } from 'tns-core-modules/platform';
import { TextBase } from 'tns-core-modules/ui/text-base/text-base';

import { AppModule } from "./app/app.module";

declare var android; // required if tns-platform-declarations is not installed

if (isAndroid) {
    TextBase.prototype[require("tns-core-modules/ui/text-base/text-base-common").fontSizeProperty.setNative] = function (value) {
        if (!this.formattedText || (typeof value !== "number")) {
            if (typeof value === "number") {
                this.nativeTextViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, value);
            }
            else {
                this.nativeTextViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
            }
        }
    };
}

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
