"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetterAuthStatus = exports.RetterActions = exports.RetterRegion = void 0;
var RetterRegion;
(function (RetterRegion) {
    RetterRegion[RetterRegion["euWest1"] = 0] = "euWest1";
    RetterRegion[RetterRegion["euWest1Beta"] = 1] = "euWest1Beta";
})(RetterRegion = exports.RetterRegion || (exports.RetterRegion = {}));
// Actions
var RetterActions;
(function (RetterActions) {
    // EMPTY = 'EMPTY',
    // SIGN_IN = 'SIGN_IN',
    RetterActions["COS_CALL"] = "COS_CALL";
    RetterActions["COS_LIST"] = "COS_LIST";
    RetterActions["COS_STATE"] = "COS_STATE";
    RetterActions["COS_INSTANCE"] = "COS_INSTANCE";
    RetterActions["COS_STATIC_CALL"] = "COS_STATIC_CALL";
})(RetterActions = exports.RetterActions || (exports.RetterActions = {}));
// Auth
var RetterAuthStatus;
(function (RetterAuthStatus) {
    RetterAuthStatus["SIGNED_IN"] = "SIGNED_IN";
    RetterAuthStatus["SIGNED_OUT"] = "SIGNED_OUT";
    RetterAuthStatus["AUTH_FAILED"] = "AUTH_FAILED";
    RetterAuthStatus["CONNECTION_FAILED"] = "CONNECTION_FAILED";
})(RetterAuthStatus = exports.RetterAuthStatus || (exports.RetterAuthStatus = {}));
//# sourceMappingURL=types.js.map