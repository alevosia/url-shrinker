import { Router, Request, Response, NextFunction } from "express";
import passport from '../config/passport';
import { IUser } from '../models/user';
const router = Router();

// Middleware that checks if user is already logged in
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		next();
	}
};

router.use(isAuthenticated);

// GET /auth/login
router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local-login', {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true,
    }, (err, user: IUser ) => {
        if (err) { return next(err); }
        if (!user) { req.session?.save(err => err ? next(err) : res.redirect("/auth")); }

        req.login(user, (err) => {
            if (err) { return next(err); }
            
        })
    })
});

export default router;
