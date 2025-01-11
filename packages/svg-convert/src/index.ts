#!/usr/bin/env node
import cli, { type ICLIArgs } from './cli'
import { start } from './core'

const options = cli.parse(process.argv).opts() as ICLIArgs
start(options)
