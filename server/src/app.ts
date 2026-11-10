import express from "express"
import { MONGODB_URL, PORT } from "./constants/constants"
import connect from "./db/connect"

const app = express()

app.listen(PORT, async()=>{
await connect(MONGODB_URL as string)
console.log(`server is running on port: ${PORT}`)
})