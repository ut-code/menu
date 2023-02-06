import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

import express from "express"
// import cors from "cors"

const app = express()

// app.use(cors({ origin: process.env["WEB_ORIGIN"] }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
console.log("success")

app.get("/feed", async (req, res) => {
  const posts = await prisma.todo2.findMany({
    // where: { published: true },
  })
  res.json(posts)
})

app.listen(3000)
