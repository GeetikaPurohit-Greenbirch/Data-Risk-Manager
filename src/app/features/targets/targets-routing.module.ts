import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetsComponent } from '../targets/component/targets.component';
import { TargetBuilderComponent } from './component/target-builder/target-builder.component';
import { EditTargetComponent } from './component/edit-target/edit-target.component';

const routes: Routes = [
  { path: '', component: TargetsComponent },
  {path:'target-builder', component: TargetBuilderComponent},
  {path: 'edit-target/:id', component:EditTargetComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetsRoutingModule { }
