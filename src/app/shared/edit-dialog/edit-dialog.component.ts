import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArteModel } from 'src/app/model/arte.model';
import { ArteService } from '../services/arte.service';
import { CollectionService } from '../services/collection.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  artForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public art: ArteModel,
    private service: ArteService,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.artForm = new FormGroup({
      titulo: new FormControl(this.art.titulo, [Validators.required]),
      descricao: new FormControl(this.art.descricao, [Validators.required]),
      votos: new FormControl({ value: this.art.contVotos, disabled: true }, [Validators.required]),
      status: new FormControl({ value: (this.art.status ? 'Em votação' : 'Votação encerrada.'), disabled: true }, [Validators.required]),
    });
  }

  submitArt(): void {
    this.art.titulo = this.artForm.get('titulo').value;
    this.art.descricao = this.artForm.get('descricao').value;

    this.service.upadteArt(this.art).subscribe(() => {
      this.snackBar.open(
        `Arte atualizada com sucesso.`,
        'OK!',
        {
          duration: 4000,
        },
      );
    }, error => {
      this.snackBar.open(
        `Erro ao atualizar a arte.`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
  }

  removeArt(): void {
    this.service.getRemove(this.art._id).subscribe(() => {
      this.snackBar.open(
        `Arte removida.`,
        'OK!',
        {
          duration: 4000,
        },
      );
    }, error => {
      // if(error.)
      this.snackBar.open(
        `Erro ao remover a arte.`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
  }

}
