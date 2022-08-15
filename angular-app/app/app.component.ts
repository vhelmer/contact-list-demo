import { Component } from '@angular/core';
import {ContactService} from "./contact.service";
import {ChildrenOutletContexts} from "@angular/router";
import {slideInAnimation} from "./animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {

  showErrorPage: boolean = false;

  constructor(private contexts: ChildrenOutletContexts, contactService: ContactService) {
    contactService.pageNotFound.subscribe(() => {
      this.showErrorPage = true;
    })
  }

  getRouteAnimationData() {
    let data = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    return data;
  }
}
