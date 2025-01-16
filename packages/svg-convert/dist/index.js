#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = __importDefault(require("./cli"));
const core_1 = require("./core");
const options = cli_1.default.parse(process.argv).opts();
(0, core_1.createApp)(options).start();
