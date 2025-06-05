import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';
import { LineagesTreeComponent } from './component/lineages-tree/lineages-tree.component';
import { LineagesComponent } from './component/lineages.component';


const routes: Routes = [
    { path:'', component: LineagesComponent },
    { path:'lineage-chart', component: LineageChartComponent },
    { path:'lineage-tree', component: LineagesTreeComponent },
    // { path:'lineage-sankey', component: LineageChartSankeyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LineagesRoutingModule { }
