import { CarrinhoService } from './../providers/carrinho.service';
import { PedidosService } from './../providers/pedidos.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './../providers/product.service';
import { AdvertisementService } from './../providers/advertisement.service';
import { EmpresaService } from './../providers/empresa.service';
import { Router } from '@angular/router'
import { AuthService } from './../providers/auth.service'
import {UserService} from './../providers/user.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pedidos = null;
  formas_pagamento: any;
  allProducts: any;
  productsLength: any;
  allAnuncios: any;
  anunciosLength: any;
  allPedidos: any;
  allVendas: any;
  empresas: any;
  idEmpresa: any;
  isAdmin:any

  constructor(
    public pedidosService: PedidosService,
    public carrinhoServie: CarrinhoService,
    public products: ProductService,
    public empresasService: EmpresaService,
    public anuncios: AdvertisementService,
    public router: Router,
    public AuthService:AuthService,
    public user: UserService
  ) {
  }

  ngOnInit() {
    if(this.AuthService.isAuthenticated()){
      var id = "0"
      this.user.getUserById(id).subscribe(res=>{
        var aux:any = res
        if(aux.TipoUsuario == 2){
          this.isAdmin = true
          this.router.navigate(['/admin'])
        }else{
          this.isAdmin = false
          this.pedidosService.getPedidos().subscribe(res => {
            this.pedidos = res;
          });
      
          this.carrinhoServie.getFormasPagamento().subscribe(res => {
            this.formas_pagamento = res;
          });
        }
      })
      
    }else{
      this.router.navigate(['/']);
    }
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

  getAllProdutos() {
    this.products.getAll().subscribe(res => {
      this.allProducts = res;
    })
    return this.allProducts.length
  }


  getAllAnuncios() {
    this.anuncios.getAll().subscribe(res => {
      this.allAnuncios = res;
    })
    return this.allAnuncios.length
  }

  getAllPedidos(){
    this.pedidosService.getPedidos().subscribe(res => {
      this.allPedidos = res;
    })
    return this.allPedidos.length
  }

  getAllVendas(){
    this.empresasService.getEmpresas().subscribe(
      res => {
        this.empresas = res
        this.idEmpresa = this.empresas[0].IdEmpresa
        this.pedidosService.getVendas(this.idEmpresa).subscribe( res => {
          this.allVendas = res
        })       
        return this.allVendas.length
        
      }
    )
  }

}
