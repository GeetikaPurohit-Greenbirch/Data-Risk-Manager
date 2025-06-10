import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseCasesComponent } from './use-cases.component';
import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
import { EditUsecaseComponent } from './component/edit-usecase/edit-usecase.component';

const routes: Routes = [
  { path: '', component: UseCasesComponent },
  {path:'create-use-case', component: CreateUseCaseComponent},
  {path: 'edit-usecase/:id', component:EditUsecaseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UseCaseRoutingModule { }
