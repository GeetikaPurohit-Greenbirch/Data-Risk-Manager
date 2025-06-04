import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { HomeComponent } from './main/home/home.component';
import { CreateUserComponent } from './features/shared/create-user/create-user.component';
import { UserListComponent } from './features/shared/user-list/user-list.component';
import { UseCasesComponent } from './features/use-cases/use-cases.component';
import { LineageChartComponent } from './features/lineage/component/lineage-chart/lineage-chart.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '**', redirectTo: 'login' }, // Redirect all unknown routes to login
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'callback', component: CallbackComponent },
  { path: 'home', component: HomeComponent,  },
  {path:'use-cases', component:UseCasesComponent},
  {path:'create-user', component:CreateUserComponent},
  {path:'user-list', component:UserListComponent},
  
  { path: 'sources', loadChildren: () => import('./features/sources/sources.module').then(m => m.SourcesModule) },
  { path: 'systems', loadChildren: () => import('./features/systems/systems.module').then(m => m.SystemsModule) },
  { path: 'interfaces', loadChildren: () => import('./features/interfaces/interfaces.module').then(m => m.InterfacesModule) },
  { path: 'controls', loadChildren: () => import('./features/controls/controls.module').then(m => m.ControlsModule) },
  { path: 'targets', loadChildren: () => import('./features/targets/targets.module').then(m => m.TargetsModule) },

  // Lazy loading for lineage feature
  { path: 'lineage', component: LineageChartComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
