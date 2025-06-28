import { model, Schema, Types } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowShema = new Schema<IBorrow>(
	{
		book: {
			type: Types.ObjectId,
			required: true,
			ref: "Book",
		},
		quantity: {
			type: Number,
			required: true,
			min: [1, "Minimum 1 Book needs to be borrowed"],
		},
		dueDate: {
			type: Date,
			required: true,
			validate: {
				validator: function (val) {
					const dueDate = new Date(val);
					const today = new Date();
					return dueDate > today;
				},
				message: "Due date must be a future date",
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

borrowShema.pre("save", async function (next) {
	try {
		const book = await Book.findById(this.book);

		if (!book) {
			next(new Error("Book isn't found"));
		} else if (this.quantity > book.copies) {
			next(new Error("Not sufficient book to borrow"));
		} else {
			book.copies -= this.quantity;
			await book.save();
			next();
		}
	} catch (err: any) {
		next(err);
	}
});

export const Borrow = model<IBorrow>("Borrow", borrowShema);
