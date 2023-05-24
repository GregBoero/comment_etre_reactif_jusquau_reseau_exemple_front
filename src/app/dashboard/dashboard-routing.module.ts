import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { DashboardComponent } from '@app/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: marker('Dashboard') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {
}
