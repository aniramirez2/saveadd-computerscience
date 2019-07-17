import { Component, OnInit } from '@angular/core';
import {TecnicoAdminService,Categoria, AddCategoria} from './../../providers/tecnicoAdmin.service'
import { AdvertisementService }from './../../providers/advertisement.service'
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-responsabilidade-tecnica',
  templateUrl: './responsabilidade-tecnica.component.html',
  styleUrls: ['./responsabilidade-tecnica.component.scss']
})
export class ResponsabilidadeTecnicaComponent implements OnInit {
  categorias:any=[]
  categoria:Categoria
  onlyCategorias:any=[]
  loading_page = false
  edit = false
  containsSubcategoria:any = []
  filteredAds:any
  nomeCategoria
  selectedcategoria
  selected
  toList:any=[]
  auxCategoriaPai=null
  AddCategoria:AddCategoria
  isFiltered = null
  nomeCat= null
  constructor(
    public tecnicoService:TecnicoAdminService,
    public adService: AdvertisementService,
    public spinner : NgxSpinnerService,
    public router : Router
  ) { }

  ngOnInit() {
    this.spinner.show()
    this.loading_page = true;
    this.callCategories()
    
    this.categoria = this.tecnicoService.instantiateCategoria();
    this.AddCategoria = this.tecnicoService.instantiateAddCategoria();
  }
  getOnlyCategories(){
    this.onlyCategorias = this.categorias.filter(cat=> cat.IdCategoriaPai == null)
  
  }
  callAds(){
    this.adService.vitrine().subscribe(res=>{
      this.filteredAds= res
      this.getNumberAdsInCat()
    })
  }
  filterTipo(value){
    if(value.target.value == 0){
      this.toList= this.categorias.filter(cat=> { return cat.IdCategoriaPai == null})
    }
    if(value.target.value == 1){
      this.toList= this.categorias.filter(cat=> { return cat.IdCategoriaPai != null})
    }
    if(value.target.value == 2){
      this.toList= this.categorias
    }
  }
  filterCatPai(value){
    this.toList= this.categorias
    console.log('value',value.target.value)
    this.isFiltered = true
    if(Number(value.target.value) == 0){
      this.toList= this.categorias
      this.isFiltered = null
    }else{
      this.getCategoriaPai(value.target.value)
      this.toList= this.categorias.filter(cat=> { return cat.IdCategoriaPai == value.target.value})
      this.toList.forEach((element, index) => {
        
        element.CategoriaPaiNome = this.nomeCat
      });
      console.log(`to list depois filter`, this.toList)
    }
    }
  callCategories(){
    this.tecnicoService.getAllCategorias().subscribe(
      res => {
        this.loading_page = false;
        this.categorias =res
        this.toList = res
        this.callAds()  
        this.getOnlyCategories() 
        this.spinner.hide()     
      },
      error => {
        this.spinner.hide() 
        if(error.status == 401 || error.status == 403 ){
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
        this.loading_page = false;
      }
    );
  }
  editarCategoria(categoria, i){
    this.edit= true
    this.categoria = categoria
    var id =categoria.IdCategoriaPai
    this.AddCategoria.IdCategoria = categoria.IdCategoria
   
    if(id == null){
      this.nomeCategoria = "É categoria pai"
      this.categoria.IdCategoriaPai =null
      
    }else{
      
      var aux = this.categorias.filter(fil=>{return fil.IdCategoria == id})
    
    this.nomeCategoria = aux[0].NomeCategoria
    }
  }
  close(){
    this.edit=false
    this.categoria = this.tecnicoService.instantiateCategoria()
    this.ngOnInit()
  }
  editCategoria(){
    var aux:AddCategoria ={
      "IdCategoria":this.AddCategoria.IdCategoria,
      "IdCategoriaPai":this.categoria.IdCategoriaPai,
      "NomeCategoria":this.categoria.NomeCategoria
    }
    //var aux:AddCategoria = categoria
    if(this.auxCategoriaPai != null){
      aux.IdCategoriaPai = this.auxCategoriaPai
    }
    
    this.tecnicoService.updateCategoria(aux).subscribe(res=>{
      
      var aux = res
      if(aux == false){
        swal("Erro","Categoria não atualizada !", "error")
      }else{
        swal("Sucesso", "Categoria atualizada com sucesso!", "success")
      this.ngOnInit()
      this.categoria = this.tecnicoService.instantiateCategoria()
      }
      
    },
    error=>{
      swal("Erro", error.error.Mensagem, "error")
      this.ngOnInit()
      this.categoria = this.tecnicoService.instantiateCategoria()
    })
  }
  excluirCategoria(id, index){
    if(this.containsSubcategoria.filter(fil=> fil.IdCategoria == id.IdCategoria).length > 0){
      swal("Esta categoria tem anúncios relacionados a ela, Não pode excluir esta categoria", {
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
            /*this.tecnicoService.deleteCategoria(id.IdCategoria).subscribe(res=>{
              swal("Sucesso", "Categoria removida com sucesso!", "success")
              this.ngOnInit()
            })*/
            
            break;
          }
        }
      )
    }else{
      swal("Tem certeza que deseja excluir esta categoria?", {
        buttons: ["Não","Excluir"]
      }).then(
        (value) => {
          switch (value) {
            
            case true:
            this.tecnicoService.deleteCategoria(id.IdCategoria).subscribe(res=>{
              swal("Sucesso", "Categoria removida com sucesso!", "success")
              this.ngOnInit()
            })
            
            break;
          }
        }
      )
    }
    
  }
  onChangeCate(event){
    if(event.target.value != null){
    var aux = event.target.value
    var aux2 = aux.split(":")
    this.auxCategoriaPai = Number(aux2[1])
  }else{
    this.auxCategoriaPai = event.target.value
  }
   }
  addCategoria(){
    
    var aux:AddCategoria ={
      "IdCategoria": null,
      "IdCategoriaPai":this.auxCategoriaPai,
      "NomeCategoria":this.categoria.NomeCategoria
    }
    console.log("add cat", aux)
    this.tecnicoService.saveCategoria(aux).subscribe(res=>{
      swal("Sucesso", "Categoria criada com sucesso!", "success")
      this.ngOnInit()
      this.categoria = this.tecnicoService.instantiateCategoria()
    },
    error=>{
      swal("Erro", error.error.Mensagem, "error")
      this.ngOnInit()
      this.categoria = this.tecnicoService.instantiateCategoria()
    })
  }
  getCategoriaPai(id){
    if(id != null){
      var aux = this.toList.filter(categoria=> categoria.IdCategoria == id)
      
      if(aux.length == 0){
        return "Sem categoria"

      }else{
        if(aux[0].NomeCategoria == null){
          return "É categoria Pai"
        }else{
          this.nomeCat = aux[0].NomeCategoria
          return aux[0].NomeCategoria
        }
      }
    }else{
      return "É categoria Pai"
    }
  }
  getDate(date){
    var aux = date.split("T")    
        return aux[0]
  }
  getNumberAdsInCat(){
    this.filteredAds.forEach(element=>{
      var containsSubcategoria = this.containsSubcategoria.some(cont=>{
        return cont.IdCategoria === element.Categoria 
      })
      if(containsSubcategoria){
        var aux = this.containsSubcategoria.findIndex(index=> index.IdCategoria === element.Categoria)
        this.containsSubcategoria[aux].count = this.containsSubcategoria[aux].count +1
      }else{
        var aux = this.categorias.filter(filt=>{return filt.IdCategoria == element.Categoria})
        var aux2 = {"IdCategoria":aux[0].IdCategoriaPai,"count":1}
        var obj ={"IdCategoria":element.Categoria,"count":1}
        this.containsSubcategoria.push(obj)
        this.containsSubcategoria.push(aux2)
      }
    })
    
  }
}
