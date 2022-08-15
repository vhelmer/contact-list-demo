import { Component, OnInit } from '@angular/core';
import {Contact, ContactService} from "../contact.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactForm} from "../contactForm";
import {SEOService} from "../seo.service";

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  contactForm = new ContactForm().create();
  contact: Contact | undefined;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private SEOService: SEOService
  ) {}

  ngOnInit(): void {
    const slug: string = this.route.snapshot.paramMap.get('slug') as string;
    this.contactService.findBySlug(slug).subscribe((contact) => {
      this.contact = contact;
      this.contactForm.controls['firstName'].setValue(contact.firstName);
      this.contactForm.controls['lastName'].setValue(contact.lastName);
      this.contactForm.controls['email'].setValue(contact.email);
      this.contactForm.controls['phoneNumber'].setValue(contact.phoneNumber);
      this.contactForm.controls['note'].setValue(contact.note);
      this.SEOService.updateTitle(`${contact.firstName} ${contact.lastName}`);
    });
  }

  onSubmit(): void {
    if (this.contact) {
      console.log(this.contactForm.value);
      this.contactService.editContact(this.contactForm.value as Contact, this.contact.slug).subscribe( (contact) => {
        this.router.navigate(['/']);
      });
    }
  }

}
