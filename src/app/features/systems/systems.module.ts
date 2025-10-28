import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemsRoutingModule } from './systems-routing.module';
import { SystemsComponent } from '../systems/component/systems.component';
import { SystemBuilderComponent } from '../systems/component/system-builder/system-builder.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditSystemDialogComponent } from './edit-system-dialog/edit-system-dialog.component';
import { EditSystemComponent } from './component/edit-system/edit-system.component';
import { CreateLineageComponent } from './component/create-lineage/create-lineage.component';
import { CreateLineageNewComponent } from './component/create-lineage-new/create-lineage-new.component';
import { icons, LucideAngularModule } from 'lucide-angular';


@NgModule({
  declarations: [
    SystemsComponent,
    SystemBuilderComponent,
    EditSystemDialogComponent,
    EditSystemComponent,
    CreateLineageComponent,
    CreateLineageNewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemsRoutingModule,
    LucideAngularModule.pick({
              ChevronLeft: icons.ChevronLeft,
              Plus: icons.Plus,
              Trash2: icons.Trash2
            }),
  ]
})
export class SystemsModule { }
