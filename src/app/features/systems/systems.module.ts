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
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

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
                 DialogModule,           //  required for <p-dialog>
                TableModule,            // for <p-table>
                ButtonModule,           // for <button pButton>
                InputTextModule,        // for pInputText
                DropdownModule,         // for pDropdown
  ]
})
export class SystemsModule { }
