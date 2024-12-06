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

const performAuthLogin = () => {
  cy.visit("http://localhost:3000/login");
  cy.get('input[name="username"]').clear();
  cy.get('input[name="password"]').clear();
  // Fill in the login form and submit
  cy.get('input[name="username"]').type("moderator");
  cy.get('input[name="password"]').type("moderator@123123");
  cy.get('button[type="submit"]').click();

  // Assert that the user is redirected to the FakeStackOverflow component
  cy.url().should("eq", "http://localhost:3000/");
};

describe("Answer Page 1", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Answer Page displays expected header", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.get("#answersHeader").should(
      "contain",
      "Programmatically navigate using React router"
    );
    cy.get("#answersHeader").should("contain", "2 answers");
    cy.get("#answersHeader").should("contain", "Ask a Question");
    cy.get("#sideBarNav").should("contain", "Questions");
    cy.get("#sideBarNav").should("contain", "Tags");
  });
});

describe("Answer Page 2", () => {
  beforeEach(() => {
    performLogin();
  });

  it("Answer Page displays expected question text", () => {
    const text =
      "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.";

    cy.contains("Programmatically navigate using React router").click();

    // Wait for the question-body-container element to appear
    cy.get(".question-body-container").should("exist");

    // Perform assertions
    cy.get(".question-views").should("contain", "3 views");
    cy.get(".handlelink").should("contain", text);
    cy.get(".question-author").should("contain", "Joji John");
    cy.get(".question-meta").should("contain", "Jan 20, 2022 at 03:00:00");
  });
});
describe("Answer Page 2", () => {
  beforeEach(() => {
    performLogin();
  });

  it("Answer Page displays expected question text", () => {
    const text =
      "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.";

    cy.contains("Programmatically navigate using React router").click();

    // Wait for the question-body-container element to appear
    cy.get(".question-body-container").should("exist");

    // Perform assertions
    cy.get(".question-views").should("contain", "3 views");
    cy.get(".handlelink").should("contain", text);
    cy.get(".question-author").should("contain", "Joji John");
    cy.get(".question-meta").should("contain", "Jan 20, 2022 at 03:00:00");
  });
});

describe("Answer Page 3", () => {
  beforeEach(() => {
    performLogin();
  });
  it("Answer Page displays expected answers", () => {
    const answers = [
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();
    cy.get(".answer-text").each(($el, index) => {
      cy.wrap($el).should("contain", answers[index]);
    });
  });
});
describe("Answer Page 4", () => {
  beforeEach(() => {
    performLogin();
  });

  it("Answer Page displays expected authors", () => {
    const authors = ["hamkalo", "azad"];
    const dates = ["Nov 20", "Nov 23"];
    const times = ["03:24:42", "08:24:00"];

    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Iterate over each answer
    cy.get(".answer-author-meta").each(($answer, index) => {
      const author = authors[index];
      const date = dates[index];
      const time = times[index];

      // Within each answer, find the author and meta elements
      cy.wrap($answer).find(".answer-author").should("contain", author);

      cy.wrap($answer)
        .find(".answer-meta")
        .should("contain", date)
        .should("contain", time);
    });
  });
});
describe("Answer Page 5", () => {
  beforeEach(() => {
    performLogin();
  });

  it("should upvote and downvote question correctly", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Upvote the question
    cy.get("#upvote-question").as("upvoteQuestionButton");
    cy.get("@upvoteQuestionButton").click();
    cy.get("@upvoteQuestionButton").should("contain", 4);

    // Downvote the question
    cy.get("#downvote-question").as("downvoteQuestionButton");
    cy.get("@downvoteQuestionButton").click();
    cy.get("@downvoteQuestionButton").should("contain", 1);
  });
  it("should upvote and downvote question comment correctly", () => {
    cy.visit("http://localhost:3000");
    cy.contains(
      "android studio save string shared preference, start activity and load the saved string"
    ).click();

    // Upvote the first question comment
    cy.get("#upvote-question-comments").eq(0).as("upvoteQuestionCommentButton");
    cy.get("@upvoteQuestionCommentButton").should("contain", "3").click();
    cy.get("@upvoteQuestionCommentButton").should("contain", "4");

    // Downvote the first question comment
    cy.get("#downvote-question-comments")
      .eq(0)
      .as("downvoteQuestionCommentButton");
    cy.get("@downvoteQuestionCommentButton").should("contain", "0").click();
    cy.get("@downvoteQuestionCommentButton").should("contain", "1");
  });

  it("should upvote and downvote answer correctly", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Upvote the first question comment
    cy.get("#upvote-answer").eq(0).as("upvoteAnswertButton");
    cy.get("@upvoteAnswertButton").should("contain", "0").click();
    cy.get("@upvoteAnswertButton").should("contain", "1");

    // Downvote the first question comment
    cy.get("#downvote-answer").eq(0).as("downvoteAnswerButton");
    cy.get("@downvoteAnswerButton").should("contain", "0").click();
    cy.get("@downvoteAnswerButton").should("contain", "1");
  });

  it("should upvote and downvote answer comments correctly", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Upvote the first question comment
    cy.get("#upvote-answer-comment").eq(0).as("upvoteAnswerCommentButton");
    cy.get("@upvoteAnswerCommentButton").should("contain", "2").click();
    cy.get("@upvoteAnswerCommentButton").should("contain", "3");

    // Downvote the first question comment
    cy.get("#downvote-answer-comment").eq(0).as("downvoteAnswerCommentButton");
    cy.get("@downvoteAnswerCommentButton").should("contain", "0").click();
    cy.get("@downvoteAnswerCommentButton").should("contain", "1");
  });
});

