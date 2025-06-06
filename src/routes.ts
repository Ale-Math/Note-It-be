import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { zodSigninSchema, zodSignupSchema, zodTodoSchema } from "./types/types";
import { Project, SharedTodo, Todo, User } from "./db";
import bycrpt from "bcrypt";
import { middleware } from "./authentication";
import jwt from "jsonwebtoken";

export const router = express.Router();
router.use(express.json());
router.use(cors());
const SALT_ROUNDS = 2;

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const data = zodSignupSchema.parse(req.body);

    const checkUser = await User.findOne({
      email: data.email,
    });

    if (checkUser) {
      res.json({
        message: "User already exists.",
      });
    } else {
      const hashedPassword = bycrpt.hashSync(data.password, SALT_ROUNDS);
      await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      const token = jwt.sign(data.email, process.env.JWT_SECRET!);

      res.json({
        token,
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Enter the correct details",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const data = zodSigninSchema.parse(req.body);

    const foundUser = await User.find({
      email: data.email,
    });
    const comparePasswords = bycrpt.compareSync(
      data.password,
      foundUser[0].password!
    );
    if (comparePasswords) {
      const token = jwt.sign(data.email, process.env.JWT_SECRET!);

      res.json({
        token,
      });
    } else {
      res.status(403).json({
        message: "Enter the correct password!",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: "Enter the correct details",
    });
  }
});

router.post("/todo", middleware, async (req: Request, res: Response) => {
  try {
    const data = zodTodoSchema.parse(req.body);
    const foundUser = await User.find({
      email: req.email,
    });

    await Todo.create({
      todo: data.todo,
      description: data.description,
      user: foundUser[0]._id,
    });

    res.json({
      message: "Todo created",
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: "User not authorised.",
    });
  }
});

router.get("/userdetails", middleware, async (req: Request, res: Response) => {
  try {
    const data = await User.find({
      email: req.email,
    });

    res.json({
      data,
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: "User not found.",
    });
  }
});

router.delete(
  "/todo/:todo",
  middleware,
  async (req: Request, res: Response) => {
    const { todo } = req.params;
    try {
      const foundUser = await User.find({
        email: req.email,
      });
      await Todo.deleteOne({
        todo: todo,
        user: foundUser[0]._id,
      });

      res.json({
        message: "Todo deleted!",
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: "There was an error while deleting the todo!",
      });
    }
  }
);

router.put(
  "/updatetodo/:todo",
  middleware,
  async (req: Request, res: Response) => {
    const newTodo = req.body.todo;
    const newDescription = req.body.description;

    const todo = req.params["todo"];

    try {
      const foundUser = await User.find({
        email: req.email,
      });

      await Todo.findOneAndUpdate(
        {
          todo: todo,
          user: foundUser[0]._id,
        },
        {
          $set: { todo: newTodo, description: newDescription },
        }
      );

      res.json({
        message: "Todo updated!",
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: "There was an error while updating the todo!",
      });
    }
  }
);

router.put(
  "/tododone/:todo",
  middleware,
  async (req: Request, res: Response) => {
    const { todo } = req.params;
    const done = req.body.done;
    try {
      const foundUser = await User.find({
        email: req.email,
      });

      await Todo.findOneAndUpdate(
        {
          todo: todo,
          user: foundUser[0]._id,
        },
        {
          $set: { done: done },
        }
      );

      res.json({
        message: "Todo updated!",
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: "There was an error while updating the todo!",
      });
    }
  }
);

router.get("/notdonetodos", middleware, async (req: Request, res: Response) => {
  try {
    const foundUser = await User.find({
      email: req.email,
    });

    const allTodos = await Todo.find({
      user: foundUser[0]._id,
      done: false,
    });

    res.json({
      allTodos,
    });
  } catch (e) {
    res.status(403).json({
      message: "Error while retrieving todos",
    });
  }
});

router.get("/donetodos", middleware, async (req: Request, res: Response) => {
  try {
    const foundUser = await User.find({
      email: req.email,
    });

    const allTodos = await Todo.find({
      user: foundUser[0]._id,
      done: true,
    });

    res.json({
      allTodos,
    });
  } catch (e) {
    res.status(403).json({
      message: "Error while retrieving todos",
    });
  }
});

router.post("/newproject", middleware, async (req: Request, res: Response) => {
  const projectName = req.body.project;
  const sharedUser = req.body.sharedemail;

  try {
    const sharedFoundUser = await User.find({
      email: sharedUser,
    });

    if (sharedFoundUser[0]) {
      const foundUser = await User.find({
        email: req.email,
      });

      const checkProject = await Project.findOne({
        project: projectName,
      });

      if (!checkProject) {
        await Project.create({
          project: projectName,
          sharedUser,
          user: foundUser[0]._id,
        });

        res.json({
          message: "Project created!",
        });
      } else {
        res.json({
          message: "Project name already exists!",
        });
      }
    } else {
      res.json({
        message: "User does not exist!",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post(
  "/sharedtodo/:project",
  middleware,
  async (req: Request, res: Response) => {
    const { project } = req.params;

    try {
      const data = zodTodoSchema.parse(req.body);
      const foundUser = await User.find({
        email: req.email,
      });

      const projectData = await Project.find({
        project,
        user: foundUser[0]._id,
      });

      const sharedUserData = await User.find({
        email: projectData[0].sharedUser,
      });

      await SharedTodo.create({
        todo: data.todo,
        description: data.description,
        user: foundUser[0]._id,
        sharedUser: sharedUserData[0]._id,
        project: projectData[0]._id,
      });

      res.json({
        message: "Todo created",
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({
        message: "User not authorised.",
      });
    }
  }
);

router.get(
  "/shareduserdetails/:project",
  middleware,
  async (req: Request, res: Response) => {
    const { project } = req.params;
    try {
      const foundUser = await User.find({
        email: req.email,
      });
      const projectData = await Project.find({
        project,
        user: foundUser[0]._id,
      });

      const sharedUserData = await User.find({
        email: projectData[0].sharedUser,
      });

      res.json({
        sharedUserData,
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({
        message: "User not found.",
      });
    }
  }
);
