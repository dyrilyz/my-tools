#!/usr/bin/env node
import cli from './cli';
import { createApp } from './core';
var options = cli.parse(process.argv).opts();
createApp(options).start();
