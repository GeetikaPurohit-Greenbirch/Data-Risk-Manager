import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { RouterModule } from '@angular/router';   // 👈 Import RouterModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Or MatMomentDateModule if using moment.js
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PdfService } from '../../shared-services/pdf.service';
import { ReportBuilderComponent } from 'src/app/layout/report-builder/report-builder.component';
import { MatOptionModule } from '@angular/material/core';
// PrimeNG modules
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { SplitterModule } from 'primeng/splitter';

import { icons, LucideAngularModule } from 'lucide-angular';

import { ToolbarModule } from 'primeng/toolbar';



ModuleRegistry.registerModules([ClientSideRowModelModule]);

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ReportBuilderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    AgGridModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatOptionModule,
    DragDropModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    TooltipModule,
    SplitterModule,

    LucideAngularModule.pick({
      ChevronLeft: icons.ChevronLeft,
      Plus: icons.Plus,
      Trash2: icons.Trash2
    }),

    ToolbarModule

  ],
  exports: [
    HeaderComponent,
    SidebarComponent,    // 👈 Export so other modules can use
    ReportBuilderComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    AgGridModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DragDropModule,
    MatOptionModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    TooltipModule,
    SplitterModule,
    ToolbarModule
  ],
  providers: [PdfService],

})
export class SharedModule { }
