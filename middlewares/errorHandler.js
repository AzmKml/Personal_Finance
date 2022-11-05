function errorHandler(error, req, res, next) {
  console.log(error, "<<< error handler");
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = error.errors.map((error) => {
      return error.message;
    });
    res.status(400).json({ message: errors });
  } else if (error.name === "Invalid Id") {
    res.status(400).json({ message: "Invalid id" });
  } else if (error.name === "Invalid input") {
    res.status(400).json({ message: "Please check your input" });
  } else if (error.name === "Minus Balance") {
    res.status(400).json({ message: "Your Balance can't minus" });
  } else if (error.name === "NotFound") {
    res.status(404).json({ message: "Data not found" });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = errorHandler;
