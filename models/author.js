const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  if (this.date_of_birth) {
    const birthDate = DateTime.fromJSDate(this.date_of_birth);
    const day_ending = getNumberSuffix(birthDate.day);
    return birthDate.toFormat("LLL d'" + day_ending + "', yyyy");
  }
  return "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  if (this.date_of_death) {
    const deathDate = DateTime.fromJSDate(this.date_of_death);
    const day_ending = getNumberSuffix(deathDate.day);
    return deathDate.toFormat("LLL d'" + day_ending + "', yyyy");
  }
  return "";
});

AuthorSchema.virtual("date_of_birth_iso").get(function () {
  if (this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth).toISODate();
  }
  return "";
});

AuthorSchema.virtual("date_of_death_iso").get(function () {
  if (this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death).toISODate();
  }
  return "";
});

function getNumberSuffix(num) {
  const th = "th";
  const rd = "rd";
  const nd = "nd";
  const st = "st";

  if (num === 11 || num === 12 || num === 13) return th;

  let lastDigit = num.toString().slice(-1);

  switch (lastDigit) {
    case "1":
      return st;
    case "2":
      return nd;
    case "3":
      return rd;
    default:
      return th;
  }
}

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
