import {Injectable, Inject, PLATFORM_ID, EventEmitter} from '@angular/core';
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {isPlatformServer} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  public pageNotFound: EventEmitter<Contact> = new EventEmitter();
  private host : string;
  constructor(@Inject(PLATFORM_ID) platformId: any,
              private http: HttpClient,
  ) {
    this.host = isPlatformServer(platformId) ? "http://proxy" : "http://localhost";
  }

  getContacts(): Observable<ContactsDto> {
    return this.http.get(this.host + "/api/contacts").pipe(
      map( (data: any) => {
          let contactDto: ContactsDto = {
            totalItems: data["hydra:totalItems"],
            contacts: data["hydra:member"]
          };
          return contactDto;
        }
      )
    )
  }

  public findBySlug(slug: string): Observable<Contact> {
    return this.http.get(this.host + '/api/contacts/' + slug).pipe(
      catchError((error: HttpErrorResponse) => {
        this.pageNotFound.emit()
        return throwError(error);
      }),
      map((data: any) => {
        return data as Contact;
      }),


    )
  }

  public addContact(contact: Contact) {
    return this.http.post<Contact>(this.host + '/api/contacts', contact).pipe(
      map((data: any) => {
        return data as Contact;
      })
    );
  }

  public editContact(contact: Contact, slug: string) {
    return this.http.put<Contact>(this.host + '/api/contacts/' + slug, contact).pipe(
      map((data: any) => {
        return data as Contact;
      })
    );
  }

  public deleteContact(slug: string) {
    return this.http.delete(this.host + '/api/contacts/' + slug);
  }
}

export interface ContactsDto {
  contacts: Contact[],
  totalItems: number
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string,
  note: string,
  slug: string
}
