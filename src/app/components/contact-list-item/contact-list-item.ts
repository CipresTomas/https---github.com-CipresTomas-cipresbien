import { Component, inject, input } from '@angular/core';
import { Contact } from '../../interfaces/contacto';
import { ContactsService } from '../../services/contacts-service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Toast } from '../../utils/modals';

@Component({
  selector: 'app-contact-list-item',
  imports: [RouterModule],
  templateUrl: './contact-list-item.html',
  styleUrl: './contact-list-item.scss'
})
export class ContactListItem {
  index = input.required<number>();
  contacto = input.required<Contact>();

  contactsService = inject(ContactsService)

  showDeleteModal(){
    Swal.fire({
      title: "Borrar contacto",
      text: "El borrado es permanente. ¿Está seguro?",
      showDenyButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonText: "Cancelar",
      confirmButtonText: `Borrar definitivamente`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.contactsService.deleteContact(this.contacto().id).then(res =>{
          if(res){
            Toast.fire({
              icon: "success",
              title: "Contacto eliminado"
            });
          }
        })
      } 
    });
  }
}
