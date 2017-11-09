import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TitleComponent } from './title/title.component';
import { PlanetsComponent } from './planets/planets.component';
import { Part1Component } from './part1/part1.component';
import { Part2Component } from './part2/part2.component';
import { Part3Component } from './part3/part3.component';
import { FormComponent } from './form/form.component';
import { FlightComponent } from './flight/flight.component';
import { ResultsComponent } from './results/results.component';


// Route Configuration
export const routes: Routes = [
  {path: '', redirectTo: '/title', pathMatch: 'full'},
  {path: 'title', component: TitleComponent},
  {path: 'planets', component: PlanetsComponent},
  {path: 'app-part-1', component: Part1Component},
  {path: 'app-part-2', component: Part2Component},
  {path: 'app-part-3', component: Part3Component},
  {path: 'registration', component: FormComponent},
  {path: 'app-flight', component: FlightComponent},
  {path: 'results', component: ResultsComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
