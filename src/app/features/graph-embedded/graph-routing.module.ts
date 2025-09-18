import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UseCasesComponent } from './graph.component';
// import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
// import { EditUsecaseComponent } from './component/edit-usecase/edit-usecase.component';
import { BuilderComponent } from './component/builder/builder.component';
import { LineageComponent } from './component/lineage-mapper/lineage.component';
// import { ShareAccessComponent } from './component/share-access/share-access.component';

const routes: Routes = [
  { path: '', component: UseCasesComponent },
  { path: 'edit-lineage/:usecaseId/:lineageId', component: BuilderComponent },
  { path: 'lineage-mapping/:usecaseId/:lineageId', component: LineageComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UseCaseRoutingModule { }
