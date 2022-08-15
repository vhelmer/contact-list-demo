import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {ContactService, Contact} from "../contact.service";
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContactForm} from "../contactForm";
import {ActivatedRoute} from "@angular/router";
import {SEOService} from "../seo.service";

@Component({
  selector: 'app-contact-list',
  templateUrl: './note-modal.component.html'
})
export class NoteModalContent {
  @Input() note: string = "";
  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-form-modal.component.html'
})
export class ContactFormModalContent {

  contactForm = new ContactForm().create();
  public onSave: EventEmitter<Contact> = new EventEmitter();
  constructor(public activeModal: NgbActiveModal, private contactService: ContactService) {}

  onSubmit() {
    this.activeModal.close();
    this.contactService.addContact(this.contactForm.value as Contact).subscribe((contact) => {
      this.onSave.emit(contact);
    });
  }
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  currentPage: number = 1;
  page: number = 1;
  pageSize: number = 10;
  private allContacts: Contact[] = [];
  contacts : Contact[] = [];
  totalItems: number = 0;

  constructor(
    private contactService: ContactService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private SEOService: SEOService
  ) {
    this.SEOService.updateTitle("Contact list | vojta.dev");
    this.SEOService.updateDescription("A free service that takes care of your contacts. Never manually copy contacts between your devices again!");
  }

  ngOnInit(): void {
    let page = 1;
    this.route.queryParams.subscribe((params) => {
      page = parseInt(params["page"]);
      this.currentPage = isNaN(page) ? 1 : page
      this.page = this.currentPage;
      this.refreshContacts();
    });
    this.contactService.getContacts().subscribe((contactsDto) => {
      this.allContacts = contactsDto.contacts;
      this.totalItems = contactsDto.totalItems;
      this.route.queryParams.subscribe()
      this.refreshContacts()
    });
  }

  openContactForm() {
    const modalRef = this.modalService.open(ContactFormModalContent);
    modalRef.componentInstance.onSave.subscribe((contact: any) => {
      this.allContacts.push(contact);
      this.totalItems += 1;
      this.refreshContacts();
    });
  }

  openNote(note: string) {
    const modalRef = this.modalService.open(NoteModalContent);
    modalRef.componentInstance.note = note;
  }

  removeContact(slug: string) {
    this.contactService.deleteContact(slug).subscribe();
    this.allContacts = this.allContacts.filter((contact) => {
      return contact.slug !== slug;
    });
    this.totalItems -= 1;
    this.refreshContacts();
  }

  refreshContacts() {
    this.contacts = this.allContacts
      .slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
  }
}
