const { Category } = require("../models");

class CategoryController {
  static async getCategories(req, res, next) {
    try {
      const response = await Category.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async addCategory(req, res, next) {
    try {
      const { name, type } = req.body;
      const response = await Category.create({ name, type });
      res.status(201).json({
        message: `Success create category with id ${response.id}, name ${response.name}, and type ${response.type}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { name, type } = req.body;
      const id = req.params.categoryId;
      if (isNaN(+id)) throw { name: "Invalid Id" };
      if (!name || !type) throw { name: "Invalid input" };

      const checkCategory = await Category.findByPk(id);
      if (!checkCategory) throw { name: "NotFound" };

      const updatedCategory = await Category.update(
        { name, type },
        { where: { id } }
      );

      res.status(200).json({
        message: `Success update category with id ${id}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      if (isNaN(+categoryId)) throw { name: "Invalid Id" };

      const response = await Category.destroy({ where: { id: categoryId } });
      if (!response) throw { name: "NotFound" };

      res.status(200).json({
        message: `Success delete category with id ${categoryId}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
