import { Router } from '@angular/router';
import { CarrinhoService } from './../providers/carrinho.service';
import { ProductService } from './../providers/product.service';
import { AuthService } from './../providers/auth.service'
import {
  AdvertisementService,
  Anuncio,
  AdProduct,
} from './../providers/advertisement.service';
import { Component, OnInit } from '@angular/core';
import { Product, Produto, Categoria } from '../providers/product.service';
import { IMAGES_URL } from '../app.api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { UserService } from './../providers/user.service';
import { EmpresaService } from './../providers/empresa.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { elementAt } from 'rxjs/operator/elementAt';
import { isArray } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Observable } from 'rxjs';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.scss'],
  providers: [NgbCarouselConfig]
})
export class VitrineComponent implements OnInit {
  ads: Anuncio[];
  filteredAds: Anuncio[];
  products: Produto;
  categories: any;
  subCategories: Categoria[] = [];
  loading_page = false;
  loading_sbcategorie = false;
  loading_images = false;
  images_url = IMAGES_URL;
  categoria: any;
  subcategories: any = [];
  search: string;
  idEmpresa: any;
  nomeEmpresa: any;
  empresa: any;
  user: any;
  indicators = false;
  auxCategory: any;
  allCategories: any;
  getThisCategory: any;
  getThisSubcategory: any;
  p: number = 1;
  anuncianteText: any = ''
  collection: any[] = [];
  containsCategoria: any[] = [];
  containsSubcategoria: any[] = [];
  EmpresaxEstado: any = []
  AdsWithStateRes: any = []
  AdsWithONGRes: any = []
  isAdmin = false
  isAdminPrefeitura = false
  subcategoriesAbsolute: any
  tmpFilteredAds: any = []
  subcategoria: any
  AdsWithONGconveniandaRes: any = [];
  seeAds = true
  Myempresa: Object;
  AuxiliarSubcategoria: any;
  isPessoaFisica: boolean;
  showMenu: boolean = true;
  isong: boolean;
  anunciantes: any;
  isAdvancedFilter = false
  isNotInteres = false
  later = false
  interesses = []
  setInteresses = false
  allinteresses: Observable<any[]>
  filtrarporinteresses: boolean
  isFIlteredByCat = false
  activeFilters: any = []
  filters = []
  isFilteredByText: boolean;
  selectedPeople1: any;
  loadingItems = false
  interessesString = ''
  constructor(
    public adServie: AdvertisementService,
    public productService: ProductService,
    public carrinhoService: CarrinhoService,
    public router: Router,
    public modalService: NgbModal,
    public userService: UserService,
    public empresaService: EmpresaService,
    public AuthService: AuthService,
    config: NgbCarouselConfig,
    private spinner: NgxSpinnerService
  ) {
    //config.showNavigationArrows = false;
    //config.showNavigationIndicators = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.loadingItems = true

    if (this.AuthService.isAuthenticated()) {
      this.callInteresses()
      this.callCategories()
      var id = "0"
      this.userService.getUserById(id).subscribe(res => {
        this.user = res
        console.log("user", this.user)
        if (this.user.Interesses == undefined) {
          this.isNotInteres = true
          this.loadingItems = false
        } else {
          if (this.user.Interesses.length > 0) {
            this.filtrarporinteresses = true
            this.loadingItems = false
            this.interesses = this.user.Interesses
            this.isNotInteres = false
            this.setInteresses = false
            this.selectedPeople1 = this.user.Interesses
            this.interesses = this.user.Interesses
            this.interesses.forEach(element => {
              this.interessesString += element.NomeInteresse + ',  '
            })
          } else {
            this.filtrarporinteresses = false
            this.isNotInteres = true
            this.loadingItems = false
          }

        }
        var aux: any = res
        if (aux.TipoUsuario == 2) {
          this.isAdmin = true
          this.showMenu = false
          this.router.navigate(['/admin'])
        } else {
          if (aux.TipoUsuario == 1) {
            this.isAdminPrefeitura = true
            this.showMenu = false
          } else {
            this.isAdmin = false
            this.isAdminPrefeitura = false
            if (aux.Enderecos.length > 0) {
              this.isPessoaFisica = true
              this.showMenu = false
            } else if (!this.isPessoaFisica) {
              this.getThisEmpresa()
            }


          }
          this.loading_page = true;
          this.loading_images = true;

          this.adServie.vitrine().subscribe(res => {
            var aux = res as Anuncio[];
            this.ads = aux
            this.collection = aux
            this.ads = this.ads.filter(ad => {
              this.ads.forEach(item => {
                this.idEmpresa = item.IdEmpresa
              });
              this.getAnunciante(this.idEmpresa)
              return ad.Produtos[0].QuantidadeEstoque > 0;
            });
            for (const ad of this.ads) {
              for (const produto of ad.Produtos) {
                const images = this.getImages(produto.IdProduto);
                images.then(resImages => {
                  produto.imagems = resImages;
                });
              }
            }
            this.filteredAds = this.ads;

            this.filterByInterest()
            this.getNumberAdsInCat(this.filteredAds)
            this.spinner.hide();
            this.loading_images = false;
            this.loading_page = false;

          },
            err => {
              if (err.status == 401) {
                localStorage.removeItem('appSaveAdd');
                window.location.reload();
              }
              console.log("error vitrine", err)
              this.spinner.hide();
            });

        }
      }, err => {
        if (err.status == 401 || err.status == 403) {
          localStorage.removeItem('appSaveAdd');
          window.location.reload();
        }
        this.spinner.hide();
      })
      this.getAllEmpresas()
    }
    if (localStorage.getItem('appSaveAdd') == null) {
      this.AuthService.logout()
      this.router.navigateByUrl('login')
    }


  }
  filterByAnunciantes(value) {
    var valuetmp = value.split(':')
    this.filters.splice(this.filters.map(function (e) { return e.nome; }).indexOf('Anunciante'), 1)
    if (value == "NULL") {
      this.filteredAds = this.ads

    } else {
      this.spinner.show()
      console.log("this.anunciantes valuetmp[1]", value)
      var isFilteredBy = this.anunciantes.filter(element => {
        if (element.IdEmpresa == value) {
          return element
        }
      })
      this.filters.push({ "nome": "Anunciante", "value": isFilteredBy[0].NomeEmpresa })
      this.isAdvancedFilter = false
      this.adServie.vitrineAnunciantes(value).subscribe(res => {
        var aux: any = res

        this.filteredAds = aux
        this.spinner.hide()
      })
    }
  }
  getAllEmpresas() {
    this.empresaService.listarAnunciantes().subscribe(res => {
      var aux: any = res
      this.anunciantes = aux
    }, err => {
      console.log("error", err)
    })
  }
  getThisEmpresa() {
    this.empresaService.getEmpresas().subscribe(res => {

      var aux: any = res
      if (Number(aux[0].TipoEmpresa) === 1 || Number(aux[0].TipoEmpresa) === 2) {
        this.isong = true
        this.showMenu = false
      }

    });
  }

