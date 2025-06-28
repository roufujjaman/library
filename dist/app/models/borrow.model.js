"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book.model");
const borrowShema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Types.ObjectId,
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
}, {
    timestamps: true,
    versionKey: false,
});
borrowShema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const book = yield book_model_1.Book.findById(this.book);
            if (!book) {
                next(new Error("Book isn't found"));
            }
            else if (this.quantity > book.copies) {
                next(new Error("Not sufficient book to borrow"));
            }
            else {
                book.copies -= this.quantity;
                yield book.save();
                next();
            }
        }
        catch (err) {
            next(err);
        }
    });
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowShema);
