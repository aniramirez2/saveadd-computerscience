import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidosService } from '../../../providers/pedidos.service';
import { EmpresaService } from '../../../providers/empresa.service';
import { AdminService } from '../../../providers/admin.service';
import { UserService } from '../../../providers/user.service';
import { CarrinhoService } from '../../../providers/carrinho.service';
import { StatusCompra} from '../../../shared/status-pedido.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  public pedidos:any = [];
  formas_pagamento: any;
  url: any;
  empresas:any =null;
  status:any = null;
  bool:any;
  allPedidos:any = [];
  sortA:any=true
  public group = null;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: PedidosService,
    public empresaService: EmpresaService,
    public userService: UserService,
    public carrinhoServie: CarrinhoService,
    public adminService: AdminService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show()
    this.userService.getUserById('0').subscribe(res=>{
     // console.log('user admin',res)
      var usuario:any = res
      if(usuario.TipoUsuario == 1){
       this.getpedidosong()
      }else if(usuario.TipoUsuario == 2){
        this.getpedidosaveadd()
      }
    },err=>{
      if(err.status == 401 || err.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
    
    this.status = this.service.getStatusPedidos()
    this.carrinhoServie.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });
    
  }
  getpedidosong(){
    this.service.getPedidosOng().subscribe(res => {
     
      this.pedidos = res
      this.allPedidos = res;
      this.getEmpresaComprador(this.pedidos)
      this.getEmpresaAnunciante(this.pedidos)
      this.getStatusPedido(this.pedidos)
      this.spinner.hide()
      this.orderByDate(this.pedidos);
    }, err=>{
      console.log("error admin", err)
      if(err.status == 401){
        localStorage.removeItem('appSaveAdd');
        window.location.reload();
      }
    });
  }
  getpedidosaveadd(){
    this.adminService.getPedidos().subscribe(res => {
     //console.log('pedidos admin', res)
      this.pedidos = res
      this.allPedidos = res;
      this.getEmpresaComprador(this.pedidos)
      this.getEmpresaAnunciante(this.pedidos)
      this.getStatusPedido(this.pedidos)
      this.orderByDate(this.pedidos);
      this.spinner.hide()
    },err=>{
      console.log("error admin", err)
      if(err.status == 401){
        localStorage.removeItem('appSaveAdd');
        window.location.reload();
      }
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
    this.router.navigate(['admin/detalhe'], { queryParams: { id: id } })
  }
  onDateSelect(event){
    this.bool = false
    var array:any=[];
    var month:any = new String(event.month);
    var day:any = new String(event.day);
    //console.log("array length",month.length)
    if(month.length == 1){
      month = `0`+month
    }
    if(day.length == 1){
      day =`0`+day
    }
    var aux1 = event.year +`-`+ month + `-`+day
    //console.log("event aux1", aux1)
    this.allPedidos.forEach((element,index) => {
     // console.log("includes", element.DataInclusao.includes(aux1))
      if(element.DataInclusao.includes(aux1)){
        array.push(element)
      }else{
        array = []
      }
    });
    //console.log("aux array", array)
    this.pedidos = array
    //console.log("")
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA:any = new Date(a.DataInclusao);
      var dateB:any = new Date(b.DataInclusao);
      return dateB - dateA;
    });
    this.pedidos = arr;
  }
  sort() {
    if(this.sortA){
      this.pedidos.sort(function compare(a, b) {
        var dateA:any = new Date(a.DataInclusao);
        var dateB:any = new Date(b.DataInclusao);
        
        return dateA - dateB;
      });
      this.sortA=false
    }else{
      this.pedidos.sort(function compare(a, b) {
        var dateA:any = new Date(a.DataInclusao);
        var dateB:any = new Date(b.DataInclusao);
        
        return dateB-dateA  ;
      });
      this.sortA=true
    }
  }

  baixarRecibo(id) {
    this.service.getRecibo(id).subscribe( res => {
      var aux:any = res
      const blob = new Blob([aux], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
     // console.log(url)
      window.open(url);
    })
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

  getTotal(pedido) {
    let total = 0;
    pedido.Itens.forEach(item => {
      total += item.ValorDesconto * item.Quantidade;
    });
    return total;
  }
  getEmpresaComprador(pedidos){
    pedidos.forEach(pedido => {
      this.empresaService.getEmpresaById(pedido.IdEmpresaComprador).subscribe(
        (response: any)=> {
            pedido.EmpresaComprador = response.NomeEmpresa;
            
        },
        (error)=> {
          console.log("error", error)
        }
      );
    });
    
  }
  getStatusPedido(pedidos){
    pedidos.forEach(pedido => {
      var auxStatus = this.status.filter(res=>{
        return res.Id == pedido.StatusPedido
      })
      pedido.StatusPedidoNome = auxStatus[0].Descricao
    });
  }
  getTotalAllPedidos(){
    var sum = 0
    var total
    this.pedidos.forEach(element => {
       sum += element.ValorTotalDesconto
    });
    return sum
  }
  getEmpresaAnunciante(pedidos){
    pedidos.forEach(pedido => {
      this.empresaService.getEmpresaById(pedido.IdAnunciante).subscribe(
        (response: any)=> {
            pedido.EmpresaAnunciante = response.NomeEmpresa;            
        },
        (error)=> {
          console.log("error", error)
        }
      );
    });
    
  }
}
