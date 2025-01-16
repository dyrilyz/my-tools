"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('svg-creator')
    .option('-c, --colorful', 'svg彩色', false)
    .option('-O, --allow-override', '允许覆盖', false)
    .option('--prefix [string]', '组件前缀')
    .option('-t, --type <filepath>', '类型输出位置（文件）')
    .option('-s, --src <dirname>', 'svg源目录')
    .option('-d, --dest <dirname>', '组件输出目录');
exports.default = program;
