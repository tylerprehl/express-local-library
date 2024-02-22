# Express - Local Library Tutorial
The goal of this tutorial is to get an introduction to building web applications using Express. The hands-on-learning experience is provided through building a "Local Library" site, where users can view, add, update, and delete certain content within the Library, including books, authors, genres, and book availability.

Although the main goal is to get an introduction to Express, the Local Library tutorial includes oodles of other learning points, including (but certainly not limited to) using MongoDB (via Mongoose) within the middleware and using the templating language Pug (formerly known as Jade) for displaying variable content.

### Tools Used
This section simply provides a list (with descriptions) of some of the more key/useful tools used throughout the project for my own future reference.
- Express Async Handler
  - Helps reduce boilerplate in asynchronous middleware functions
- Express Validator
  - Provides methods for validating and sanitizing data from forms
- Mongoose
  - Object Relational Maper (ORM) for object modeling with MongoDB
- Pug
  - HTML templating language
- Luxon
  - Used as a Date-to-String formatter

### Other Interesting Things Learned
- Better to compare against undefined with undefined as the first operand in Pug (ex - undefined === author, not author === undefined)
  - Using the latter resulted in the Date of Birth and Date of Death not being loaded back into the Create Author form on failed validation 
- Escaped vs Unescaped text is a little confusing (atm), but super important
  - Without thinking, I entered a new book with a summary that had apostrophes in it, which got converted to \&#x27; in the validation/sanitization step, and then displayed on the Book Detail page <em>exactly</em> as such