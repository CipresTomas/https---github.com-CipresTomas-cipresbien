import { Component, effect, inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactsService } from '../../services/contacts-service';
import { Router, ActivatedRoute } from '@angular/router'; // ← Agregar ActivatedRoute
import { Contact, NewContact } from '../../interfaces/contacto';
import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-new-edit-contact',
  imports: [FormsModule,Spinner],
  templateUrl: './new-edit-contact.html',
  styleUrl: './new-edit-contact.scss'
})
export class NewEditContact implements OnInit {
  contactsService = inject(ContactsService);
  router = inject(Router);
  route = inject(ActivatedRoute); // ← Inyectar ActivatedRoute
  
  errorEnBack = false;
  idContacto = input<string>();
  imprimir = effect(() => {
    console.log('idContacto cambiado a:', this.idContacto());
  });
  contactoBack:Contact | undefined = undefined;
  form = viewChild<NgForm>("newContactForm");
  solicitudABackEnCurso = false;
  
  async ngOnInit() {
    console.log(' idContacto input:', this.idContacto());
    console.log(' Parámetros de ruta:', this.route.snapshot.params);
    console.log(' URL completa:', this.route.snapshot.url);
    
    if(this.idContacto()){
      console.log(' MODO EDITAR - ID:', this.idContacto());
      const contacto:Contact|null = await this.contactsService.getContactById(this.idContacto()!);
      console.log(' Contacto encontrado:', contacto);
      
      if(contacto){
        this.contactoBack = contacto;
        this.form()?.setValue({
          address: contacto.address,
          company: contacto.company,
          email: contacto.email,
          firstName:contacto.firstName,
          image:contacto.image,
          isFavourite:contacto.isFavorite,
          lastName: contacto.lastName,
          number: contacto.number
        })
        console.log('Formulario cargado con datos');
      }
    } else {
      console.log(' MODO NUEVO contacto');
    }
  }

  async handleFormSubmission(form:NgForm){
    this.errorEnBack = false;
    const nuevoContacto: NewContact ={
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      address: form.value.address,
      email: form.value.email,
      image: form.value.image,
      number: form.value.number,
      company: form.value.company,
      isFavorite: form.value.isFavorite || false
    }

    this.solicitudABackEnCurso = true;
    let res;
    if(this.idContacto()){
      console.log(' Guardando edición...');
      res = await this.contactsService.editContact({...nuevoContacto,id:this.contactoBack!.id});
    } else {
      console.log(' Creando nuevo contacto...');
      res = await this.contactsService.createContact(nuevoContacto);
    }
    this.solicitudABackEnCurso = false;

    if(!res) {
      this.errorEnBack = true;
      return
    };
    
    
    this.router.navigate(["/"]);
  }
}