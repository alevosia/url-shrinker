import mongoose from 'mongoose';
import shortId from 'shortid';


export interface IShortURL extends mongoose.Document {
    full: string,
    short: string,
    clicks: number
};

const shortURLSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

export default mongoose.model<IShortURL>('ShortURL', shortURLSchema);