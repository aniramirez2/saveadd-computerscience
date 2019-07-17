import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() {}

  unmask(value) {
    return value.replace(/\D+/g, '');
  }

  getLocalDate(date: any) {
    const localDate = new Date(date);
    const localTime = localDate.getTime();
    const localOffset = localDate.getTimezoneOffset() * 60000;
    return new Date(localTime + localOffset);
  }

  stringToDecimal(st) {
    try{
      let val = st.replace(/^\D+/g, '');
    val = val.replace(',', '.');
    return parseFloat(val);
    }catch(error){
      return parseFloat(st);
    }
    
  }
}
