import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SourcesRoutingModule } from './sources-routing.module';
import { SourcesComponent } from '../sources/component/sources.component';
import { SourceBuilderComponent } from './component/source-builder/source-builder.component';
import { SharedModule } from '../shared/shared/shared.module';


@NgModule({
  declarations: [
    SourcesComponent,
    SourceBuilderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SourcesRoutingModule
  ]
})
export class SourcesModule { }
