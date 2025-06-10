import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared.module';
import { LineagesRoutingModule } from './lineages-routing.module';

import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';
import { LineageSankeyComponent } from './component/lineage-sankey/lineage-sankey.component';
import { LineageTreeComponent } from './component/lineage-tree/lineage-tree.component';
import { LineageTreegraphComponent } from './component/lineage-treegraph/lineage-treegraph.component';
import { LineagesTreegraphboxComponent } from './component/lineages-treegraphbox/lineages-treegraphbox.component';
import { EchartSankeyComponent } from './component/echart-sankey/echart-sankey.component';
import { AlexDigramComponent } from './component/alex-digram/alex-digram.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    LineageChartComponent,
    LineageTreeComponent,
    LineageSankeyComponent,
    LineageTreegraphComponent,
    LineagesTreegraphboxComponent,
    EchartSankeyComponent,
    AlexDigramComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LineagesRoutingModule,
    NgxEchartsModule,
    HighchartsChartModule
  ],
})
export class LineagesModule {}
