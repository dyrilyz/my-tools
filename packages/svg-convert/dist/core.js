"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const node_path_1 = require("node:path");
const fast_xml_parser_1 = require("fast-xml-parser");
const promises_1 = require("node:fs/promises");
const dirname = process.cwd();
const xmlAttrsPrefix = '@_';
const includeAttrs = ['viewBox', 'fill', 'stroke'].map((t) => `${xmlAttrsPrefix}${t}`);
const includeTags = ['svg', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'g', 'defs', 'use', 'linearGradient', 'pattern', 'mask', 'clipPath', 'filter'];
class App {
    constructor(options) {
        const xmlOpt = { ignoreAttributes: false };
        this.options = options;
        this.plugins = [];
        this.parser = new fast_xml_parser_1.XMLParser(xmlOpt);
        this.builder = new fast_xml_parser_1.XMLBuilder(xmlOpt);
        this.svgKey = [...includeAttrs, ...includeTags];
    }
    use(plugin) {
        this.plugins.push(plugin);
        return this;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const dest = (0, node_path_1.resolve)(dirname, this.options.dest);
            const svgDir = (0, node_path_1.resolve)(dirname, this.options.src);
            const svgList = yield (0, promises_1.readdir)(svgDir);
            yield (0, promises_1.mkdir)(dest, { recursive: true });
            for (let svgName of svgList) {
                const filepath = (0, node_path_1.resolve)(svgDir, svgName);
                const path = (0, node_path_1.parse)(filepath);
                if (path.ext !== '.svg')
                    break;
                const data = yield (0, promises_1.readFile)(filepath);
                const xml = this.parser.parse(data);
                const svg = {};
                Object.keys(xml['svg']).forEach((key) => this.svgKey.includes(key) && Reflect.set(svg, key, xml['svg'][key]));
                for (const plugin of this.plugins) {
                    yield ((_a = plugin.loaded) === null || _a === void 0 ? void 0 : _a.call(plugin, svg));
                }
                const component = {
                    template: this.builder.build({ template: { svg } }),
                    filename: `${this.options.prefix}${path.name}.vue`,
                    outPath: '',
                    output: true,
                };
                component.outPath = (0, node_path_1.resolve)(dest, component.filename);
                for (const plugin of this.plugins) {
                    yield ((_b = plugin.beforeOutput) === null || _b === void 0 ? void 0 : _b.call(plugin, this, component));
                }
                if (component.output) {
                    yield (0, promises_1.writeFile)(component.outPath, component.template);
                }
            }
            for (const plugin of this.plugins) {
                yield ((_c = plugin.end) === null || _c === void 0 ? void 0 : _c.call(plugin, this));
            }
        });
    }
}
const corePlugin = {
    loaded(svg) {
        svg[`${xmlAttrsPrefix}class`] = 'iconfont-svg';
    },
    beforeOutput(app, component) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!app.options.colorful) {
                const matchFill = component.template.match(/ fill="[^"]*"/g);
                debugger;
                if (matchFill === null || matchFill === void 0 ? void 0 : matchFill.length) {
                    for (const item of matchFill) {
                        if (item == ' fill="none"')
                            continue;
                        component.template = component.template.replace(item, ' fill="currentColor"');
                    }
                }
                const matchStroke = component.template.match(/ stroke="[^"]*"/g);
                if (matchStroke === null || matchStroke === void 0 ? void 0 : matchStroke.length) {
                    for (const item of matchStroke) {
                        if (item == ' stroke="none"')
                            continue;
                        component.template = component.template.replace(item, ' stroke="currentColor"');
                    }
                }
                // component.template = component.template.replace(/ fill="[^"]*"/g, ' fill="currentColor"')
                // component.template = component.template.replace(/ stroke="[^"]*"/g, ' fill="currentColor"')
            }
            if (!app.options.allowOverride) {
                try {
                    yield (0, promises_1.access)(component.outPath);
                    component.output = false;
                    console.log(`${component.filename}已存在`);
                }
                catch (_a) { }
            }
        });
    },
};
// 生成类型文件
const typePlugin = {
    end(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = app.options;
            if (!options.type)
                return;
            const filepath = (0, node_path_1.resolve)(dirname, options.type);
            yield (0, promises_1.mkdir)((0, node_path_1.resolve)(filepath, '..'), { recursive: true });
            const dest = (0, node_path_1.resolve)(dirname, options.dest);
            const compList = yield (0, promises_1.readdir)(dest);
            const typeFile = `// 自动生成文件，请勿修改
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ${compList
                .map((t) => {
                const name = (0, node_path_1.parse)(t)
                    .name.replace(/(^\S|-\S)/g, (str) => str.toUpperCase())
                    .replace(/-/g, '');
                const fp = (0, node_path_1.join)(options.dest, t)
                    .replace(/\\/g, '/')
                    .replace(/^src\//, '@/');
                return [name, `typeof import('${fp}')`].join(': ');
            })
                .join('\n    ')}
  }
}

export {}`;
            yield (0, promises_1.writeFile)(filepath, typeFile);
        });
    },
};
function createApp(options) {
    const instance = new App(options);
    instance.use(corePlugin).use(typePlugin);
    return instance;
}
