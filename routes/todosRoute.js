const express = require("express");
const { body, param } = require("express-validator");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

const {
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
} = require("../controllers/todosController");

router.get("/", isAuth, getTodos);

router.post(
  "/",
  isAuth,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isLength({ min: 3 })
      .withMessage("Title should be at least 3 characters long."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 3 })
      .withMessage("Description should be at least 3 characters long."),
  ],
  postTodo
);

router.patch(
  "/:todoId",
  isAuth,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isLength({ min: 3 })
      .withMessage("Title should be at least 3 characters long."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 3 })
      .withMessage("Description should be at least 3 characters long."),
    body("isDone").isBoolean(),
    param("todoId")
      .trim()
      .notEmpty()
      .withMessage("A todo is required to have an ID."),
  ],
  patchTodo
);

router.delete(
  "/:todoId",
  isAuth,
  [param("todoId").trim().notEmpty().withMessage("A todo Id is required.")],
  deleteTodo
);

module.exports = router;
