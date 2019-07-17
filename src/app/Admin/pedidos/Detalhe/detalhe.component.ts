import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService, StatusPedido } from '../../../providers/pedidos.service';
import { CarrinhoService } from '../../../providers/carrinho.service';
import { EmpresaService } from '../../../providers/empresa.service';
import { ProductService } from '../../../providers/product.service';
import { UserService } from '../../../providers/user.service';
import { AuthService } from '../../../providers/auth.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
  selector: 'app-detalhe-component',
  templateUrl: './detalhe.component.html'
})
export class DetalheComponent implements OnInit {
  sub: any;
  idPedido: any;
  pedido: any;
  pedidoAtualizar: any;
  formas_pagamento: any;
  empresaCompradora: any;
  empresaAnunciante: any;
  Enderecos: any;
  endereco: any;
  Itens: any = [];
  idProduto: any;
  produto: any;
  estados: any;
  produtoById:any;
  statusPedido:any;
  statusPedidos:StatusPedido[] = [];
  statusPedidoSelecionado:any;
  ensayo:number =1;
  dataPedido:any;
  horaPedido:any;
  usuarioStatus:any =''
  CodigoBarras: any = [
    {
      Codigo: null,
      TipoCodigoBarras: 1
    }
  ]
  allUser: any =[];
  codigosBarras: any= [];
  
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public vendaViewService: PedidosService,
    public carrinhoServie: CarrinhoService,
    public empresasService: EmpresaService,
    public produtoService: ProductService,
    public userService: UserService,
    public authService:AuthService
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
    this.getAllUsers()
    this.getCodigosBarras()
    this.getPedido(this.idPedido.id)
    
    this.carrinhoServie.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
    });

    this.statusPedidos = this.vendaViewService.getStatusPedidos();
    this.empresasService.getEstados().subscribe(res => {
      this.estados = res;
      
    });
  }
  getNomeStatus(id){
    var aux = this.statusPedidos.filter(status=>{
      return status.Id == id
    })
    return aux[0].Descricao
  }
  getCodigo(id){
    switch (id) {
      case 1:
        return 'EAN 13'
      case 2:
        return 'DUN'
      case 3:
        return 'Data Bar'
      case 4:
        return '128'
      case 5:
        return 'ITF'
      case 6:
        return 'Data Matrix'
      default:
        break;
    }
  }
  getCodigosBarras(){
    this.produtoService.getCodigosBarras().subscribe(res=>{
      this.codigosBarras = res
    })
  }
  getNameStatus(id){
    console.log("id",id)
    this.statusPedidos.forEach(element => {
      if(element.Id == id){
        this.statusPedido= element.Descricao
      }
    });
  }
  atualizarStatusPedido(){
    this.pedidoAtualizar = {
        "IdPedido": this.idPedido.id,
        "StatusPedido": this.statusPedidoSelecionado
    }

    this.vendaViewService.update(this.pedidoAtualizar).subscribe(res => {
        swal("Sucesso", "Status Pedido atualizado com Sucesso!", "success");
     }, error => {
        swal("Falha", "Houve uma falha ao atualizar pedido!", "error");
     });
  }

  getPedido(id) {
    console.log("id",id)
    this.vendaViewService.getViewPedido(id).subscribe(
      res => {
        this.pedido = res; 
        console.log("pedido",this.pedido)
        var aux = this.pedido.DataInclusao.split("T")    
        this.dataPedido =aux[0]
        var aux2 = aux[1].split(".")   
        this.horaPedido =aux2[0]
        console.log("pedido view",JSON.stringify(this.pedido))
        this.getNameStatus(this.pedido.StatusPedido)    
        this.statusPedidoSelecionado = this.pedido.StatusPedido;
        this.getComprador(this.pedido.IdEmpresaComprador)  
        this.getAnunciante(this.pedido.IdAnunciante)  
        this.getProdutoById();      
        
        
        return this.pedido
      }
  )}

  getFormaPagamento(id) {
    let forma_pagamento;
    
    if(forma_pagamento != undefined){
      forma_pagamento = this.formas_pagamento.find(forma => {
        return forma.IdFormaPagamento === id;
      });
      return forma_pagamento.NomeFormaPagamento;
    }else{
      return '-'
    }
    
  }

  getComprador(id) {
    this.empresasService.getEmpresaById(id).subscribe(
      res => {
        this.empresaCompradora = res
        console.log("empresa compradora", this.empresaCompradora)
        this.setNomeEstado(true)
        return this.empresaCompradora
      }
    )
  }
  getNameUser(id){
    var aux = this.allUser.filter(user=>{
      return user.IdUsuario == id
    })
    return aux[0].NomeUsuario
  }
  getAllUsers(){
    this.userService.getAllUser().subscribe(res=>{
      this.allUser = res
    },error=>{
      if(error.status == 401 || error.status == 403 ){
        this.authService.logout()
        this.router.navigateByUrl('/login')
      }
    })
  }
  getAnunciante(id) {
    this.empresasService.getEmpresaById(id).subscribe(
      res => {
        this.empresaAnunciante = res
        this.setNomeEstado(false)
        return this.empresaAnunciante
      }
    )
  }

  getTotal(pedido) {
    let total = 0;
    pedido.Itens.forEach(item => {
      total += item.ValorDesconto * item.Quantidade;
    });
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
  getDate(date){
    var aux = date.split("T")    
       return aux[0]
        
  }
  getHour(date){
    var aux = date.split("T")
    var aux2 = aux[1].split(".")   
   return aux2[0]
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
  }
  setNomeEstado(comprador:boolean){
    if(comprador){
      this.nomeEstadoComprador()
    }else{
      this.nomeEstadoAnunciante()
    }
  }
  nomeEstadoComprador(){
    this.empresaCompradora.Enderecos.forEach((endereco,index) => {
      this.estados.forEach(estado => {
        if(endereco.Estado == estado.IdEstado){
          this.empresaCompradora.Enderecos[index].Estado = estado.NomeEstado;
        }
      });
    });
  }
  nomeEstadoAnunciante(){
    this.empresaAnunciante.Enderecos.forEach((endereco,index) => {
      this.estados.forEach(estado => {
        if(endereco.Estado == estado.IdEstado){
          this.empresaAnunciante.Enderecos[index].Estado = estado.NomeEstado;
        }
      });
    });
  }
  cancelarPedido(){
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

}
