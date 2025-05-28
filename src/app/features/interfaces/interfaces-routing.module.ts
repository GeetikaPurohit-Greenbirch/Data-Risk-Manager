import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfacesComponent } from '../interfaces/component/interfaces.component';
import { InterfaceBuilderComponent } from './component/interface-builder/interface-builder.component';
import { EditInterfaceComponent } from './component/edit-interface/edit-interface.component';

const routes: Routes = [
  { path: '', component: InterfacesComponent },
  {path : 'interface-builder', component:InterfaceBuilderComponent},
  {path: 'edit-interface/:id', component:EditInterfaceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfacesRoutingModule { }
