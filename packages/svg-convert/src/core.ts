import type { ICLIArgs } from './cli'
import { join, parse, resolve } from 'node:path'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'

const dirname = process.cwd()
const xmlAttrsPrefix = '@_'
const includeAttrs = ['viewBox'].map((t) => `${xmlAttrsPrefix}${t}`)
const includeTags = ['svg', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'g', 'defs', 'use', 'linearGradient', 'pattern', 'mask', 'clipPath', 'filter']

interface Component {
  template: string
  filename: string
  outPath: string
  output: boolean
}

type Plugin = {
  loaded?: (svg: Record<string, any>) => any
  beforeOutput?: (app: App, component: Component) => any
  end?: (app: App) => any
  [key: string]: any
}

class App {
  declare options: ICLIArgs
  declare plugins: Plugin[]
  declare parser: XMLParser
  declare builder: XMLBuilder
  declare svgKey: string[]

  constructor(options: ICLIArgs) {
    const xmlOpt = { ignoreAttributes: false }
    this.options = options
    this.plugins = []
    this.parser = new XMLParser(xmlOpt)
    this.builder = new XMLBuilder(xmlOpt)
    this.svgKey = [...includeAttrs, ...includeTags]
  }
  use(plugin: Plugin) {
    this.plugins.push(plugin)
    return this
  }

  async start() {
    const dest = resolve(dirname, this.options.dest)
    const svgDir = resolve(dirname, this.options.src)
    const svgList = await readdir(svgDir)

    await mkdir(dest, { recursive: true })
    for (let svgName of svgList) {
      const filepath = resolve(svgDir, svgName)
      const path = parse(filepath)
      if (path.ext !== '.svg') break
      const data = await readFile(filepath)
      const xml = this.parser.parse(data)
      const svg: Record<string, any> = {}
      Object.keys(xml['svg']).forEach((key) => this.svgKey.includes(key) && Reflect.set(svg, key, xml['svg'][key]))
      for (const plugin of this.plugins) {
        await plugin.loaded?.(svg)
      }
      const component: Component = {
        template: this.builder.build({ template: { svg } }),
        filename: `${this.options.prefix}${path.name}.vue`,
        outPath: '',
        output: true,
      }
      component.outPath = resolve(dest, component.filename)
      for (const plugin of this.plugins) {
        await plugin.beforeOutput?.(this, component)
      }

      if (component.output) {
        await writeFile(component.outPath, component.template)
      }
    }

    for (const plugin of this.plugins) {
      await plugin.end?.(this)
    }
  }
}

const corePlugin: Plugin = {
  loaded(svg) {
    svg[`${xmlAttrsPrefix}class`] = 'iconfont-svg'
  },
  async beforeOutput(app, component) {
    if (!app.options.colorful) {
      component.template = component.template.replace(/ fill="[^"]*"/g, ' fill="currentColor"')
    }
    if (!app.options.allowOverride) {
      try {
        await access(component.outPath)
        component.output = false
        console.log(`${component.filename}已存在`)
      } catch {}
    }
  },
}

// 生成类型文件
const typePlugin: Plugin = {
  async end(app) {
    const options = app.options
    if (!options.type) return
    const filepath = resolve(dirname, options.type)
    await mkdir(resolve(filepath, '..'), { recursive: true })
    const dest = resolve(dirname, options.dest)
    const compList = await readdir(dest)
    const typeFile = `// 自动生成文件，请勿修改
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ${compList
      .map((t) => {
        const name = parse(t)
          .name.replace(/(^\S|-\S)/g, (str) => str.toUpperCase())
          .replace(/-/g, '')
        const fp = join(options.dest, t)
          .replace(/\\/g, '/')
          .replace(/^src\//, '@/')
        return [name, `typeof import('${fp}')`].join(': ')
      })
      .join('\n    ')}
  }
}

export {}`
    await writeFile(filepath, typeFile)
  },
}

export function createApp(options: ICLIArgs) {
  const instance = new App(options)
  instance.use(corePlugin).use(typePlugin)
  return instance
}
