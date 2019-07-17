import { Component, OnInit } from '@angular/core';
import { Anuncio, AdvertisementService } from '../../providers/advertisement.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMAGES_URL } from '../../app.api';

@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.component.html',
  styleUrls: ['./detalhes-produto.component.scss']
})
export class DetalhesProdutoComponent implements OnInit {
  anuncio: Anuncio;
  images_url = IMAGES_URL;
  constructor(public service: AdvertisementService, public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  formatValue(value) {
    return parseFloat(value).toFixed(2);
  }

}
