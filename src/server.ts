import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { join } from "path";
import mongoose from "mongoose";
import passport from "./config/passport";
import session from "./config/session";
import flash from 'connect-flash';

// Routers
import rootRouter from "./routes/root";
import authRouter from "./routes/auth";

declare const process: {
	env: {
		MONGODB_CONNECTION_STRING: string;
		PORT: number;
	};
};

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const PORT = process.env.PORT || 5000;
const app = express();

app.set("views", join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", rootRouter);
app.use("/auth", authRouter);

mongoose
	.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(client => {
		console.log(`Connected to database: ${client.connection.db.databaseName}`);

		app.listen(PORT, () => {
			console.log(`Server is now listening to port ${PORT}.`);
		});
	})
	.catch(err => {
		console.error(err);
	});
