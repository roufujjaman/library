import express, { NextFunction, Request, Response } from "express";
import { bookRoute } from "./app/controllers/book.controller";
import { Borrow } from "./app/models/borrow.model";
import { Book } from "./app/models/book.model";
import { borrowRouter } from "./app/controllers/borrow.controller";

export const app = express();

app.use(express.json());

app.use("/api/books", bookRoute);

app.use("/api/borrow", borrowRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		message: "welcome",
	});
});

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({ message: "Route is not defined" });
});
