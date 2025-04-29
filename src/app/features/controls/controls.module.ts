import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsRoutingModule } from './controls-routing.module';
import { ControlsComponent } from '../controls/component/controls.component';
import { ControlBuilderComponent } from './component/control-builder/control-builder.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SharedModule } from '../shared/shared/shared.module';


@NgModule({
  declarations: [    
    ControlsComponent,
    ControlBuilderComponent
  ],
  imports: [
    CommonModule,
    ControlsRoutingModule,
    SharedModule
  ]
})
export class ControlsModule { }
