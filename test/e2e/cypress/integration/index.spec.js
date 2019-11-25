/// <reference types="Cypress" />

context('Remember-Me', () => {
	beforeEach(() => {
		cy.visit('localhost:3000')
	});

	describe('When user attempts to log in', () => {
		beforeEach(() => {
			cy.get('[data-cy=login-button]').click();
		});

		it('should log in successfully', () => {
			cy.get('body').contains('You are logged in');
		});

		describe('And then the user re-visits the website', () => {
			beforeEach(() => {
				cy.reload();
			});

			it('should not be logged-in', () => {
				cy.get('body').contains('You are not logged in');
			});
		});
	});

	describe('When the user clicks on the remember-me checkbox', () => {
		beforeEach(() => {
			cy.get('[data-cy=remember-me-checkbox]').click();
		});

		describe('And then attempts to log in', () => {
			beforeEach(() => {
				cy.get('[data-cy=login-button]').click();
			});

			it('should log in successfully', () => {
				cy.get('body').contains('You are logged in');
			});

			describe('And the user re-visits the website', () => {
				beforeEach(() => {
					cy.wait(100);
					cy.reload();
				});

				it('should be logged-in', () => {
					cy.get('body').contains('You are logged in');
				});
			});
		});
	});
});
