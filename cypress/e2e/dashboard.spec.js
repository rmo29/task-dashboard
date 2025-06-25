// cypress/e2e/dashboard.spec.js
describe("Dashboard flows", () => {
  it("logs in and creates a project", () => {
    cy.visit("/auth/login");
    cy.get("input[type=email]").type("user@example.com");
    cy.get("input[type=password]").type("securepass");
    cy.get("button").contains("Sign in").click();
    cy.url().should("include", "/");
    cy.get("button").contains("New Project").click();
    cy.get('input[placeholder="Project Name"]').type("Cypress Project");
    cy.get("button[type=submit]").click();
    cy.contains("Cypress Project");
  });
});
