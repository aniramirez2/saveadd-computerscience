import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Produto, ProductService } from './../../providers/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-remove-produto',
  templateUrl: './remove-produto.component.html',
  styleUrls: ['./remove-produto.component.scss']
})
export class RemoveProdutoComponent implements OnInit {
  produto: Produto;
  public success = new Subject<string>();
  successMessage: string;
  deleted = false;
  constructor(
    public service: ProductService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}

  remove() {
    this.service.delete(this.produto.IdProduto).subscribe(res => {
      this.deleted = true;
      if (!this.successMessage) {
        this.successMessage = 'O produto foi removido';
      }
    });
  }
}
