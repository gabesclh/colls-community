import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { DropzoneDirective } from './dropzone/dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';



@NgModule({
  declarations: [
    HeaderComponent,
    DropzoneDirective,
    UploaderComponent,
    EditDialogComponent,
    DetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HeaderComponent,
    MaterialModule,
    DropzoneDirective,
    UploaderComponent,
  ],
  entryComponents: [
    EditDialogComponent,
    DetailsDialogComponent,
  ],
})
export class SharedModule { }
