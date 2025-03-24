/// <reference types="cypress" />

describe('Authentifizierung', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('sollte erfolgreich einloggen und zum Dashboard navigieren', () => {
    // Mock API-Antworten
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['user'],
        },
      },
    }).as('login');

    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 200,
      body: {
        message: 'Token refreshed successfully',
      },
    }).as('refresh');

    // Login-Formular ausfüllen
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Überprüfe API-Aufruf
    cy.wait('@login').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Überprüfe Navigation zum Dashboard
    cy.url().should('include', '/dashboard');

    // Überprüfe, ob die Benutzerinformationen angezeigt werden
    cy.get('[data-testid="user-email"]').should('contain', 'test@example.com');
  });

  it('sollte bei ungültigen Anmeldedaten einen Fehler anzeigen', () => {
    // Mock fehlgeschlagenen Login
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        message: 'Ungültige Anmeldedaten',
      },
    }).as('loginFailed');

    // Login-Formular mit falschen Daten ausfüllen
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Überprüfe API-Aufruf
    cy.wait('@loginFailed').then((interception) => {
      expect(interception.response?.statusCode).to.equal(401);
    });

    // Überprüfe Fehlermeldung
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Ungültige Anmeldedaten');
  });

  it('sollte erfolgreich ausloggen', () => {
    // Mock API-Antworten
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['user'],
        },
      },
    }).as('login');

    cy.intercept('POST', '**/auth/logout', {
      statusCode: 200,
      body: {
        message: 'Logged out successfully',
      },
    }).as('logout');

    // Einloggen
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Warte auf Navigation zum Dashboard
    cy.url().should('include', '/dashboard');

    // Ausloggen
    cy.get('[data-testid="logout-button"]').click();

    // Überprüfe API-Aufruf
    cy.wait('@logout').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Überprüfe Navigation zur Login-Seite
    cy.url().should('include', '/login');
  });

  it('sollte den Access Token automatisch erneuern', () => {
    // Mock API-Antworten
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          email: 'test@example.com',
          roles: ['user'],
        },
      },
    }).as('login');

    // Mock abgelaufenen Access Token
    cy.intercept('GET', '**/api/protected-route', {
      statusCode: 401,
      body: {
        message: 'Token expired',
      },
    }).as('expiredToken');

    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 200,
      body: {
        message: 'Token refreshed successfully',
      },
    }).as('refresh');

    // Einloggen
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Warte auf Navigation zum Dashboard
    cy.url().should('include', '/dashboard');

    // Simuliere abgelaufenen Token
    cy.visit('/protected-route');

    // Überprüfe Token-Erneuerung
    cy.wait('@expiredToken');
    cy.wait('@refresh').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
  });
}); 