import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidosService } from '../../../providers/pedidos.service';
import { EmpresaService } from '../../../providers/empresa.service';
import { CarrinhoService } from '../../../providers/carrinho.service';
import { ActivatedRoute, Router } from '@angular/router';
import { conformToMask } from 'angular2-text-mask';
import { masks } from '../../../masks';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-ongs',
  templateUrl: './ongs.component.html',
  styleUrls: ['./ongs.component.scss']
})
export class OngsComponent implements OnInit {
  public pedidos:any = [];
  formas_pagamento: any;
  url: any;
  empresas:any =null;
  status:any = null;
  bool:any;
  allPedidos:any;
  sortA:any=true
  public group = null;
  estados: any;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: PedidosService,
    public empresaService: EmpresaService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show()
    this.service.getOngs().subscribe(res => {
      console.log("res", res)
      this.pedidos = res
      this.allPedidos = res;
      this.spinner.hide()
    },err=>{
      this.spinner.hide()
      if(err.status == 401 || err.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    });
    this.empresaService.getEstados().subscribe(res => {
      this.estados = res;
    });

  }
    getNomeEmpresa(id){
    var empresa = this.empresas.filter(res=>{
        return res.IdEmpresaComprador == id || res.IdAnunciante == id
      }
    )
    return empresa.NomeEmpresa
  }
  viewPedido(id) {
    this.router.navigate(['admin/detalheOng'], { queryParams: { id: id } })
  }
  onDateSelect(event){
    this.bool = false
    var array:any=[];
    var month:any = new String(event.month);
    var day:any = new String(event.day);
    console.log("array length",month.length)
    if(month.length == 1){
      month = `0`+month
    }
    if(day.length == 1){
      day =`0`+day
    }
    var aux1 = event.year +`-`+ month + `-`+day
    console.log("event aux1", aux1)
    this.allPedidos.forEach((element,index) => {
      console.log("includes", element.DataInclusao.includes(aux1))
      if(element.DataInclusao.includes(aux1)){
        array.push(element)
      }else{
        array = []
      }
    });
    console.log("aux array", array)
    this.pedidos = array
    console.log("")
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA:any = new Date(a.DataInclusao);
      var dateB:any = new Date(b.DataInclusao);
      return dateA - dateB;
    });
    this.pedidos = arr;
  }
  conformCnpj(value: string) {
    return conformToMask(value, masks.cnpj, { guide: false }).conformedValue;
  }
  getNomeEstado(id){
    return this.estados.filter(estado=>{
      return estado.IdEstado == Number(id)
    })[0].NomeEstado
  }

  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }

  getFormaPagamento(id) {
    let forma_pagamento;
    forma_pagamento = this.formas_pagamento.find(forma => {
      return forma.IdFormaPagamento === id;
    });
    return forma_pagamento.NomeFormaPagamento;
  }

}
