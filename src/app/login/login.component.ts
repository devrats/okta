import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';
import { Tokens } from '@okta/okta-auth-js';
//@ts-ignore
import * as OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-secure',
  template: `
    <!-- Container to inject the Sign-In Widget -->
    <div id="okta-signin-container"></div>
  `,
})
export class LoginComponent implements OnInit {
  authService;
  widget = new OktaSignIn({
    features: {
      registration: true,
    },
    el: '#okta-signin-container',
    clientId: '0oa8y3wrcyyAGF63z5d7',
    redirectUri: 'http://localhost:4200/login/callback',
    baseUrl: 'https://dev-31586241.okta.com',
    authParams: {
      pkce: true,
      issures: 'https://dev-31586241.okta.com/oauth2/default',
      scopes:['openid', 'profile', 'email']
    },
  });

  constructor(oktaAuth: OktaAuthService, router: Router) {
    this.authService = oktaAuth;

    // Show the widget when prompted, otherwise remove it from the DOM.
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case '/login':
            break;
          case '/protected':
            break;
          default:
            this.widget.remove();
            break;
        }
      }
    });
  }

  async ngOnInit() {
    const originalUri = this.authService.getOriginalUri();
    if (!originalUri) {
      this.authService.setOriginalUri('/');
    }

    const tokens: Tokens = await this.widget.showSignInToGetTokens({
      el: '#okta-signin-container',
    });
    this.authService.handleLoginRedirect(tokens);
    this.widget.hide();
  }
}
