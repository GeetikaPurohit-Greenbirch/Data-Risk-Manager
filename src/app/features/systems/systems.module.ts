import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemsRoutingModule } from './systems-routing.module';
import { SystemsComponent } from '../systems/component/systems.component';
import { SystemBuilderComponent } from '../systems/component/system-builder/system-builder.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditSystemDialogComponent } from './edit-system-dialog/edit-system-dialog.component';
import { EditSystemComponent } from './component/edit-system/edit-system.component';


@NgModule({
  declarations: [
    SystemsComponent,
    SystemBuilderComponent,
    EditSystemDialogComponent,
    EditSystemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemsRoutingModule
  ]
})
export class SystemsModule { }
