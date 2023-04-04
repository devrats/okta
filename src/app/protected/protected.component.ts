// src/app/protected.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent implements OnInit {

  isAuthenticated: boolean = false;
  name = {};

  constructor(private _router: Router, private oktaService: OktaAuthService) { }

  public async ngOnInit(): Promise<void> {
    this.isAuthenticated = await this.oktaService.isAuthenticated()
    if(this.isAuthenticated){
      this.name = this.oktaService.getUser()
    }
  }
}
