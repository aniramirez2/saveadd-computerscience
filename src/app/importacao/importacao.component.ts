import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  Produto,
  ProductService,
  
} from '../providers/product.service';
import {TecnicoAdminService} from '../providers/tecnicoAdmin.service'
import { NgxSpinnerService } from 'ngx-spinner';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router, ActivatedRoute } from '@angular/router';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'import-produtos',
  templateUrl: './importacao.component.html',
  styleUrls: ['./importacao.component.scss']
})
export class ImportacaoComponent implements OnInit {
  produto: Produto;
  planilha: any;
  filename:any
  public success = new Subject<string>();
  successMessage: string;
  deleted = false;
  uploaded = false;
  itens:any=[];
  itensError:any=[];
  sucess:any
  toList:any=[]
  constructor(
    public service: ProductService,
    public spinner: NgxSpinnerService,
    public tecnico: TecnicoAdminService,
    public router: Router,
  ) {}

  ngOnInit() {
   this.tecnico.getAllCategorias().subscribe(res=>{
     this.toList = res
   })
  }
  getCategoriaPai(id){
    if(id==0){
      return "--"
    }else{
      var aux=this.toList.filter(cat=>{
        if(cat.IdCategoria == id){return cat}
      })
      console.log("aux", aux)
      return aux[0].NomeCategoria
    }
   
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.planilha = file;
      this.filename = this.planilha.name
    }
  }

  editarCategoria(id){
    this.router.navigate(['/produtos/view/'+id])
  }

  upload() {
    this.spinner.show()
    console.log("Planilha",this.planilha)
    if(this.planilha == undefined){
      this.spinner.hide()
      swal("erro","Por favor adicione uma planilha","error")
    }else{
    this.service.uploadImportacao(this.planilha).subscribe(
      res => {
          this.spinner.hide()  
          this.sucess = res
          
            console.log("res import", res)
            this.itens= this.sucess.Itens.filter(item=>{
              if(item.Sucesso){return item.Produto}
            })
            this.itensError= this.sucess.Itens.filter(item=>{
              if(!item.Sucesso){return item.Produto}
            })
            //console.log("itens", this.itens)
            //console.log("itensErros", this.itensError)
            if(this.sucess.Sucesso){
              swal('Sucesso','Planilha importada com sucesso', 'success')
            }else{
              swal('Erro','A Planilha nao foi importada com sucesso', 'error')
            }
      },
      error => {
        console.log("error import", error)
        this.spinner.hide()
      }
    );
  }
}
}