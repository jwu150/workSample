import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TabViewModule } from 'primeng/tabview';

import { CardViewComponent } from './card-view/card-view.component';
import { MenuModule } from "primeng/menu";
import { MessageService } from "primeng/api";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { PopupFilterComponent } from './popup-filter/popup-filter.component';
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {SelectButtonModule} from "primeng/selectbutton";
import { ResumeComponent } from './resume/resume.component';
import { StaticSamplesComponent } from './static-samples/static-samples.component';

@NgModule({
  declarations: [
    AppComponent,
    CardViewComponent,
    PopupFilterComponent,
    ResumeComponent,
    StaticSamplesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TabViewModule,
    MenuModule,
    NoopAnimationsModule,
    OverlayPanelModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    SelectButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
