import { RESPONSE } from '@nguniversal/express-engine/tokens'
import {Component, OnInit, Inject, Optional, PLATFORM_ID} from '@angular/core'
import { Response } from 'express'
import {SEOService} from "../seo.service";
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  private response: Response;
  constructor(@Optional() @Inject(RESPONSE) response: any, @Inject(PLATFORM_ID) private platformId: any, SEOService: SEOService) {
    this.response = response;
    SEOService.updateTitle("Page not found");
  }

  ngOnInit(): void {
    if(isPlatformServer(PLATFORM_ID)) {
      this.response.status(404);
    }
  }

}
