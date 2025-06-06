import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared.module';
import { LineagesRoutingModule } from './lineages-routing.module';
import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';
import { LineageSankeyComponent } from './component/lineage-sankey/lineage-sankey.component';
import { LineageTreeComponent } from './component/lineage-tree/lineage-tree.component';
import { LineageTreegraphComponent } from './component/lineage-treegraph/lineage-treegraph.component';
import { LineagesTreegraphboxComponent } from './component/lineages-treegraphbox/lineages-treegraphbox.component';

@NgModule({
  declarations: [
    LineageChartComponent,
    LineageTreeComponent,
    LineageSankeyComponent,
    LineageTreegraphComponent,
    LineagesTreegraphboxComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LineagesRoutingModule,
  ],
})
export class LineagesModule {}
