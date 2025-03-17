import express, { Request, Response } from "express";
import cors from "cors"
export const router = express.Router();
router.use(express.json());
router.use(cors());

router.post("/signup", (req: Request, res: Response) => {
    res.json({
        message: "signup endpoint"
    })
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
