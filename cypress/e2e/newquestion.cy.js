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
  cy.get('input[name="username"]').type("hetan");
  cy.get('input[name="password"]').type("hetan");
  cy.get('button[type="submit"]').click();
  cy.url().should("eq", "http://localhost:3000/");
};

describe("New Question Form Metadata", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question creates and displays expected meta data", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click();
    cy.contains("Fake Stack Overflow");
    cy.contains("5 questions");
    cy.contains("hetan");
    cy.contains("0 seconds ago");
    const answers = [
      "0 answers",
      "1 answers",
      "2 answers",
      "3 answers",
      "2 answers",
    ];
    const views = ["0 views", "2 views", "2 views", "2 views", "2 views"];
    cy.get(".postStats").each(($el, index, $list) => {
      cy.wrap($el).should("contain", answers[index]);
      cy.wrap($el).should("contain", views[index]);
    });
    cy.contains("Unanswered").click();
    cy.get(".postTitle").should("have.length", 1);
    cy.contains("1 question");
  });
});

describe("New Question Form", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question creates and displays in All Questions", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Fake Stack Overflow");
    const qTitles = [
      "Test Question 1",
      "Test Question 1",
      "Quick question about storage on android",
      "Object storage for a web application",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});

describe("New Question Form with many tags 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question creates and displays in All Questions with necessary tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript t1 t2");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Fake Stack Overflow");
    cy.contains("javascript");
    cy.contains("t1");
    cy.contains("t2");
  });
});

describe("New Question Form with many tags 2", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question creates and displays in All Questions with necessary tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript t1 t2");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Fake Stack Overflow");
    cy.contains("javascript");
    cy.contains("android-studio");
    cy.contains("t2");
  });
});

describe("New Question Form Error Empty Title", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question with empty title shows error", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Title cannot be empty");
  });
});

describe("New Question Form Error Long Title", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question with long title shows error", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type(
      "Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
    );
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Title cannot be more than 100 characters");
  });
});

describe("New Question Form Error Empty Text", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question with empty text shows error", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTagInput").type("javascript");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Question text cannot be empty");
  });
});

describe("New Question Form Error Extra Tags", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question with more than 5 tags shows error", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("t1 t2 t3 t4 t5 t6");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("Cannot have more than 5 tags");
  });
});

describe("New Question Form Error Long New Tag", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question with a long new tag", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("New tag length cannot be more than 20");
  });
});

describe("create a new question with a new and an old tag and the question should appear in both through old tag and new tag", () => {
  beforeEach(() => {
    performLogin();
  });
  it("create a new question with a new tag and finds the question through tag", () => {
    cy.visit("http://localhost:3000");

    // add a question with tags
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1-tag1 react");
    // cy.get("#formUsernameInput").type("mks1");
    cy.contains("Post Question").click();

    // clicks tags
    cy.contains("Tags").click();
    cy.contains("test1-tag1").click();
    cy.contains("1 questions");
    cy.contains("Test Question A");

    cy.contains("Tags").click();
    cy.contains("react").click();
    cy.contains("2 questions");
    cy.contains("Test Question A");
    cy.contains("Programmatically navigate using React router");
  });
});

describe("New Question Form with same tags", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Ask a Question creates and accepts only 1 tag for all the repeated tags", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Tags").click();
    cy.contains("10 Tags");
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("test-tag test-tag test-tag");
    // cy.get("#formUsernameInput").type("joym");
    cy.contains("Post Question").click();
    cy.contains("test-tag").should("have.length", 1);
    cy.contains("Tags").click();
    cy.contains("13 Tags");
    cy.contains("test-tag").click();
    cy.contains("1 questions");
  });
});
