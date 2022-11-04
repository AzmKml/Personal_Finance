const router = require("express").Router();
const TransactionController = require("../controllers/transaction-controller");

router.get("/", TransactionController.getTransaction);
router.post("/", TransactionController.addTransaction);
router.get("/:transactionId", TransactionController.getDetailTransaction);
router.delete("/:transactionId", TransactionController.deleteTransaction);
router.put("/:transactionId", TransactionController.updateTransaction);

module.exports = router;
