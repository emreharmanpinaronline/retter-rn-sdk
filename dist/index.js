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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var observable_1 = require("./observable");
var types_1 = require("./types");
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
var axios_1 = __importDefault(require("axios"));
var https_1 = require("https");
var helpers_1 = require("./helpers");
__exportStar(require("./types"), exports);
var DEFAULT_RETRY_DELAY = 50; // in ms
var DEFAULT_RETRY_COUNT = 3;
var DEFAULT_RETRY_RATE = 1.5;
var RetterRegions = [
    {
        id: types_1.RetterRegion.euWest1,
        url: 'api.retter.io',
    },
    {
        id: types_1.RetterRegion.euWest1Beta,
        url: 'test-api.retter.io',
    },
];
var Retter = /** @class */ (function () {
    function Retter(config) {
        var _this = this;
        this.initialized = false;
        this.cloudObjects = [];
        this.listeners = {};
        this.refreshTokenPromise = null;
        this.sslPinningEnabled = true;
        if (this.initialized)
            throw new Error('SDK already initialized.');
        this.initialized = true;
        this.clientConfig = config;
        this.tokenStorageKey = "RIO_TOKENS_KEY.".concat(config.projectId);
        if (!this.clientConfig.region)
            this.clientConfig.region = types_1.RetterRegion.euWest1;
        if (!this.clientConfig.retryConfig)
            this.clientConfig.retryConfig = {};
        if (!this.clientConfig.retryConfig.delay)
            this.clientConfig.retryConfig.delay = DEFAULT_RETRY_DELAY;
        if (!this.clientConfig.retryConfig.count)
            this.clientConfig.retryConfig.count = DEFAULT_RETRY_COUNT;
        if (!this.clientConfig.retryConfig.rate)
            this.clientConfig.retryConfig.rate = DEFAULT_RETRY_RATE;
        this.authStatusSubject = new observable_1.Observable(function () { });
        this.authStatus.setOnFirstSubscription(function () {
            _this.initAuth();
        });
        this.createAxiosInstance();
        this.initAuth();
    }
    Retter.getInstance = function (config) {
        var instance = this.instances.find(function (instance) { var _a; return ((_a = instance.clientConfig) === null || _a === void 0 ? void 0 : _a.projectId) === config.projectId; });
        if (instance)
            return instance;
        var newInstance = new Retter(config);
        this.instances.push(newInstance);
        return newInstance;
    };
    // #region Request
    Retter.prototype.createAxiosInstance = function () {
        var axiosConfig = {
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': "max-age=0",
            },
            timeout: 30000,
        };
        if (this.sslPinningEnabled === false) {
            axiosConfig.httpsAgent = new https_1.Agent({ rejectUnauthorized: false });
        }
        this.axiosInstance = axios_1.default.create(axiosConfig);
    };
    Retter.prototype.makeAPIRequest = function (action, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, tokens, now, safeNow, accessTokenDecoded, newTokenData, newData, error_1, newToken, newData, error_2, newData;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        endpoint = this.generateEndpoint(action, data);
                        return [4 /*yield*/, this.getCurrentTokenData()];
                    case 1:
                        tokens = _b.sent();
                        now = Math.floor(Date.now() / 1000);
                        safeNow = now + 30 + ((_a = tokens === null || tokens === void 0 ? void 0 : tokens.diff) !== null && _a !== void 0 ? _a : 0) // add server time diff
                        ;
                        accessTokenDecoded = tokens === null || tokens === void 0 ? void 0 : tokens.accessTokenDecoded;
                        if (!(accessTokenDecoded && accessTokenDecoded.exp < safeNow)) return [3 /*break*/, 12];
                        if (!this.refreshTokenPromise) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.refreshTokenPromise];
                    case 3:
                        newTokenData = _b.sent();
                        if (!newTokenData) {
                            this.fireAuthStatusChangedEvent({
                                authStatus: types_1.RetterAuthStatus.SIGNED_OUT,
                            });
                            throw new Error('Access token is undefined.');
                        }
                        newData = __assign({}, data);
                        newData.headers = __assign(__assign({}, newData.headers), { Authorization: "Bearer ".concat(newTokenData) });
                        return [4 /*yield*/, this.executeRequest(endpoint, newData)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        error_1 = _b.sent();
                        throw error_1;
                    case 6:
                        this.refreshTokenPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var response, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.refreshToken()];
                                    case 1:
                                        response = _a.sent();
                                        this.refreshTokenPromise = null;
                                        return [2 /*return*/, response.accessToken];
                                    case 2:
                                        error_3 = _a.sent();
                                        this.refreshTokenPromise = null;
                                        throw error_3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })();
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, this.refreshTokenPromise];
                    case 8:
                        newToken = _b.sent();
                        if (!newToken) {
                            this.fireAuthStatusChangedEvent({
                                authStatus: types_1.RetterAuthStatus.SIGNED_OUT,
                            });
                            throw new Error('Access token is undefined.');
                        }
                        newData = __assign({}, data);
                        newData.headers = __assign(__assign({}, newData.headers), { Authorization: "Bearer ".concat(newToken) });
                        return [4 /*yield*/, this.executeRequest(endpoint, newData)];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        error_2 = _b.sent();
                        throw error_2;
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        newData = __assign({}, data);
                        if ((tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) !== 'undefined' &&
                            (tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) !== 'null' &&
                            Boolean(tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) &&
                            (tokens === null || tokens === void 0 ? void 0 : tokens.accessToken)) {
                            newData.headers = __assign(__assign({}, newData.headers), { Authorization: "Bearer ".concat(tokens.accessToken) });
                        }
                        else {
                            this.fireAuthStatusChangedEvent({
                                authStatus: types_1.RetterAuthStatus.SIGNED_OUT,
                            });
                        }
                        return [4 /*yield*/, this.executeRequest(endpoint, newData)];
                    case 13: return [2 /*return*/, _b.sent()];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.executeRequest = function (url, config) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var queryStringParams, data, headers, _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        queryStringParams = __assign({}, config.queryStringParams);
                        if (!queryStringParams.__culture)
                            queryStringParams.__culture = (_b = (_a = this.clientConfig) === null || _a === void 0 ? void 0 : _a.culture) !== null && _b !== void 0 ? _b : 'en-us';
                        if (!queryStringParams.__platform && ((_c = this.clientConfig) === null || _c === void 0 ? void 0 : _c.platform))
                            queryStringParams.__platform = this.clientConfig.platform;
                        if (config.httpMethod === 'get' && config.body) {
                            data = (0, helpers_1.base64Encode)(JSON.stringify((0, helpers_1.sort)(config.body)));
                            delete config.body;
                            queryStringParams.data = data;
                            queryStringParams.__isbase64 = 'true';
                        }
                        headers = __assign({}, config.headers);
                        _d = headers;
                        return [4 /*yield*/, (0, helpers_1.getInstallationId)()];
                    case 1:
                        _d.installationId = _e.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var _a;
                                _this.axiosInstance({
                                    url: url,
                                    method: (_a = config.httpMethod) !== null && _a !== void 0 ? _a : 'POST',
                                    headers: headers,
                                    params: queryStringParams,
                                    data: config.body,
                                })
                                    .then(function (response) {
                                    resolve(response);
                                })
                                    .catch(function (error) {
                                    reject(error);
                                });
                            })];
                }
            });
        });
    };
    Retter.prototype.generateEndpoint = function (action, data) {
        var _a;
        var prefixes = (_a = {},
            _a[types_1.RetterActions.COS_CALL] = 'CALL',
            _a[types_1.RetterActions.COS_LIST] = 'LIST',
            _a[types_1.RetterActions.COS_STATE] = 'STATE',
            _a[types_1.RetterActions.COS_INSTANCE] = 'INSTANCE',
            _a[types_1.RetterActions.COS_STATIC_CALL] = 'CALL',
            _a);
        var url = "/".concat(prefixes[action]);
        if (data.classId)
            url += "/".concat(data.classId);
        if (action === types_1.RetterActions.COS_INSTANCE) {
            var instanceId = data.key
                ? "".concat(data.key.name, "!").concat(data.key.value)
                : data.instanceId;
            if (instanceId)
                url += "/".concat(instanceId);
        }
        if (action === types_1.RetterActions.COS_STATE) {
            url += "/".concat(data.instanceId);
        }
        if (action === types_1.RetterActions.COS_LIST) {
            // do nothing
        }
        if (action === types_1.RetterActions.COS_CALL ||
            action === types_1.RetterActions.COS_STATIC_CALL) {
            url += "/".concat(data.method);
            if (data.instanceId)
                url += "/".concat(data.instanceId);
            if (data.pathParams)
                url += "/".concat(data.pathParams);
        }
        return this.buildUrl(this.clientConfig.projectId, url);
    };
    Retter.prototype.buildUrl = function (projectId, path) {
        var _this = this;
        var _a, _b, _c;
        var prefix = ((_a = this.clientConfig) === null || _a === void 0 ? void 0 : _a.url)
            ? "".concat(this.clientConfig.url)
            : "".concat(projectId, ".").concat((_b = RetterRegions.find(function (region) { var _a; return region.id === ((_a = _this.clientConfig) === null || _a === void 0 ? void 0 : _a.region); })) === null || _b === void 0 ? void 0 : _b.url);
        return "https://".concat(prefix, "/").concat((_c = this.clientConfig) === null || _c === void 0 ? void 0 : _c.projectId).concat(path);
    };
    // #endregion
    // #region Firebase
    Retter.prototype.initFirebase = function (tokenData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('[RetterFork] Firebase init bypassed.');
                return [2 /*return*/];
            });
        });
    };
    Retter.prototype.clearFirebase = function () {
        this.firebase = undefined;
        this.firestore = undefined;
        this.firebaseAuth = undefined;
    };
    Retter.prototype.getFirebaseListener = function (queue, collection, documentId) {
        var document = (0, firestore_1.doc)(this.firestore, collection, documentId);
        return (0, firestore_1.onSnapshot)(document, function (doc) {
            var data = Object.assign({}, doc.data());
            for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.startsWith('__'))
                    delete data[key];
            }
            queue.next(data);
        });
    };
    Retter.prototype.getFirebaseState = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var projectId, user, unsubscribers, observables, listenerPrefix, state;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.clientConfig)
                            throw new Error('Client config not found.');
                        projectId = this.clientConfig.projectId;
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        user = _a.sent();
                        unsubscribers = [];
                        observables = {
                            role: new observable_1.Observable(function () { }),
                            user: new observable_1.Observable(function () { }),
                            public: new observable_1.Observable(function () { }),
                        };
                        listenerPrefix = "".concat(projectId, "_").concat(config.classId, "_").concat(config.instanceId);
                        state = {
                            role: {
                                observable: observables.role,
                                subscribe: function (callback) {
                                    if (!_this.listeners["".concat(listenerPrefix, "_role")]) {
                                        var listener = _this.getFirebaseListener(observables.role, "/projects/".concat(projectId, "/classes/").concat(config.classId, "/instances/").concat(config.instanceId, "/roleState"), user.identity);
                                        _this.listeners["".concat(listenerPrefix, "_role")] = listener;
                                    }
                                    return observables.role.subscribe(callback);
                                },
                            },
                            user: {
                                observable: observables.user,
                                subscribe: function (callback) {
                                    if (!_this.listeners["".concat(listenerPrefix, "_user")]) {
                                        var listener = _this.getFirebaseListener(observables.user, "/projects/".concat(projectId, "/classes/").concat(config.classId, "/instances/").concat(config.instanceId, "/userState"), user.userId);
                                        _this.listeners["".concat(listenerPrefix, "_user")] = listener;
                                    }
                                    return observables.user.subscribe(callback);
                                },
                            },
                            public: {
                                observable: observables.public,
                                subscribe: function (callback) {
                                    if (!_this.listeners["".concat(listenerPrefix, "_public")]) {
                                        var listener = _this.getFirebaseListener(observables.public, "/projects/".concat(projectId, "/classes/").concat(config.classId, "/instances"), config.instanceId);
                                        _this.listeners["".concat(listenerPrefix, "_public")] = listener;
                                    }
                                    return observables.public.subscribe(callback);
                                },
                            },
                        };
                        return [2 /*return*/, { state: state, unsubscribers: unsubscribers }];
                }
            });
        });
    };
    // #endregion
    // #region Cloud Object
    Retter.prototype.getCloudObject = function (config) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var instance, data, seekedObject, state, call, getState, listInstances, retVal;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.initialized)
                            throw new Error('Retter SDK not initialized.');
                        if (!(!config.instanceId && !config.useLocal)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.makeAPIRequest(types_1.RetterActions.COS_INSTANCE, config)];
                    case 1:
                        data = (_d.sent()).data;
                        instance = data;
                        config.instanceId = data.instanceId;
                        _d.label = 2;
                    case 2:
                        seekedObject = this.cloudObjects.find(function (object) {
                            return object.config.classId === config.classId &&
                                object.config.instanceId === config.instanceId;
                        });
                        if (seekedObject) {
                            return [2 /*return*/, seekedObject];
                        }
                        return [4 /*yield*/, this.getFirebaseState(config)];
                    case 3:
                        state = (_d.sent()).state;
                        call = function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var error_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        params.retryConfig = __assign(__assign({}, this.clientConfig.retryConfig), params.retryConfig);
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 8]);
                                        return [4 /*yield*/, this.makeAPIRequest(types_1.RetterActions.COS_CALL, __assign(__assign({}, params), { classId: config.classId, instanceId: config.instanceId }))];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3:
                                        error_4 = _a.sent();
                                        --params.retryConfig.count;
                                        params.retryConfig.delay *= params.retryConfig.rate;
                                        if (!(error_4.response &&
                                            error_4.response.status === 570 &&
                                            params.retryConfig.count > 0)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, new Promise(function (r) {
                                                return setTimeout(r, params.retryConfig.delay);
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, call(params)];
                                    case 5: return [2 /*return*/, _a.sent()];
                                    case 6: throw error_4;
                                    case 7: return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); };
                        getState = function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.makeAPIRequest(types_1.RetterActions.COS_STATE, __assign(__assign({}, params), { classId: config.classId, instanceId: config.instanceId }))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        listInstances = function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.makeAPIRequest(types_1.RetterActions.COS_LIST, __assign(__assign({}, params), { classId: config.classId }))];
                                    case 1:
                                        data = (_a.sent()).data;
                                        return [2 /*return*/, data.instanceIds];
                                }
                            });
                        }); };
                        retVal = {
                            call: call,
                            state: state,
                            getState: getState,
                            listInstances: listInstances,
                            methods: (_a = instance === null || instance === void 0 ? void 0 : instance.methods) !== null && _a !== void 0 ? _a : [],
                            response: (_b = instance === null || instance === void 0 ? void 0 : instance.response) !== null && _b !== void 0 ? _b : null,
                            instanceId: config.instanceId,
                            // @ts-ignore
                            isNewInstance: (_c = instance === null || instance === void 0 ? void 0 : instance.newInstance) !== null && _c !== void 0 ? _c : false,
                        };
                        this.cloudObjects.push(__assign(__assign({}, retVal), { config: config, unsubscribers: [] }));
                        return [2 /*return*/, retVal];
                }
            });
        });
    };
    Retter.prototype.clearCloudObjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listeners;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listeners = Object.values(this.listeners);
                        if (listeners.length > 0) {
                            listeners.map(function (i) { return i(); });
                            this.cloudObjects.map(function (i) {
                                var _a, _b, _c, _d, _e, _f;
                                (_b = (_a = i.state) === null || _a === void 0 ? void 0 : _a.role.queue) === null || _b === void 0 ? void 0 : _b.complete();
                                (_d = (_c = i.state) === null || _c === void 0 ? void 0 : _c.user.queue) === null || _d === void 0 ? void 0 : _d.complete();
                                (_f = (_e = i.state) === null || _e === void 0 ? void 0 : _e.public.queue) === null || _f === void 0 ? void 0 : _f.complete();
                            });
                        }
                        this.listeners = {};
                        this.cloudObjects.map(function (i) { return i.unsubscribers.map(function (u) { return u(); }); });
                        this.cloudObjects = [];
                        if (!this.firebaseAuth) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, auth_1.signOut)(this.firebaseAuth)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.clearFirebase();
                        return [2 /*return*/];
                }
            });
        });
    };
    // #endregion
    // #region Static Call
    Retter.prototype.makeStaticCall = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initialized)
                            throw new Error('Retter SDK not initialized.');
                        return [4 /*yield*/, this.makeAPIRequest(types_1.RetterActions.COS_STATIC_CALL, __assign(__assign({}, params), { classId: params.classId }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // #endregion
    // #region Auth
    Retter.prototype.initAuth = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCurrentTokenData()];
                    case 1:
                        tokens = _c.sent();
                        if (!(tokens && tokens.isTokenValid)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.initFirebase(tokens)];
                    case 2:
                        _c.sent();
                        this.fireAuthStatusChangedEvent({
                            authStatus: types_1.RetterAuthStatus.SIGNED_IN,
                            uid: (_a = tokens.accessTokenDecoded) === null || _a === void 0 ? void 0 : _a.userId,
                            identity: (_b = tokens.accessTokenDecoded) === null || _b === void 0 ? void 0 : _b.identity,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        this.fireAuthStatusChangedEvent({
                            authStatus: types_1.RetterAuthStatus.SIGNED_OUT,
                        });
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.authenticateWithCustomToken = function (token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var projectId, response, tokenData, authEvent;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.clientConfig)
                            throw new Error('Client config not found.');
                        projectId = this.clientConfig.projectId;
                        return [4 /*yield*/, this.axiosInstance({
                                url: this.buildUrl(projectId, '/TOKEN/auth'),
                                method: 'post',
                                data: { customToken: token },
                            })];
                    case 1:
                        response = _c.sent();
                        tokenData = this.formatTokenData(response.data);
                        return [4 /*yield*/, this.storeTokenData(tokenData)];
                    case 2:
                        _c.sent();
                        this.clearFirebase();
                        this.clearCloudObjects();
                        return [4 /*yield*/, this.initFirebase(tokenData)];
                    case 3:
                        _c.sent();
                        authEvent = {
                            authStatus: types_1.RetterAuthStatus.SIGNED_IN,
                            uid: (_a = tokenData.accessTokenDecoded) === null || _a === void 0 ? void 0 : _a.userId,
                            identity: (_b = tokenData.accessTokenDecoded) === null || _b === void 0 ? void 0 : _b.identity,
                        };
                        this.fireAuthStatusChangedEvent(authEvent);
                        return [2 /*return*/, authEvent];
                }
            });
        });
    };
    Retter.prototype.refreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var projectId, tokens, refreshToken, response, tokenData, error_5, isNetworkError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.clientConfig)
                            throw new Error('Client config not found.');
                        projectId = this.clientConfig.projectId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 8]);
                        return [4 /*yield*/, this.getCurrentTokenData()];
                    case 2:
                        tokens = _a.sent();
                        refreshToken = tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken;
                        return [4 /*yield*/, this.axiosInstance({
                                url: this.buildUrl(projectId, '/TOKEN/refresh'),
                                method: 'post',
                                data: { refreshToken: refreshToken },
                            })];
                    case 3:
                        response = _a.sent();
                        tokenData = this.formatTokenData(response.data);
                        return [4 /*yield*/, this.storeTokenData(tokenData)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, tokenData];
                    case 5:
                        error_5 = _a.sent();
                        isNetworkError = error_5.message === 'Network Error';
                        if (!!isNetworkError) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.signOut()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: throw error_5;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, projectId, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 8]);
                        return [4 /*yield*/, this.getCurrentTokenData()];
                    case 1:
                        tokenData = _a.sent();
                        if (!tokenData) return [3 /*break*/, 3];
                        projectId = this.clientConfig.projectId;
                        return [4 /*yield*/, this.axiosInstance({
                                url: this.buildUrl(projectId, '/TOKEN/signOut'),
                                method: 'post',
                                headers: {
                                    Authorization: "Bearer ".concat(tokenData.accessToken),
                                },
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 8];
                    case 4:
                        error_6 = _a.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        this.clearFirebase();
                        return [4 /*yield*/, this.clearTokenData()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.clearCloudObjects()];
                    case 7:
                        _a.sent();
                        this.fireAuthStatusChangedEvent({
                            authStatus: types_1.RetterAuthStatus.SIGNED_OUT,
                        });
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentTokenData()];
                    case 1:
                        tokenData = _a.sent();
                        return [2 /*return*/, tokenData === null || tokenData === void 0 ? void 0 : tokenData.accessTokenDecoded];
                }
            });
        });
    };
    Retter.prototype.storeTokenData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof data === 'undefined')
                            return [2 /*return*/];
                        return [4 /*yield*/, async_storage_1.default.setItem(this.tokenStorageKey, JSON.stringify(data))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.clearTokenData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, async_storage_1.default.removeItem(this.tokenStorageKey)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.formatTokenData = function (tokenData) {
        var _a;
        tokenData.accessTokenDecoded = (0, jwt_decode_1.default)(tokenData.accessToken);
        tokenData.refreshTokenDecoded = (0, jwt_decode_1.default)(tokenData.refreshToken);
        if ((_a = tokenData.accessTokenDecoded) === null || _a === void 0 ? void 0 : _a.iat) {
            tokenData.diff =
                tokenData.accessTokenDecoded.iat - Math.floor(Date.now() / 1000);
        }
        tokenData.isTokenValid =
            tokenData.accessToken !== 'undefined' &&
                tokenData.accessToken !== 'null' &&
                Boolean(tokenData.accessToken);
        return tokenData;
    };
    Retter.prototype.getCurrentTokenData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.tokenStorageKey)
                            throw new Error('Token storage key not found.');
                        return [4 /*yield*/, async_storage_1.default.getItem(this.tokenStorageKey)];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            return [2 /*return*/, undefined];
                        try {
                            data = JSON.parse(item);
                            if (data.accessTokenDecoded && data.refreshTokenDecoded)
                                return [2 /*return*/, data];
                            data.accessTokenDecoded = (0, jwt_decode_1.default)(data.accessToken);
                            data.refreshTokenDecoded = (0, jwt_decode_1.default)(data.refreshToken);
                            data.isTokenValid =
                                data.accessToken !== 'undefined' &&
                                    data.accessToken !== 'null' &&
                                    Boolean(data.accessToken);
                            return [2 /*return*/, data];
                        }
                        catch (e) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Retter.prototype.fireAuthStatusChangedEvent = function (event) {
        this.authStatusSubject.next(event);
    };
    Object.defineProperty(Retter.prototype, "authStatus", {
        get: function () {
            return this.authStatusSubject;
        },
        enumerable: false,
        configurable: true
    });
    Retter.instances = [];
    return Retter;
}());
exports.default = Retter;
//# sourceMappingURL=index.js.map