"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var trpc_1 = require("./trpc");
var file_1 = require("../routers/file");
var files_1 = require("../routers/files");
var upload_1 = require("../routers/upload");
// Merge all feature routers
exports.appRouter = (0, trpc_1.router)({
    file: file_1.fileRouter,
    files: files_1.filesRouter,
    upload: upload_1.uploadRouter
});
