"use strict";

require("dotenv").config();
const db = require("../db");

db.initSchema()
  .then(function () { return db.ensureDefaultCompany(); })
  .then(function (id) {
    console.log("Database ready. Default company id:", id);
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
