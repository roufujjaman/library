import { NextFunction, Request, response, Response, Router } from "express";
import { Book } from "../models/book.model";

export const bookRoute = Router();

bookRoute.post("/", async (req: Request, res: Response) => {
	try {
		const book = await Book.create(req.body);
		res.status(200).json({
			success: true,
			message: "Book created successfully",
			data: book,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: err._message || "Couldn't create the book",
			error: err,
		});
	}
});

bookRoute.get("/", async (req: Request, res: Response) => {
	try {
		const data = req.query;

		const filter: any = {};
		const sort: any = {};
		let limit: number = 10;

		if (typeof data.filter === "string") {
			filter["genre"] = data.filter.toUpperCase();
		}

		if (typeof data.sortBy == "string" && typeof data.sort === "string") {
			sort[data.sortBy] = data.sort.toLowerCase();
		}

		if (typeof data.limit === "string") {
			const parsed = parseInt(data.limit);
			if (!isNaN(parsed)) {
				limit = parsed;
			}
		}

		const books = await Book.find(filter).sort(sort).limit(limit);

		if (books.length === 0) {
			console.log(books.length);

			res.status(200).json({
				success: false,
				message: "No Books found with current filters",
				data: books,
			});
		}

		res.status(200).json({
			success: true,
			message: "Books retrieved successfully",
			data: books,
		});
	} catch (err: any) {
		res.status(500).json({
			success: false,
			message: "No Books found",
			error: err,
		});
	}
});

bookRoute.get("/:bookId", async (req: Request, res: Response) => {
	try {
		const bookId = req.params.bookId;

		const book = await Book.findOne({ _id: bookId });

		if (!book) {
			res.status(404).json({
				success: false,
				message: "Book isn't found",
				data: null,
			});
		}

		res.status(200).json({
			success: true,
			message: "Book retrieved successfully",
			data: book,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Book isn't found",
			error: err,
		});
	}
});

bookRoute.put(
	"/:bookId",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body;
			const bookId = req.params.bookId;

			const { copies, ...rest } = data;
			const query = rest;

			if (copies && copies > 0) {
				query.$inc = { copies: copies };
			}

			const book = await Book.findByIdAndUpdate(bookId, query, {
				new: true,
			});

			if (!book) {
				res.status(404).send({
					success: false,
					message: "Book isn't found",
					data: null,
				});
			}

			res.status(200).json({
				success: true,
				message: "Book updated successfully",
				data: book,
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: "Couldn't update the book",
				error: err,
			});
		}
	}
);

bookRoute.delete("/:bookId", async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const bookId = req.params.bookId;

		const book = await Book.findByIdAndDelete(bookId);

		if (!book) {
			res.status(404).json({
				success: false,
				message: "Book isn't found",
				data: null,
			});
		}

		res.status(200).json({
			success: true,
			message: "Book deleted successfully",
			data: book,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Couldn't delete the book",
			error: err,
		});
	}
});
