import passport from "passport";
import passportLocal from "passport-local";
import User from "../models/user";
import { IUser } from "../models/user";

// stores the user's id in session to be used during deserialization
passport.serializeUser((user: IUser, done) => {
	user && user._id ? done(null, user._id) : done(null, false);
});

// fetches user's data from the database in every request using their id that is stored in session
passport.deserializeUser(async (id: string, done) => {
	const user = await User.findOne({ _id: id });
	return done(null, user);
});

passport.use(
	"local-login",
	new passportLocal.Strategy((username, password, done) => {
		User.findOne({ username: username })
			.then(async user => {
				if (!user) {
					return done(null, false, { message: "Username does not exist." });
				}

				if (!(await user.verifyPassword(password))) {
					return done(null, false, { message: "Password is incorrect." });
				}
			})
			.catch(err => {
				console.error(err);
				return done(err);
			});
	})
);

export default passport;
