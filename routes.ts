import express, { Express, Request, Response } from "express"
import login from "./src/rest/user/login"
import signup from "./src/rest/user/signup"
import user from "./src/rest/user/user"
import plan from "./src/rest/plan/plan"
import creator from "./src/rest/creator/creator"
import category from "./src/rest/category"
import course from "./src/rest/course"
import card from "./src/rest/card"

export const router = express.Router()

router.get("/", (req: Request, response: Response) => {
    response.status(200).json({ success: true })
})

router.use("/login", login)
router.use("/signup", signup)
router.use("/user", user)
router.use("/plan", plan)
router.use("/creator", creator)
router.use("/category", category)
router.use("/course", course)
router.use("/card", card)
