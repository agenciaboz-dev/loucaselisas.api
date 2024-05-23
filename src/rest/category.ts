import express, { Express, Request, Response } from "express"
import { Category, CategoryForm, PartialCategory } from "../class/Category"
import { UploadedFile } from "express-fileupload"
const router = express.Router()

router.get("/list/admin", async (request: Request, response: Response) => {
    try {
        const categories = await Category.list(true)
        response.json(categories)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/list", async (request: Request, response: Response) => {
    try {
        const categories = await Category.list()
        response.json(categories)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/", async (request: Request, response: Response) => {
    try {
        const data = JSON.parse(request.body.data) as CategoryForm
        const category = await Category.new(data)

        if (request.files) {
            const file = request.files.file as UploadedFile
            await category.updateCover(file)
        }

        response.json(category)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    try {
        const data = JSON.parse(request.body.data) as PartialCategory
        const category = new Category(data.id)
        await category.init()

        if (request.files) {
            const file = request.files.file as UploadedFile
            await category.updateCover(file)
        }

        await category.update(data)
        response.json(category)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/courses", async (request: Request, response: Response) => {
    const category_id = request.query.category_id as string | undefined

    if (category_id) {
        try {
            const category = new Category(category_id)
            await category.init()
            const courses = await category.getCourses()
            response.json(courses)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("category_id param is required")
    }
})

export default router
