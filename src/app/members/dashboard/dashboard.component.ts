import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';
import { ArteModel } from 'src/app/model/arte.model';
import { EditDialogComponent } from 'src/app/shared/edit-dialog/edit-dialog.component';
import { ArteService } from 'src/app/shared/services/arte.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user$: Observable<User>;
  user: UserModel;

  artsList = new Array<ArteModel>();

  constructor(
    private readonly snackBar: MatSnackBar,
    private auth: AuthService,
    private service: ArteService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(usr => {
      this.user = usr;
      this.getArts();
    });
  }

  getArts(): void {
    this.service.getArtsByUid(this.user.uid).subscribe((response) => {
      if (response.body !== 'Não existe nenhuma arte desse usuario cadastrada') {
        this.artsList = response.body;
      }
    }, error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
  }

  openDialog(art: ArteModel): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: art
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }



}
