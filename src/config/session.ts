import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";

const MongoStore = connectMongo(session);

export default session({
	name: "shorturl",
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
	secret: "SECRET",
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
});
