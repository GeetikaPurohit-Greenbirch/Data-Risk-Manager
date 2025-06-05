import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared.module';
import { LineagesRoutingModule } from './lineages-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HighchartsChartModule,
    LineagesRoutingModule,
    LineageChartComponent,
  ],
})
export class LineagesModule {}
