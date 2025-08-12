import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseCasesComponent } from './graph.component';
// import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
// import { EditUsecaseComponent } from './component/edit-usecase/edit-usecase.component';
import { BuilderComponent } from './component/builder/builder.component';
// import { ShareAccessComponent } from './component/share-access/share-access.component';

const routes: Routes = [
  { path: '', component: UseCasesComponent },
   {path: 'edit-lineage/:id', component: BuilderComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UseCaseRoutingModule { }
