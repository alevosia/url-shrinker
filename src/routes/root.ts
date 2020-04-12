import { Router } from "express";
import URL from "../models/url";

const router = Router();

// GET /
router.get("/", async (req, res) => {
	const results = await URL.find();
	res.render("index", { results: results });
});

// GET /:shortenedURL
router.get("/:shortenedURL", async (req, res) => {
	const shortenedURL = req.params.shortenedURL;
	const url = await URL.findOne({ short: shortenedURL });
	if (!url) {
		return res.sendStatus(404);
	}
	res.redirect(url.full);
	url.clicks++;
	url.save();
});

// GET /short
router.post("/short", async (req, res) => {
	const fullURL = req.body.fullURL;
	await URL.create({ full: fullURL });
	res.redirect("/");
});

export default router;
