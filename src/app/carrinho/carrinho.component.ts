import { IMAGES_URL } from './../app.api';
import { AuthService } from './../providers/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Anuncio } from '../providers/advertisement.service';
import { CarrinhoService } from '../providers/carrinho.service';
import { EmpresaService } from '../providers/empresa.service';
import { UserService } from '../providers/user.service';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { forEach } from '@angular/router/src/utils/collection';
import { join } from 'path';
var swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  anuncios: Anuncio[];
  anuncios_checkout = [];
  checking_out = false;
  /*swal: any;*/
  empresas: any;
  checking_out2 = false;
  formas_pagamento: any;
  forma_pagamento: any =null;
  arrayFormaPagamento:any= [];
  entrega: any;
  estoque: string;
  empresa_selecionada: any;
  images_url = IMAGES_URL;
  errorMessage: any =[];
  ErrorMsg: any;
  empresa:any;
  observacoes:any;
  maxValue :any= null;
  loading_page = false;
  hasRestriction:any =[];
  hasValidatedRetrictions:any =[];
  restricaoIsOK:any =[];
  disabledFinal = false
   aux1:any = false
   aux2:any = false
  total: number;
  empresasByAnuncio:any =[];
  finished= false
  infoUser: any ={};
  totalEmpresa:any=[]
  showFaltante: boolean = false;
  showDadosBancarios: any = false
  dadosBancariosArray: any = []
  empresasTransferOuDeposito:any=[]
  empresaDadosBancarios:any =''
  faltante: number = 0;
  fisrtEmpresa: any;
  pedido: any = ""
  pedidos:any =[]
  formaPagamentoDefault: any;
  minValue: any = null;
  users:any=[]
  constructor(
    public service: CarrinhoService,
    public router: Router,
    public auth: AuthService,
    public empresaService: EmpresaService,
    public modalService: NgbModal,
    public UserService: UserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.anuncios = this.service.getCarrinho();
    this.anunciosChecking()
    this.getFormasPagamento()
    this.getEmpresas()
    this.getThisEmpresa()
    this.getInfoUser(0)
  }

  validateArray(arr) {
    return Array.isArray(arr)
  }

  verifyMaxRestriction(anuncio) {
    anuncio.Restricoes.forEach(element => {
      if (element.TipoRestricao == 2) {
        this.maxValue = element.Valor
      }
      if (element.TipoRestricao == 1) {
        this.minValue = element.Valor
      }
    })
  }

  check() {
    this.disabledFinal = true
    if (this.empresas.length != 0) {
      this.checking_out = true;
      this.checking_out2 = true;
    }
  }

  getMaxQuantity(anuncio, value): any {
    this.verifyMaxRestriction(anuncio)
    if (this.maxValue == null) {
      if (Number(value) > anuncio.Produtos[0].QuantidadeEstoque) {
        if (this.empresas.length != 0) {
          this.disabledFinal = true
        }
        swal("Erro", `Quantidade Máxima no anúncio ${anuncio.Titulo}  atingida, só tem 
      ${anuncio.Produtos[0].QuantidadeEstoque} no estoque`, "error");
      }
    } else {
      if (Number(value) > Number(this.maxValue)) {
        swal("Erro", `Quantidade máxima no anúncio  ${anuncio.Titulo},é ${this.maxValue}`, "error");
      }
      if (Number(this.maxValue) < anuncio.Produtos[0].QuantidadeEstoque) {
        if (Number(value) > Number(this.maxValue)) {
          swal("Erro", `Quantidade Máxima no anúncio ${anuncio.Titulo}  atingida, com restrição de 
          ${this.maxValue}`, "error");
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
        }
      } else {
        if (Number(value) > anuncio.Produtos[0].QuantidadeEstoque) {
          swal("Erro", `Quantidade Máxima no anúncio ${anuncio.Titulo}  atingida, só tem 
          ${anuncio.Produtos[0].QuantidadeEstoque} no estoque`, "error");
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
        }

      }
    }

    if (this.minValue != null) {
      if (Number(value) < Number(this.minValue)) {
        swal("Erro", `Quantidade mínima no anúncio  ${anuncio.Titulo},é ${this.minValue}`, "error");
      }
    }
  }

  anunciosChecking() {
    this.anuncios.forEach((an, index) => {
      if (Array.isArray(an)) {
        var aux: any = []
        an.forEach((anuncio, i) => {
          const anuncio_checkout = {
            IdAnuncioProduto: anuncio.Produtos[0].IdProduto,
            Quantidade: anuncio.Quantidade ? anuncio.Quantidade : 1,
            ValorUnitario: anuncio.Produtos[0].ValorUnitarioOriginal,
            ValorDesconto: anuncio.Produtos[0].ValorUnitarioDesconto,
            IdAnuncio: anuncio.IdAnuncio,
            IdLote: null,
            TotalProd: 0
          }
          aux.push(anuncio_checkout)
        })
        this.anuncios_checkout.push(aux);

      } else {
        const anuncio_checkout = {
          IdAnuncioProduto: an.Produtos[0].IdProduto,
          Quantidade: an.Quantidade ? an.Quantidade : 1,
          ValorUnitario: an.Produtos[0].ValorUnitarioOriginal,
          ValorDesconto: an.Produtos[0].ValorUnitarioDesconto,
          IdAnuncio: an.IdAnuncio,
          IdLote: null,
          TotalProd: 0
        }
        this.anuncios_checkout[index] = anuncio_checkout;
      }
    })
    this.setRestricoes()
  }

  setRestricoes() {
    this.anuncios.forEach((anuncio, j) => {
      if (Array.isArray(anuncio)) {
        anuncio.forEach((an, i) => {
          this.getValueRestricao(an, j, i)
        })
      } else {
        this.getValueRestricao(anuncio, j, null)
      }
    })
    this.getTotalProd()
  }

  getFormasPagamento() {
    this.service.getFormasPagamento().subscribe(res => {
      this.formas_pagamento = res;
      //this.formaPagamentoDefault = this.formas_pagamento[0].IdFormaPagamento
    }, error => {
      if (error.status == 401 || error.status == 403) {
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
  }

  getEmpresas() {
    this.empresaService.getEmpresas().subscribe(res => {
      this.empresas = res;
      this.fisrtEmpresa = this.empresas[0]
      if (this.fisrtEmpresa == undefined) {
        this.entrega = this.infoUser.Enderecos[0]

      } else {
        this.entrega = this.fisrtEmpresa.Enderecos[0]
        this.empresa_selecionada = this.empresas[0]
      }
    })
  }

  getThisEmpresa() {
    this.anuncios.forEach((element, index) => {
      if (Array.isArray(element)) {
        this.empresaService.getEmpresaById(element[0].IdEmpresa).subscribe(res => {
          this.empresasByAnuncio[index] = res;
          this.formaPagamentoDefault = this.empresasByAnuncio[index].FormasPagamento[0].IdFormaPagamento
        })
      } else {
        this.empresaService.getEmpresaById(element.IdEmpresa).subscribe(res => {
          this.empresasByAnuncio[index] = res;
          this.formaPagamentoDefault = this.empresasByAnuncio[index].FormasPagamento[0].IdFormaPagamento
        })
      }
    })
  }

  checkRestricaoQuantidade(restricao, quantidade, anuncio) {
    var auxiliarRestricao = parseFloat(restricao.Valor.match(/[\d\.]+/))
    switch (restricao.TipoRestricao) {
      case 1://quantidade minima
        if (quantidade < auxiliarRestricao) {
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
          this.loading_page = false
          this.aux1 = false
          this.spinner.hide()
          swal("Erro", `Quantidade Mínima no anúncio ${anuncio.Titulo} não atingida, quantidade minima ${restricao.Valor}`, "error");
          this.ErrorMsg = `Quantidade Mínima no anúncio ${anuncio.Titulo} não atingida`;

          break;
        } else {
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
          this.restricaoIsOK.push("ok")
          this.hasValidatedRetrictions.push(restricao.IdRestricao)
          break;
        }
      case 2://quantidade maxima
        if (quantidade > auxiliarRestricao) {
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
          swal("Erro", `Quantidade Máxima no anúncio ${anuncio.Titulo} atingida, maximo ${restricao.Valor}`, "error");
          this.ErrorMsg = `Quantidade Máxima no anúncio ${anuncio.Titulo} atingida`
          this.loading_page = false
          break;
        } else {
          if (this.empresas.length != 0) {
            this.disabledFinal = true
          }
          this.restricaoIsOK.push("ok")
          this.hasValidatedRetrictions.push(restricao.IdRestricao)
          break;
        }
      default:
        break;
    }
  }

  isInt(n) {
    return n % 1 === 0;
 }

  makeCheckout2(anuncio, j) {
    if (this.empresas.length != 0) {
      this.checking_out2 = true;
    } else {
      this.checking_out = false;
      this.checking_out2 = false;
    }
    this.spinner.show()
    var countResticoes = 0

    if (Array.isArray(anuncio)) {
      anuncio.forEach((element, index) => {
        // console.log("this.anuncios_checkout[j][index].Quantidade",this.anuncios_checkout[j][index].Quantidade)
        //this.updateQuantidade(this.anuncios_checkout[j][index].Quantidade, j, element , index)
        countResticoes = countResticoes + element.Restricoes.length
        if (element.Restricoes.length > 0) {
          this.hasRestriction.push("yes")
          element.Restricoes.forEach(item => {
            if (item.TipoRestricao === 1 || item.TipoRestricao === 2) {
              if (item.TipoRestricao === 1) {
                if (Number(item.Valor) > this.anuncios_checkout[j][index].Quantidade) {
                  this.anuncios_checkout[j][index].Quantidade = item.Valor
                }
              }
              if (this.hasValidatedRetrictions.some(e => e.IdRestricao === item.IdRestricao)) {
                this.restricaoIsOK.push("ok")
              } else {
                this.checkRestricaoQuantidade(item, this.anuncios_checkout[j][index].Quantidade, this.anuncios[j][index])
              }
            } else if (item.TipoRestricao === 4 || item.TipoRestricao === 7 || item.TipoRestricao === 6) {
              this.restricaoIsOK.push("ok")
            } else if (element.Restricoes.length == 1) {
              this.service.saveCarrinhoCheckout(this.anuncios_checkout);
              if (this.anuncios.length == 1) {
                this.pedidoParaSalvar2(anuncio, j)
              }
            }
          })
        } else {
          this.hasRestriction.push("no")
        }
      })
    } else {
      countResticoes = countResticoes + anuncio.Restricoes.length
      if (anuncio.Restricoes.length > 0) {
        this.hasRestriction.push("yes")
        anuncio.Restricoes.forEach(item => {
          if (item.TipoRestricao === 1 || item.TipoRestricao === 2) {
            if (item.TipoRestricao === 1) {
              if (Number(item.Valor) > this.anuncios_checkout[j].Quantidade) {
                this.anuncios_checkout[j].Quantidade = item.Valor
              }
            }
            if (this.hasValidatedRetrictions.some(e => e.IdRestricao === item.IdRestricao)) {
              this.restricaoIsOK.push("ok")
            } else {
              this.checkRestricaoQuantidade(item, this.anuncios_checkout[j].Quantidade, this.anuncios[j])
            }
          } else {
            if (anuncio.Restricoes.length == 1 && this.anuncios.length == 1) {
              this.service.saveCarrinhoCheckout(this.anuncios_checkout);
              this.pedidoParaSalvar2(anuncio, j)
            }
            if (item.TipoRestricao === 4 || item.TipoRestricao === 7 || item.TipoRestricao === 6) {
              this.restricaoIsOK.push("ok")
            }
          }
        })
      } else {
        this.hasRestriction.push("no")
      }
    }

    if (!this.hasRestriction.includes('yes')) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout);
      this.pedidoParaSalvar2(anuncio, j)
    } else if (this.restricaoIsOK.length == countResticoes || this.restricaoIsOK.length > countResticoes) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout);
      this.pedidoParaSalvar2(anuncio, j)
    }
  }
 
  makeCheckout() {
    if (this.empresas.length != 0) {
      this.checking_out2 = true
    } else {
      this.checking_out = false
      this.checking_out2 = false
    }
    this.spinner.show()
    var countResticoes = 0
    this.anuncios.forEach((anuncio, j) => {
      if (Array.isArray(anuncio)) {

        anuncio.forEach((element, index) => {
          this.updateQuantidade(this.anuncios_checkout[j][index].Quantidade, index, element, j)
          countResticoes = countResticoes + element.Restricoes.length
          if (element.Restricoes.length > 0) {
            this.hasRestriction.push("yes")
            element.Restricoes.forEach(item => {
              if (item.TipoRestricao === 1 || item.TipoRestricao === 2) {
                if (this.hasValidatedRetrictions.some(e => e.IdRestricao === item.IdRestricao)) {
                  this.restricaoIsOK.push("ok")
                } else {
                  this.checkRestricaoQuantidade(item, this.anuncios_checkout[j][index].Quantidade, this.anuncios[j][index])
                }
              } else if (item.TipoRestricao === 3 || item.TipoRestricao === 4 || item.TipoRestricao === 7 || item.TipoRestricao === 6) {
                this.restricaoIsOK.push("ok")
              }
              //else if(element.Restricoes.length==1 ){
              //  this.service.saveCarrinhoCheckout(this.anuncios_checkout);
              //  if(this.anuncios.length==1){
              //   this.pedidoParaSalvar()
              // }
              //
              //this.ErrorMsg = 'Não é restrição tipo 1 ou 2 ou nao e tipo int'
              //}
            })
          } else {
            this.hasRestriction.push("no")
          }
        })
      } else {
        countResticoes = countResticoes + anuncio.Restricoes.length
        if (anuncio.Restricoes.length > 0) {
          this.hasRestriction.push("yes")
          anuncio.Restricoes.forEach(item => {
            if (item.TipoRestricao === 1 || item.TipoRestricao === 2) {
              if (this.hasValidatedRetrictions.some(e => e.IdRestricao === item.IdRestricao)) {
                this.restricaoIsOK.push("ok")
              } else {
                this.checkRestricaoQuantidade(item, this.anuncios_checkout[j].Quantidade, this.anuncios[j])
              }
            } else {
              if (anuncio.Restricoes.length == 1 && this.anuncios.length == 1) {
                this.service.saveCarrinhoCheckout(this.anuncios_checkout);
                //this.pedidoParaSalvar(j)
              }
              if (item.TipoRestricao === 4 || item.TipoRestricao === 7 || item.TipoRestricao === 6) {
                this.restricaoIsOK.push("ok")
              }

            }
          })
        } else {
          this.hasRestriction.push("no")
        }
      }
    })

    if (!this.hasRestriction.includes('yes')) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout)
      this.pedidoParaSalvar()
    } else if (this.restricaoIsOK.length == countResticoes || this.restricaoIsOK.length == countResticoes) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout)
      this.pedidoParaSalvar()
    }
  }

  finalValidations2(anuncio, j) {
    var auxilar: any = []
    var num: number = 0

    if (Array.isArray(anuncio)) {
      anuncio.forEach(el => {
        el.Restricoes.forEach(restric => {
          if (restric.TipoRestricao == 1 || restric.TipoRestricao == 2) {
            num += 1
            if (this.hasValidatedRetrictions.includes(restric.IdRestricao)) {
              auxilar.push("ok")
            }
          }
        })
      })
    } else {
      anuncio.Restricoes.forEach(restric => {
        if (restric.TipoRestricao == 1 || restric.TipoRestricao == 2) {
          num += 1
          if (this.hasValidatedRetrictions.includes(restric.IdRestricao)) {
            auxilar.push("ok")
          }
        }
      })
    }
    if (auxilar.length != 0 && auxilar.length != 0 && auxilar.length === num) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout);
      this.pedidoParaSalvar2(anuncio, j)
    }
  }

  finalValidations() {
    var auxilar: any = []
    var num: number = 0
    this.anuncios.forEach(element => {
      if (Array.isArray(element)) {
        element.forEach(el => {
          el.Restricoes.forEach(restric => {
            if (restric.TipoRestricao == 1 || restric.TipoRestricao == 2) {
              num += 1
              if (this.hasValidatedRetrictions.includes(restric.IdRestricao)) {
                auxilar.push("ok")
              }
            }
          })
        })
      } else {
        element.Restricoes.forEach(restric => {
          if (restric.TipoRestricao == 1 || restric.TipoRestricao == 2) {
            num += 1
            if (this.hasValidatedRetrictions.includes(restric.IdRestricao)) {
              auxilar.push("ok")
            }
          }
        })
      }
    })
    if (auxilar.length != 0 && auxilar.length != 0 && auxilar.length === num) {
      this.service.saveCarrinhoCheckout(this.anuncios_checkout)
      this.pedidoParaSalvar()
    }
  }

  pushPagamento(event, produto, empresa, j) {
    var aux = this.formas_pagamento.filter(forma => {      return forma.NomeFormaPagamento == event    })

    if (event == "Depósito Bancário" || event == "Transferência") {
      this.showDadosBancarios = true
      this.empresaDadosBancarios = empresa
    } else {
      this.showDadosBancarios = false
    }

    var anunciante: any = null

    if (Array.isArray(produto)) {
      anunciante = produto[0].IdEmpresa
    } else {
      anunciante = produto.IdEmpresa
    }
    if (this.arrayFormaPagamento.length > 0) {
      if (this.arrayFormaPagamento.some(e => e.IdEmpresa === anunciante)) {
        var indexof = this.arrayFormaPagamento.findIndex(x => x.idEmpresa == produto.IdAnunciante);
        this.arrayFormaPagamento.splice(indexof, 1)
        const formapagamento = {
          "IdEmpresa": anunciante,
          "IdFormaPagamento": Number(aux[0].IdFormaPagamento)
        }
        this.arrayFormaPagamento.push(formapagamento)
      } else {
        const formapagamento = {
          "IdEmpresa": anunciante,
          "IdFormaPagamento": Number(aux[0].IdFormaPagamento)
        }
        this.arrayFormaPagamento.push(formapagamento)
      }

    } else {
      const formapagamento = {
        "IdEmpresa": anunciante,
        "IdFormaPagamento": Number(aux[0].IdFormaPagamento)
      }

      this.arrayFormaPagamento.push(formapagamento)
    }
    if (this.showDadosBancarios) {
      this.dadosBancariosArray.push(anunciante)
      this.searchEmpresasById()
    }

    if (this.showDadosBancarios) {
      document.querySelector('#section3' + j).classList.add('show-section');
    }
  }

  searchEmpresasById() {
    this.dadosBancariosArray.forEach(element => {
      this.empresaService.getEmpresaById(element).subscribe(res => {
        this.empresasTransferOuDeposito.push(res)
      })
    })
  }

  pedidoParaSalvar2(anuncio, j) {
    console.log("entrega", this.entrega)
    let pedido = null
    this.checking_out2 = true
    var pedidosGuardados: any = [];
    if (Array.isArray(anuncio)) {
      var formaPago: any = null;
      if (this.arrayFormaPagamento.find(p => p.IdEmpresa === anuncio[0].IdEmpresa) == undefined) {
        swal("Erro", "Por favor escolha uma forma de pagamento", "error")
        this.spinner.hide()
      } else {
        formaPago = this.arrayFormaPagamento.find(p => p.IdEmpresa === anuncio[0].IdEmpresa)

        var arr: any = []
        if (Array.isArray(this.anuncios_checkout[j])) {
          arr = this.anuncios_checkout[j]
        } else {
          arr.push(this.anuncios_checkout[j])
        }
        this.pedido = {
          IdAnunciante: anuncio[0].IdEmpresa,
          IdEnderecoEntrega: this.entrega.IdEndereco,
          FormaPagamento: formaPago.IdFormaPagamento,
          IdUsuarioComprador: this.auth.getSessionData().user_id,
          IdEmpresaComprador: this.empresa_selecionada.IdEmpresa,
          Itens: arr,
          Observacoes: this.observacoes,
        };
        console.log("pedido", this.pedido)
        this.pedidos.push(this.pedido)

        this.service.checkoutmulti(this.pedidos).subscribe(
          res => {
            const pedidoRes: any = res;
            this.spinner.hide()
            this.ngOnInit()
            //this.errorMessage.push(pedidoRes[0].NumeroPedido)
            this.removeItem(j)
            this.finished = true
            swal('Sucesso', ` o pedido... ${pedidoRes[0].NumeroPedido} foi gerado com sucesso`, 'success', {
              dangerMode: false,
              buttons: ["fechar", "OK"],
            })
              .then((value) => {
                switch (value) {
                  case true:
                    window.location.reload()
                }
              })
          },
          error => {
            this.ErrorMsg = error;
            pedidosGuardados.push(this.ErrorMsg)
            this.spinner.hide()
            swal(`Ops, ${error.error.Mensagem}`, {
              dangerMode: true,
              buttons: ["fechar", "OK"],
            })
              .then((value) => {
                switch (value) {
                  case true:
                    this.spinner.hide()
                    break;
                }
              });
          }
        );
      }
    } else {
      var formaPago: any = null;
      if (this.arrayFormaPagamento.find(p => p.IdEmpresa === anuncio.IdEmpresa) == undefined) {
        swal("Erro", "Por favor escolha uma forma de pagamento", "error")
        this.spinner.hide()
      } else {
        formaPago = this.arrayFormaPagamento.find(p => p.IdEmpresa === anuncio.IdEmpresa)

        var arr: any = []
        if (Array.isArray(this.anuncios_checkout[j])) {
          arr = this.anuncios_checkout[j]
        } else {
          arr.push(this.anuncios_checkout[j])
        }
        if (this.entrega != undefined) {
          if (this.empresas.length != 0) {
            this.pedido = {
              IdAnunciante: anuncio.IdEmpresa,
              IdEnderecoEntrega: this.entrega.IdEndereco,
              FormaPagamento: formaPago.IdFormaPagamento,
              IdUsuarioComprador: this.auth.getSessionData().user_id,
              IdEmpresaComprador: this.empresa_selecionada.IdEmpresa,
              Itens: arr,
              Observacoes: this.observacoes
            };
          } else {
            this.pedido = {
              IdAnunciante: anuncio.IdEmpresa,
              IdEnderecoEntrega: this.entrega.IdEndereco,
              FormaPagamento: formaPago.IdFormaPagamento,
              IdUsuarioComprador: this.auth.getSessionData().user_id,
              IdEmpresaComprador: null,
              Itens: arr,
              Observacoes: this.observacoes
            };
          }

          this.pedidos = []
          this.pedidos.push(this.pedido)
          console.log("pedidos enviados", this.pedidos)
          this.service.checkoutmulti(this.pedidos).subscribe(
            res => {
              console.log("res", res)
              const pedidoRes: any = res;
              this.spinner.hide()
              //this.errorMessage.push(pedidoRes[0].NumeroPedido) 
              this.removeItem(j)
              swal('Sucesso', ` o pedido... ${pedidoRes[0].NumeroPedido} foi gerado com sucesso`, 'success', {
                dangerMode: false,
                buttons: ["fechar", "OK"],
              })
                .then((value) => {
                  switch (value) {
                    case true:
                      window.location.reload()

                  }
                });


            },
            error => {
              console.log("error", error)
              this.ErrorMsg = error;
              this.spinner.hide()
              swal(`Não foi possível gerar o pedido... ${error.error.Mensagem}`, {
                dangerMode: true,
                buttons: ["fechar", "OK"],
              })
                .then((value) => {
                  switch (value) {
                    case true:
                      if (this.empresas.length != 0) {
                        this.spinner.hide()
                      }

                  }
                });
            }
          );

        } else {
          this.spinner.hide()
          swal("Erro", "Por favor escolha um enderço de envio", 'error')
        }
      }
    }
  }

  pedidoParaSalvar() {
    this.checking_out2 = true
    var pedidosGuardados: any = [];
    this.anuncios.forEach((element, index) => {
      if (Array.isArray(element)) {
        var formaPago: any = null;
        formaPago = this.arrayFormaPagamento.find(p => p.IdEmpresa === element[0].IdEmpresa)
        var arr: any = []
        if (Array.isArray(this.anuncios_checkout[index])) {
          arr = this.anuncios_checkout[index]
        } else {
          arr.push(this.anuncios_checkout[index])
        }
        console.log("entrega", this.entrega)
        console.log("entrega", this.entrega.IdEndereco)
        if (formaPago != null) {
          this.pedido = {
            IdAnunciante: element[0].IdEmpresa,
            IdEnderecoEntrega: this.entrega.IdEndereco,
            FormaPagamento: formaPago.IdFormaPagamento,
            IdUsuarioComprador: this.auth.getSessionData().user_id,
            IdEmpresaComprador: this.empresa_selecionada.IdEmpresa,
            Itens: arr,
            Observacoes: this.observacoes,
          };

          this.pedidos.push(this.pedido)
        } else {
          this.spinner.hide()
          swal("Erro", "Por favor escolha uma Forma de pagamento na empresa" + element[0].IdEmpresa, "error")
        }

      } else {
        var formaPago: any = null;
        if (this.arrayFormaPagamento.find(p => p.IdEmpresa === element.IdEmpresa) != undefined) {
          formaPago = this.arrayFormaPagamento.find(p => p.IdEmpresa === element.IdEmpresa)
        } else {
          formaPago = this.empresasByAnuncio[0].FormasPagamento[0]
        }
        var arr: any = [];
        if (Array.isArray(this.anuncios_checkout[index])) {
          arr = this.anuncios_checkout[index]
        } else {

          arr.push(this.anuncios_checkout[index])
        }
        console.log("entrega", this.entrega)
        console.log("formaPago", formaPago)
        if (this.entrega == undefined || formaPago == undefined) {
          console.log("entrega", this.entrega)
        } else {
          if (this.empresas.length != 0) {
            this.pedido = {
              IdAnunciante: element.IdEmpresa,
              IdEnderecoEntrega: this.entrega.IdEndereco,
              FormaPagamento: formaPago.IdFormaPagamento,
              IdUsuarioComprador: this.auth.getSessionData().user_id,
              IdEmpresaComprador: this.empresa_selecionada.IdEmpresa,
              Itens: arr,
              Observacoes: this.observacoes,
            };
          } else {

            //this.getInfoUser(this.auth.getSessionData().user_id);
            this.pedido = {
              IdAnunciante: element.IdEmpresa,
              IdEnderecoEntrega: this.infoUser.Enderecos[0].IdEndereco,
              FormaPagamento: formaPago.IdFormaPagamento,
              IdUsuarioComprador: this.auth.getSessionData().user_id,
              IdEmpresaComprador: null,
              Itens: arr,
              Observacoes: this.observacoes,
            };

          }
        }
        this.pedidos.push(this.pedido)
      }
    });
    console.log("pedidos", JSON.stringify(this.pedidos))
    this.service.checkoutmulti(this.pedidos).subscribe(
      res => {
        const pedidoRes: any = res;
        console.log("pedidoRes", JSON.stringify(pedidoRes))
        this.spinner.hide()
        if (pedidoRes[0].NumeroPedido) {
          this.errorMessage.push(pedidoRes[0].NumeroPedido)
          this.removeItem(0)
          this.finished = true
        }
      },
      error => {
        console.log("error", error)
        this.ErrorMsg = error;
        pedidosGuardados.push(this.ErrorMsg)
        this.spinner.hide()
        swal(`Ops, ${error.error.Mensagem}`, {
          dangerMode: true,
          buttons: ["fechar", "OK"],
        })
          .then((value) => {
            switch (value) {
              case true:
                this.disabledFinal = false
                this.spinner.hide()
                break;
            }
          });
      }

    );
  }

  getInfoUser(id) {
    this.UserService.getUserById(id).subscribe(
      res => {
        this.infoUser = res
        this.users.push(this.infoUser)
        this.empresa_selecionada = this.infoUser
      })
  }

  getFaltante(minimo, j) {
    this.faltante = Number(minimo.ValorPedidoMinimo) - Number(this.totalEmpresa[j])

    if (this.faltante < 0 || this.faltante == 0) {
      this.showFaltante = false
    } else {
      this.showFaltante = true
    }
  }

  updateQuantidade(value, index, anuncio, i) {
    console.log("value", value)
    var value2 = ''

    if (value.target != undefined) {
      value2 = value.target.value
    } else {
      value2 = value
    }
    this.getMaxQuantity(anuncio, value2)

    if (i == null) {
      this.anuncios_checkout[index].Quantidade = Number(value2)
      this.anuncios[index].Quantidade = Number(value2);
      this.service.storeCarrinho(this.anuncios);
      this.anuncios_checkout[index].TotalProd = this.anuncios_checkout[index].Quantidade * anuncio.Produtos[0].ValorUnitarioDesconto
    } else {
      this.anuncios_checkout[index][i].Quantidade = Number(value2)
      this.anuncios[index][i].Quantidade = Number(value2)
      this.service.storeCarrinho(this.anuncios);
      this.anuncios_checkout[index][i].TotalProd = anuncio.Produtos[0].ValorUnitarioDesconto * this.anuncios_checkout[index][i].Quantidade
    }
  }

  formatReal(int) {
    var tmp = int + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if (tmp.length > 6)
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;
  }

  removeItem(index) {
    this.service.removeDoCarrinho(index);
    this.anuncios.splice(index, 1);
    this.anuncios_checkout.splice(index, 1);
    this.empresasByAnuncio.splice(index, 1)
    this.restricaoIsOK = []
  }

  removeAnuncio(j, i) {
    if (i == undefined) {
      this.removeItem(j)
    } else {
      var tmp: any = this.anuncios
      tmp[j].splice(i, 1)
      if (tmp[j].length == 0) {
        this.removeItem(j)
      } else {
        this.anuncios = tmp
      }
      this.service.storeCarrinho([])
      this.service.storeCarrinho(this.anuncios)
    }
  }

  getTotal() {
    let total = 0
    this.anuncios_checkout.forEach(anuncio => {
      if (Array.isArray(anuncio)) {
        anuncio.forEach(an => {
          total += Number(an.TotalProd)
        })
      } else {
        total += Number(anuncio.TotalProd)
      }
    })
    this.total = total
    return total
  }

  getTotalByEmpresa(an, index) {
    let total = 0;
    var anunciosC = this.anuncios_checkout[index]
    if (Array.isArray(anunciosC)) {
      anunciosC.forEach(an => {
        total += an.ValorDesconto * an.Quantidade;
      })
    } else {
      total += anunciosC.ValorDesconto * anunciosC.Quantidade;
    }
    this.totalEmpresa[index] = total
    this.getFaltante(this.empresasByAnuncio[index], index)
    return total
  }

  formatValue(value) {
    return parseFloat(value).toFixed(2);
  }

  detalhes(anuncio) {
    const modalRef = this.modalService.open(DetalhesProdutoComponent, { size: 'lg' });
    modalRef.componentInstance.anuncio = anuncio;
  }

  completarpedido(j) {
    document.querySelector('#section' + j).classList.add('show-section');
    document.querySelector('#section2' + j).classList.add('show-section');
    document.querySelector('#button' + j).classList.add('hide-button');
  }

  getValueRestricao(anuncio, j, i) {
    var isrestricao = false
    var res = ''
    anuncio.Restricoes.forEach(element => {
      if (element.TipoRestricao == 1) {
        isrestricao = true
        res = element.Valor
        return String(element.Valor)
      }
    })
    if (!isrestricao) {
      return '1'
    } else {
      if (i != undefined) {
        this.anuncios_checkout[j][i].Quantidade = res
        //this.anuncios_checkout[j][i].TotalProd= anuncio.Produtos[0].ValorUnitarioDesconto *this.anuncios_checkout[j][i].Quantidade
      } else {
        this.anuncios_checkout[j].Quantidade = res
        // this.anuncios_checkout[j][i].TotalProd= anuncio.Produtos[0].ValorUnitarioDesconto *this.anuncios_checkout[j].Quantidade
      }
      return String(res)
    }
  }

  getMaxValueRestricao(anuncio, j, i) {
    var isrestricao = false
    var res = ''
    anuncio.Restricoes.forEach(element => {
      if (element.TipoRestricao == 2) {
        isrestricao = true
        res = element.Valor
        return String(element.Valor)
      }
    })
    if (!isrestricao) {
      return '1000000'
    } else {
      return String(res)
    }
  }

  getTotalProd() {
    this.anuncios_checkout.forEach(element => {
      if (Array.isArray(element)) 
        element.forEach(an => { an.TotalProd = (an.ValorDesconto * an.Quantidade) })
       else 
        element.TotalProd = (element.ValorDesconto * element.Quantidade)    
      })
    }
}
