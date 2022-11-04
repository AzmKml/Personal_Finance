const router = require("express").Router();
const WalletController = require("../controllers/wallet-controller");

router.get("/", WalletController.getAllWallet);
router.post("/", WalletController.addNewWallet);
router.get("/:walletId", WalletController.getDetailWallet);
router.patch("/:walletId", WalletController.updateWallet);
router.delete("/:walletId", WalletController.deleteWallet);

module.exports = router;
