import { UtilsService } from './../../shared/utils.service';
import { Router } from '@angular/router';
import { EmpresaService } from './../../providers/empresa.service';
import {
  AdvertisementService,
  Advertisement,
  AdProduct,
  AdRestriction,
  TipoRestricao,
  AdLote
} from './../../providers/advertisement.service';
import { AuthService } from './../../providers/auth.service';
import { ProductService } from './../../providers/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable  } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of as of } from 'rxjs/observable/of';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  tap,
  switchMap,
  catchError
} from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FileHolder } from 'angular2-image-upload';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import { masks } from './../../masks';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.scss']
})
export class NovoComponent implements OnInit {
  masks = masks;
  ad: Advertisement;
  adProduct: AdProduct;
  categories: any[] = [];
  rawProduct: any = null;
  saved = false;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  empresa_id: string;
  saving = false;
  unidades: string[] = ['Kg', 'Unidade', 'Pacote', 'Caixa', 'Litro','m²','Saco'];
  restricao: AdRestriction;
  auxLote:any =null;
  lote:AdLote;
  lotes: AdLote[]=[];
  restricoes: AdRestriction[] = [];
  tipoRestricoes: TipoRestricao[] = [];
  preco: string;
  desconto: string;
  focusProduct = new Subject<string>();
  clickProduct = new Subject<string>();
  category: any = null;
  subcategory:any =null;
  swal: any;
  selectedRest:any;
  estados:any;
  subcategories:any;
  onlyCategories:any[]=[];
  productUpdate:any;
  NomeEstado;
  produtos:any;
  produtosCategoria:any[] = [];
  raw_product:any;
  isCatSelected = false
  @ViewChild('categoryThInstance') categoryThInstance: NgbTypeahead;
  @ViewChild('producTypehead') productThInstance: NgbTypeahead;

  numberMask = createNumberMask({
    prefix: 'R$ ',
    decimalSymbol: ',',
    allowDecimal: true,
    thousandsSeparatorSymbol: '.'
  });

  public success = new Subject<string>();
  successMessage: string;
  errorMessage: string;
  searching = false;
  searchFailed = false;
  searching_products = false;
  subcategoriesprod:any = []
  batch_number: string = null;
  batch_expire_date: string = null;
  onlysubcategories =[]
  hideSearchingWhenUnsubscribed = new Observable(() => () =>
    (this.searching = false)
  );
  empresa:any = ''
  category_formatter = (x: { NomeCategoria: string }) => x.NomeCategoria;
  product_formatter = (x: { NomeProduto: string }) => x.NomeProduto;
  cpfMask: (string | RegExp)[];
  selectedProd: boolean;

  constructor(
    public auth: AuthService,
    public adService: AdvertisementService,
    public productService: ProductService,
    public empresaService: EmpresaService,
    public router: Router,
    public utils: UtilsService
  ) {
    // this.quantidate = Array(100)
    //   .fill(0)
    //   .map((x, i) => i);
    // console.log(this.quantidate);
    moment.locale('pt-BR');
    this.ad = {
      title: null,
      type: 1,
      batches: null,
      products: null,
      category: null,
      description: null,
      end_date: null,
      start_date: null,
      IdEmpresa: null,
      restrictions: null,
      lotes:null
    };
  }

