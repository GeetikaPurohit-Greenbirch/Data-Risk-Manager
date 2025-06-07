import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';
import { LineageTreeComponent } from './component/lineage-tree/lineage-tree.component';
import { LineagesComponent } from './component/lineages.component';
import { LineageTreegraphComponent } from './component/lineage-treegraph/lineage-treegraph.component';
import { LineageSankeyComponent } from './component/lineage-sankey/lineage-sankey.component';
import { LineagesTreegraphboxComponent } from './component/lineages-treegraphbox/lineages-treegraphbox.component';
import { EchartSankeyComponent } from './component/echart-sankey/echart-sankey.component';

const routes: Routes = [
  { path: '', component: LineagesComponent },
  { path: 'lineage-chart', component: LineageChartComponent },
  { path: 'lineage-tree', component: LineageTreeComponent },
  { path: 'lineage-treegraph', component: LineageTreegraphComponent },
  { path: 'lineage-treegraphbox', component: LineagesTreegraphboxComponent },
  { path: 'lineage-sankey', component: LineageSankeyComponent },
  { path: 'lineage-echarts-sankey', component: EchartSankeyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LineagesRoutingModule {}
