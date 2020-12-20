import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngEgr'
})
export class OrdenIngEgrPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    const itemsFiltered =  items.slice().sort((a,b) => {
      if(a.tipo === 'ingreso'){
        return -1;
      }else{
        return 1;
      }
    });
    return itemsFiltered;
  }

}
