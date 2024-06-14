import { config } from "dotenv";
import app from "./src/app.js";
import db from "./src/db.js";

config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server running on port:' + PORT);
})