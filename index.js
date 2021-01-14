"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.A08Server = void 0;
var Http = __importStar(require("http"));
var Mongo = __importStar(require("mongodb"));
var url_1 = require("url");
var A08Server;
(function (A08Server) {
    var Server = /** @class */ (function () {
        function Server() {
            this.db = null;
            this.userCollection = null;
            this.db_name = "phillip";
            this.mongodb_connection_url = "mongodb+srv://gispaulphillip:v1Ba0P5lT5lHe8jv@gispaulphillipwise2020.xf65h.mongodb.net/<dbname>?retryWrites=true&w=majority";
            console.log("Starting server");
            this.http_port = Number(process.env.PORT);
            if (!this.http_port)
                this.http_port = 8100;
            this.connectDatabase();
            this.startHttpServer();
        }
        Server.prototype.startHttpServer = function () {
            Http.createServer(this.onMessage.bind(this)).listen(this.http_port);
        };
        Server.prototype.onMessage = function (req, res) {
            return __awaiter(this, void 0, void 0, function () {
                var responseText, url, _a, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log("Message received: ", req.url);
                            responseText = '404';
                            if (req.url === "/") {
                                res.write(responseText);
                                res.end();
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 9, , 10]);
                            url = new url_1.URL(req.url, "http://localhost:" + this.http_port);
                            _a = url.pathname;
                            switch (_a) {
                                case "/login": return [3 /*break*/, 2];
                                case "/register": return [3 /*break*/, 4];
                                case "/list": return [3 /*break*/, 6];
                            }
                            return [3 /*break*/, 8];
                        case 2: return [4 /*yield*/, this.handleLogin(url.searchParams)];
                        case 3:
                            responseText = _b.sent();
                            return [3 /*break*/, 8];
                        case 4: return [4 /*yield*/, this.handleRegister(url.searchParams)];
                        case 5:
                            responseText = _b.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.getUserList()];
                        case 7:
                            responseText = _b.sent();
                            return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            e_1 = _b.sent();
                            console.log(e_1);
                            return [3 /*break*/, 10];
                        case 10:
                            res.write(responseText);
                            res.end();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Server.prototype.connectDatabase = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.db = new Mongo.MongoClient(this.mongodb_connection_url, { useNewUrlParser: true });
                            return [4 /*yield*/, this.db.connect()];
                        case 1:
                            _a.sent();
                            this.userCollection = this.db.db(this.db_name).collection("benutzer");
                            return [2 /*return*/];
                    }
                });
            });
        };
        Server.prototype.handleLogin = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var psw, email, userArray, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.userCollection) {
                                return [2 /*return*/, "db_error"];
                            }
                            psw = params.get('password');
                            email = params.get('email');
                            if (!psw || !email) {
                                return [2 /*return*/, "error"];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.userCollection.find({ email: email, password: psw }).toArray()];
                        case 2:
                            userArray = _a.sent();
                            if (userArray && userArray.length === 0) {
                                return [2 /*return*/, "error_user_not_found"];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            return [2 /*return*/, e_2.message];
                        case 4: return [2 /*return*/, "success"];
                    }
                });
            });
        };
        Server.prototype.handleRegister = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var vorname, nachname, password, email, userArray, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.userCollection) {
                                return [2 /*return*/, "db_error"];
                            }
                            vorname = params.get('vorname');
                            nachname = params.get('nachname');
                            password = params.get('password');
                            email = params.get('email');
                            if (!vorname || !nachname || !password || !email) {
                                return [2 /*return*/, "data_error"];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.userCollection.find({ email: email }).toArray()];
                        case 2:
                            userArray = _a.sent();
                            if (userArray && userArray.length > 0) {
                                return [2 /*return*/, "already_existing_error"];
                            }
                            return [4 /*yield*/, this.userCollection.insertOne({
                                    vorname: vorname,
                                    nachname: nachname,
                                    password: password,
                                    email: email
                                })];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_3 = _a.sent();
                            return [2 /*return*/, e_3.message];
                        case 5: return [2 /*return*/, "success"];
                    }
                });
            });
        };
        Server.prototype.getUserList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var userArray, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.userCollection) {
                                return [2 /*return*/, "db_error"];
                            }
                            return [4 /*yield*/, this.userCollection.find({}).toArray()];
                        case 1:
                            userArray = _a.sent();
                            if (userArray.length === 0) {
                                return [2 /*return*/, "no user in list"];
                            }
                            response = "<pre>";
                            userArray.forEach(function (entry) {
                                response += entry.vorname + " " + entry.nachname + "\r\n";
                            });
                            response += "</pre>";
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        return Server;
    }());
    A08Server.Server = Server;
})(A08Server = exports.A08Server || (exports.A08Server = {}));
new A08Server.Server();
