import { Request, Response, Router } from "express";
import { Borrow } from "../models/borrow.model";

export const borrowRouter = Router();

borrowRouter.post("/", async (req: Request, res: Response) => {
	try {
		const data = req.body;

		const borrow = await Borrow.create(data);

		res.status(200).json({
			success: true,
			message: "Book borrowed successfully",
			data: borrow,
		});
	} catch (err: any) {
		if (err.name === "Error") {
			res.status(400).json({
				success: false,
				message: err.message,
				error: err,
			});
		}

		res.status(400).json({
			success: false,
			message: "Book borrow unsuccessfull",
			error: err,
		});
	}
});

borrowRouter.get("/", async (req: Request, res: Response) => {
	try {
		const borrowSummary = await Borrow.aggregate([
			{
				$group: {
					_id: "$book",
					totalQuantity: { $sum: "$quantity" },
				},
			},
			{
				$lookup: {
					from: "books",
					localField: "_id",
					foreignField: "_id",
					as: "book",
				},
			},
			{
				$unwind: "$book",
			},
			{
				$project: {
					_id: 0,
					"book.title": 1,
					"book.isbn": 1,
					totalQuantity: 1,
				},
			},
		]);

		res.status(200).json({
			success: true,
			message: "Borrowed books summary retrieved successfully",
			data: borrowSummary,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: "Borrowed books summary can't be retrieved",
			error: err,
		});
	}
});
