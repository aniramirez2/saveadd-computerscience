import { CarrinhoService } from './providers/carrinho.service';
import { SharedModule } from './shared/shared.module';
import { UtilsService } from './shared/utils.service';
import { EmpresaService } from './providers/empresa.service';
import { UserService } from './providers/user.service';
import { TecnicoAdminService } from './providers/tecnicoAdmin.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxTawkModule } from 'ngx-tawk';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ImageUploadModule } from 'angular2-image-upload';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarStepsComponent } from './navbar-steps/navbar-steps.component';

/* Shared Service */
import { CadUserComponent } from './cad-user/cad-user.component';
import { LoginComponent } from './login/login.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ComprasComponent } from './compras/compras.component';
import { VendasComponent } from './vendas/vendas.component';
import { AuthService } from './providers/auth.service';
import { GuardService } from './providers/guard.service';
import { DatePipe } from '@angular/common';
import { ProductService } from './providers/product.service';
import { AdvertisementService } from './providers/advertisement.service';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosService } from './providers/pedidos.service';
import { LoginRecuperacaoComponent } from './login-recuperacao/login-recuperacao.component';
import { LoginSenhaComponent } from './login-senha/login-senha.component';
import { ImportacaoComponent } from './importacao/importacao.component';
import { VendaViewComponent } from './venda-view/venda-view.component';
import { PedidoViewComponent } from './pedido-view/pedido-view.component';
import { CadastroNewUserComponent } from './cadastro-new-user/cadastro-new-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusCompra } from './shared/status-pedido.pipe';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    StatusCompra,
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    NavbarStepsComponent,
    CadUserComponent,
    LoginComponent,
    EditarUsuarioComponent,
    ComprasComponent,
    VendasComponent,
    AlterarSenhaComponent,
    PedidosComponent,
    LoginRecuperacaoComponent,
    VendaViewComponent,
    PedidoViewComponent,
    CadastroNewUserComponent,
    LoginSenhaComponent,
    ImportacaoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ImageUploadModule.forRoot(),
    TextMaskModule,
    RouterModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxTawkModule,
    NgxSpinnerModule,
  ],
  providers: [
    AuthService,
    GuardService,
    UserService,
    DatePipe,
    ProductService,
    AdvertisementService,
    EmpresaService,
    UtilsService,
    CarrinhoService,
    PedidosService,
    TecnicoAdminService,
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    CookieService
  ],
  entryComponents: [AlterarSenhaComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
registerLocaleData(localePt);