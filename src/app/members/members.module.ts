import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SubmitComponent } from './submit/submit.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersComponent } from './members.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SharedModule } from '../shared/shared.module';
import { ArteService } from '../shared/services/arte.service';
import { CollectionService } from '../shared/services/collection.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);


const MemberRouting: Routes = [
  {
    path: 'member',
    component: MembersComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'submit', component: SubmitComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' },
    ],
    canActivate: [AngularFireAuthGuard], data: {
      authGuardPipe: redirectUnauthorizedToLogin
    },
  }
];

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(MemberRouting)
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    SubmitComponent
  ],
  providers: [
    ArteService,
    CollectionService,
  ],
})
export class MembersModule { }
