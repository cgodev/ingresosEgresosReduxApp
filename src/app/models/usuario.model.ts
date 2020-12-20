export class Usuario{

  constructor(public uid: string,
    public nombre: string,
    public email: string,){}

  static parseFirebase({email,nombre,uid}){
    return new Usuario(uid ,nombre,email);
  }
}
