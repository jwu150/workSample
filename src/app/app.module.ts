import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabViewModule } from 'primeng/tabview';

import { CardViewComponent } from './card-view/card-view.component';
import { MenuModule } from "primeng/menu";
import { MessageService } from "primeng/api";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    CardViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabViewModule,
    MenuModule,
    NoopAnimationsModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
