import { Router } from "express";
import ShortURL from "../models/url";

const router = Router();

router.get("/", (req, res) => {
	ShortURL.find()
		.select({ _id: 0 })
		.then(results => {
			res.render("index", { results: results });
		})
		.catch(err => {
			res.sendStatus(500);
		});
});

router.get("/:shortenedURL", (req, res) => {
	const shortenedURL = req.params.shortenedURL;

	ShortURL.findOne({ short: shortenedURL })
		.then(shortURL => {
			if (shortURL) {
				shortURL.clicks++;
				shortURL.save();
				res.redirect(shortURL.full);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(404);
		});
});

router.post("/short", async (req, res) => {
	const fullURL = req.body.fullURL;
	await ShortURL.create({ full: fullURL });

	res.redirect("/");
});

export default router;
