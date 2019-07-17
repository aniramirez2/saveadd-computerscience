import { IMAGES_URL } from './../../app.api';
import { Categoria, Fabricante } from './../../providers/product.service';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import {  Subject, Observable,  } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge
} from 'rxjs/operators';
import {
  ProductService,
  Produto,
  Imagem,
  Codigo
} from '../../providers/product.service';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AddImageComponent } from '../add-image/add-image.component';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { CodigoBarras } from '../../shared/codigo-barras.pipe';

import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewProdutoComponent implements OnInit {
  produto: Produto;
  categorias: Categoria[];
  fabricantes: Fabricante[] = [];
  imagem: Imagem;
  loading_page = false;
  loading_imagens = false;
  updating = false;
  edit = false;
  images: Imagem[];
  images_url = IMAGES_URL;
  successMessage: string;
  errorMessage: string;
  tipos_codigo: any = [
    {"id":1,"nome":'EAN 13'},
    {"id":2,"nome":'DUN'},
    {"id":3,"nome":'Data Bar'},
    {"id":4,"nome":'128'},
    {"id":5,"nome":'ITF'},
    {"id":6,"nome":'Data Matrix'}
  ];
  category: any = null;
  subcategories: any =null;
  categories: any[] = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  codigo: Codigo ;
  Subcategoria: any;
  Categoria: any;
  NomeCategoria: any;
  NomeSubcategoria: any;
  allCategories:any =null;
  lotes={};
  none: number;
  
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('thFabricante') thFabricante: NgbTypeahead;
  @ViewChild('rawFabricante') rawFabricante: ElementRef;
  //focus$ = new Subject<string>();
  //click$ = new Subject<string>();

  focusFabricante = new Subject<string>();
  clickFabricante = new Subject<string>();
  constructor(
    public service: ProductService,
    public modalService: NgbModal,
    public route: ActivatedRoute
  ) {
    
  }
  searchFabricante = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      merge(this.focusFabricante),
      merge(
        this.clickFabricante.pipe(
          filter(() => !this.thFabricante.isPopupOpen())
        )
      ),
      map(term =>
        (term === ''
          ? this.fabricantes
          : this.fabricantes.filter(v => {
              return (
                v.NomeFabricante.toLowerCase().indexOf(term.toLowerCase()) > -1
              );
            })
        ).slice(0, 10)
      )
    );
  category_formatter = (x: { NomeCategoria: string }) => x.NomeCategoria;
  fabricante_formatter = (x: { NomeFabricante: string }) => x.NomeFabricante;
  showNewCat: boolean = false;
  showNewSub: boolean = false;
  ngOnInit() {
    this.codigo = this.service.instantiateCodigo()
    //this.tipos_codigo = this.service.getTiposCodigo();
    console.log("tipo cod",this.tipos_codigo )
    this.route.params.subscribe(params => {
      this.loading_page = true;
      this.getProdutoById(params['id']);
      this.getImages(params['id']);
    });
    this.service.getCategories().subscribe(res => {
      this.allCategories = res;
      this.allCategories.forEach(element => {
        if(element.IdCategoriaPai == null){
          this.categories.push(element);
        }
      });        
      })   
      this.service.getFabricantes().subscribe(res => {
        this.fabricantes = res as Fabricante[];
      });  
  }
  onChange(deviceValue){
    var aux = deviceValue.split(":");
    console.log();
    this.getSubcategorieByID(aux[1])
  }
  public beforeChange($event: NgbTabChangeEvent) {
    
  };
  addCodigo(){
    console.log("cod", this.codigo)
    if(this.codigo != null ){
      this.produto.CodigoBarras.push(this.codigo)
      this.codigo = this.service.instantiateCodigo()
      this.none = 0
        }
  }
  getCodigo(cod){
    switch (cod) {
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
  getSubcategorieByID(id: any){
    this.service.getSubCategories(id).subscribe(res => {
      const data: any = res;
      if(res != []){
        this.subcategories = data;    
      }else{
        this.subcategories = null;
      }
        
    },
  error => { this.subcategories = null }
    )  
  }
  getRealCategories(id){
    this.service.getCategorieById(id).subscribe(res => {
      const data: any = res;
      if(res != []){
        this.Subcategoria = data.IdCategoria;
         /*this.getCategoryByIdToGetName(this.Subcategoria)*/
         this.getSubcategorieByID(data.IdCategoriaPai)
        this.Categoria = data.IdCategoriaPai; 
        this.NomeSubcategoria = data.NomeCategoria;
        this.categories.forEach(element => {
          if(element.IdCategoria == this.Categoria){
            this.NomeCategoria = element.NomeCategoria
          }
        });
      }else{
        console.log("Resposta vazia");
      }
        
    },
  error => { this.subcategories = null }
    )
  }
  getCategoryByIdToGetName(id):any{
    this.service.getCategorieById(id).subscribe(res => {
      var aux = res  
    },
  error => { console.log("error", error.errorMessage) }
    )
  }
  getProdutoById(id){
    this.service.getById(id).subscribe(
      res => {
        this.produto = res as Produto;
        this.getRealCategories(this.produto.Categoria)
        this.loading_page = false;
      },
      error => {
        this.loading_page = false;
      }
    );
  }
  updateCodigos(){
    this.update()
  }
  excluirCod(cod, index){
    this.produto.CodigoBarras.splice(index, 1);
  }
  cancel() {
    this.edit = false;
    this.route.params.subscribe(params => {
      this.getProdutoById(params['id']);
    });
  }

  update() {
    this.updating = true;
    console.log("before update", this.produto)
    //this.produto as Produto;
    this.service.update(this.produto).subscribe(
      res => {
        swal("Sucesso", "Produto editado com sucesso!", "success");

        this.successMessage = 'O produto foi editado';
        this.updating = false;
        this.edit = false;
        this.ngOnInit()
      },
      error => {
        this.errorMessage = error;
        console.log("error checkout",error)
          swal(`Ops, ${error.error.Mensagem}`, {
            dangerMode: true,
            buttons: ["fechar","OK"],
          })
          .then((value) => {
            switch (value) {                 
              case true:
              this.loading_page=false
                break;
            }
          });     
        this.edit = false;
      }
    );
    return true;
  }
  removeImage(product: any){
    this.getImages(this.produto.IdProduto);
    swal("tem certeza que quer deletar a Imagem?", {
      buttons: {
        cancel: {
          text: "Cancelar",
          value: "cancel"
        },
        confirmation: {
          text: "Ok",
          value: "confirmation",
          dangerMode: true
        }
      }
    }).then(
      (value) => {
        switch (value) {
          
          case "confirmation":
            var objectImProd = {
              'IdProduto': this.produto.IdProduto,
              'IdImagem' : this.images[0].IdImagem,
              'Ordem': 0,
            } 
            this.service.deleteImagem(objectImProd).subscribe( 
              res =>
              {
              console.log('respuesta delete', res)
              if(res){
                window.location.reload();
              }
            })
            //this.ngOnInit()
          break;
        }
      }
    )
   
    
  }

  openAddImageModal(produto) {
    const modalRef = this.modalService.open(AddImageComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.produto = produto;
    modalRef.result.then(
      res => {
        if (res) {
          this.getImages(this.produto.IdProduto);
        }
      },
      reason => {
        console.log(reason);
      }
    );
    return true;
  }
  getNomeCodigo(id:any):any{
    this.tipos_codigo.forEach(element => {
      if(id == element.Id){
        return element
      }
    });
  }
  getImages(id) {
    this.loading_imagens = true;
    this.service.getImages(id).subscribe(
      res => {
        this.loading_imagens = false;

        this.images = res as Imagem[];
      },
      error => {
        this.loading_imagens = false;
      }
    );
  }
  onChangeSubCategoria(value){
    var aux = value.split(":")
    this.produto.Categoria = aux[1]
  }
  onChangeCodigo(value){
    var aux= value.value.split(":")
    console.log("value cod", aux[1])
    this.codigo.TipoCodigoBarras = Number(aux[1])

  }
}
