import { Injectable, Inject } from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: any
  ) { }

  public updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  public updateDescription(description: string) {
    this.metaService.updateTag({ name: 'description', content: description })
  }

}
