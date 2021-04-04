import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';
import { ArteModel } from 'src/app/model/arte.model';
import { CollectionModel } from 'src/app/model/collection.model';
import { VoteModel } from 'src/app/model/vote.model';
import { ArteService } from 'src/app/shared/services/arte.service';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { DetailsDialogComponent } from '../shared/details-dialog/details-dialog.component';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

  user: UserModel;

  arts: ArteModel[] = [];
  collection = new CollectionModel();

  constructor(
    private artService: ArteService,
    private colService: CollectionService,
    private db: AngularFirestore,
    private auth: AuthService,
    private readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCurrentArts();
    this.getCurrentCollection();
    this.auth.user.subscribe(usr => {
      this.user = usr;
    });
  }

  getCurrentArts(): void {
    this.artService.getArtsByTopVotes().subscribe(response => {
      if (response.body !== 'Não existe nenhuma arte dessa coleção') {
        this.arts = response.body;
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

  getCurrentCollection(): void {
    this.colService.getCurrentCollection().subscribe(response => {
      if (response.body !== 'Não existe nenhuma colecao ativa cadastrada') {
        this.collection = response.body;
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

  vote(id: string): void {
    console.log(this.user);
    if (!this.user) {
      this.router.navigate(['/login']);
      this.snackBar.open(
        `Faça login para registrar seu voto! 😆`,
        'OK!',
        {
          duration: 4000,
        },
      );
      return;
    }
    const voteTemp: VoteModel = {
      uid: this.user.uid,
      data: new Date(),
      artId: id,
      collectionId: this.collection._id,
    };

    const docRef = this.db.collection(`votes`).doc(this.user.uid + '&' + id);

    docRef.get().subscribe(doc => {
      if (doc.exists) {
        this.snackBar.open(
          `Você já votou neste design! 😔`,
          'OK!',
          {
            duration: 4000,
          },
        );
      } else {
        this.voteOK(id);
        docRef.set(voteTemp, { merge: true }).then(() => {
          this.snackBar.open(
            `Voto contabilizado com sucesso! 😀`,
            'Valeu!',
            {
              duration: 4000,
            },
          );
          this.getCurrentArts();
        }).catch(error => {
          this.snackBar.open(
            `Erro ao votar! ${error.message} 😔`,
            'OK!',
            {
              duration: 4000,
            },
          );
        });
      }
    }, error => {
      console.log('Ocorreu um erro, desculpe. ', error);
    });
  }

  voteOK(id: string): void {
    this.artService.getVote(id).subscribe(() => {
      this.arts = [];
      this.getCurrentArts();
    }, () => { });
  }

  openDialog(art: ArteModel): void {
    const dialogRef = this.dialog.open(DetailsDialogComponent, {
      data: art
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
