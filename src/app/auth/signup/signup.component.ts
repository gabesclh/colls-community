import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase';
import { EMPTY } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { UserModel } from '../security/user/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user: User;
  signUpForm: FormGroup;
  showForm = false;
  hide = true;

  constructor(
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params.completeSignUp);
        if (params.completeSignUp) {
          this.afAuth.currentUser.then((user) => {
            console.log(user);
            this.user = user;
            this.signUpForm = new FormGroup({
              email: new FormControl(user.email, [Validators.required, Validators.email]),
              senha: new FormControl('', [Validators.required]),
              nome: new FormControl(user.displayName, [Validators.required]),
              cpf: new FormControl('', [Validators.required]),
              telefone: new FormControl('', [Validators.required]),
              perfil: new FormControl('false', [Validators.required])
            });
            this.showForm = true;
          });
        }
      });
  }

  signUpViaGoogle(): void {
    this.auth
      .loginViaGoogle()
      .then(() => {
        this.afAuth.currentUser.then((user) => {
          this.user = user;
          this.afs.doc<UserModel>(`users/${user.uid}`).get().subscribe(userTemp => {
            const usr = userTemp.data();
            if (usr.cpf) {
              this.snackBar.open(
                `Ei! Você já é cadastrado! 😀`,
                'OK!',
                {
                  duration: 4000,
                },
              );
              this.router.navigate(['/']);
            } else {
              this.signUpForm = new FormGroup({
                email: new FormControl(user.email, [Validators.required, Validators.email]),
                senha: new FormControl('', [Validators.required]),
                nome: new FormControl(user.displayName, [Validators.required]),
                cpf: new FormControl('', [Validators.required]),
                telefone: new FormControl('', [Validators.required]),
                perfil: new FormControl('false', [Validators.required])
              });
              this.showForm = true;
            }
          });
        });
      }
      ).catch((error) => {
        this.snackBar.open(`${error.message} 😢`, 'Fechar', {
          duration: 4000,
        });
        return EMPTY;
      });
  }

  completeSignUp(): void {
    const data = {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      photoURL: this.user.photoURL,
      cpf: this.signUpForm.get('cpf').value,
      phoneNumber: this.signUpForm.get('telefone').value,
      userDesigner: (this.signUpForm.get('perfil').value === 'true'),
      userAdmin: false
    };
    this.auth.updateUserData(data).then((response) => {
      this.afAuth.currentUser.then((user) => {
        user.updatePassword(this.signUpForm.get('senha').value);
        this.snackBar.open(
          `Bem-vindo! 😀`,
          'Valeu!',
          {
            duration: 4000,
          },
        );
        this.router.navigate(['/member/dashboard']);
      });
    }
    ).catch((error) => {
      this.snackBar.open(`${error.message} 😢`, 'Fechar', {
        duration: 4000,
      });
      return EMPTY;
    });
  }

}
