import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfacesComponent } from '../interfaces/component/interfaces.component';
import { InterfaceBuilderComponent } from './component/interface-builder/interface-builder.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditInterfaceComponent } from './component/edit-interface/edit-interface.component';
import { icons, LucideAngularModule } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    InterfacesComponent,
    InterfaceBuilderComponent,
    EditInterfaceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InterfacesRoutingModule,
    LucideAngularModule.pick({
                  ChevronLeft: icons.ChevronLeft,
                  Plus: icons.Plus,
                  Trash2: icons.Trash2
                }),
    DialogModule,           // required for <p-dialog>
    TableModule,            // for <p-table>
    ButtonModule,           // for <button pButton>
    InputTextModule,        // for pInputText
    DropdownModule,         // for pDropdown
   
  ]
})
export class InterfacesModule { }
