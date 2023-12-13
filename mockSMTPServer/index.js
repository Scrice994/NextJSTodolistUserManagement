require("dotenv").config();
const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
    name: "127.0.0.1",
    secure: false,
    disabledCommands: ["STARTTLS"],
    onAuth(auth, session, cb) {
        if(auth.username === process.env.SMTP_MAIL && auth.password === process.env.SMTP_PASSWORD){
            return cb(null, { user: 123 })
        } 
        cb(new Error("Invalid username or password"));
    },
    onData(stream, session, cb) {
        stream.pipe(process.stdout); 
        stream.on("end", cb);
    },
    onConnect(session, callback) {
        return callback();
    }
});

server.listen(process.env.SMTP_PORT, "127.0.0.1",() => {
    console.log("Mail mock server UP!!!");
});