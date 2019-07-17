import { IMAGES_URL } from './../../app.api';
import { AdvertisementService, Anuncio, TipoRestricao } from './../../providers/advertisement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { EmpresaService } from './../../providers/empresa.service';
import { ProductService } from './../../providers/product.service';
import { CarrinhoService } from './../../providers/carrinho.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss']
})

export class DetalhesComponent implements OnInit {
  anuncio: Anuncio;
  images_url = IMAGES_URL;
  empresa: any;
  formas_pagamento: any=[];
  categories:any = [];
  restricoes:any = [];
  tipoRestricoes:any =[];
  estados:any =[];
  auxEstado: any = null;
  auxiliarcategorias:any;
  modalReference: any;
  constructor(
    public router: Router,
    public activeModal: NgbActiveModal,
    public adService: AdvertisementService, 
    public empresaService: EmpresaService,
    public productService: ProductService,
    public carrinhoService: CarrinhoService,
  ) {
    this.empresa = {}
  }
  ngOnInit() {
    
    this.getEstados()
    this.restricoes = this.anuncio.Restricoes;
    this.tipoRestricoes = this.adService.getTipoRestricoes();
    this.getAnunciante(this.anuncio.IdEmpresa);
    this.getTipoRestricao();
    
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
      //this.getCategoria(this.anuncio.Categoria);
    });  
    this.productService.getCategorieById(this.anuncio.Categoria).subscribe(
      res=>{
        this.auxiliarcategorias = res
      },
      error=>{
        console.log("error", error)
      }
    )
    
  }
  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
  
  closeModal(){
    this.activeModal.close();
  }

  getAnunciante(id) {
    this.empresaService.getEmpresaById(id).subscribe(
      res => {
        this.empresa = res
        this.getNomeEstado()
        return this.empresa
      }
    )
  }
  getEstados(){
    this.empresaService.getEstados().subscribe(
      res=>{
        this.estados = res
        this.validateRestrictionForState(); 
      }
    )
  }
  close(){
    
  }
  validateRestrictionForState(){
    this.restricoes.forEach(element => {
      if(element.TipoRestricao == 4){
        this.getEstadoById(Number(element.Valor))
      }
    });
    
  }
  getEstadoById(id){
    this.auxEstado =this.estados.find(item => item.IdEstado === id);
  }

  getCategoria(id_categoria) {
    for (const categoria of this.categories) {
      if (categoria.IdCategoria === id_categoria) {
        //this.anuncio.Categoria= categoria.NomeCategoria;
        //this.auxiliarcategorias =categoria
        return categoria.NomeCategoria
      }
    }
  }
  getSubCategoria(getSubCategoria) {
    for (const categoria of this.categories) {
      if (categoria.IdCategoria === this.auxiliarcategorias.IdCategoriaPai){
          return categoria.NomeCategoria          
        //this.anuncio.Categoria= categoria.NomeCategoria;
        
      }
    }
  }
  getTipoRestricao(){   
    this.restricoes.forEach((restricao, index) => {
      this.tipoRestricoes.forEach(element => {
        if (restricao.TipoRestricao == element.Id){
          this.restricoes[index].NomeRestricao = element.Descricao;         
         }
      });
      
    });
  }
  adicionaCarrinho(anuncio: Anuncio) {
    if(!this.isDuplicated(anuncio)){
    var aux = this.carrinhoService.getCarrinho();
    var noHasElementInArray:any =[];
    if(aux.length > 0){
        aux.forEach((element,index) => {
          if(Array.isArray(element)){
            if(element.some(e =>e.IdEmpresa === anuncio.IdEmpresa)){
              var tmp = aux[index]
              this.carrinhoService.removeDoCarrinho(index);
              var arrAux:any =[];
              tmp.push(anuncio)
              this.carrinhoService.adicionaCarrinho(tmp)
            }else{
              noHasElementInArray.push("no")
            }
          }else{
            if(element.IdEmpresa === anuncio.IdEmpresa){
              var tmp = element
              this.carrinhoService.removeDoCarrinho(index);
              var aux2:any =[];
              aux2.push(tmp)
              aux2.push(anuncio)
        
              this.carrinhoService.adicionaCarrinho(aux2)
            }else{
              noHasElementInArray.push("no")
            }
          }
        });
      }else{
        //this.carrinhoService.adicionaCarrinho(anuncio);
      }
      if(aux.length == noHasElementInArray.length){
        this.carrinhoService.adicionaCarrinho(anuncio);
      }
    
     }
     this.closeModal()
  }
  isDuplicated(anuncio:Anuncio){
    var carrinho = this.carrinhoService.getCarrinho();
    var aux = carrinho.filter(anun=>{
      if(anun.IdAnuncio == anuncio.IdAnuncio){
        return anun
      }
    })
    if(aux.length >0){
      swal('Erro', 'Você já adicionou este item', 'error' )
      return true
      
    }else{
      return false
    }
  }
  getNomeEstado(){
    this.estados.forEach(element => {
      this.empresa.Enderecos.forEach(empresa => {
        if(element.IdEstado == empresa.Estado){
          empresa.Estado = element.NomeEstado
        }
      });
      
    });
  }
}
