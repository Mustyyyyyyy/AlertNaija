const express = require("express");

const {
  getAgencies
} = require("../controllers/agency.controller");

const router = express.Router();

router.get("/", getAgencies);

module.exports = router;