import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  loading: boolean = false;
  formGroup : FormGroup;
  uiSubscription: Subscription

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading;

    })
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.formGroup.invalid){return}

    this.store.dispatch( ui.isLoading() );

    const {nombre, correo, password} = this.formGroup.value;

    this.authService.crearUsuario(nombre,correo,password)
    .then(credenciales => {

      this.store.dispatch( ui.stopLoading() );
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.error(err);
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops... tienes un problema.',
        text: err.message,
      })
    })

  }

}
