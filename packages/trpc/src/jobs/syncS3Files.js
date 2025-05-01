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
exports.syncS3Files = syncS3Files;
var client_s3_1 = require("@aws-sdk/client-s3");
var prisma_1 = require("../prisma");
var env_1 = require("../env");
var logger_1 = require("../logger");
// Initialize S3 client
var s3Client = new client_s3_1.S3Client({
    region: env_1.env.S3_REGION,
    endpoint: env_1.env.S3_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
    credentials: {
        accessKeyId: env_1.env.S3_ACCESS_KEY,
        secretAccessKey: env_1.env.S3_SECRET_KEY
    }
});
/**
 * Sync S3 files with database
 * This job checks if files in S3 exist in the database
 * If not, it deletes them from S3
 */
function syncS3Files() {
    return __awaiter(this, void 0, void 0, function () {
        var s3Files, dbFiles, dbKeys_1, orphanedFiles, _i, orphanedFiles_1, key, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info('Starting S3 file synchronization job');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, listAllS3Objects(env_1.env.S3_BUCKET_NAME)];
                case 2:
                    s3Files = _a.sent();
                    logger_1.logger.info({ fileCount: s3Files.length }, 'Found files in S3');
                    return [4 /*yield*/, prisma_1.default.file.findMany({
                            select: { s3Key: true }
                        })];
                case 3:
                    dbFiles = _a.sent();
                    dbKeys_1 = new Set(dbFiles.map(function (file) { return file.s3Key; }));
                    logger_1.logger.info({ fileCount: dbKeys_1.size }, 'Found files in database');
                    orphanedFiles = s3Files.filter(function (key) { return !dbKeys_1.has(key); });
                    logger_1.logger.info({ fileCount: orphanedFiles.length }, 'Found orphaned files in S3');
                    if (!(orphanedFiles.length > 0)) return [3 /*break*/, 8];
                    _i = 0, orphanedFiles_1 = orphanedFiles;
                    _a.label = 4;
                case 4:
                    if (!(_i < orphanedFiles_1.length)) return [3 /*break*/, 7];
                    key = orphanedFiles_1[_i];
                    logger_1.logger.debug({ key: key }, 'Deleting orphaned file');
                    return [4 /*yield*/, deleteS3Object(env_1.env.S3_BUCKET_NAME, key)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    logger_1.logger.info({ fileCount: orphanedFiles.length }, 'Deleted orphaned files from S3');
                    return [3 /*break*/, 9];
                case 8:
                    logger_1.logger.info('No orphaned files found');
                    _a.label = 9;
                case 9:
                    logger_1.logger.info('S3 file synchronization completed successfully');
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    logger_1.logger.error({ err: error_1 }, 'Error during S3 file synchronization');
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * List all objects in an S3 bucket
 */
function listAllS3Objects(bucket) {
    return __awaiter(this, void 0, void 0, function () {
        var objects, continuationToken, command, response, _i, _a, object;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    objects = [];
                    _b.label = 1;
                case 1:
                    command = new client_s3_1.ListObjectsV2Command({
                        Bucket: bucket,
                        ContinuationToken: continuationToken
                    });
                    return [4 /*yield*/, s3Client.send(command)];
                case 2:
                    response = _b.sent();
                    if (response.Contents) {
                        for (_i = 0, _a = response.Contents; _i < _a.length; _i++) {
                            object = _a[_i];
                            if (object.Key) {
                                objects.push(object.Key);
                            }
                        }
                    }
                    continuationToken = response.NextContinuationToken;
                    _b.label = 3;
                case 3:
                    if (continuationToken) return [3 /*break*/, 1];
                    _b.label = 4;
                case 4: return [2 /*return*/, objects];
            }
        });
    });
}
/**
 * Delete an object from S3
 */
function deleteS3Object(bucket, key) {
    return __awaiter(this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new client_s3_1.DeleteObjectCommand({
                        Bucket: bucket,
                        Key: key
                    });
                    return [4 /*yield*/, s3Client.send(command)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
