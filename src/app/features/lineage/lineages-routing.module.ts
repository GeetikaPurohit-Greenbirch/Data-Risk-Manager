import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineageChartComponent } from './component/lineage-chart/lineage-chart.component';


const routes: Routes = [
    { path:'', component: LineageChartComponent },
    // { path:'/lineage-chart', component: LineageChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LineagesRoutingModule { }
