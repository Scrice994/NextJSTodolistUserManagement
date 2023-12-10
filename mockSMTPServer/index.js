require("dotenv").config();
const os = require("os");

const SMTPServer = require("smtp-server").SMTPServer;

const server = new SMTPServer({
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

server.listen(process.env.SMTP_PORT, () => {
    console.log("Mail mock server UP!!!");
});