import express, { Request, Response } from "express";
import cors from "cors"
import 'dotenv/config';
import { zodSignupSchema } from "./types/types";
import { User } from "./db";
import bycrpt from "bcrypt";

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

router.post("/signin", (req: Request, res: Response) => {
    res.json({
        message: "signin endpoint"
    })
});

router.post("/todo", (req: Request, res: Response) => {
    res.json({
        message: "create todo endpoint"
    })
});

router.delete("/todo", (req: Request, res: Response) => {
    res.json({
        message: "delete todo endpoint"
    })
});

router.put("/todo", (req: Request, res: Response) => {
    res.json({
        message: "edit todo endpoint"
    })
});

router.get("/todo", (req: Request, res: Response) => {
    res.json({
        message: "get all todos endpoint"
    })
});

