import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  Produto,
  ProductService,
  Imagem
} from '../../providers/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {
  produto: Produto;
  imagem: Imagem;
  public success = new Subject<string>();
  successMessage: string;
  errorMessage: string;
  deleted = false;
  uploaded = false;
  constructor(
    public service: ProductService,
    public activeModal: NgbActiveModal,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.imagem = this.service.instantiateImagem();
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.imagem.imagem = file;
    }
  }

  upload() {
    this.spinner.show()
    this.imagem.IdProduto = this.produto.IdProduto;
    this.imagem.ordemImage = 1;
    this.service.uploadImagem(this.imagem).subscribe(
      res => {
        if (!this.successMessage) {
          this.successMessage = 'A imagem foi adicionada';
          this.spinner.hide()
        }
        window.location.reload();
      },
      error => {
        this.errorMessage = 'Não foi possível adicionar a imagem';
        this.spinner.hide()
        console.log("error img", error)
      }
    );
  }
}
