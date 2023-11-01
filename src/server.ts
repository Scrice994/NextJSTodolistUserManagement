import mongoose from "mongoose";
import { app } from "./index";
import env from "./env";

const port = env.PORT;

mongoose.connect("mongodb://127.0.0.1:27017/TodoList")
.then(() => {
    console.log("UserManagement connect to MONGO");
    app.listen(port, () => {
        console.log("UserManagement running on port: " + port)
    })
})
.catch( err => console.error(err));