import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfacesComponent } from '../interfaces/component/interfaces.component';
import { InterfaceBuilderComponent } from './component/interface-builder/interface-builder.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditInterfaceComponent } from './component/edit-interface/edit-interface.component';


@NgModule({
  declarations: [
    InterfacesComponent,
    InterfaceBuilderComponent,
    EditInterfaceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterfacesRoutingModule
  ]
})
export class InterfacesModule { }
