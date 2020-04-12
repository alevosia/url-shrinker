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
	new passportLocal.Strategy(
		{
			usernameField: "emailAddress"
		},
		async (emailAddress, password, done) => {
			const user = await User.findOne({ emailAddress: emailAddress });

			if (!user) {
				return done(null, false, { message: "Email address does not exist." });
			}

			const validPassword = await user.verifyPassword(password);

			if (!validPassword) {
				return done(null, false, { message: "Password is incorrect." });
			}

			done(null, user, { message: "Login successful." });
		}
	)
);

passport.use(
	"local-signup",
	new passportLocal.Strategy(
		{
			usernameField: "emailAddress",
			passReqToCallback: true
		},
		async (req, emailAddress, password, done) => {
			const confirmPassword: string = req.body.confirmPassword;

			if (confirmPassword !== password) {
				return done(null, false, { message: "Passwords do not match." });
			}

			const user = User.findOne({ emailAddress: emailAddress });

			if (user) {
				return done(null, false, { message: "Email address is unavailable." });
			}

			const newUser = await User.create({
				emailAddress: emailAddress,
				password: password
			});

			done(null, newUser, { message: "Signup successful." });
		}
	)
);

export default passport;
