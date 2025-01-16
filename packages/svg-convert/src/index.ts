#!/usr/bin/env node
import cli, { type ICLIArgs } from './cli'
import { createApp } from './core'

const options = cli.parse(process.argv).opts() as ICLIArgs
createApp(options).start()
