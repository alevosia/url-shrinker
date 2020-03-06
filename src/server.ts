import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { join } from 'path';
import mongoose from 'mongoose';
import ShortURL from './models/shortURL';

declare const process : {
    env: {
        MONGODB_CONNECTION_STRING: string,
        PORT: number
    }
}

dotenv.config();

const connectionString: string = process.env.MONGODB_CONNECTION_STRING;
const PORT = process.env.PORT || 5000;
const app = express();

app.set('views', join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {

    ShortURL.find().select({ _id: 0 })
        .then(results => {
            res.render('index', { results: results });
        })
        .catch(err => {
            res.sendStatus(500);
        });
    
});

app.get('/:shortenedURL', (req, res) => {
    const shortenedURL = req.params.shortenedURL;

    ShortURL.findOne({ short: shortenedURL })
        .then(shortURL => {

            if (shortURL) {
                shortURL.clicks++;
                shortURL.save()
                res.redirect(shortURL.full);
            } else {
                res.sendStatus(404);
            }
            
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(404);
        });
})

app.post('/short', async (req, res) => {

    const fullURL = req.body.fullURL;
    await ShortURL.create({ full: fullURL });

    res.redirect('/');
});

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to database: ${client.connection.db.databaseName}`);

        app.listen(PORT, () => {
            console.log(`Server is now listening to port ${PORT}.`);
        });
    })
    .catch(err => {
        console.error(err);
    });


