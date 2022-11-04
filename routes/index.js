const express = require("express");
const router = express.Router();
const categoriesRouter = require("./categoriesRouter");
const walletsRouter = require("./walletsRouter");

router.use("/categories", categoriesRouter);
router.use("/wallets", walletsRouter);

module.exports = router;
