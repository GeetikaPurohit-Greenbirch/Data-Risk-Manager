import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UseCaseRoutingModule } from './graph-routing.module';
// import { CreateUseCaseComponent } from './component/create-use-case/create-use-case.component';
import { UseCasesComponent } from './graph.component';
import { SharedModule } from '../shared/shared/shared.module';
import { BuilderComponent } from './component/builder/builder.component';
import { DiagramComponent } from './component/diagram/diagram.component';
import { NodesComponent } from './component/nodes/nodes.component';
import { ConfirmDialogComponent } from './component/delete-confirmation/deleteConfirmation.component';
import { LineageComponent } from './component/lineage-mapper/lineage.component';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

// import { NodesComponent } from "../nodes/nodes.component";
// import { DiagramComponent } from "../diagram/diagram.component";
// import { ShareDialogComponent } from './component/share-dialog/share-dialog.component';
// import { ShareAccessComponent } from './component/share-access/share-access.component';


@NgModule({
  declarations: [UseCasesComponent,
    BuilderComponent,
    DiagramComponent,
    NodesComponent,
    ConfirmDialogComponent,
    LineageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SplitterModule,
    UseCaseRoutingModule,
    TableModule,
    PaginatorModule,
  ]
})
export class GraphModuleEmbedded { }
