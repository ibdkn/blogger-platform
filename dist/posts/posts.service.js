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
exports.postsService = void 0;
const posts_repository_1 = require("./posts.repository");
exports.postsService = {
    getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_repository_1.postsRepository.getPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);
            const postsCount = yield posts_repository_1.postsRepository.getPostsCountByBlogId(blogId);
            return {
                pageCount: Math.ceil(postsCount / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: postsCount,
                items: posts
            };
        });
    },
};
