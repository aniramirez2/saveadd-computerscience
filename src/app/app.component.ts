import { AuthService } from './providers/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  @Input() formData;
  constructor(
    public router: Router,
    public auth: AuthService
  ) {
    console.log(moment());
    moment.locale('pt-BR');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).gtag('set', 'page', event.urlAfterRedirects);
        (<any>window).gtag('send', 'pageview');
      }
    });
  }

  ngOnInit() { }

  onLoginOrRegister() {
    if (
      this.router.url === '/' ||
      this.router.url === '/login' ||
      this.router.url === '/recuperar-senha' ||
      this.router.url.includes('/recuperarSenha') ||
      this.router.url === '/cadastro-usuario'
    ) {
      return true;
    }
    return false;
  }
}
