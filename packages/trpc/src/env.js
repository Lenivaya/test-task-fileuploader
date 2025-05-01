"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var env_core_1 = require("@t3-oss/env-core");
var zod_1 = require("zod");
exports.env = (0, env_core_1.createEnv)({
    server: {
        DATABASE_URL: zod_1.z.string().url(),
        // S3 Configuration
        S3_ENDPOINT: zod_1.z.string().url(),
        S3_REGION: zod_1.z.string().default('us-east-1'),
        S3_ACCESS_KEY: zod_1.z.string().min(1),
        S3_SECRET_KEY: zod_1.z.string().min(1),
        S3_BUCKET_NAME: zod_1.z.string().min(1),
        // Kafka Configuration
        KAFKA_BROKERS: zod_1.z
            .string()
            .default('localhost:29092')
            .transform(function (val) { return val.split(',').map(function (broker) { return broker.trim(); }); }),
        KAFKA_CLIENT_ID: zod_1.z.string().default('file-uploader'),
        // Server Configuration
        HOST: zod_1.z.string().default('0.0.0.0'),
        PORT: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().positive())
            .default('3001'),
        LOG_LEVEL: zod_1.z
            .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
            .default('info'),
        NODE_ENV: zod_1.z
            .enum(['development', 'production', 'test'])
            .default('development')
    },
    /**
     * The prefix that client-side variables must have. This is enforced both at
     * a type-level and at runtime.
     */
    clientPrefix: 'PUBLIC_',
    client: {},
    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: process.env,
    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true
});
