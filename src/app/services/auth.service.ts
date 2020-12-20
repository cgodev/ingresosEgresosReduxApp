import { Injectable } from '@angular/core';
import 'firebase/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions  from '../ingreso-egreso/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  constructor(public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store) { }

  initAuthListener(){

    this.auth.authState.subscribe(fuser => {

      if(fuser){

        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe((firestoreUser: any) => {

          const user = Usuario.parseFirebase(firestoreUser);
          this._user = user;
          this.store.dispatch(authActions.setUser({user}));
        })
      } else {
        this._user = null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItems());

      }

    })

  }

  get user(){
    return {...this._user};
  }

  crearUsuario(nombre: string, email: string, password: string){


    return this.auth.createUserWithEmailAndPassword(email,password)
    .then(({user}) => {
      const newUser = new Usuario(user.uid, nombre, email);
      return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    });

  }

  login(email: any, password: any) {

    return this.auth.signInWithEmailAndPassword(email,password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fuser => fuser != null)
    );
  }
}
