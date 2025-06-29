describe('TurtleShop E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe('Authentication Flow', () => {
    it('should redirect to login page when not authenticated', () => {
      cy.visit('/products');
      cy.url().should('include', '/login');
    });

    it('should login successfully with valid credentials', () => {
      cy.visit('/login');
      
      // Check if login form is visible
      cy.get('[data-cy="username-input"]').should('be.visible');
      cy.get('[data-cy="password-input"]').should('be.visible');
      
      // Fill in the login form
      cy.get('[data-cy="username-input"]').type('emilys');
      cy.get('[data-cy="password-input"]').type('emilyspass');
      
      // Submit the form
      cy.get('[data-cy="login-button"]').click();
      
      // Should redirect to products page
      cy.url().should('include', '/products');
      
      // Check if user is welcomed
      cy.contains('Welcome,').should('be.visible');
    });

    it('should show error message with invalid credentials', () => {
      cy.visit('/login');
      
      cy.get('[data-cy="username-input"]').type('invalid');
      cy.get('[data-cy="password-input"]').type('invalid');
      cy.get('[data-cy="login-button"]').click();
      
      // Should show error message
      cy.get('.p-toast-message-error').should('be.visible');
    });
  });

  describe('Products Page', () => {
    beforeEach(() => {
      // Login before each test
      cy.login();
    });

    it('should display products grid', () => {
      cy.visit('/products');
      
      // Wait for products to load
      cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 0);
      
      // Check if product information is displayed
      cy.get('[data-cy="product-title"]').first().should('be.visible');
      cy.get('[data-cy="product-price"]').first().should('be.visible');
      cy.get('[data-cy="product-image"]').first().should('be.visible');
    });

    it('should toggle favorite status', () => {
      cy.visit('/products');
      
      // Wait for products to load
      cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 0);
      
      // Click on first product's favorite button
      cy.get('[data-cy="favorite-button"]').first().click();
      
      // Check if favorites count increased
      cy.get('[data-cy="favorites-badge"]').should('contain', '1');
    });

    it('should navigate to favorites page', () => {
      cy.visit('/products');
      
      // Click on favorites button
      cy.get('[data-cy="favorites-button"]').click();
      
      // Should navigate to favorites page
      cy.url().should('include', '/favorites');
      cy.contains('Your Favorite Products').should('be.visible');
    });
  });

  describe('Favorites Page', () => {
    beforeEach(() => {
      // Login and add a favorite before each test
      cy.login();
      cy.visit('/products');
      cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-cy="favorite-button"]').first().click();
      
      cy.get('[data-cy="favorites-badge"]').should('contain', '1');
    });

    it('should display favorite products', () => {
      cy.visit('/favorites');
      
      // Should show favorite products
      cy.get('[data-cy="favorite-product"]').should('have.length.greaterThan', 0);
    });

    it('should keep unmarked products visible until navigation', () => {
      cy.visit('/favorites');
      
      // Unmark a favorite
      cy.get('[data-cy="favorite-button"]').first().click();
      
      // Product should still be visible with warning
      cy.get('[data-cy="favorite-product"]').should('have.length.greaterThan', 0);
      cy.contains('Will be removed').should('be.visible');
      
      // Navigate away and back
      cy.get('[data-cy="back-to-products"]').click();
      
      // Now the badge should show 0 favorites since we unmarked it
      cy.get('[data-cy="favorites-badge"]').should('contain', '0');
      
      // Navigate back to favorites to verify it's empty
      cy.get('[data-cy="favorites-button"]').click();
      cy.url().should('include', '/favorites');
    });

    it('should navigate back to products', () => {
      cy.visit('/favorites');
      
      cy.get('[data-cy="back-to-products"]').click();
      
      cy.url().should('include', '/products');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should logout successfully', () => {
      cy.visit('/products');
      
      cy.get('[data-cy="logout-button"]').click();
      
      // Should redirect to login page
      cy.url().should('include', '/login');
      
      // Should not be able to access protected routes
      cy.visit('/products');
      cy.url().should('include', '/login');
    });
  });
});

// Custom commands are now defined in cypress/support/commands.ts