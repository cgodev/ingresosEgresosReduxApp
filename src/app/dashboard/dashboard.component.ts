import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  ingresosEgresosSubscription: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('user').pipe(
      filter( auth => auth.user != null )
    ).subscribe(({user}) => {

      this.ingresosEgresosSubscription = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
      .subscribe((ingresosEgresos) => {

        this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresos }))
      });
    });

  }

  ngOnDestroy(){
    this.userSubscription?.unsubscribe();
    this.ingresosEgresosSubscription?.unsubscribe();
  }

}
