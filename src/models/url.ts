import { Document, Schema, model } from "mongoose";
import shortId from "shortid";

export interface IURL extends Document {
	_id: string;
	full: string;
	short: string;
	clicks: number;
}

const URLSchema = new Schema<IURL>({
	full: {
		type: String,
		required: true
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
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

export default model<IURL>("URL", URLSchema);
