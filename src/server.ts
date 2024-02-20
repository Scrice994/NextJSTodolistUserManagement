import mongoose from "mongoose";
import { app } from "./index";
import env from "./env";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_URL)
.then(() => {
    console.log("UserManagement connect to MONGO");
    app.listen(port, () => {
        console.log("UserManagement running on port: " + port)
    })
})
.catch( err => console.error(err));