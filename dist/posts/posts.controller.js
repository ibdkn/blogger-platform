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
exports.postsController = void 0;
const pagination_helper_1 = require("../helpers/pagination.helper");
const posts_service_1 = require("./posts.service");
exports.postsController = {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = (0, pagination_helper_1.paginationPostQueries)(req);
            const posts = yield posts_service_1.postsService.getPosts(pageNumber, pageSize, sortBy, sortDirection);
            res.status(200).json(posts);
        });
    },
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const post = yield posts_service_1.postsService.getPost(id);
            if (!post) {
                res.status(404).json({
                    errorsMessages: [{ field: 'id', message: 'Post not found' }],
                });
                return;
            }
            res.status(200).json(post);
        });
    },
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield posts_service_1.postsService.createPost(req.body);
            res.status(201).json(newPost);
        });
    },
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const errors = yield posts_service_1.postsService.updatePost(id, req.body);
            // Если репозиторий вернул ошибки, отправляем 404 с описанием
            if (errors) {
                res.status(404).json({ errorsMessages: errors });
                return;
            }
            // Если всё успешно, отправляем 204
            res.status(204).send();
        });
    },
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const errors = yield posts_service_1.postsService.deletePost(id);
            // Если репозиторий вернул ошибки, отправляем 404 с описанием
            if (errors) {
                res.status(404).json({ errorsMessages: errors });
                return;
            }
            // Если всё успешно, отправляем 204
            res.status(204).send();
        });
    }
};
