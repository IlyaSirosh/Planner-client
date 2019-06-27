import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {routes} from './app.routes';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {PlanningModule} from './planning/planning.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    RouterModule.forRoot(routes,{ useHash: true }),
    BrowserModule,
    HttpClientModule,
    PlanningModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