  verMeusAnuncios() {
    this.seeAds = false
    this.loading_images = true;
    this.adServie.meusAnuncios().subscribe(res => {
      var aux: any = res
      this.filteredAds = aux
      this.ads = aux
      this.getNumberAdsInCat(this.filteredAds)
      for (const ad of this.filteredAds) {
        for (const produto of ad.Produtos) {
          const images = this.getImages(produto.IdProduto);
          images.then(resImages => {
            produto.imagems = resImages;
          });
        }
      }
      this.loading_images = false;

    })

  }
  selectedItem(event) {
    if (event.target.checked) {
      this.verMeusAnuncios()
    } else {
      this.verVitrine()
    }
  }
  verVitrine() {
    this.ads = this.collection
    this.seeAds = true
    this.filteredAds = this.ads
    this.getNumberAdsInCat(this.filteredAds)
  }


  async getImages(id_produto: string) {
    return await this.productService.getImages(id_produto).toPromise();
  }
  callInteresses() {
    this.allinteresses = this.productService.getInteresses()
  }
  callCategories() {
    this.productService.getCategories().subscribe(res => {
      this.getOnlyCategories(res);
      this.allCategories = res
    });
  }
  getOnlyCategories(categorias) {
    this.categories = categorias.filter(categoria => {
      return categoria.IdCategoriaPai == null
    })
    this.validateSubcategories(this.categories)
  }
  validateSubcategories(categories) {
    var aux: any = [];
    var aux2: any = []
    categories.forEach(element => {
      this.productService.getSubCategories(element.IdCategoria).subscribe(
        res => {

          var arr: any = res
          if (arr.length != 0) {
            aux.push(element)
          }
        }
      )
    });
    this.categories = aux
  }
  getNumberAdsInCat(arr) {
    var aux2: any = []
    var containsSubcategoria: any = null
    this.containsSubcategoria = []
    if (arr != undefined && arr.constructor === Array) {
      arr.forEach(element => {
        containsSubcategoria = this.containsSubcategoria.some(cont => {
          return cont.IdCategoria === element.Categoria
        })
        if (containsSubcategoria) {
          var aux = this.containsSubcategoria.findIndex(index => index.IdCategoria === element.Categoria)
          this.containsSubcategoria[aux].count = this.containsSubcategoria[aux].count + 1
        } else {
          var obj = { "IdCategoria": element.Categoria, "count": 1 }
          this.containsSubcategoria.push(obj)
        }
      })
    }
    this.getCountCategorias(this.containsSubcategoria)

  }
  getCountCategorias(arr) {
    var aux2: any = []
    var containsCategoria: any = null
    this.containsCategoria = []
    this.allCategories.forEach(element => {
      arr.forEach(ar => {
        if (ar.IdCategoria === element.IdCategoria) {
          containsCategoria = this.containsCategoria.some(cont => {
            return cont.IdCategoria === element.IdCategoriaPai
          })

          if (containsCategoria) {
            var aux = this.containsCategoria.findIndex(index => index.IdCategoria === element.IdCategoriaPai)
            var cont = arr.filter(index => { return index.IdCategoria === element.IdCategoria })

            this.containsCategoria[aux].count += cont[0].count
          } else {
            var obj = { "IdCategoria": element.IdCategoriaPai, "count": ar.count }
            this.containsCategoria.push(obj)

          } elementAt
        }
      });

    });
    this.containsCategoria.forEach(element => {
      if (element.IdCategoria != null) {
        var result = this.allCategories.filter(filter => { return filter.IdCategoria == element.IdCategoria })[0]

        if (result != undefined) {
          aux2.push(result)
        }

      }

    });
    this.categories = aux2
  }
  orderby(value) {
    var valuetmp = value.split(':')
    this.spinner.show()
    this.adServie.vitrineOrderBy("A").subscribe(res => {
      var aux: any = res
      this.filteredAds = aux
      console.log("res order by", res)
      this.spinner.hide()
    })
  }
  filterByCat(value, type) {
    var valuetmp = value.split(':')
    switch (type) {
      case 'categoria':
        if (value != 'null') {
          this.filtrarporinteresses = false
          this.setInteresses = false
          this.isFIlteredByCat = true
          this.spinner.show()
          console.log("filterbycat", valuetmp[1])
          this.adServie.vitrineByCat(valuetmp[1]).subscribe(res => {
            var aux: any = res
            this.filteredAds = aux
            console.log("res cate", res)
            this.getNumberAdsInCat(this.filteredAds)
            this.updateFilter(valuetmp[1])
            var isFilteredBy = this.categories.filter(element => {
              if (element.IdCategoria == valuetmp[1]) {
                return element
              }
            })
            this.filters.push({ "nome": "Categoria", "value": isFilteredBy[0].NomeCategoria })
            this.spinner.hide()
          })

        } else {
          this.subcategoria = null
          this.filteredAds = this.ads
          this.getNumberAdsInCat(this.filteredAds)
          this.setInteresses = true
          this.filters.splice(this.filters.map(function (e) { return e.nome; }).indexOf('Categoria'), 1)
          this.filters.splice(this.filters.map(function (e) { return e.nome; }).indexOf('Subcategoria'), 1)

        }
        break;
      case 'subcategoria':
        this.spinner.show()
        this.adServie.vitrineByCat(valuetmp[1]).subscribe(res => {
          var aux: any = res
          this.filteredAds = aux
          console.log(" filteredAds sub", aux)
          this.getNumberAdsInCat(this.filteredAds)
          //this.filters.push({"nome":"Subcategoria","value":aux.NomeCategoria})
          this.spinner.hide()
        })
        this.filtrarporinteresses = false
        this.isFIlteredByCat = true
        console.log("valuetmp[1]", valuetmp[1])
        var isFilteredBy = this.allCategories.filter(element => {
          if (element.IdCategoria == valuetmp[1]) {
            return element
          }
        })
        console.log("isFilteredBy", isFilteredBy)
        this.filters.push({ "nome": "Subcategoria", "value": isFilteredBy[0].NomeCategoria })
        this.isAdvancedFilter = false
        //this.selectedSubcategoria(valuetmp[1])
        break;
      case 'null':

        break;
    }
  }
  filterText() {
    var query = this.search
    console.log('query', this.search)
    if (query != undefined && query.length > 0) {
      this.isFilteredByText = true
      var toLower = query.toLowerCase();
      this.filteredAds = this.filteredAds.filter(ad => {
        var adToLowe = ad.Titulo.toLowerCase()
        return adToLowe.includes(toLower);
      });
    } else {
      this.restoreFilters(false)
      this.isFilteredByText = false
    }
  }
  getPercentDescount(Origin, Descount) {
    return Math.round((Descount - Origin) * 100 / Origin)
  }
  checkForImages(product: AdProduct) {
    if (product.imagems) {
      if (product.imagems.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  isDuplicated(anuncio: Anuncio) {
    var carrinho = this.carrinhoService.getCarrinho();
    var aux = []
    carrinho.forEach(anun => {
      if (Array.isArray(anun)) {
        anun.forEach(an => {
          if (an.IdAnuncio == anuncio.IdAnuncio) {
            aux.push(an)

          }
        })
      } else {
        if (anun.IdAnuncio == anuncio.IdAnuncio) {
          aux.push(anun)
        }
      }

    })
    if (aux.length > 0) {
      swal('Erro', 'Você já adicionou este item', 'error')
      return true

    } else {
      return false
    }
  }

  adicionaCarrinho(anuncio: Anuncio) {
    if (!this.isDuplicated(anuncio)) {
      var aux = this.carrinhoService.getCarrinho();
      var noHasElementInArray: any = [];
      if (aux.length > 0) {
        aux.forEach((element, index) => {
          if (Array.isArray(element)) {
            if (element.some(e => e.IdEmpresa === anuncio.IdEmpresa)) {
              var tmp = aux[index]
              this.carrinhoService.removeDoCarrinho(index);
              var arrAux: any = [];
              tmp.push(anuncio)
              this.carrinhoService.adicionaCarrinho(tmp)
            } else {
              noHasElementInArray.push("no")
            }
          } else {
            if (element.IdEmpresa === anuncio.IdEmpresa) {
              var tmp = element
              this.carrinhoService.removeDoCarrinho(index);
              var aux2: any = [];
              aux2.push(tmp)
              aux2.push(anuncio)

              this.carrinhoService.adicionaCarrinho(aux2)
            } else {
              noHasElementInArray.push("no")
            }
          }
        });
      } else {
        //this.carrinhoService.adicionaCarrinho(anuncio);
      }
      if (aux.length == noHasElementInArray.length) {
        this.carrinhoService.adicionaCarrinho(anuncio);
      }
    }
  }
  aceitar(anuncio: Anuncio) {
    this.carrinhoService.adicionaCarrinho(anuncio);
    this.router.navigate(['/carrinho']);
  }

  updateFilter(categoria) {
    this.subcategories = []
    this.loading_sbcategorie = true
    this.productService.getSubCategories(categoria).subscribe(
      res => {
        var aux: any = res
        this.subcategoriesAbsolute = res
        this.containsSubcategoria.forEach(element => {
          var aux2 = aux.filter(filt => { return filt.IdCategoria == element.IdCategoria })
          if (aux2.length > 0) {
            this.subcategories.push(element)
          }
        });
        //this.subcategories = res
        this.loading_sbcategorie = false
      }
    )
  }
  getNomeCategoria(id) {
    var aux = this.subcategoriesAbsolute.filter(filter => { return filter.IdCategoria == id })
    return aux[0].NomeCategoria
  }
  selectedSubcategoria(categoria) {
    //var aux = categoria.split(":")
    if (categoria != undefined) {
      this.filteredAds = this.filteredAds.filter(ad => {
        return ad.Categoria === Number(categoria);
      });
    }
  }
  restoreFilters(issubca) {
    console.log('my empresa', this.Myempresa)
    if (this.seeAds == false) {
      this.verMeusAnuncios()
    } else {
      this.filteredAds = this.collection
    }

    if (issubca) {
      this.AuxiliarSubcategoria = this.collection
    }
    this.getNumberAdsInCat(this.AuxiliarSubcategoria)
  }
  getCategoria(id_categoria) {
    for (const categoria of this.allCategories) {
      if (categoria.IdCategoria === id_categoria) {
        this.auxCategory = categoria.NomeCategoria;
        return categoria.NomeCategoria;
      }
    }
  }

  formatValue(value) {
    var valor: any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }

  detalhes(anuncio, i, seeAds) {
    const modalRef = this.modalService.open(DetalhesComponent, { size: 'lg' });
    modalRef.componentInstance.anuncio = anuncio;
    modalRef.componentInstance.seeAds = seeAds;

  }
  getAnunciante(id) {
    this.empresaService.getEmpresaById(id).subscribe(
      res => {
        this.empresa = res
        this.nomeEmpresa = this.empresa.NomeEmpresa
        return this.empresa
      }
    )
  }
  FiltrosAvancados() {
    console.log("isAdvancedFilter", this.isAdvancedFilter)
    console.log("isNotInteres", this.isNotInteres)
    this.isAdvancedFilter = true
  }
  OcultarFiltros() {
    this.isAdvancedFilter = false
    this.setInteresses = false
  }
  forlater() {
    this.later = true
  }
  removeInteresse(item) {
    var aux = this.interesses.map(function (e) { return e.IdInteresse; }).indexOf(item.IdInteresse);
    this.interesses.splice(aux, 1);
  }
  addInteresses(item) {
    console.log("indexof", this.interesses.map(function (e) { return e.IdInteresse; }).indexOf(item.IdInteresse))
    if (this.interesses.map(function (e) { return e.IdInteresse; }).indexOf(item.IdInteresse) == -1) {
      this.interesses.push(item)
    }
    this.interessesString = ''
  }
  informarInteresses() {
    this.setInteresses = true
    this.later = true
    this.isAdvancedFilter = true
  }
  updateUser() {
    this.spinner.show()
    this.user.Interesses = this.interesses
    console.log("Interesses", JSON.stringify(this.user))
    this.userService.update(this.user).subscribe(res => {
      swal('Sucesso', 'Interesses salvos com sucesso', 'success')
      this.spinner.hide()
      this.ngOnInit()
    }, error => {
      this.spinner.hide()
      swal('Erro', 'Interesses não foram salvos ' + error.error.Mensagem, 'error')
    })
  }
  limparFiltros() {
    this.filteredAds = this.collection
    this.filters = []
    this.categoria = 0
    this.subcategoria = null
    this.anuncianteText = 'NUll'
    this.isFIlteredByCat = false

  }
  filterByInterest() {

    if (this.user.Interesses.length > 0) {
      if (this.filtrarporinteresses) {
        this.spinner.show()
        this.adServie.vitrineByInterest().subscribe(res => {
          var response: any = res
          this.filteredAds = response
          if (this.isFilteredByText) {
            this.filterText()
          }
          this.isAdvancedFilter = false
          this.spinner.hide()
        })
      } else {
        this.filteredAds = this.collection
        console.log("isFilteredByText", this.isFilteredByText)
        if (this.isFilteredByText) {
          this.filterText()
        }
      }
    }

  }
}
