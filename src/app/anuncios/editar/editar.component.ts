// import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { UtilsService } from './../../shared/utils.service';
import { ProductService } from './../../providers/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AdvertisementService,
  Anuncio,
  AdRestriction,
  AdLote
} from '../../providers/advertisement.service';
import { Produto } from '../../providers/product.service';
import { EmpresaService } from '../../providers/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveProductComponent } from '../remove-product/remove-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { TipoRestricao } from '../../shared/tipo-restricao.pipe';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import { masks } from './../../masks';
@Component({
  selector: 'app-editar-anuncios',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  masks = masks;
  loading_page = false;
  loading_produtos = false;
  anuncio: Anuncio;
  updating = false;
  edit = false;
  products: Produto[] = [];
  unidades: string[] = ['Kg', 'Unidade', 'Pacote', 'Caixa', 'Litro','m²','Saco'];
  preco: string;
  desconto: string;
  tipoRestricoes:any;
  restricoes: AdRestriction[] = [];
  restricao:AdRestriction;
  auxForSelectRestricoes:any;
  selectedRest:any;
  successMessage: string;
  errorMessage: string;
  estados:any;
  categories:any=[];
  subcategories:any=[];
  auxCategoria:any=[];
  auxSubCategoria:any=null;
  auxLote:any =null;
  lote:AdLote;
  lotes: AdLote[]=[];
  onlyCategories:any = [];
  descRes:any= [
    {"Id": 1,"Descricao": "Quantidade Mínima"},
    {"Id": 2,"Descricao": "Quantidade Máxima"},
    {"Id": 3,"Descricao": "Restrito a um CNPJ"},
    {"Id": 4,"Descricao": "Restrito ao Estado"},
    {"Id": 6,"Descricao": "Restrito a ONG's"},
    {"Id": 7,"Descricao": "Restrito a ONG's Conveniadas"}
  ];
  NomeEstado: any;
  isCatSelected: boolean;
  produtosCategoria: any =[];
  AllProducts: any;
  onlysubcategories: any=[];
  subcategoriesprod: any=[];
  produtos: any;
  prodReserv:any = []
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public service: AdvertisementService,
    public productService: ProductService,
    public modalService: NgbModal,
    public utils: UtilsService,
    public empresaService: EmpresaService
  ) {}

  ngOnInit() {
  
    this.getEstados();
    this.getAllProducts()
    this.route.params.subscribe(params => {
      this.loading_page = true;
      this.service.getAnuncioById(params['id']).subscribe(
        res => {
          this.loading_page = false;
          this.anuncio = res as Anuncio;
          this.anuncio.Restricoes.forEach(element => {
            if(element.TipoRestricao == 4){
              this.getNameEstado(element.Valor)
            }
          });
          this.productService.getCategories().subscribe(res => {
            const data: any = res;
            this.categories =data                     
            this.getCategoryName(this.anuncio.Categoria);
            this.getSubcategorieByID(this.anuncio.Categoria)
            
            ;
          });
          this.anuncio.DataFim = this.utils.getLocalDate(this.anuncio.DataFim);
          this.anuncio.DataInicio = this.utils.getLocalDate(
            this.anuncio.DataInicio
          );
          this.preco = String(this.anuncio.Produtos[0].ValorUnitarioOriginal) ;
          this.desconto = String(
            this.anuncio.Produtos[0].ValorUnitarioDesconto
          );
          this.getProducts();
        },
        error => {
          this.loading_page = false;
        }
      );
    });
   
    this.tipoRestricoes = this.service.getTipoRestricoes();
    this.restricao = this.service.instantiateRestricao();
    this.lote = this.service.instantiateLote();
  }
  getEstados(){
    this.empresaService.getEstados().subscribe(
      res => {
        this.estados = res
      },
      error => {
        console.log("error",error)
      }
    );
  }
  addLote() {
    if (this.lote.NumeroLote != null
        && this.lote.DataVencimento != null){
      
      this.lote.IdProduto = this.anuncio.Produtos[0].IdProduto
      this.lote.IdAnuncio = this.anuncio.IdAnuncio
      this.anuncio.Lotes.push(this.lote)
      this.lote = this.service.instantiateLote();
        }
    
  }
  onChange($event){
    var toArray =  $event.target.value .split(":");
    this.selectedRest = toArray[1];
  }
  onChangeCategory(value, $event){
    var toArray =  value.split(":");
    this.getSubcategorieByID(toArray[1])
  }
  onChangeSubcategory(value,$event){
    var toArray =  value.split(":");
    this.auxSubCategoria  = toArray[1];
    this.productService.getCategorieById(this.auxSubCategoria).subscribe(res =>{
      this.auxSubCategoria = res
    })
    this.getSubcategoryName(this.auxSubCategoria )
  }
  validateNewRestrictions(){
    if(this.restricao.TipoRestricao != null && this.restricao.Valor != null){
      this.restricao.IdRestricao= String(this.restricoes.length+1);
      this.restricao.IdAnuncio= this.anuncio.IdAnuncio;
      delete this.restricao.Descricao;
      this.anuncio.Restricoes.push(this.restricao)
    }
  }
  excluirRest(restric, index){
          this.anuncio.Restricoes.splice(index, 1);
    
  }
  excluirLote(lote, index){
    this.anuncio.Lotes.splice(index, 1);

}
  getDate(date){
    var aux = date.split("T")    
        return aux[0]
  }
  update() {
    this.updating = true;
    this.anuncio.Produtos[0].ValorUnitarioDesconto = this.utils.stringToDecimal(
      this.desconto
    );
    this.anuncio.Produtos[0].ValorUnitarioOriginal = this.utils.stringToDecimal(
      this.preco
    );
   /* if(this.auxSubCategoria != 0 ){
      this.anuncio.Categoria = this.auxSubCategoria.IdCategoria
    }else{
      this.anuncio.Categoria = this.auxCategoria.IdCategoria
    }*/
    this.anuncio.Restricoes.forEach((element, index) => {
          delete element.Descricao      
          this.anuncio.Restricoes[index] = element
        }
    );
    
    this.anuncio.Restricoes = this.anuncio.Restricoes.concat(this.restricoes);
    this.anuncio.Lotes = this.anuncio.Lotes.concat(this.lotes);
    this.service.update(this.anuncio).subscribe(
      res => {
        if(res == true){
          swal("Sucesso", "Anúncio editado com sucesso!", "success");
          window.location.reload()
        }
        this.successMessage = 'Edição feita com sucesso';
        this.edit = false;
        this.updating = false;
        this.restricoes = [];
      },
      error => {
        console.log("error", error.error.Mensagem)
        this.errorMessage = error.errorMessage;
        this.edit = false;
        this.updating = false;
          this.loading_page=false
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
        }
      
    );
  }
  
  callProductService(){
    this.productService.getCategories().subscribe(res => {
      const data: any = res;
      for (const categorie of data) {
        this.categories.push(categorie);
      }
       this.getOnlyCategories(data)
      
      
    });
  }
  getOnlyCategories(data){
    
    var noSubcat = []
    var catPai=[]
    console.log("data",data)
    data.forEach(element => {
      if(element.IdCategoriaPai == null){
        this.onlyCategories.push(element)
      }
      this.subcategoriesprod.filter(element2=>{
        if(element2 == element.IdCategoria){
          this.onlysubcategories.push(element)
          if(catPai.indexOf(element.IdCategoriaPai) == -1){
            catPai.push(element.IdCategoriaPai)
          }  
        }      
       })
    });
   console.log("this.onlysubcategories",this.onlysubcategories)
   console.log("this.onlycategories",this.onlyCategories)
   console.log("catPai",catPai)
    this.onlyCategories=  this.onlyCategories.filter(val=> {
      if(catPai.indexOf(val.IdCategoria) != -1 ){
        return val
      };
    });
    console.log("this.onlyCategories",this.onlyCategories)
  }
  getSubcategorieByID(id: any){  
    
    this.productService.getSubCategories(id).subscribe(res => {
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
  getCategoryName(idCat:any){
    if(idCat != 0){
    this.categories.forEach(element => {
      if(element.IdCategoria === idCat){
        if(element.IdCategoriaPai == null){
          this.auxCategoria = element
          this.auxSubCategoria = null
        }else{
          this.auxSubCategoria = element
          this.categories.forEach(element2 => {
            if(element2.IdCategoria === this.auxSubCategoria.IdCategoriaPai){
              this.auxCategoria = element2
            }
          });
        }
        
      }
      
    });
    }else{
      console.log("Categoira 0", idCat)
    }
  }
  getSubcategoryName(id:any){
    this.subcategories.forEach(element => {
      if(element.IdCategoria === id){
        this.auxSubCategoria = element
      }
      
    });
  }
  onChangeRestr(value){
    
    var aux = value.split(":")
    this.selectedRest = aux[1]
    /*this.getTipoRes(aux[1])*/
  }
  openAddProductModal() {
    const modalRef = this.modalService.open(AddProductComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.anuncio = this.anuncio;
    modalRef.result.then(
      res => {
        if (res.updated) {
          this.anuncio = res.anuncio;
          this.getProducts();
        }
      },
      reason => {
        console.log(reason);
      }
    );
  }

  addRescricao() {
 
   if(this.restricao.TipoRestricao != null){
    if(this.anuncio.Restricoes.length>0){
      if(this.service.validateRepeatedRestriction(this.restricao.TipoRestricao,this.anuncio.Restricoes).length > 0){
        swal("Erro", "Você ja adicionou essa restrição", "error");
            
          }else{
            if(this.restricao.TipoRestricao == 3){
              if(this.service.validarCNPJ(this.restricao.Valor)){
                this.addRestrictionAftervalidation()
              }else{
                swal("Erro", "CNPJ inválido", "error");
              }
            }else{
              this.addRestrictionAftervalidation()
            }
            
          }
    }else{
      if(this.restricao.TipoRestricao == 3){
        if(this.service.validarCNPJ(this.restricao.Valor)){
          this.addRestrictionAftervalidation()
        }else{
          swal("Erro", "CNPJ inválido", "error");
        }
      }else{
        this.addRestrictionAftervalidation()
      }
    }
     
  }
  }
  addRestrictionAftervalidation(){
    if(this.restricao.TipoRestricao == 7 || this.restricao.TipoRestricao == 6 ){
      this.restricao.Valor = "sim"
    }
   // this.restricao.Valor = String(this.restricao.Valor)
     this.restricao.IdAnuncio = this.anuncio.IdAnuncio
    
    if(this.restricao.TipoRestricao == 4){
      this.getNameEstado(this.restricao.Valor)
    }
    this.anuncio.Restricoes.push(this.restricao);
    this.restricao = this.service.instantiateRestricao();
    this.validateNewRestrictions()
  }
  getNameEstado(id){
    this.estados.forEach(element => {
      if(id == element.IdEstado){
        this.NomeEstado = element.NomeEstado
      }
    });
  }
  openRemoveProdutoModal(product) {
    const modalRef = this.modalService.open(RemoveProductComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.produto = product;
    modalRef.componentInstance.anuncio = this.anuncio;
    modalRef.result.then(
      res => {
        if (res) {
          this.anuncio.Produtos = this.anuncio.Produtos.filter(obj => {
            return obj.IdProduto !== product.IdProduto;
          });
        }
      },
      reason => {
        console.log(reason);
      }
    );
  }
  getProducts() {
    this.products = [];
    for (const adProduct of this.anuncio.Produtos) {
      this.loading_produtos = true;
      this.productService.getById(adProduct.IdProduto).subscribe(
        productRes => {
          this.loading_produtos = false;
          const product = productRes as Produto;
          this.products.push(product);
          this.prodReserv = this.products
        },
        error => {
          this.loading_produtos = false;
        }
      );
    }
  }
  getAllProducts() {
    
      this.productService.getAll().subscribe(
        productRes => {
          this.loading_produtos = false;
          this.produtos = productRes
          this.AllProducts = productRes
          this.produtos.forEach(element => {
            if(this.subcategoriesprod.indexOf(element.Categoria) == -1){
              this.subcategoriesprod.push(element.Categoria)   
            }     
          });     
          this.callProductService()
        },
        error => {
          this.loading_produtos = false;
        }
      );
    
  }
  selectedCategory(item) {
    this.getSubcategorieByID2(Number(item.value));
    this.isCatSelected = false
  }
  getSubcategorieByID2(id: any){
    this.productService.getSubCategories(id).subscribe(res => {
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
  filterProductByCategory(id){
    //this.produtosCategoria =[];
      console.log('AllProducts', this.AllProducts)
     this.produtosCategoria= this.AllProducts.filter(element => {
        return element.Categoria == Number(id)
         
      }); 
    
  }
  onChangeSubcategroy(value){
    this.anuncio.Categoria = value
    console.log("valuecat ", value)
    this.filterProductByCategory(value)
    this.isCatSelected = true
  }
  hideProduto(){
    this.products =[]
  }
  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
  getTipoRes(id){
    this.descRes.forEach(tipoRegistricao => {
      if (tipoRegistricao.Id===id){
        /*this.auxForSelectRestricoes=tipoRegistricao.Descricao ;*/
      }
    });
  }
  selectedProduct(item) {
    this.anuncio.Produtos=[]
    var product = this.AllProducts.filter(element =>{
      return element.IdProduto == item
    });
    //swal('erro',"Lembre de atualizar a quantidade do produto e a unidade","error")
    this.anuncio.Produtos.push(product[0]) 
  }
}
