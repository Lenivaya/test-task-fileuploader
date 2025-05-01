"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startS3SyncJob = startS3SyncJob;
var syncS3Files_1 = require("./syncS3Files");
var logger_1 = require("../logger");
/**
 * Run the S3 sync job on a schedule
 * @param intervalMinutes - Interval in minutes
 */
function startS3SyncJob(intervalMinutes) {
    if (intervalMinutes === void 0) { intervalMinutes = 60; }
    logger_1.logger.info({ intervalMinutes: intervalMinutes }, 'Starting S3 sync job scheduler');
    // Run once immediately
    (0, syncS3Files_1.syncS3Files)().catch(function (error) {
        logger_1.logger.error({ err: error }, 'Error running S3 sync job');
    });
    // Then run on interval
    var intervalMs = intervalMinutes * 60 * 1000;
    setInterval(function () {
        (0, syncS3Files_1.syncS3Files)().catch(function (error) {
            logger_1.logger.error({ err: error }, 'Error running S3 sync job');
        });
    }, intervalMs);
}
