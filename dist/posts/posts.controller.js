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
const posts_repository_1 = require("./posts.repository");
exports.postsController = {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_repository_1.postsRepository.getAllPosts();
            res.status(200).json(posts);
        });
    },
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_repository_1.postsRepository.getPost(req.params.id);
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
            const newPost = yield posts_repository_1.postsRepository.createPost(req.body);
            res.status(201).json(newPost);
        });
    },
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
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
            const errors = yield posts_repository_1.postsRepository.deletePost(req.params.id);
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
