"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHealthReport = makeHealthReport;
function makeHealthReport(input) {
    return {
        ...input,
        timestamp: new Date().toISOString()
    };
}
//# sourceMappingURL=health.js.map