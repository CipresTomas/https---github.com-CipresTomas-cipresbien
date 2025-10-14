import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-logged-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './logged-layout.html',
  styleUrl: './logged-layout.scss'
})
export class LoggedLayout {
  authService = inject(Auth);

  showLogoutModal(){
    Swal.fire({
      title: "¿Quiere cerrar sesión?",
      showDenyButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonText: "Cancelar",
      confirmButtonText: `Cerrar sesión`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.authService.logout();
      } 
    });
  }
}
