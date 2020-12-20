import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngEgr } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription;
  constructor(private store: Store<AppStateWithIngEgr>,
    private ingresoEgresoService: IngresoEgresoService) { }


  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresosEgresos').subscribe(({items}) => {
      this.ingresosEgresos = items

    });
  }

  ngOnDestroy(){
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid:string){
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
    .then(() => Swal.fire('Eliminacion correcta!', 'Item borrado', 'success'))
    .catch(err => Swal.fire('Eliminacion correcta!',err.message, 'error'))
  }

}
