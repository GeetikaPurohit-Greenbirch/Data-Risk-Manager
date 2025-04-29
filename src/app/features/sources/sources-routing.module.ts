import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourcesComponent } from '../sources/component/sources.component';
import { SourceBuilderComponent } from './component/source-builder/source-builder.component';

const routes: Routes = [
  { path: '', component: SourcesComponent },
  {path:'source-builder', component:SourceBuilderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcesRoutingModule { }
