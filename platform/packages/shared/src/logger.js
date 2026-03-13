"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structuredLogger = void 0;
function emit(entry) {
    const line = JSON.stringify(entry);
    if (entry.level === "error") {
        console.error(line);
    }
    else if (entry.level === "warn") {
        console.warn(line);
    }
    else {
        console.log(line);
    }
}
exports.structuredLogger = {
    debug(message, context, service, event) {
        emit({ level: "debug", message, context, service, event, timestamp: new Date().toISOString() });
    },
    info(message, context, service, event) {
        emit({ level: "info", message, context, service, event, timestamp: new Date().toISOString() });
    },
    warn(message, context, service, event) {
        emit({ level: "warn", message, context, service, event, timestamp: new Date().toISOString() });
    },
    error(message, context, service, event) {
        emit({ level: "error", message, context, service, event, timestamp: new Date().toISOString() });
    }
};
//# sourceMappingURL=logger.js.map