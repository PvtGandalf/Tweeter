# Assignment 4
**Assignment and Code Blog entry due at 11:59pm on Monday, 5/18/2020**<br/>
**This assignment will not be demoed**

The goal of this assignment is to start to use Node.js and some of its built-in modules to build a very simple web server that serves static content.

You are provided with several files in `public/` implementing the Tweeter site we've been working on throughout the course, with the exception of `index.js`.  If you opened the `index.html` file in your browser, you'd see the site you're familiar with by now, with all of its styling and, when you add your own `index.js` file, its interactions.  In addition to your familiar files, you're also provided with a file `404.html`, whose purpose we'll get to in a bit.

The file `server.js` is the file you'll work on for this assignment.  Your job is to complete that file to implement a very basic Node-based web server that satisfies the following requirements:

  * First, add your name and oregonstate.edu email address to the header comment in `server.js`, so the TA grading your assignment knows who you are.

  * The server can only use Node's built-in modules (e.g. `http`, `fs`, `path`, etc.), no third-party modules.

  * The server should listen for requests on the port specified by the environment variable `PORT`.  If `PORT` is not present in the environment, the server should listen on port 3000 by default.

  * When someone requests a path from your server that corresponds to the name of one of the files in `public/` (including `404.html`), your server should respond with the contents of that file and a status code of 200.  In addition, the server's response should have the `Content-Type` header set to the appropriate value for the type of file being sent (i.e. `"text/html"` for an HTML file, `"text/css"` for a CSS file, and `"application/javascript"` for a JS file).  For example, if you run your server on port 3000 on your laptop, you should be able to access the following files by entering the following URLs into your browser:
    * `public/index.html` - [http://localhost:3000/index.html](http://localhost:3000/index.html)
    * `public/index.js` - [http://localhost:3000/index.js](http://localhost:3000/index.js)
    * `public/style.css` - [http://localhost:3000/style.css](http://localhost:3000/style.css)
    * `public/404.html` - [http://localhost:3000/404.html](http://localhost:3000/404.html)

    Note that if everything is hooked up correctly, your `index.html` and `404.html` pages will automatically have styles and interactions from `style.css` and `index.js` because the browser will see those files referenced from the HTML and make additional requests for those files.

  * When someone requests the root path (i.e. `/`) from your server, it should respond with the contents of `public/index.html` and a status code of 200.  For example, if you run your server on port 3000 on your laptop and visit [http://localhost:3000](http://localhost:3000) in your laptop's browser, your server should send the contents of `public/index.html`.

  * If someone visits a path on your site that does not correspond to the name of any of the files in `public/`, your server should respond with the contents of `public/404.html` and a status code of 404.  For example, if you run your server on port 3000 on your laptop and visit  [http://localhost:3000/thispagedoesnotexist](http://localhost:3000/thispagedoesnotexist) in your laptop's browser, your server should serve the contents of `public/404.html`.

  * Your server should read any given file in `public/` from disk only once.  In other words, the contents of each file should be cached (i.e. saved) in the server's memory after the first read, and the server should use this cache when responding with a file's contents instead of reading the file a second time.  In other words, after you read a file from disk once, you should always read it from memory.  You should add a `console.log()` statement immediately before each call to read a file to prove to yourself that each file is being read only once.

Note that since this assignment is released before assignment 3 is due, the contents of `index.js` are incomplete.  If you want to see the full site in action, including the interactions you implemented for assignment 3, you can replace the contents of `public/index.js` with your `index.js` from assignment 3.  However, no part of your grade for this assignment will be based on changes to `index.js`.  For this assignment, it only matters that you correctly serve the contents of `public/index.js`, whatever they are.

## Code Blog

Add an entry to your Code Blog reflecting on your experience with this assignment.  Here are some questions you could answer (though these aren't the only ones):

  * What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

  * What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

  * What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Piazza forum?  The TAs?  How did you use each of these resources?

  * What are one or two things you had to Google to complete the assignment?

## Submission

As always, we'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the master branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the master branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs290-sp20/assignment-4-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

In addition to submitting your assignment via GitHub, you must submit the URL to your code blog entry (e.g. http://web.engr.oregonstate.edu/~YOUR_ONID_ID/cs290/blog.html) via Canvas by the due date specified above.

## Autograding tests

Note that this repository contains some tests that will be used for auto-grading part of the assignment.  These tests will be automatically run every time you push a new commit to GitHub.  If all of the tests pass, you'll see a green checkmark on your GitHub repo page, next to the status message for the most recent commit, like the one below:

![Image](https://www.dropbox.com/s/2b6l41ppcznws3p/Screenshot%202020-05-08%2020.25.38.png?raw=true)

If any of the tests fail, you'll see a red "X" instead of a green checkmark.

You can click on either the green checkmark or the red "X" to see more details about the test results.  In this details page, you'll specifically want to look under the section labeled "Run education/autograding" to see the results of the tests.  The messages printed during testing may be somewhat cryptic, but hopefully they'll help you debug any problems.

You can also run the tests locally by running the command `npm test`.  Don't forget to run `npm install` first to install dependencies needed by the tests.

## Grading criteria

Only changes to `server.js` will be considered when grading this assignment.  Changes to other files will be ignored, though you should add the contents of your `index.js` from Assignment 3 to `public/index.js` to get the full effect of the assignment (your `index.js` won't actually be graded).  Note also that when grading, we will not run `npm install` to install third-party modules, so if you used third-party modules in your solution, it probably won't work, and you'll get a bad grade.

The assignment is worth 100 points total:

  * 15 points: server listens on the port specified by the environment variable `PORT` or 3000 by default.

  * 40 points: server serves files from `public/` with status 200 and correct `Content-Type` header when corresponding URL path is visited.
    * 10 points per file: 8 points for correctly serving file content and 2 points for correct `Content-Type` header and 200 status code

  * 10 points: server serves `public/index.html` with status 200 when the root URL path (`/`) is visited.

  * 20 points: server serves `public/404.html` with status 404 when a URL path not corresponding to any file in `public/` is visited.

  * 15 points: server reads files in `public/` exactly once and caches them.

For this assignment, the auto-grading tests cover the first 4 criteria above.  The last criterion (reading files only once) will be graded by inspecting your code.
