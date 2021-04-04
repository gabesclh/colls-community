export class ArteModel {
    _id: string;
    titulo: string;
    descricao: string;
    data: Date;
    arteImg: string;
    status: boolean;
    uidAutor: string;
    idColecao: string;
    contVotos?: number;
    nomeAutor?: string;
    imgAutor?: string;
}
