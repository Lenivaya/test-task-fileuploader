"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
var zod_1 = require("zod");
var server_1 = require("@trpc/server");
var trpc_1 = require("../server/trpc");
var fileUploadHelper_1 = require("../utils/fileUploadHelper");
var logger_1 = require("../logger");
exports.uploadRouter = (0, trpc_1.router)({
    // Get upload progress for a file
    getProgress: trpc_1.publicProcedure
        .input(zod_1.z.object({ fileId: zod_1.z.string() }))
        .query(function (_a) {
        var input = _a.input;
        var fileId = input.fileId;
        logger_1.logger.debug({ fileId: fileId }, 'Checking upload progress');
        var progress = (0, fileUploadHelper_1.getUploadProgress)(fileId);
        if (!progress) {
            logger_1.logger.warn({ fileId: fileId }, 'Upload progress not found');
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Upload progress not found'
            });
        }
        logger_1.logger.debug({ fileId: fileId, progressPercent: progress.progress }, 'Upload progress retrieved');
        return progress;
    })
});
