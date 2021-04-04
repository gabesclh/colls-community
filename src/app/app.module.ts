import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { VoteComponent } from './community/vote.component';
import { MembersComponent } from './members/members.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersModule } from './members/members.module';
import { AppFirebaseModule } from './app-firebase.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { InterceptorService } from './auth/security/interceptor/interceptor.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function tokenGetter() {
  return localStorage.getItem('tkn');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    VoteComponent,
    MembersComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MembersModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppFirebaseModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8080', 'api.colls.co'],
        disallowedRoutes: ['http://example.com/examplebadroute/'],
      },
    }),
    NgxMaskModule.forRoot(),
  ],
  exports: [
    MembersModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
