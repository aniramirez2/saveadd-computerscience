import {
  ProductService,
  Product,
  Codigo,
  Fabricante,
  Lote,
  Produto
} from './../../providers/product.service';
import { UserService } from './../../providers/user.service';
import { EmpresaService } from './../../providers/empresa.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbTypeahead, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-novo-produto',
  templateUrl: './novo-produto.component.html',
  styleUrls: ['./novo-produto.component.scss']
})
export class NovoProdutoComponent implements OnInit {
  model: any;
  model2: any;
  categories: any[] = [];
  codigos: Codigo[] = [];
  fabricantes: Fabricante[] = [];
  lote: Lote;
  lotes: Lote[] = [];
  fabricante: Fabricante;
  category: any = null;
  subcategories: any = null;
  saving = false;
  hasSubcategory: boolean = false;
  product: Product = {
    name: null,
    category: null,
    description: null,
    manufacturer: null,
    code: null,
    code_type: null,
    codigoInterno: null,
    Fabricante: {
      NomeFabricante: null
    },
    CodigoBarras: [
      {
        Codigo: null,
        TipoCodigoBarras: null
      }
    ],
    Lotes: []
  };

  onlyCategories: any[] = [];
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('thFabricante') thFabricante: NgbTypeahead;
  @ViewChild('rawFabricante') rawFabricante: ElementRef;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  focusFabricante = new Subject<string>();
  clickFabricante = new Subject<string>();

  public success = new Subject<string>();
  successMessage: string;
  tipos_codigo = [
    { "id": 1, "nome": 'EAN 13' },
    { "id": 2, "nome": 'DUN' },
    { "id": 3, "nome": 'Data Bar' },
    { "id": 4, "nome": '128' },
    { "id": 5, "nome": 'ITF' },
    { "id": 6, "nome": 'Data Matrix' }
  ];

  /* search = (text$: Observable<string>) =>
     text$.pipe(
       debounceTime(200),
       distinctUntilChanged(),
       merge(this.focus$),
       merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))),
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
  nc: any = null;
  ns: any = null;
  newCategoria = {}
  newSubcategoria = {}
  usario: any
  empresa: any;
  constructor(
    public producService: ProductService,
    public router: Router,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public user: UserService,
    public empresaservice: EmpresaService
  ) {
    if (!this.fabricante) {
      this.fabricante = this.producService.instantiateFabricante();
    }
    this.lote = this.producService.instantiateLote();
  }

  ngOnInit() {
    this.empresaservice.getEmpresas().subscribe(res => {
      this.empresa = res
      console.log("this.empresa", this.empresa)
      if (this.empresa[0].InscricaoEstadual) {
        this.router.navigate(['/produtos/novo'])
      } else {
        swal("Erro", "Empresa informada não pode incluir produtos pois não possui Inscrição Estadual", "error");
        this.router.navigate(['vitrine'])
      }
    })

    var onlysubcategories = []
    this.user.getUserById('0').subscribe(res => {
      var aux: any = res
      this.usario = aux.user_id
    })
    this.producService.getCategories().subscribe(res => {
      const data: any = res;
      for (const categorie of data) {
        this.categories.push(categorie);
      }
      data.forEach(element => {
        if (element.IdCategoriaPai == null) {
          this.onlyCategories.push(element)
        }
      });
      data.forEach(element => {
        if (element.IdCategoriaPai != null && !onlysubcategories.includes(element.IdCategoriaPai)) {
          onlysubcategories.push(element.IdCategoriaPai)
        }
      });
      console.log(`onlysubcategories`, onlysubcategories)
      this.onlyCategories = this.onlyCategories.filter(function (val) {
        if (onlysubcategories.includes(val.IdCategoria)) {
          return val
        };
      });
      this.getSubcategories();
    });



    this.producService.getFabricantes().subscribe(res => {
      this.fabricantes = res as Fabricante[];
    });

    this.success
      .pipe(debounceTime(4000))
      .subscribe(() => (this.successMessage = null));
    this.success.subscribe(message => (this.successMessage = message));
  }

  getSubcategories() {
    this.categories.forEach((element, index) => {
      this.producService.getSubCategories(element.IdCategoria).subscribe(res => {
        const data: any = res;
        this.categories[index].Subcategories = data;
      });
    });
  }
  getSubcategorieByID(id: any) {
    this.producService.getSubCategories(id).subscribe(res => {
      const data: any = res;
      if (res != []) {
        this.subcategories = data;
        this.spinner.hide()
      } else {
        this.subcategories = null;
        this.spinner.hide()
      }

    },
      error => {
        this.subcategories = null
        this.spinner.hide()
      }
    )

  }
  newFabricante(name) {
    if (name) {
      this.fabricante = name;
      this.hasSubcategory = true
    } else {
      this.fabricante = null;
    }
  }
  saveNewCat() {
    if (this.showNewCat == true) {
      this.newCategoria = { NomeCategoria: this.nc, IdCategoriaPai: 'NULL' }
      this.newSubcategoria = { NomeCategoria: this.ns, IdCategoriaPai: 'NULL' }
    } else if (this.showNewCat == false && this.showNewSub == true) {
      this.newSubcategoria = { NomeCategoria: this.ns, IdCategoriaPai: this.category }
    }
    this.showNewCat = false
    this.showNewSub = false
    swal({
      icon: "success",
      text: "Sua sugestão de categoria/subcategoria será analisada e atualizada automaticamente, em caso de ser aprovada. Agradecemos a ajuda!",
      title: "Sucesso"
    });
  }

  saveSubcategory(value) {
    var aux = value.split(":");
    if (value == "ns") {
      this.showNewSub = true
    } else {
      this.product.category = Number(aux[1]);
      this.setHasTrue()
    }
  }
  setHasTrue() {
    this.hasSubcategory = true
  }
  onChangeCodigo(value) {
    var aux = value.split(":")
    this.product.CodigoBarras[0].TipoCodigoBarras = Number(aux[1])


  }
  createProduct() {
    this.product.CodigoBarras[0].Codigo = this.product.code
    if (this.fabricante) {
      this.product.Fabricante = this.fabricante;
    } else {
      this.product.Fabricante = this.producService.instantiateFabricante();
      this.product.Fabricante.NomeFabricante = this.rawFabricante.nativeElement.value;
    }
    this.product.Lotes.push(this.lote);
    this.saving = true;
    console.log("prod before update", this.product)
    if (this.product.Fabricante.NomeFabricante != null) {
      this.producService.createProduct(this.product).subscribe(
        res => {
          const resProduto = res as Produto;
          this.saving = false;
          this.router.navigate(['produtos/view', resProduto.IdProduto]);
          if (!this.successMessage) {
            this.success.next('O produto foi adicionado');

          }
        },
        () => {
          this.saving = false;
        }
      );
    } else {
      swal('Erro', 'Por favor adicione um fabricante', 'error')
      this.saving = false;
    }
  }

  selectedCategory(item) {
    console.log("value", item)
    if (item == "nc") {
      this.showNewCat = true

    } else {
      this.spinner.show()
      var arr = item.split(":")
      this.category = arr[1];
      this.getSubcategorieByID(arr[1]);
    }
  }

  selectFabricante(item) {
    this.fabricante = item.item;
  }
}
