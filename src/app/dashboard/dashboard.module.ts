import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from '@app/dashboard/dashboard-routing.module';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@shared';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule, DashboardRoutingModule, MatCardModule, SharedModule, TranslateModule, MatPaginatorModule, MatTableModule
  ]
})
export class DashboardModule {
}
