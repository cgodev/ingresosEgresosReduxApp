import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import * as operators from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    delete ingresoEgreso.uid;

    return this.fireStore.doc(`${this.authService.user.uid}/ingresos-egresos`).collection('items')
    .add({ ...ingresoEgreso})
  }

  borrarIngresoEgreso(uidItem: string){
    return this.fireStore.doc(`${this.authService.user.uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

  initIngresosEgresosListener(uid: string){
    return this.fireStore.collection(`${uid}/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      operators.map(snapshot => {
        return snapshot.map(doc =>{
          return {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          }
        })
      })
    );
  }
}
