import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfacesComponent } from '../interfaces/component/interfaces.component';
import { InterfaceBuilderComponent } from './component/interface-builder/interface-builder.component';
import { SharedModule } from '../shared/shared/shared.module';


@NgModule({
  declarations: [
    InterfacesComponent,
    InterfaceBuilderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterfacesRoutingModule
  ]
})
export class InterfacesModule { }
