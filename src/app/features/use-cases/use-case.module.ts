import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UseCaseRoutingModule } from './use-case-routing.module';
import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
import { UseCasesComponent } from './use-cases.component';
import { SharedModule } from '../shared/shared/shared.module';
import { EditUsecaseComponent } from './component/edit-usecase/edit-usecase.component';


@NgModule({
  declarations: [UseCasesComponent,
    CreateUseCaseComponent,EditUsecaseComponent],
  imports: [
    CommonModule,
    SharedModule,
    UseCaseRoutingModule
  ]
})
export class UseCaseModule { }
