const express = require("express");
const router = express.Router();
const categoriesRouter = require("./categoriesRouter");
const walletsRouter = require("./walletsRouter");
const TransactionsRouter = require("./transactionsRouter");

router.use("/categories", categoriesRouter);
router.use("/wallets", walletsRouter);
router.use("/transactions", TransactionsRouter);

module.exports = router;
