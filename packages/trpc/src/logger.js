"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var pino_1 = require("pino");
var env_1 = require("./env");
// Configure logger based on environment
var logger = (0, pino_1.default)(__assign({ level: env_1.env.LOG_LEVEL || 'info', 
    // Add standard serializers for common objects like errors
    serializers: __assign({}, pino_1.default.stdSerializers
    // Add any custom serializers here
    ), 
    // Add common base properties to all logs
    base: {
        app: 'api',
        env: process.env.NODE_ENV || 'development'
    } }, (env_1.env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                levelFirst: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        }
    })));
exports.logger = logger;