  ngOnInit() {
    this.empresaService.getEmpresas().subscribe(res => {
      // console.log(res[0]);
      this.empresa_id = res[0].IdEmpresa;
      this.empresa = res
      this.hasie()
      // console.log(this.empresa_id);
      if(this.empresa[0].FormasPagamento.length == 0) {
        //this.router.navigate(['/anuncios'])
        swal('erro',"Por favor adicione as formas de pagamento antes de criar os anuncios",'error')
        .then((willDelete) => {
          if (willDelete) {
            this.router.navigate(['anuncios'])
          } 
        });
        //swal("Erro", "Por favor adicione as formas de pagamento antes de criar os anuncios", "error");
        //this.router.navigate(['vitrine'])
      }
    });
    this.getEstados()
    
    this.productService.getAll().subscribe(res =>{
      this.produtos = res
      this.produtos.forEach(element => {
        if(this.subcategoriesprod.indexOf(element.Categoria) == -1){
          this.subcategoriesprod.push(element.Categoria)   
         }     
      });     
      this.callProductService() 
      console.log("subcategoriesprod",this.subcategoriesprod)
    })
    
    this.adProduct = this.adService.instantiateProduct();

    this.success.pipe(debounceTime(4000)).subscribe(() => {
      this.successMessage = null;
      this.router.navigate(['/anuncios']);
    });
    
    this.success.subscribe(message => (this.successMessage = message));
    this.tipoRestricoes = this.adService.getTipoRestricoes();
    this.restricao = this.adService.instantiateRestricao();
    this.lote= this.adService.instantiateLote();
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
  selectedCategory(item) {
    this.getSubcategorieByID(Number(item.value));
    this.isCatSelected = false
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
  hasie() {
    console.log("this.empresa",this.empresa)
    if(this.empresa[0].InscricaoEstadual == "") {
      swal('erro','Empresa informada não pode incluir anúncios pois não possui Inscrição Estadual','error')
      .then((willDelete) => {
        if (willDelete) {
          this.router.navigate(['anuncios'])
        } 
      });
      //swal("Erro", "Empresa informada não pode incluir anúncios pois não possui Inscrição Estadual", "error");
      
    } else {
      //this.router.navigate(['/anuncios/novo'])
    }
  }
  filterProductByCategory(id:any){
    this.produtosCategoria =[];
    this.produtos.forEach(element => {
      if(element.Categoria == id){
        this.produtosCategoria.push(element)
        
      }
    });
  }
  
  getSubcategorieByID(id: any){
    /*this.productService.getSubCategories(id).subscribe(res => {
      const data: any = res;
      if(res != []){
        this.subcategories = data;    
      }else{
        this.subcategories = null;
      }
        
    },
    error => { this.subcategories = null }
    )  */
    this.subcategories = this.onlysubcategories.filter(cat=>{
      if(cat.IdCategoriaPai == id){
        return cat
      }
    })
  }


  saveAd() {
    this.ad.products = [];
    this.ad.IdEmpresa = this.empresa_id;
    this.adProduct.ValorUnitarioDesconto = this.utils.stringToDecimal(
      this.adProduct.ValorUnitarioDesconto
    );
    this.adProduct.ValorUnitarioOriginal = this.utils.stringToDecimal(
      this.adProduct.ValorUnitarioOriginal
    );
    
    this.ad.products.push(this.adProduct);
    if(this.restricoes.length != 0){
      this.ad.restrictions = [];
      this.restricoes.forEach(restricao => {
      const restrict:AdRestriction = {
        Valor: restricao.Valor,
        TipoRestricao: restricao.TpRestricao.Id
      };
      this.ad.restrictions.push(restrict);
    });
    }else{
      this.ad.restrictions = [];
    }
    if(this.lotes.length != 0){
      this.ad.lotes=[];
        this.lotes.forEach((lote,index) =>{
          const loteaux:AdLote = {
            NumeroLote: lote.NumeroLote,
            DataVencimento: lote.DataVencimento,
            IdProduto: this.ad.products[0].IdProduto
          };
          this.ad.lotes.push(loteaux)
         /* if(lote.IdProduto == product.IdProduto){
             this.productService.getById(lote.IdProduto).subscribe(res=>{
               this.productUpdate =res
               this.productUpdate.Lotes = lote
               this.updateProduct(this.productUpdate);
             })
            
          }*/
        }) 
    }
    this.ad.category = Number(this.ad.category)
    this.saving = true;
    if (moment(this.ad.start_date).isSameOrAfter(moment().format("YYYY-MM-DD"))){
      
      this.adService.createAd(this.ad).subscribe(
        res => {
          this.saved = true;
          if (!this.successMessage) {
            swal("Sucesso", "Anúncio Cadastrado com Sucesso!", "success");
            this.router.navigate(['anuncios'])
          }
        },
        error => {
          console.log(error)
          swal("Erro", error.error.Mensagem, "error");
        }
      )
    }else{
      swal("Erro", "A data não pode ser anterior a hoje", "error");
    }
  }
  updateProduct(prod){
    this.productService.update(prod).subscribe(res=>{
    })
  }
  removeLote(lote,index){
    this.lotes.splice(index, 1);
  }
  onChangeRest($event){
    var toArray =  $event.target.value .split(":");
    this.selectedRest = toArray[0];
    this.restricao.TipoRestricao = this.selectedRest
    this.restricao.Descricao = this.getNameRest(this.selectedRest)
  }
  onChange($event){
    var toArray =  $event.target.value .split(":");
    this.selectedRest = toArray[1];
    this.ad.category = toArray[0];
  }
  onChangeCategory($event){
    var toArray =  $event.target.value .split(":");
    this.ad.category = toArray[1];
  }
  onChangeSubcategroy(value){
    /*var toArray =  $event.target.value .split(":");*/
    this.ad.category = value.value
    this.filterProductByCategory(value.value)
    this.isCatSelected = true
  }
  selectedProduct(item) {
    this.productService.getById(item).subscribe(res=>{
       this.raw_product = res;
       this.selectedProd = true
      this.adProduct.IdProduto = this.raw_product.IdProduto;
    }) 
    
  }

  addRescricao() {
    if (this.restricao.TpRestricao.Id != null){
        if(this.restricoes.length>0){
          if(this.adService.validateRepeatedRestriction(this.restricao.TipoRestricao,this.restricoes).length > 0){
            swal("Erro", "Você ja adicionou essa restrição", "error");
            
          }else{
            if(this.restricao.TpRestricao.Id == 3){
              if(this.adService.validarCNPJ(this.restricao.Valor)){
                this.addRestrictionAftervalidation()
              }else{
                swal("Erro", "CNPJ inválido", "error");
              }
            }else{
              this.addRestrictionAftervalidation()
            }
            
          }
        }else{
          if(this.restricao.TpRestricao.Id == 3){
            if(this.adService.validarCNPJ(this.restricao.Valor)){
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
  excluirRest(restric, index){
    this.restricoes.splice(index, 1);
}
  addRestrictionAftervalidation(){
    if(this.restricao.TpRestricao.Id == 7 || this.restricao.TpRestricao.Id == 6){
      this.restricao.Valor = "sim"
    }
    if(this.restricao.TpRestricao.Id == 4){
      this.getNameEstado(this.restricao.Valor)
    }
    
    this.restricoes.push(this.restricao);
    this.restricao = this.adService.instantiateRestricao();
  }
  addLote() {
    if (this.lote.NumeroLote != null
        && this.lote.DataVencimento != null){
      
      this.lote.IdLote = String(this.lotes.length +1)
      this.lote.IdProduto = this.adProduct.IdProduto
      this.lotes.push(this.lote)
      this.lote = this.adService.instantiateLote();
      
    }
  }
  getNameRest(id):any{
    this.restricoes.forEach(element => {
      if(element.IdRestricao == id){
        return element.Descricao
      }
    });
  }

  /*searchCategory = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      merge(this.focus$),
      merge(
        this.click$.pipe(filter(() => !this.categoryThInstance.isPopupOpen()))
      ),
      map(term =>
        (term === ''
          ? this.onlyCategories
          : this.onlyCategories.filter(
              v =>
                v.NomeCategoria.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );*/

  onUploadFinished(file: FileHolder) {
    /*console.log(file);*/
  }

  onRemoved(file: FileHolder) {
    /*console.log(file);*/
  }

  onUploadStateChanged(state: boolean) {
    /*console.log(state);*/
  }
  getNameEstado(id){
    this.estados.forEach(element => {
      if(id == element.IdEstado){
        this.NomeEstado = element.NomeEstado
      }
    });
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
}
