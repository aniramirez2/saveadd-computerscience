import { Component, OnInit } from '@angular/core';
import {
  AdvertisementService,
  Anuncio
} from '../providers/advertisement.service';

import { Router , ActivatedRoute } from '@angular/router';

import { EmpresaService } from './../providers/empresa.service';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { element } from 'protractor';
const swal: SweetAlert = _swal as any;
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.scss']
})
export class AnunciosComponent implements OnInit {
  ads: Anuncio[];
  swal: any;
  p: number = 1;
  collection: any[] = []; 
  loading_page = false;
  empresa: any;
  constructor(
    public adService: AdvertisementService,
    public empresaService: EmpresaService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loading_page = true;
    this.adService.list().subscribe(
      res => {
        this.loading_page = false;
        var aux =res as Anuncio[];
        this.ads = aux.filter(ad => ad.StatusAnuncio == 1);
        this.collection = this.ads
        
        console.log("anuncios ", this.ads)
      },
      error => {
        if(error.status == 401 || error.status == 403 ){
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
        this.loading_page = false;
      }
    );
    this.empresaService.getEmpresas().subscribe(res => {
      this.empresa = res
      console.log(this.empresa)
    });

  }

  removeAnuncio(id){
    swal("Tem certeza que deseja excluir este anúncio?", {
      buttons: {
        cancel: {
          text: "Cancelar",
          value: "cancel"
        },
        confirmation: {
          text: "Excluir",
          value: "confirmation",
          dangerMode: true
        }
      }
    }).then(
      (value) => {
        switch (value) {
          case "confirmation":
          console.log('dentro da função')
          this.adService.removeAnuncio(id).subscribe(res => {
            console.log('response',res)
            this.ngOnInit()
            
          })
          swal("Sucesso", "Anúncio removido com sucesso!", "success")
          break;
        }
      }
    )
    console.log('clicou', id)
  }
  getDate(date){
    var aux = date.split("T")    
        return aux[0]
  }
  
}
