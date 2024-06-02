import { config } from "dotenv";
import app from "./app.js";
import db from "./db.js";
config()

const PORT = process.env.PORT

db()
app.listen(PORT, () => {
    console.log('Server running on port:' + PORT)
})