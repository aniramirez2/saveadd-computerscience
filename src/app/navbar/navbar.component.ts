import { CarrinhoService } from './../providers/carrinho.service';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
import { User, UserService } from './../providers/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../providers/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  notLoggedIn: any;
  total_carrinho = 0;
  public sidebarOpened = false;
  user: Object;
  isAdmin: boolean;

  constructor(
    config: NgbDropdownConfig,
    public auth: AuthService,
    public router: Router,
    public userService: UserService,
    public carrinho: CarrinhoService
  ) {
    config.placement = 'bottom-right';
  }
  user_name: string = null;
  ngOnInit() {
    if(this.auth.isAuthenticated()){
      var id = "0"
      this.userService.getUserById(id).subscribe(res=>{
        this.user = res
        var aux:any = res
        if(aux.TipoUsuario == 2 || aux.TipoUsuario == 1){
          
          this.isAdmin = true
        }
      })
      this.total_carrinho = this.carrinho.countCarrinhoItems();
    console.log(this.total_carrinho);
    if (!this.user_name) {
      this.userService.getUserById(this.auth.getSessionData().user_id)
        .subscribe(
          res => {
            const data: any = res;
            this.user_name = data.NomeUsuario;
          },
          error => {
            if (error.status === 401) {
              this.auth.logout();
              this.router.navigateByUrl('');
            }
          }
        );
    }
    
    }else{
      this.router.navigateByUrl('');
    }
    
  }

  ngDoCheck(): void {
    this.total_carrinho = this.carrinho.countCarrinhoItems();
    // Observable.interval(3000).subscribe(() => {
    //   if (!this.user_name && this.auth.isAuthenticated()) {
    //     this.userService
    //       .getUserById(this.auth.getSessionData().user_id)
    //       .subscribe(res => {
    //         const data: any = res;
    //         this.user_name = data.NomeUsuario;
    //       });
    //   }
    // });
  }

  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    } else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('');
  }
}
