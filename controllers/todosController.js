const { validationResult } = require("express-validator");

const Todo = require("../models/todoModel");
const User = require("../models/userModel");
const errorHandler = require("../helper/errorHandler");

exports.getTodos = async (req, res) => {
  try {
    const { sort } = req.query;
    let sortBy;
    if (sort) {
      switch (sort) {
        case "newest":
          sortBy = { createdAt: -1 };
          break;
        case "oldest":
          sortBy = { createdAt: 1 };
          break;
        case "completed":
          sortBy = { isDone: -1 };
          break;
        case "uncompleted":
          sortBy = { isDone: 1 };
          break;
      }
    }

    const user = await User.findById(req.userId).populate({
      path: "todos",
      options: { sort: sortBy },
    });

    res.status(200).json({
      message: "Retrieved todos successfully.",
      todos: user.todos,
      isSuccess: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.postTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { title, description, priority } = req.body;
    const todo = new Todo({
      title,
      description,
      priority,
      userId: req.userId,
    });
    await todo.save();

    const user = await User.findById(req.userId);
    user.todos.push(todo);
    await user.save();

    res
      .status(200)
      .json({ message: "Successfully added a todo.", todo, isSuccess: true });
  } catch (error) {
    throw error;
  }
};

exports.patchTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { title, description, isDone, priority } = req.body;
    const { todoId } = req.params;

    const todo = await Todo.findById(todoId);

    if (!todo) errorHandler(404, "This todo does not exist.");

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, description, isDone, priority },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Updated a todo successfully.",
      oldTodo: {
        title: todo.title,
        description: todo.description,
        isDone: todo.isDone,
        priority: todo.priority,
      },
      updatedTodo: {
        title: updatedTodo.title,
        description: updatedTodo.description,
        isDone: updatedTodo.isDone,
        priority: updatedTodo.priority,
      },
      isSuccess: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { todoId } = req.params;

    const todo = await Todo.findById(todoId);

    if (!todo) errorHandler(404, "This todo does not exist.");

    const result = await Todo.findByIdAndDelete(todoId);

    res.status(201).json({
      message: "Successfully deleted a todo.",
      todo: result,
      isSuccess: true,
    });
  } catch (error) {
    throw error;
  }
};
