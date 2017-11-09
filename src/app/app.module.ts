import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';


import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { PlanetsComponent } from './planets/planets.component';
import { routing } from './app.routes';
import { Part1Component } from './part1/part1.component';
import { Part2Component } from './part2/part2.component';
import { FormComponent } from './form/form.component';
import { Part3Component } from './part3/part3.component';
import { FillInBlankComponent } from './part2/fillinblank/fillinblank.component';
import { FillInBlank2Component } from './part3/fillinblank2/fillinblank2.component';
import { InfoComponent } from './info/info.component';
import { ServiceXmlModule } from './serviceXml/serviceXml.module';
import { FlightComponent } from './flight/flight.component';
import { ResultsComponent } from './results/results.component';
import {SharedService} from './service/shared.service';
import {CheckComponent} from './info/check.component';


// Decorator
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    ServiceXmlModule,
  ],
  declarations: [
    AppComponent,
    TitleComponent,
    PlanetsComponent,
    Part1Component,
    Part2Component,
    Part3Component,
    FormComponent,
    FillInBlankComponent,
    FillInBlank2Component,
    InfoComponent,
    FlightComponent,
    ResultsComponent,
    CheckComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [ InfoComponent, CookieService, SharedService ],
  bootstrap: [ AppComponent ]
})

  export class AppModule {}
