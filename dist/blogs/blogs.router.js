"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_controller_1 = require("./blogs.controller");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', blogs_controller_1.blogsController.getBlogs);
exports.blogsRouter.get('/:id', blogs_controller_1.blogsController.getBlog);
