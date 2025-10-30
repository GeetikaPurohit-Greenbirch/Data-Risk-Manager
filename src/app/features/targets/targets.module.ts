import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TargetsRoutingModule } from './targets-routing.module';
import { TargetsComponent } from '../targets/component/targets.component';
import { TargetBuilderComponent } from './component/target-builder/target-builder.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditTargetComponent } from './component/edit-target/edit-target.component';
import { icons, LucideAngularModule } from 'lucide-angular';


@NgModule({
  declarations: [
    TargetsComponent, 
    TargetBuilderComponent,
    EditTargetComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TargetsRoutingModule,
     LucideAngularModule.pick({
                  ChevronLeft: icons.ChevronLeft,
                  Plus: icons.Plus,
                  Trash2: icons.Trash2
                }),
  ]
})
export class TargetsModule { }
