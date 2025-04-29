import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetsComponent } from '../targets/component/targets.component';
import { TargetBuilderComponent } from './component/target-builder/target-builder.component';

const routes: Routes = [
  { path: '', component: TargetsComponent },
  {path:'target-builder', component: TargetBuilderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetsRoutingModule { }
