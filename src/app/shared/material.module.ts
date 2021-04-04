import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
  ],
  exports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
  ]
})
export class MaterialModule { }
