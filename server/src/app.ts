import cors from "cors";
import express from "express";
import { MONGODB_URL, PORT } from "./constants/constants";
import connect from "./db/connect";
import routes from "./routes/index";

const app = express()

app.use(cors({
    origin: "*"
}
))
app.use(express.json())
app.use(routes)

app.listen(PORT, async()=>{
await connect(MONGODB_URL)
console.log(`server is running on port: ${PORT}`)
})