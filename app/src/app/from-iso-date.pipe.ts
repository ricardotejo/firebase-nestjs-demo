import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromIsoDate'
})
export class FromIsoDatePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return new Date(value).toLocaleDateString();
  }

}
