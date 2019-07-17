import { map } from 'rxjs/operators';
import { AddAddressComponent } from './../add-address/add-address.component';
import { AddPhoneComponent } from './../add-phone/add-phone.component';
import { RemoveEmpresaComponent } from './../remove-empresa/remove-empresa.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateEmpresaComponent } from './../create-empresa/create-empresa.component';
import { ActivatedRoute } from '@angular/router';
import {
  EmpresaService,
  Empresa,
  Endereco,
  DadosBancarios
} from './../../providers/empresa.service';
import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from './../../providers/carrinho.service';
import { UserService } from './../../providers/user.service'
import * as _swal from 'sweetalert';
import { conformToMask } from 'angular2-text-mask';
import { masks } from './../../masks';
import { SweetAlert } from 'sweetalert/typings/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../providers/product.service';
const swal: SweetAlert = _swal as any;



@Component({
  selector: 'app-view-empresa',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewEmpresaComponent implements OnInit {
  empresa: Empresa;
  filiais: Empresa[];
  dadosBancarios: DadosBancarios;
  FormasPagamento: any = [];
  edit = false;
  loading_page = false;
  loading_filiais = false;
  updating = false;
  estados: any;
  estado: any;
  swal: any;
  formasPagamentos: any = [];
  intencoes: any = [];
  auxEstado: any = [];
  noneEstado: any = null;
  user: any
  masks = masks;
  selectedPeople1 = []
  categorias: Observable<any[]>;
  options = {
    multiple: true
  }
  allProfiles = [
    { Id: 0, Nome: "Faturamento" },
    { Id: 1, Nome: "Entrega" },
    { Id: 2, Nome: "Estoque" }
  ];
  showDadosBancarios: boolean = false;
  constructor(
    public empresaService: EmpresaService,
    public formasPagamento: CarrinhoService,
    public route: ActivatedRoute,
    public modalService: NgbModal,
    public usuario: UserService,
    public producService: ProductService
  ) {
    this.dadosBancarios = this.empresaService.instatiateDadosBancarios()
  }
  id: any
  ngOnInit() {
    this.categorias = this.producService.getInteresses()

    this.id = this.route.snapshot.paramMap.get('id');
    //console.log("interesses up", this.categorias)ng
    this.usuario.getUserById('0').subscribe(res => {
      this.user = res
      //console.log("user", this.user)
    })
    this.empresaService.getFormasPagamento().subscribe(res => {
      this.formasPagamentos = res;
    });


    this.route.params.subscribe(params => {
      this.loading_page = true;
      this.empresaService.getEmpresaById(params['id']).subscribe(
        res => {
          this.loading_page = false;

          this.empresa = res as Empresa;
          this.getIntencoes()
          console.log("empresa", this.empresa)
          this.empresa.DadosBancarios as DadosBancarios
          if (this.empresa.DadosBancarios.length === 0) {
            this.empresa.DadosBancarios.push(this.empresaService.instatiateDadosBancarios())

          }
          //this.setNomeEstado();
          this.empresa.FormasPagamento.forEach(item => {
            for (let i = 0; i < this.formasPagamentos.length; i++) {
              if (this.formasPagamentos[i].IdFormaPagamento === item.IdFormaPagamento) {
                this.formasPagamentos[i].isChecked = true;

              }
            }
          });
          console.log("formasPagamentos", this.formasPagamentos)
        },
        error => {
          this.loading_page = false;
        }
      );

      this.loading_filiais = true;
      this.empresaService.getFiliais(params['id']).subscribe(
        res => {
          this.loading_filiais = false;
          this.filiais = res as Empresa[];
        },
        error => {
          this.loading_filiais = false;
        }
      );

    });

    this.empresaService.getEstados().subscribe(res => {
      this.estados = res;
    });



  }
  removeInteresse(item) {
    var aux = this.user.Interesses.map(function (e) { return e.IdInteresse; }).indexOf(item);
    this.user.Interesses.splice(aux, 1);
  }
  addInteresses(item) {
    this.user.Interesses.push(item)
  }
  addTipoEndereco(value, index) {
    var aux = value.split(":")
    this.empresa.Enderecos[index].TipoEndereco = Number(aux[1])
  }
  setNomeEstado() {
    this.empresa.Enderecos.forEach((endereco, index) => {
      this.estados.forEach(estado => {
        if (endereco.Estado == estado.IdEstado) {
          this.empresa.Enderecos[index].Estado = estado.NomeEstado;
        }
      });
    });
  }
  getIntencoes() {
    this.empresaService.getIntencoes().subscribe(res => {
      this.intencoes = res;
      var aux = this.intencoes.filter(item => {
        if (this.empresa.TipoEmpresa != 1 && this.empresa.TipoEmpresa != 2 && item.IdIntencao == 4) {
          item.show = false
        } else {
          item.show = true
        }
        return item
      })
      aux.forEach(item => {
        if (this.empresa.Intencoes.map(function (e) { return e.IdIntencao; }).indexOf(item.IdIntencao) != -1) {
          item.isChecked = true
        } else {
          item.isChecked = false
        }
      })
    })
  }
  validateCnpj() {
    if (this.empresa.FormasPagamento.map(function (e) { return e.IdFormaPagamento; }).indexOf(5) != -1 || this.empresa.FormasPagamento.map(function (e) { return e.IdFormaPagamento; }).indexOf(6) != -1) {
      var cnpj = this.empresa.DadosBancarios[0].CpfCnpjTitular.replace(/[^\d]+/g, '')
      if (this.empresa.Cnpj != cnpj) {
        this.updating = false

        swal("Erro", "O cnpj não pode ser diferente do cnpj da empresa atual", "error")
        return false
      } else {
        this.empresa.DadosBancarios[0].CpfCnpjTitular = cnpj
        return true
      }
    } else {
      return true
    }
  }
  update() {
    this.updating = true;

    if (this.empresa.FormasPagamento.length > 0) {

      var aux = this.empresa.FormasPagamento.filter(element => {
        if (element.IdFormaPagamento == 5 || element.IdFormaPagamento == 6) {
          return element
        }
      });
      //console.log('aux',aux)
      if (aux.length == 0) {
        this.empresa.DadosBancarios = []
      } else {
        this.empresa.DadosBancarios[0].IdEmpresa = this.empresa.IdEmpresa
        //console.log("Usuario befpre ", this.user)
        this.empresa.DadosBancarios[0].IdUsuario = this.user.IdUsuario
      }

    } else {
      this.empresa.DadosBancarios = []
    }
    this.empresaService.update(this.empresa).subscribe(res => {
      this.updateUser()
      this.dadosBancarios = this.empresaService.instatiateDadosBancarios()
      this.edit = false;
      this.updating = false;
      swal('Sucesso', 'Empresa Atualizada com Sucesso', 'success')
      //this.ngOnInit()
      window.location.reload()
    },
      error => {
        swal("error", error.error.Mensagem, "error")
        this.updating = false;
        this.dadosBancarios = this.empresaService.instatiateDadosBancarios()
        //console.log("error checkout",error)
        swal(`Ops, ${error.error.Mensagem}`, {
          dangerMode: true,
          buttons: ["fechar", "OK"],
        })
          .then((value) => {
            switch (value) {
              case true:
                this.loading_page = false
                break;
            }
          });
      });

  }
  updateUser() {
    this.usuario.update(this.user).subscribe(res => {
      //console.log("Success response user", res)
      this.ngOnInit()
    },
      error => {
        console.log("Error user", error)
      })
  }
  selectState(value, i) {
    var aux = value.split(":")
    this.empresa.Enderecos[i].Estado = Number(aux[1])
  }
  removeEndereco(endereco: Endereco, index) {

    swal("Tem certeza que deseja excluir este endereço?", {
      dangerMode: true,
      buttons: ["Cancelar", "Confirmar"],
    })
      .then((value) => {
        switch (value) {

          case true:
            this.empresa.Enderecos.splice(index, 1)
            this.update()
            swal("Sucesso", "Endereço removido!", "success");
            break;
        }
      });



  }

  selectedItem(formaPagamento, event) {
    formaPagamento.isChecked = !formaPagamento.isChecked;
    if (event.target.checked) {
      this.empresa.FormasPagamento.push(formaPagamento)
      if (formaPagamento.IdFormaPagamento === 6 || formaPagamento.IdFormaPagamento === 5) {
        this.showDadosBancarios = true
      }
    } else {

      var aux = this.empresa.FormasPagamento.findIndex(i => i.IdFormaPagamento === formaPagamento.IdFormaPagamento);
      this.empresa.FormasPagamento.splice(aux, 1);
      var exists6 = this.empresa.FormasPagamento.findIndex(i => i.IdFormaPagamento === 6)
      var exists5 = this.empresa.FormasPagamento.findIndex(i => i.IdFormaPagamento === 5)
      if (exists6 == -1 && exists5 == -1) {
        this.showDadosBancarios = false
      }
    }
  }
  selectedIntencao(intem, event) {
    intem.isChecked = !intem.isChecked;
    var intencao = {
      IdIntencao: intem.IdIntencao,
      NomeIntencao: intem.NomeIntencao
    }
    if (event.target.checked) {
      this.empresa.Intencoes.push(intencao)
    } else {
      var aux = this.empresa.Intencoes.findIndex(i => i.IdIntencao === intencao.IdIntencao);
      this.empresa.Intencoes.splice(aux, 1);
    }
  }

  formasPagamentoSelecionadas() {
    return this.formasPagamentos
      .filter(fp => fp.isChecked)
      .map(fp => this.empresaService.instantiateFormaPagamento(fp.IdFormaPagamento, fp.NomeFormaPagamento));
  }

  openCreateModal(empresa: Empresa) {
    const modalRef = this.modalService.open(CreateEmpresaComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.matriz = empresa;
    const id = this.route.snapshot.paramMap.get('id');
    modalRef.result.then(res => {
      if (res) {
        this.empresaService.getFiliais(id).subscribe(filiais => {
          this.filiais = filiais as Empresa[];
        });
      }
    });
  }

  openRemoveModal(empresa: Empresa) {
    const modalRef = this.modalService.open(RemoveEmpresaComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.empresa = empresa;
    modalRef.result.then(
      res => {
        if (res) {
          const index = this.filiais.findIndex(
            x => x.IdEmpresa === empresa.IdEmpresa
          );
          if (index > -1) {
            this.filiais.splice(index, 1);
          }
        }
        //console.log('close ' + res);
      },
      reason => {
        console.log(reason);
      }
    );
  }

  openAddPhoneModal() {
    const modalRef = this.modalService.open(AddPhoneComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.empresa = this.empresa;
    modalRef.result.then(res => {
      if (res.updated) {
        this.empresa = res.empresa;
      }
    });
  }

  openAddAddressModal() {
    const modalRef = this.modalService.open(AddAddressComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.empresa = this.empresa;
    modalRef.result.then(res => {
      if (res.updated) {
        this.empresa = res.empresa;
      }
    });
  }

}
