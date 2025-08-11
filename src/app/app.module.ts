import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from '@auth0/auth0-angular';
// import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { environment } from '../environments/environment';
import OktaAuth from '@okta/okta-auth-js';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './layout/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './main/home/home.component';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Or MatMomentDateModule if using moment.js


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserComponent } from './features/shared/create-user/create-user.component';
import { AuthInterceptor } from './features/shared-interceptors/auth.interceptor';
import { UserListComponent } from './features/shared/user-list/user-list.component';
import { SharedModule } from './features/shared/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NodeDropModalComponent } from './node-drop-modal/node-drop-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// const oktaAuth  = new OktaAuth({
//   clientId: environment.okta.clientId,
//   issuer: environment.okta.issuer,
//   redirectUri: environment.okta.redirectUri,
//   responseType: ['code'],
//   scopes: environment.okta.scopes,
//   pkce: environment.okta.pkce,
// });

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CreateUserComponent,
    UserListComponent,
    NodeDropModalComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule, // Required for Toastr animations
    ToastrModule.forRoot({
      timeOut: 2000, // 5 seconds
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    }),
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin+ '/callback',
        audience: environment.auth.audience, // Replace with your API identifier from Auth0
        scope: 'openid profile email offline_access',
      },
      cacheLocation: 'localstorage', // Persist tokens across page reloads
      useRefreshTokens: true, // Ensure tokens are refreshed when they expire

    }),
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
