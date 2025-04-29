import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TargetsRoutingModule } from './targets-routing.module';
import { TargetsComponent } from '../targets/component/targets.component';
import { TargetBuilderComponent } from './component/target-builder/target-builder.component';
import { SharedModule } from '../shared/shared/shared.module';


@NgModule({
  declarations: [
    TargetsComponent, 
    TargetBuilderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TargetsRoutingModule
  ]
})
export class TargetsModule { }
