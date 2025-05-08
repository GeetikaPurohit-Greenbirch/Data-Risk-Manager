import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemsComponent } from '../systems/component/systems.component';
import { SystemBuilderComponent } from '../systems/component/system-builder/system-builder.component';
import { EditSystemDialogComponent } from './edit-system-dialog/edit-system-dialog.component';

const routes: Routes = [
  { path: '', component: SystemsComponent },
  {path: 'system-builder', component:SystemBuilderComponent},
  {path:'edit-system-dialog', component:EditSystemDialogComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemsRoutingModule { }
