describe("Database Setup", () => {
  it("Populates and removes the database", () => {
    cy.exec("node ./server/remove_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ./server/populate_db.js mongodb://127.0.0.1:27017/fake_so");
    cy.clearLocalStorage("user");
  });
});
const performLogin = () => {
  cy.visit("http://localhost:3000/login");
  cy.get('input[name="username"]').clear();
  cy.get('input[name="password"]').clear();
  // Fill in the login form and submit
  cy.get('input[name="username"]').type("hetan");
  cy.get('input[name="password"]').type("hetan");
  cy.get('button[type="submit"]').click();

  // Assert that the user is redirected to the FakeStackOverflow component
  cy.url().should("eq", "http://localhost:3000/");
};

describe("Search 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Search string in question text", () => {
    const qTitles = [
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("navigation{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("Search 2", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Search string matches tag and text", () => {
    const qTitles = [
      "Programmatically navigate using React router",
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("navigation [React]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("Search 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Output of the search should be in newest order by default", () => {
    const qTitles = [
      "Programmatically navigate using React router",
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("android [react]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("Search 4", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Output of the search should show number of results found", () => {
    const qTitles = [
      "Programmatically navigate using React router",
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("android [react]{enter}");
    cy.contains(qTitles.length + " questions");
  });
});

describe("Search 5", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Output of the empty search should show all results ", () => {
    const qTitles = [
      "Quick question about storage on android",
      "Object storage for a web application",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("{enter}");
    cy.contains(qTitles.length + " questions");
  });
});

describe("Search 6", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Search string with non-existing tag and non-tag word", () => {
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("[NonExistingTag] nonexistingword{enter}");
    cy.contains("No Questions Found");
  });
});

describe("Search 7", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Search string with case-insensitive matching", () => {
    const qTitles = [
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("AnDrOiD{enter}");
    cy.contains("android");
  });
});
