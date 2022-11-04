const router = require("express").Router();
const CategoryController = require("../controllers/category-controller");

router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.addCategory);
router.put("/:categoryId", CategoryController.updateCategory);
router.delete("/:categoryId", CategoryController.deleteCategory);

module.exports = router;
