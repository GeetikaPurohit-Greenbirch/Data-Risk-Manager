import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UseCaseRoutingModule } from './use-case-routing.module';
import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
import { UseCasesComponent } from './use-cases.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditUsecaseComponent } from './component/edit-usecase/edit-usecase.component';
import { ShareDialogComponent } from './component/share-dialog/share-dialog.component';
import { ShareAccessComponent } from './component/share-access/share-access.component';
import { icons, LucideAngularModule } from 'lucide-angular';


@NgModule({
  declarations: [UseCasesComponent,
    CreateUseCaseComponent, EditUsecaseComponent,
    ShareDialogComponent,
    ShareAccessComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UseCaseRoutingModule,
    LucideAngularModule.pick({
      ChevronLeft: icons.ChevronLeft,
      Plus: icons.Plus,
      Trash2: icons.Trash2
    }),

  ]
})
export class UseCaseModule { }
