import { AddressModel } from './address.model';
import { BankModel } from './bank.model';

export class UserModel {
    uid: string;
    email: string;
    photoURL: string;
    displayName: string;
    phoneNumber?: string;
    cpf?: number;
    address?: AddressModel;
    bank?: BankModel;
    votes?: string[];
    userDesigner?: boolean;
    userAdmin?: boolean;
}
