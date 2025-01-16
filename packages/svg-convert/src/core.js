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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { join, parse, resolve } from 'node:path';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
var __dirname = process.cwd();
var xmlAttrsPrefix = '@_';
var includeAttrs = ['viewBox'].map(function (t) { return "".concat(xmlAttrsPrefix).concat(t); });
var includeTags = ['svg', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'g', 'defs', 'use', 'linearGradient', 'pattern', 'mask', 'clipPath', 'filter'];
var App = /** @class */ (function () {
    function App(options) {
        var xmlOpt = { ignoreAttributes: false };
        this.options = options;
        this.plugins = [];
        this.parser = new XMLParser(xmlOpt);
        this.builder = new XMLBuilder(xmlOpt);
        this.svgKey = __spreadArray(__spreadArray([], includeAttrs, true), includeTags, true);
    }
    App.prototype.use = function (plugin) {
        this.plugins.push(plugin);
        return this;
    };
    App.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dest, svgDir, svgList, _loop_1, this_1, _i, svgList_1, svgName, state_1, _a, _b, plugin;
            var _this = this;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        dest = resolve(__dirname, this.options.dest);
                        svgDir = resolve(__dirname, this.options.src);
                        return [4 /*yield*/, readdir(svgDir)];
                    case 1:
                        svgList = _f.sent();
                        return [4 /*yield*/, mkdir(dest, { recursive: true })];
                    case 2:
                        _f.sent();
                        _loop_1 = function (svgName) {
                            var filepath, path, data, xml, svg, _g, _h, plugin, component, _j, _k, plugin;
                            return __generator(this, function (_l) {
                                switch (_l.label) {
                                    case 0:
                                        filepath = resolve(svgDir, svgName);
                                        path = parse(filepath);
                                        if (path.ext !== '.svg')
                                            return [2 /*return*/, "break"];
                                        return [4 /*yield*/, readFile(filepath)];
                                    case 1:
                                        data = _l.sent();
                                        xml = this_1.parser.parse(data);
                                        svg = {};
                                        Object.keys(xml['svg']).forEach(function (key) { return _this.svgKey.includes(key) && Reflect.set(svg, key, xml['svg'][key]); });
                                        _g = 0, _h = this_1.plugins;
                                        _l.label = 2;
                                    case 2:
                                        if (!(_g < _h.length)) return [3 /*break*/, 5];
                                        plugin = _h[_g];
                                        return [4 /*yield*/, ((_c = plugin.loaded) === null || _c === void 0 ? void 0 : _c.call(plugin, svg))];
                                    case 3:
                                        _l.sent();
                                        _l.label = 4;
                                    case 4:
                                        _g++;
                                        return [3 /*break*/, 2];
                                    case 5:
                                        component = {
                                            template: this_1.builder.build({ template: { svg: svg } }),
                                            filename: "".concat(this_1.options.prefix).concat(path.name, ".vue"),
                                            outPath: '',
                                            output: true,
                                        };
                                        component.outPath = resolve(dest, component.filename);
                                        _j = 0, _k = this_1.plugins;
                                        _l.label = 6;
                                    case 6:
                                        if (!(_j < _k.length)) return [3 /*break*/, 9];
                                        plugin = _k[_j];
                                        return [4 /*yield*/, ((_d = plugin.beforeOutput) === null || _d === void 0 ? void 0 : _d.call(plugin, this_1, component))];
                                    case 7:
                                        _l.sent();
                                        _l.label = 8;
                                    case 8:
                                        _j++;
                                        return [3 /*break*/, 6];
                                    case 9:
                                        if (!component.output) return [3 /*break*/, 11];
                                        return [4 /*yield*/, writeFile(component.outPath, component.template)];
                                    case 10:
                                        _l.sent();
                                        _l.label = 11;
                                    case 11: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, svgList_1 = svgList;
                        _f.label = 3;
                    case 3:
                        if (!(_i < svgList_1.length)) return [3 /*break*/, 6];
                        svgName = svgList_1[_i];
                        return [5 /*yield**/, _loop_1(svgName)];
                    case 4:
                        state_1 = _f.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 6];
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        _a = 0, _b = this.plugins;
                        _f.label = 7;
                    case 7:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        plugin = _b[_a];
                        return [4 /*yield*/, ((_e = plugin.end) === null || _e === void 0 ? void 0 : _e.call(plugin, this))];
                    case 8:
                        _f.sent();
                        _f.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
var corePlugin = {
    loaded: function (svg) {
        svg["".concat(xmlAttrsPrefix, "class")] = 'iconfont-svg';
    },
    beforeOutput: function (app, component) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!app.options.colorful) {
                            component.template = component.template.replace(/ fill="[^"]*"/g, ' fill="currentColor"');
                        }
                        if (!!app.options.allowOverride) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, access(component.outPath)];
                    case 2:
                        _b.sent();
                        component.output = false;
                        console.log("".concat(component.filename, "\u5DF2\u5B58\u5728"));
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
};
// 生成类型文件
var typePlugin = {
    end: function (app) {
        return __awaiter(this, void 0, void 0, function () {
            var options, filepath, dest, compList, typeFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = app.options;
                        if (!options.type)
                            return [2 /*return*/];
                        filepath = resolve(__dirname, options.type);
                        return [4 /*yield*/, mkdir(resolve(filepath, '..'), { recursive: true })];
                    case 1:
                        _a.sent();
                        dest = resolve(__dirname, options.dest);
                        return [4 /*yield*/, readdir(dest)];
                    case 2:
                        compList = _a.sent();
                        typeFile = "// \u81EA\u52A8\u751F\u6210\u6587\u4EF6\uFF0C\u8BF7\u52FF\u4FEE\u6539\ndeclare module '@vue/runtime-core' {\n  export interface GlobalComponents {\n    ".concat(compList
                            .map(function (t) {
                            var name = parse(t)
                                .name.replace(/(^\S|-\S)/g, function (str) { return str.toUpperCase(); })
                                .replace(/-/g, '');
                            var fp = join(options.dest, t)
                                .replace(/\\/g, '/')
                                .replace(/^src\//, '@/');
                            return [name, "typeof import('".concat(fp, "')")].join(': ');
                        })
                            .join('\n    '), "\n  }\n}\n\nexport {}");
                        return [4 /*yield*/, writeFile(filepath, typeFile)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
};
export function createApp(options) {
    var instance = new App(options);
    instance.use(corePlugin).use(typePlugin);
    return instance;
}
