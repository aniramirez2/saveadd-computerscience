import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, StatusPedido } from './../providers/pedidos.service';
import { CarrinhoService } from './../providers/carrinho.service';
import { EmpresaService } from './../providers/empresa.service';
import { ProductService } from './../providers/product.service';
import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import {CodigoBarras} from './../shared/codigo-barras.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
const swal: SweetAlert = _swal as any;
@NgModule({
  imports: [SharedModule],
  declarations: [],
  exports: []
})
export class VendaViewModule {}

@Component({
  selector: 'app-venda-view',
  templateUrl: './venda-view.component.html',
  styleUrls: ['./venda-view.component.scss']
})
export class VendaViewComponent implements OnInit {
  sub: any;
  idPedido: any;
  pedido: any = '';
  pedidoAtualizar: any;
  formas_pagamento: any = [];
  empresaCompradora: any;
  Enderecos: any;
  endereco: any;
  Itens: any = [];
  idProduto: any;
  produto: any;
  estados: any;
  produtoById:any;
  statusPedidos:StatusPedido[] = [];
  statusPedidoSelecionado:any;
  ensayo:number =1;
  dataPedido:any;
  horaPedido:any;
  CodigoBarras: any = [
    {
      Codigo: null,
      TipoCodigoBarras: 1
    }
  ]
  isSelectedStatus: boolean = false;
  observacoes: any;
  statusPedidoss: any
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public vendaViewService: PedidosService,
    public carrinhoServie: CarrinhoService,
    public empresasService: EmpresaService,
    public produtoService: ProductService,
    public spinner: NgxSpinnerService
  ) {
    this.empresaCompradora = {}
    this.Enderecos = []
    this.endereco = {}
    this.Itens = []
   }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.idPedido = params;
      return this.idPedido
    });
    this.getPedido(this.idPedido.id)
    
    this.carrinhoServie.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });

    this.statusPedidos = this.vendaViewService.getStatusPedidos();
    this.statusPedidos.sort((a,b)=>a.Descricao.localeCompare(b.Descricao));
    this.empresasService.getEstados().subscribe(res => {
      this.estados = res;
      
    });
  }
  statusReturn(id){
    var aux= this.statusPedidos.filter(status=>{ if(status.Id === id){return status} })
    return aux[0].Descricao
  }
  atualizarStatusPedido(){
    this.spinner.show()
    this.pedidoAtualizar = {
        "IdPedido": this.idPedido.id,
        "StatusPedido": this.statusPedidoSelecionado,
        "Observacoes": this.observacoes
    }
    this.vendaViewService.update(this.pedidoAtualizar).subscribe(res => {
      
      console.log("response", res)
        this.pedido.StatusProduto = null
        this.isSelectedStatus = false
        this.spinner.hide()
        this.observacoes = ""
        this.ngOnInit()
        swal("Sucesso", "Status Pedido atualizado com Sucesso!", "success");
     }, error => {
       console.log("erro", error)
       this.spinner.hide()
        swal("Falha", "Houve uma falha ao atualizar pedido!", "error");
     });
  }

  getPedido(id) {
    this.vendaViewService.getViewPedido(id).subscribe(
      res => {
        this.pedido = res; 
        console.log("pedido", this.pedido)
        var aux = this.pedido.DataInclusao.split("T")    
        this.dataPedido =aux[0]
        var aux2 = aux[1].split(".")   
        this.horaPedido =aux2[0]
        this.statusPedidoSelecionado = this.pedido.StatusPedido;
        this.getComprador(this.pedido.IdEmpresaComprador)  
        this.getProdutoById();        
        return this.pedido
      }
  )}
  activateObservacoes(){
    this.isSelectedStatus = true
  }
  getFormaPagamento(id) {
    let forma_pagamento;
    forma_pagamento = this.formas_pagamento.find(forma => {
      return forma.IdFormaPagamento === id;
    });
    if(forma_pagamento != undefined){
      return forma_pagamento.NomeFormaPagamento;
    }else{
      return "-"
    }
    
  }

  getComprador(id) {
    this.empresasService.getEmpresaById(id).subscribe(
      res => {
        this.empresaCompradora = res
        this.setNomeEstado()
        return this.empresaCompradora
      }
    )
  }
  getDate(date){
    var aux = date.split("T")    
       return aux[0]
        
  }
  getHour(date){
    var aux = date.split("T")
    var aux2 = aux[1].split(".")   
   return aux2[0]
  }
  getTotal(pedido) {
    let total = 0;
    if(pedido != ''){
      pedido.Itens.forEach(item => {
        total += item.ValorDesconto * item.Quantidade;
      });
    }
    return total;
  }

  getTotalProduto(produto) {
    var total: number = 0
    total = produto.Quantidade * produto.ValorDesconto
    return total
  }

  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
    

  getProduto(id) {
    this.produtoService.getById(id).subscribe(
      res => {
        this.produtoById = res;
        console.log("prod by id", this.produtoById)
      }
    )
  }
  getProdutoById() {
    this.pedido.Itens.forEach((item, index) => {
      this.produtoService.getById(item.IdAnuncioProduto).subscribe(
        res => {
          this.produtoById = res
      this.pedido.Itens[index].infoProduct = {"IdProduto":this.produtoById.IdProduto,
    "NomeProduto": this.produtoById.NomeProduto,"CodigoBarras":this.produtoById.CodigoBarras}
      }
    )
    });
    console.log("pedido itens", this.pedido.Itens);
  }
  setNomeEstado(){
    this.empresaCompradora.Enderecos.forEach((endereco,index) => {
      this.estados.forEach(estado => {
        if(endereco.Estado == estado.IdEstado){
          this.empresaCompradora.Enderecos[index].Estado = estado.NomeEstado;
         
        }
      });
    });
  }
  cancelarPedido(){
    swal("Tem certeza que quer cancelar esta venda?", {
      dangerMode: true,
      buttons: ["Não","Sim"]
    }).then((value) => {
        switch (value) {
          case true:
          this.pedidoAtualizar = {
            "IdPedido": this.idPedido.id,
            "StatusPedido": 5
          }
          this.vendaViewService.update(this.pedidoAtualizar).subscribe(res => {
            swal("Sucesso", "Você cancelou o pedido!", "success");
            this.ngOnInit()
         }, error => {
            swal("Falha", "Houve uma falha ao cancelar pedido!", "error");
         });
        }
      });
    
  }

}
