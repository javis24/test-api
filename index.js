import express  from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore  from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js"
import ScheduledClassRoute from "./routes/ScheduledClassRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

 (async()=>{
     await db.sync();
 })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'api-coningles-api-conignles.ywdlku.easypanel.host'
}));
app.use(express.json());
app.use(UserRoute);
app.use(ScheduledClassRoute);
app.use(AuthRoute);

 store.sync();
app.listen(process.env.APP_PORT, ()  => {
    console.log('Servidor corriendo en el puerto....');
});

