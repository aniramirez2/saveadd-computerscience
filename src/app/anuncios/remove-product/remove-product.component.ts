import {
  AdvertisementService,
  Anuncio
} from './../../providers/advertisement.service';
import { Component, OnInit } from '@angular/core';
import { Produto } from '../../providers/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-remove-product',
  templateUrl: './remove-product.component.html',
  styleUrls: ['./remove-product.component.scss']
})
export class RemoveProductComponent implements OnInit {
  produto: Produto;
  anuncio: Anuncio;
  public success = new Subject<string>();
  successMessage: string;
  deleted = false;
  constructor(
    public activeModal: NgbActiveModal,
    public service: AdvertisementService
  ) {}

  ngOnInit() {}

  remove(id) {
    this.anuncio.Produtos = this.anuncio.Produtos.filter(obj => {
      return obj.IdProduto !== id;
    });
    this.service.update(this.anuncio).subscribe(res => {
      this.deleted = true;
      console.log("res remove prod", res)
      if (!this.successMessage) {
        this.successMessage = 'O produto foi removido';
      }
    });
  }
}
