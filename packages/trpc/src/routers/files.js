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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesRouter = void 0;
var zod_1 = require("zod");
var logger_1 = require("../logger");
var prisma_1 = require("../prisma");
var trpc_1 = require("../server/trpc");
var kafka_1 = require("../services/kafka");
var s3_1 = require("../services/s3");
var uploadFilesSchema = zod_1.z.object({
    files: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        file: zod_1.z.object({
            buffer: zod_1.z.instanceof(Buffer).optional(),
            originalname: zod_1.z.string(),
            mimetype: zod_1.z.string(),
            size: zod_1.z.number().int().positive()
        })
    }))
});
function processFileCreation(name, file) {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, s3Key, url, newFile, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!file.buffer) {
                        logger_1.logger.warn({ name: name, originalName: file.originalname }, 'File buffer is missing');
                        throw new Error('File buffer is required');
                    }
                    timestamp = Date.now();
                    s3Key = "".concat(timestamp, "-").concat(file.originalname.replace(/\s+/g, '-'));
                    logger_1.logger.debug({ name: name, originalName: file.originalname }, 'Uploading file to S3');
                    return [4 /*yield*/, (0, s3_1.uploadFileToS3)(s3Key, file.buffer, file.mimetype)];
                case 1:
                    url = _a.sent();
                    return [4 /*yield*/, prisma_1.default.file.create({
                            data: {
                                name: name,
                                originalName: file.originalname,
                                url: url,
                                s3Key: s3Key,
                                size: file.size,
                                mimeType: file.mimetype,
                                status: 'READY'
                            }
                        })];
                case 2:
                    newFile = _a.sent();
                    logger_1.logger.info({ fileId: newFile.id, name: name, size: file.size }, 'File uploaded successfully');
                    return [4 /*yield*/, kafka_1.kafkaService.publishFileUploaded(newFile)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { result: newFile }];
                case 4:
                    error_1 = _a.sent();
                    logger_1.logger.error({ err: error_1, name: name, originalName: file.originalname }, 'Error uploading file');
                    return [2 /*return*/, {
                            error: {
                                filename: file.originalname,
                                error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                            }
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.filesRouter = (0, trpc_1.router)({
    uploadFiles: trpc_1.publicProcedure
        .input(uploadFilesSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var files, results, errors;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    files = input.files;
                    results = [];
                    errors = [];
                    logger_1.logger.info({ count: files.length }, 'Processing multiple file uploads');
                    return [4 /*yield*/, Promise.all(files.map(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var _c, result, error;
                            var name = _b.name, file = _b.file;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, processFileCreation(name, file)];
                                    case 1:
                                        _c = _d.sent(), result = _c.result, error = _c.error;
                                        if (result) {
                                            results.push(result);
                                        }
                                        if (error) {
                                            errors.push(error);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _c.sent();
                    logger_1.logger.info({
                        success: errors.length === 0,
                        total: files.length,
                        succeeded: results.length,
                        failed: errors.length
                    }, 'Completed multiple file uploads');
                    return [2 /*return*/, {
                            success: errors.length === 0,
                            files: results,
                            errors: errors.length > 0 ? errors : undefined
                        }];
            }
        });
    }); })
});
