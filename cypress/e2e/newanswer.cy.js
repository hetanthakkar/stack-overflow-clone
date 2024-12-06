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

describe("New Answer Page 7", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Create new answer should increase the count of the answers on question page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("2 answers");
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("joym");
    cy.get("#answerTextInput").type("Test Answer 1");
    cy.contains("Post Answer").click();
    cy.contains("3 answers");
  });
});

describe("New Answer Page 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Create new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "Test Answer 1",
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    // cy.get('input[name="answerUsernameInput"]').clear();

    // cy.get("#answerUsernameInput").type("joym");
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click();

    // Assert that the newly posted answer is displayed
    cy.get(".answer-container").first().should("contain", answers[0]);
    cy.contains("hetan");
    cy.contains("0 seconds ago");
  });
});

describe("New Answer Page 2", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Username is mandatory when creating a new answer", () => {
    const answers = [
      "Test Answer 1",
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click();
    // cy.contains("Username cannot be empty");
  });
});

describe("New Answer Page 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Answer is mandatory when creating a new answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").type("joym");
    cy.contains("Post Answer").click();
    cy.contains("Answer text cannot be empty");
  });
});

describe("New Answer Page 4", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully displays the username textbox for the new answer page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerUsernameInput").should("exist");
  });
});

describe("New Answer Page 5", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully displays the answer textbox for the new answer page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.get("#answerTextInput").should("exist");
  });
});

describe("New Answer Page 6", () => {
  beforeEach(() => {
    performLogin();
  });
  it("successfully displays the UserName and Answer Text fields for the new answer page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.contains("Answer Question").click();
    cy.contains("Username");
    cy.contains("Answer Text");
  });
});
