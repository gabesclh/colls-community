import { Component } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../security/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../security/user/user.model';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;
  fullLogin = false;
  resetSenha = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required])
  });

  resetEmail = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private router: Router,
  ) { }

  loginViaPassword(): void {
    this.auth
      .loginViaPassword(this.loginForm.get('email').value, this.loginForm.get('senha').value)
      .then(() => {
        this.snackBar.open(
          `Bem-vindo! 😀`,
          'Valeu!',
          {
            duration: 4000,
          },
        );
        this.router.navigate(['/']);
      }
      ).catch((error) => {
        if (error.code === 'auth/wrong-password') {
          this.snackBar.open(`Senha incorreta ou não definida 😢`, 'Fechar', {
            duration: 4000,
          });
        } else {
          this.snackBar.open(`${error.message} 😢`, 'Fechar', {
            duration: 4000,
          });
        }
        return EMPTY;
      });
  }

  loginViaGoogle(): void {
    this.auth
      .loginViaGoogle().then(() => {
        this.snackBar.open(
          `Bem-vindo! 😀`,
          'Valeu!',
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

  resetPassword(): void {
    this.auth
      .resetPassword(this.resetEmail.value);
  }

}
