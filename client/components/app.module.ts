import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {HomeCmp} from "./desktop/index";
import {AppComponent} from "./app";
import { rootRouterConfig } from "./app.routes";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
  declarations: [HomeCmp, AppComponent],
  imports     : [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig)],
  providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule {

}
//, RouterModule.forRoot(rootRouterConfig)