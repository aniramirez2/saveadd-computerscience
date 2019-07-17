import { AdProduct } from './../../providers/advertisement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AdvertisementService,
  Anuncio
} from '../../providers/advertisement.service';

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
import { ProductService, Produto } from '../../providers/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  anuncio: Anuncio;
  produto: Produto;
  adProduct: AdProduct;
  updating = false;
  updated = false;
  focusProduct = new Subject<string>();
  clickProduct = new Subject<string>();
  searching = false;
  searchFailed = false;
  searching_products = false;
  @ViewChild('producTypehead') productThInstance: NgbTypeahead;
  hideSearchingWhenUnsubscribed = new Observable(() => () =>
    (this.searching = false)
  );
  product_formatter = (x: { NomeProduto: string }) => x.NomeProduto;
  constructor(
    public activeModal: NgbActiveModal,
    public service: AdvertisementService,
    public productService: ProductService
  ) {}

  ngOnInit() {
    this.adProduct = this.service.instantiateProduct();
  }

  update() {
    this.anuncio.Produtos.push(this.adProduct);
    this.updating = true;
    this.service.update(this.anuncio).subscribe(
      res => {
        this.updating = false;
        this.updated = true;
      },
      error => {
        this.updating = false;
        this.updated = false;
      }
    );
  }

  searchProduct = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      merge(this.focusProduct),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.productService.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false)),
      merge(this.hideSearchingWhenUnsubscribed)
    );

  selectedProduct(item) {
    const product = item.item;
    this.adProduct.IdProduto = product.IdProduto;
  }
}
