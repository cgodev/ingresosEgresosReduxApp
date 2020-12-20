import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm : FormGroup;
  tipo: string = "ingreso"
  isLoading = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
      this.isLoading = ui.isLoading;
    })
    this.ingresoEgresoForm = this.fb.group({
      descripcion:['',Validators.required],
      monto: ['',Validators.required]
    })
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  guardar(){

    setTimeout(()=>{

    },2500);

    if(this.ingresoEgresoForm.invalid){return;}
    this.store.dispatch(ui.isLoading())
    const {descripcion, monto} = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then((ref)=> {
      this.ingresoEgresoForm.reset();
      Swal.fire('Registro creado', descripcion, 'success');
      this.store.dispatch(ui.stopLoading())
    })
    .catch(err => {
      Swal.fire('Ooops...', err.message, 'error')
      this.store.dispatch(ui.stopLoading());
    });

  }

}
