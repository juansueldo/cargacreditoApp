
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, VERSION } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cargando : boolean = true
  usuario : any;
  noCarga : boolean = true;
  tope : number = 0;
  public scannerEnabled: boolean = false;
  public information: string = "No se  detectado información de ningún código. Acerque un código QR para escanear.";

  constructor(public auth : AuthService,private usuarios : DbService,private scanner : ScannerService, private router: Router) {
    this.usuarios.traerUsuarios().subscribe(users => {
      console.log(users);
      users.forEach(user => {
        if(this.auth.mailLogueado == user.correo){
          this.usuario = user;
          this.tope = this.usuario.perfil == 'admin' ? 320 : 160;
          this.noCarga = this.usuario.credito == this.tope;
        }
      });
    })
    setTimeout(() => {
      this.cargando = false;
    }, 500);
  }

  cargarCredito(codigo : any){
      switch (codigo) {      
        case '8c95def646b6127282ed50454b73240300dccabc':
          if(this.usuario.perfil === 'admin'){
            if(this.usuario.credito10 == 2){
              this.cargaMaxima(true);
              return
            }else{
              this.usuario.credito10++;
              this.usuario.credito += 10;
            }
          }else{
            if(this.usuario.credito10 == 1){
              this.cargaMaxima(false);
              return
            }else{
              this.usuario.credito10++;
              this.usuario.credito += 10;
            }
          }
          break;
  
        case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ':
          if(this.usuario.perfil === 'admin'){
            if(this.usuario.credito50 == 2){
              this.cargaMaxima(true);
              return
            }else{
              this.usuario.credito50++;
              this.usuario.credito += 50;
            }
          }else{
            if(this.usuario.credito50 == 1){
              this.cargaMaxima(false);
              return;
            }else{
              this.usuario.credito50++;
              this.usuario.credito += 50;
            }
          }        
          break;
  
        case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
          if(this.usuario.perfil === 'admin'){
            if(this.usuario.credito100 == 2){
              this.cargaMaxima(true);
              return;
            }else{
              this.usuario.credito100++;
              this.usuario.credito += 100;
            }
          }else{
            if(this.usuario.credito100 == 1){
              this.cargaMaxima(false);
              return;
            }else{
              this.usuario.credito100++;
              this.usuario.credito += 100;
            }
          }        
          break;
      }    
      this.usuarios.actualizarUsuario(this.usuario,this.usuario.uid)
  }

  vaciarCredito(){
    this.usuario.credito10 = 0
    this.usuario.credito50 = 0
    this.usuario.credito100 = 0
    this.usuario.credito = 0
    this.usuarios.actualizarUsuario(this.usuario,this.usuario.uid)
  }

  cargaMaxima(isAdmin : boolean){    
    Swal.fire({
      title: 'Máxima carga alcanzada.',
      icon: 'error',
      text: `Solo puedes cargar ${isAdmin ? 2+' veces' : 1+' vez'} este valor.`,
      confirmButtonText: "Aceptar",
      confirmButtonColor: '#7e34bc',
      background: '#5ab8a2',
      color: '#FFFFFF',
      heightAuto: false
    });
    return
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.information = "Espera recuperando información... ";

    this.information = $event;
    console.log(this.information);
    this.cargarCredito(this.information);
  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.information = "No se  detectado información de ningún código. Acerque un código QR para escanear.";
  }
}