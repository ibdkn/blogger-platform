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
exports.blogsService = void 0;
const blogs_repository_1 = require("./blogs.repository");
exports.blogsService = {
    getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogs_repository_1.blogsRepository.getBlogs(pageNumber, pageSize, sortBy, sortDirection, searchNameTerm);
            const blogsCount = yield blogs_repository_1.blogsRepository.getBlogsCount(searchNameTerm);
            return {
                pageCount: Math.ceil(blogsCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: blogsCount,
                items: blogs
            };
        });
    },
};
