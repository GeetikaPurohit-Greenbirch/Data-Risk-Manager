import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlsComponent } from '../controls/component/controls.component';
import { ControlBuilderComponent } from './component/control-builder/control-builder.component';
import { EditControlComponent } from './component/edit-control/edit-control.component';

const routes: Routes = [
  { path: '', component: ControlsComponent },
  {path:'control-builder', component:ControlBuilderComponent},
  {path: 'edit-control/:id', component:EditControlComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlsRoutingModule { }
