import express, { Request, Response } from "express";
import cors from "cors"
import 'dotenv/config';
import { zodSigninSchema, zodSignupSchema, zodTodoSchema } from "./types/types";
import { Todo, User } from "./db";
import bycrpt from "bcrypt";
import { middleware } from "./authentication";
import jwt from "jsonwebtoken"
import { todo } from "node:test";

export const router = express.Router();
router.use(express.json());
router.use(cors());

router.post("/signup", async (req: Request, res: Response) => {

    try {
    const data = zodSignupSchema.parse(req.body);
    const hashedPassword = bycrpt.hashSync(data.password, 2);
    await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });
res.json({
    message: "Signed up successfully"
})
    } catch(e){ 
        
        res.json({
        message: "Enter the correct details"
        })
        return;
    }
});

router.post("/signin", async (req: Request, res: Response) => {
    try {
    const data = zodSigninSchema.parse(req.body);
            const foundUser = await User.find({
                email: data.email
            });
            
            const token = jwt.sign(data.email, process.env.JWT_SECRET!)

        res.json({
            message: token
        })

            

    } catch(e) {
        res.json({
            message: "Enter the correct details"
        })
    }



});

router.post("/todo", middleware, async (req: Request, res: Response) => {

    try{
        const data = zodTodoSchema.parse(req.body);
        const foundUser = await User.find({
            email: req.email
        })

        await Todo.create({
            todo: data.todo,
            user: foundUser[0]._id
        })

        res.json({
            message: "Todo created"
        })
    } catch(e) {
        console.log(e);
    res.json({
        message: "User not authorised."
    })
}
});

router.delete("/todo/:todo", middleware, async (req: Request, res: Response) => {
    const { todo } = req.params;
    try {
    const foundUser = await User.find({
        email: req.email
    })
    await Todo.deleteOne({
        todo: todo,
        user: foundUser[0]._id
    })

    res.json({
        message: "Todo deleted!"
    })

} catch(e) {

    console.log(e);
    res.json({
        message: "There was an error while deleting the todo!"
    })
}
});

router.put("/updatetodo/:todo", middleware, async (req: Request, res: Response) => {
    const newTodo = req.body.todo;
    const { todo } = req.params;
    try {
        const foundUser = await User.find({
            email: req.email
        })

        const todoId = await Todo.findOne({
            todo: todo,
            user: foundUser[0]._id
        })

        
        await Todo.findOneAndUpdate({
            todo: todo,
            user: foundUser[0]._id
        },
    {
        $set: {todo: newTodo}
    })

        res.json({
            message: "Todo updated!"
        })
    
    } catch(e) {
    
        console.log(e);
        res.json({
            message: "There was an error while updating the todo!"
        })
    }
});


router.get("/todo", (req: Request, res: Response) => {
    res.json({
        message: "get all todos endpoint"
    })
});

