import mongoose from "mongoose";
import { app } from "./app";

async function main() {
	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.MONGO_USER_ID}:${process.env.MONGO_USER_PASS}@cluster0.ajfqpxx.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0`
		);
		console.log("✅ Connected to MongoDB");
	} catch (err) {
		console.log("Could not connect to MongoDB");
		console.log(err);
	}
	app.listen(process.env.PORT, (err) => {
		console.log(`✅ APP IS LISTENING AT PORT: ${process.env.PORT}`);
	});
}

main();
