import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const BookSchema = new Schema<IBook>(
	{
		title: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		genre: {
			type: String,
			required: true,
			trim: true,
			uppercase: true,
			enum: {
				values: [
					"FICTION",
					"NON_FICTION",
					"SCIENCE",
					"HISTORY",
					"BIOGRAPHY",
					"FANTASY",
				],
				message: "{VALUE} Is not valid",
			},
		},
		isbn: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			default: "",
		},
		copies: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value >= 0;
				},
				message: "{VALUE} Must be positive number or 0",
			},
		},
		available: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

export const Book = model<IBook>("Book", BookSchema);
