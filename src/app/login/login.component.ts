import { CarrinhoService } from './../providers/carrinho.service';
import { Component, OnInit, Compiler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../providers/auth.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    '../../assets/styles/landing-screens/_auth.scss'
  ]
})

export class LoginComponent implements OnInit {
  notLoggedIn: boolean;
  loading = false;
  error: any;
  errorMsg = null;
  loginErrorMsg: any;
  is_login: any;
  //loginForm: FormGroup;
  isSubmitted: boolean;
  cpfMask = [];
  InstallTrigger: any;
  lembrar: any = false;
  cpf: any

  loginForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    },
    {}
  );
  constructor(
    public router: Router,
    public auth: AuthService,
    public carrinhoService: CarrinhoService,
    public cookieService: CookieService,
    private _compiler: Compiler
  ) {
    this.createMasks()
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.notLoggedIn = true;
      this.router.navigateByUrl('/vitrine');
    } else {
      this.browsers()
      if (localStorage.getItem('cpf') != "") {
        this.cpf = localStorage.getItem('cpf')
        this.lembrar = true
      }
    }
  }

  browsers() {
    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    //console.log('is_chrome',is_chrome)
    var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    //console.log('is_explorer',is_explorer)
    var is_ed = navigator.userAgent.indexOf('Edge') > -1;

    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    //console.log('is_firefox',is_firefox)    
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    if ((is_chrome) && (is_safari)) { is_safari = false; }
    //console.log('is_safari',is_safari)
    var is_Opera = navigator.userAgent.indexOf("Presto") > -1;
    //console.log('is_Opera',is_Opera)

    if (is_Opera || is_firefox || is_safari || is_explorer || is_ed) {
      swal("Erro", "Por questões de compatibilidade, favor utilizar o Google Chrome para acessar a plataforma", "error")
    }
  }
  lembraruser() {
    this.lembrar = !this.lembrar
    if (this.lembrar === true) {
      localStorage.setItem('cpf', this.cpf);
    } else {
      localStorage.removeItem('cpf');
    }
  }
  loginUser(e: any) {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors);
      Object.keys(this.loginForm.controls).forEach(field => {
        // {1}
        const control = this.loginForm.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
      return;
    }
    this.loading = true;
    const username = this.loginForm.controls.username.value.replace(/\D+/g, '');
    console.log("user", username)
    this.auth.login(username, this.loginForm.controls.password.value).subscribe(
      res => {
        var aux: any = res
        this.loading = false;
        //this.notLoggedIn = false;
        this.auth.saveSession(res);
        if (this.lembrar === true) {
          localStorage.setItem('cpf', username);
        }
        this.carrinhoService.storeCarrinho([]);
        this.notLoggedIn = true;
        this.router.navigateByUrl('/vitrine');
        //this.router.navigateByUrl('/dashboard');
        window.location.reload();
        //his.ngOnInit()


      },
      error => {
        console.log("error", error)
        this.loading = false;
        this.loginErrorMsg = 'Usuário ou senha inválidos';
      }
    );
  }
  routerCadastro() {
    this.router.navigateByUrl('/cadastro-usuario');
  }

  createMasks() {
    this.cpfMask = [
      /[0-9]/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/
    ];
  }
}
