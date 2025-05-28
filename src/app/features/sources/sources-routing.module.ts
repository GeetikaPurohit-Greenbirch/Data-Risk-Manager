import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourcesComponent } from '../sources/component/sources.component';
import { SourceBuilderComponent } from './component/source-builder/source-builder.component';
import { EditSourceComponent } from './component/edit-source/edit-source.component';

const routes: Routes = [
  { path: '', component: SourcesComponent },
  {path:'source-builder', component:SourceBuilderComponent},
  {path: 'edit-source/:id', component:EditSourceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcesRoutingModule { }
