"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    destinations[key] = {
        validUntil: new Date(new Date().getTime() + cacheLifetime),
        value: destination
    };
    return destination[key].value;
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