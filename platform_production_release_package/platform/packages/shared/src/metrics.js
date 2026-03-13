"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementCounter = incrementCounter;
exports.readCounters = readCounters;
const counters = new Map();
function key(name, labels) {
    return JSON.stringify({ name, labels: labels || {} });
}
function incrementCounter(name, labels, by = 1) {
    const k = key(name, labels);
    counters.set(k, (counters.get(k) || 0) + by);
}
function readCounters() {
    return Array.from(counters.entries()).map(([k, value]) => {
        const parsed = JSON.parse(k);
        return { name: parsed.name, labels: parsed.labels, value };
    });
}
//# sourceMappingURL=metrics.js.map