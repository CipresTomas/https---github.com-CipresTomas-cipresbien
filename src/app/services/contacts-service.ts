import { inject, Injectable, signal } from '@angular/core';
import { Contact, NewContact } from '../interfaces/contacto';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  authService = inject(Auth);
  readonly URL_BASE = "https://agenda-api.somee.com/api/contacts";

  
  contacts = signal<Contact[]>([]);
  

  async createContact(nuevoContacto:NewContact) {
    const res = await fetch(this.URL_BASE, 
      {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(nuevoContacto)
      });
    if(!res.ok) return;
    const resContact:Contact = await res.json();
    
    
    this.contacts.update(contacts => [...contacts, resContact]);
    return resContact;
  }

  async deleteContact(id:number){
    const res = await fetch(this.URL_BASE+"/"+id, 
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
    if(!res.ok) return;
    
    this.contacts.update(contacts => contacts.filter(contact => contact.id !== id));
    return true;
  }

  async editContact(contact:Contact){
    const res = await fetch(this.URL_BASE+"/"+contact.id, 
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer "+this.authService.token,
        },
        body: JSON.stringify(contact)
      });
    if(!res.ok) return;
   
   
    this.contacts.update(contacts => 
      contacts.map(oldContact => oldContact.id === contact.id ? contact : oldContact)
    );
    return contact;
  }

  async getContacts(){
    const res = await fetch('https://agenda-api.somee.com/api/Contacts',
      {
        method: "GET",
        headers: {
          Authorization: "Bearer "+this.authService.token
        }
      })
      if(res.ok){
        const resJson:Contact[] = await res.json()
        
        this.contacts.set(resJson);
      }
  }

  async getContactById(id:string | number){
    const res = await fetch(this.URL_BASE+"/"+id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer "+this.authService.token
        }
      })
      if(res.ok){
        const resJson:Contact = await res.json()
        return resJson;
      }
      return null;
  }

  async setFavourite(id:string | number ) {
    const res = await fetch(this.URL_BASE+"/"+id+"/favorite", 
      {
        method: "POST",
        headers: {
          Authorization: "Bearer "+this.authService.token,
        },
      });
    if(!res.ok) return;
   
    this.contacts.set(this.contacts().map(contact => {
      if(contact.id === id) {
        return {...contact, isFavorite: !contact.isFavorite};
      };
      return contact;
    }));
    return true;
  }
async setFavorite(id:string | number ) {
  const res = await fetch(this.URL_BASE+"/"+id+"/favorite", 
    {
      method: "POST",
      headers: {
        Authorization: "Bearer "+this.authService.token,
      },
    });
  if(!res.ok) return;
 
  this.contacts.update(contacts => 
    contacts.map(contact => 
      contact.id === id ? {...contact, isFavorite: !contact.isFavorite} : contact
    )
  );
  return true;
}}