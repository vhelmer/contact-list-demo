import {FormControl, FormGroup, Validators} from "@angular/forms";

export class ContactForm {

  create() {
    return new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      lastName: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator
      ]),
      email: new FormControl('', [
        Validators.email
      ]),
      phoneNumber: new FormControl(''),
      note: new FormControl('')
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}