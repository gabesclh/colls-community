import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/security/auth.service';
import { User } from 'firebase';
import { UserModel } from 'src/app/auth/security/user/user.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: UserModel;
  isLoggedIn = false;
  isDesigner = false;
  isAdmin = false;

  constructor(
    public auth: AuthService,
    private readonly snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(usr => {
      if (usr) {
        this.user = usr;
        if (this.user.uid) { this.isLoggedIn = true; }
        if (this.user.userDesigner) { this.isDesigner = true; }
        if (this.user.userAdmin) { this.isAdmin = true; }
      }
    });
  }

  logout(): void {
    this.auth
      .logout()
      .then(() => {
        this.snackBar.open(
          `Até logo! 👋🏾`,
          'Tchau!',
          {
            duration: 4000,
          },
        );
      }
      ).catch((error) => {
        this.snackBar.open(`${error.message} 😢`, 'Fechar', {
          duration: 4000,
        });
        return EMPTY;
      });
  }

}
