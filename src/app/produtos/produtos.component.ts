import { Component, OnInit } from '@angular/core';
import {
  Produto,
  ProductService,
  Categoria
} from '../providers/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveProdutoComponent } from './remove-produto/remove-produto.component';
import { EmpresaService } from './../providers/empresa.service';
import { AuthService } from './../providers/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  loading_page = false;
  produtos: Produto[];
  categorias: Categoria[];
  empresa: any;
  p: number = 1;
  collection: any[] = []; 
  constructor(
    public empresaService: EmpresaService,
    public service: ProductService,
    public router: Router,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.spinner.show()
    this.empresaService.getEmpresas().subscribe(res => {
      this.empresa = res
      console.log(this.empresa)
    });
    this.loading_page = true;
    this.service.getAll().subscribe(
      res => {
        var aux:any = res
        this.loading_page = false;
        this.produtos = res as Produto[];
        this.orderByDate(this.produtos)
        this.collection= aux
        this.spinner.hide()
      },
      error => {
        this.loading_page = false;
        this.spinner.hide()
        if(error.status == 401){
          this.auth.logout()
          this.router.navigateByUrl('/login')
        }
      }
    );
    this.service.getCategories().subscribe(res => {
      const data: any = res;
      this.categorias = res as Categoria[];
      // for (const categorie of data) {
      //   this.categories.push(categorie);
      // }
    });

    
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA:any = new Date(a.DataInclusao);
      var dateB:any = new Date(b.DataInclusao);
      return dateB - dateA;
    });
    this.produtos = arr;
  }
  openRemoveModal(produto: Produto) {
    const modalRef = this.modalService.open(RemoveProdutoComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.produto = produto;
    modalRef.result.then(
      res => {
        if (res) {
          const index = this.produtos.findIndex(
            x => x.IdProduto === produto.IdProduto
          );
          if (index > -1) {
            this.produtos.splice(index, 1);
          }
        }
        console.log('close ' + res);
      },
      reason => {
        console.log(reason);
      }
    );
  }

  getCategoria(id_categoria) {
    for (const categoria of this.categorias) {
      // console.log(categoria.IdCategoria);
      if (categoria.IdCategoria === id_categoria) {
        return categoria.NomeCategoria;
      }
    }
  }

  hasIE() {
    if(!this.empresa[0].InscricaoEstadual ) {
      swal("Erro", "Empresa informada não pode incluir anúncios pois não possui Inscrição Estadual", "error");
      this.router.navigate(['produtos'])
    } else {
      this.router.navigate(['/produtos/novo'])
    }
  }
}
