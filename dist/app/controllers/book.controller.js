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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoute = void 0;
const express_1 = require("express");
const book_model_1 = require("../models/book.model");
exports.bookRoute = (0, express_1.Router)();
exports.bookRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err._message || "Couldn't create the book",
            error: err,
        });
    }
}));
exports.bookRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.query;
        const filter = {};
        const sort = {};
        let limit = 10;
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
        const books = yield book_model_1.Book.find(filter).sort(sort).limit(limit);
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "No Books found",
            error: err,
        });
    }
}));
exports.bookRoute.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findOne({ _id: bookId });
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Book isn't found",
            error: err,
        });
    }
}));
exports.bookRoute.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const bookId = req.params.bookId;
        const { copies } = data, rest = __rest(data, ["copies"]);
        const query = rest;
        if (copies && copies > 0) {
            query.$inc = { copies: copies };
        }
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, query, {
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Couldn't update the book",
            error: err,
        });
    }
}));
exports.bookRoute.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findByIdAndDelete(bookId);
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Couldn't delete the book",
            error: err,
        });
    }
}));
