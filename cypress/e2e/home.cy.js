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

describe("Home Page 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows All Questions string", () => {
    cy.visit("http://localhost:3000");
    cy.contains("All Questions");
  });
});

describe("Home Page 2", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows Ask a Question button", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question");
  });
});

describe("Home Page 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows total questions number", () => {
    cy.visit("http://localhost:3000");
    cy.contains("4 questions");
  });
});

describe("Home Page 4", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows filter buttons", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Newest");
    cy.contains("Active");
    cy.contains("Unanswered");
  });
});

describe("Home Page 5", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows menu items", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Questions");
    cy.contains("Tags");
  });
});

describe("Home Page 6", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows search bar", () => {
    cy.visit("http://localhost:3000");
    cy.get("#searchBar");
  });
});

describe("Home Page 7", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows page title", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Fake Stack Overflow");
  });
});

describe("Home Page 8", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows all questions in model", () => {
    const qTitles = [
      "Quick question about storage on android",
      "Object storage for a web application",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.visit("http://localhost:3000");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("Home Page 9", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows all question stats", () => {
    const answers = ["1 answers", "2 answers", "3 answers", "2 answers"];
    const views = ["2 views", "2 views", "2 views", "2 views"];
    cy.visit("http://localhost:3000");
    cy.get(".postStats").each(($el, index, $list) => {
      cy.wrap($el).should("contain", answers[index]);
      cy.wrap($el).should("contain", views[index]);
    });
  });
});

describe("Home Page 10", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows all question authors and date time", () => {
    const authors = ["elephantCDE", "monkeyABC", "saltyPeter", "Joji John"];
    const date = ["Mar 10", "Feb 18", "Jan 10", "Jan 20"];
    const times = ["14:28:01", "01:02:15", "11:24:30", "03:00:00"];
    cy.visit("http://localhost:3000");
    cy.get(".lastActivity").each(($el, index, $list) => {
      cy.wrap($el).should("contain", authors[index]);
      cy.wrap($el).should("contain", date[index]);
      cy.wrap($el).should("contain", times[index]);
    });
  });
});

describe("Home Page 11", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows all questions in model in active order", () => {
    const qTitles = [
      "Programmatically navigate using React router",
      "android studio save string shared preference, start activity and load the saved string",
      "Quick question about storage on android",
      "Object storage for a web application",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Active").click();
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("Home Page 12", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully shows all unanswered questions in model", () => {
    const qTitles = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Unanswered").click();
    cy.contains("0 questions");
  });
});

describe("Home Page 13", () => {
  beforeEach(() => {
    performLogin();
  });
  it('successfully highlights "Questions" link when on the home page', () => {
    cy.visit("http://localhost:3000");
    cy.get(".sideBarNav")
      .contains("Questions")
      .should("have.css", "background-color", "rgb(204, 204, 204)");
  });
});

describe("Home Page 14", () => {
  beforeEach(() => {
    performLogin();
  });
  it('successfully highlights "Tags" link when on the Tags page', () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.get(".sideBarNav")
      .contains("Tags")
      .should("have.css", "background-color", "rgb(204, 204, 204)");
  });
});
