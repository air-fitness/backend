const knex = require("knex");
const knexConfig = require("../knexfile.js");

const environment = process.env.ENVIRONMENT || "development";
console.log("environment", process.env.ENVIRONMENT);

module.exports = knex(knexConfig[environment]);