describe("Answer Page", () => {
  beforeEach(() => {
    performLogin();
  });

  it("should add a comment to the question", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Click on the "Add Comment to Question" button
    cy.get(".CommentForQuestion").click();

    // Enter the comment text
    const commentText = "This is a test comment for the question";
    cy.get(".comment_textarea").type(commentText);

    // Submit the comment
    cy.get(".submit_button").click();

    // Assert that the comment is added to the question
    cy.get(".comments-section .comment-text").should("contain", commentText);
  });

  it("should add a comment to an answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Click on the "Reply" button for the first answer
    cy.get(".ansButton").eq(0).click();

    // Enter the comment text
    const commentText = "This is a test comment for the answer";
    cy.get(".comment_textarea").type(commentText);

    // Submit the comment
    cy.get(".submit_button").click();

    // Assert that the comment is added to the answer
    cy.get(".comments-section .comment-text").should("contain", commentText);
  });
});

describe("Answer Page", () => {
  beforeEach(() => {
    performLogin();
  });

  // Wait for the element to appear with a timeout of 5 seconds

  it("should add a comment to the question", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Click on the "Add Comment to Question" button
    cy.get(".CommentForQuestion").click();

    // Enter the comment text
    const commentText = "This is a test comment for the question";
    cy.get(".comment_textarea").type(commentText);

    // Submit the comment
    cy.get(".submit_button").click();

    cy.get("#question-comment").as("qcbutton");
    cy.get("@qcbutton").click();
    cy.get("@qcbutton").should("have.text", commentText);
    // Assert that the comment is added to the question
    // cy.get(".question-comment").should("have.text", commentText);
  });

  it("should add a comment to an answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Programmatically navigate using React router").click();

    // Click on the "Reply" button for the first answer
    cy.get(".ansButton").eq(0).click();

    // Enter the comment text
    const commentText = "This is a test comment for the answer";
    cy.get(".comment_textarea").type(commentText);

    // Submit the comment
    cy.get(".submit_button").click();

    cy.get("#answer-comment").as("acbutton");
    cy.get("@acbutton").click();
    cy.get("@acbutton").should("have.text", commentText);
  });
});

describe("Delete in Answer Page", () => {
  beforeEach(() => {
    performAuthLogin();
  });

  it("should delete a comment from the question", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Quick question about storage on android").click();

    // Get the first question comment and delete it
    cy.get("#delete-question-comment").as("dqcbutton");
    cy.get("@dqcbutton").parent().find("button").contains("Delete").click();
    cy.get("@dqcbutton").parent().find("button").contains("Delete").click();
    cy.get("@dqcbutton").should("not.exist");
  });

  it("should delete a comment from an answer", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Quick question about storage on android").click();

    // Get the first answer comment and delete it
    cy.get("#delete-answer-comment").as("acbutton");
    cy.get("@acbutton").then(($comment) => {
      if ($comment.length > 0) {
        cy.get("@acbutton").parent().find("button").contains("Delete").click();
        cy.get("@acbutton").should("not.exist");
      }
    });
  });
});
