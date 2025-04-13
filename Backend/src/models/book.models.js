import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			trim: true,
		},
		location: {
			city: {
				type: String,
				required: true,
				trim: true,
			},
			state: {
				type: String,
				required: true,
				trim: true,
			},
		},
		owner: {
			ref: "User",
			type: Schema.Types.ObjectId,
		},
		status: {
			type: String,
			enum: ["available", "requested", "exchanged"],
			default: "available",
		},
		coverImage: {
			type: String,
		},
	},
	{ timestamps: true }
);
bookSchema.plugin(mongooseAggregatePaginate);

export const Book = mongoose.model("Book", bookSchema);
