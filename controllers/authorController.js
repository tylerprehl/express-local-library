const Author = require("../models/author");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find({}).sort({ family_name: 1 }).exec();

  res.render("author_list", { title: "Author List", author_list: allAuthors });
});

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

// Handle Author create on POST.
exports.author_create_post = [
  // the 2 callback functions are passed as an array so that they occur in the proper order

  // Validate and sanitize the first name, family name, DOB, and DOD fields

  // Note - we are only validating names with Alpha to demo daisy-chaining validators,
  // it is NOT good practice to do so! (The )
  body("first_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be at least 2 characters long")
    .isAlpha()
    .withMessage("First name has non-alpha characters"),

  body("family_name")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Family name must be at least 2 characters long")
    .isAlpha()
    .withMessage("Family name has non-alpha characters"),

  /* 
  If we REALLY cared, we could do date range specification (like DOB must be such that they,
  are XX years old)

  Additionally, dates entered will result in the day immediately previous to what was submitted
  because JS parses generic date strings as a time of 0 hours UTC, so if your time zone is west of UTC
  (which is all of N. America) then the JS will display the date in  your time zone, which would 
  be a couple hours into the prior day 
  */
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    // Create an Author object with validated and sanitized data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors, so render form with sanitized values/error messages
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return; // if there were errors, this is the end
    } else {
      // The data is valid. Because we don't have a specific key to check against,
      // allow any new input

      await author.save(); // easy peasy!
      // Now redirect to new genre page
      res.redirect(author.url);
    }
  }),
];

// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
