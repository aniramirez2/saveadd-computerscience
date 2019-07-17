import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from './../providers/user.service'

import { EmpresaService, Empresa } from './../providers/empresa.service';
import { AuthService } from './../providers/auth.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  empresa: Empresa;
  isAdmin:any = false;
  isAdminPrefeitura = false
  isPessoaFisica= false
  compradora = false
  showMenu = true
  isong= false
  isloading = false
  constructor(
    public empresaService: EmpresaService,
    public router: Router,
    public user:UserService,
    public AuthService:AuthService
  ) {
   }

  ngOnInit() {
    this.isloading = true
    if(this.AuthService.isAuthenticated()){
      var id = "0"
      this.user.getUserById(id).subscribe(res=>{
        var aux:any = res
        //console.log('this.user sidebar',aux)
        if(aux.TipoUsuario == 2 ){
          this.isAdmin = true
        }else{
          if(aux.TipoUsuario == 1){
            this.isAdminPrefeitura = true
          }else{
            if(aux.Enderecos.length > 0){
             this.isPessoaFisica= true
             this.showMenu = false
            }
            this.isAdmin = false
            if(!this.isPessoaFisica){
              this.getThisEmpresa()
            }
            
          }
          
        }
        this.isloading =false
      })
      
    }else{
      this.router.navigateByUrl('/');
    }
    

  }
  isClicked(id){
    document.querySelector('#'+id).classList.add('active');
    
    /*if(id == 'novop'){
      this.hasIE(id);
    }else if(id == 'anuncios'){
      this.hasFormasPago(id)
    }else{
      
    }*/
  }
  getThisEmpresa(){
    this.empresaService.getEmpresas().subscribe(res => {
      
      this.empresa = res as Empresa
      //console.log('this.empresa',this.empresa[0])
      if(this.empresa[0].Intencoes != undefined){
        /*this.empresa[0].Intencoes.forEach(element => {
          if(element.NomeIntencao ==='Vender'){
            this.compradora=true
            this.showMenu = false
          }
        });*/
        if(this.empresa[0].Intencoes.indexOf('Vender') == -1){
         // this.showMenu = false
        }
      }
      if(Number(this.empresa[0].TipoEmpresa) === 1 || Number(this.empresa[0].TipoEmpresa) === 2){
        this.isong = true
        this.showMenu= false
      }
    });
  }
  hasIE(id) {
    document.querySelector('#'+id).classList.add('active');
    if(this.empresa[0].InscricaoEstadual) {
      this.router.navigate(['/produtos/novo'])
    } else {
      swal("Erro", "Empresa informada não pode incluir produtos pois não possui Inscrição Estadual", "error");
      this.router.navigate(['vitrine'])
    }
    
  }
  hasFormasPago(id) {
   
    if(this.empresa[0].FormasPagamento.length >0) {
      document.querySelector('#'+id).classList.add('active');
      this.router.navigate(['/anuncios'])
    } else {
      swal("Erro", "Por favor adicione as formas de pagamento antes de criar os anuncios", "error");
      this.router.navigate(['vitrine'])
    }
  }

}
