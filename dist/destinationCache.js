"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.get = void 0;
const destinations = {};
const cacheLifetime = 60000;
function get(key) {
    cleanCache();
    const cacheToken = destinations[key];
    if (cacheToken) {
        return cacheToken.value;
    }
}
exports.get = get;
function set(key, destination) {
    cleanCache();
    if (destination) {
        destinations[key] = {
            validUntil: new Date(new Date().getTime() + cacheLifetime),
            value: destination
        };
        return destination;
    }
}
exports.set = set;
function cleanCache() {
    const now = new Date().getTime() - 1000;
    Object.entries(destinations).forEach(function ([key, value]) {
        if (value.validUntil.getTime() < now) {
            delete destinations[key];
        }
    });
}
