import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { VoteComponent } from './community/vote.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['/']);

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  {
    path: 'signup', component: SignupComponent,
  },
  {
    path: 'member', loadChildren: () => import('./members/members.module').then(mod => mod.MembersModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { path: '', component: VoteComponent },
  { path: '**', redirectTo: 'vote' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
