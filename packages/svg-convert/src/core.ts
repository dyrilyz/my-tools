import type { ICLIArgs } from './cli'
import { join, parse, resolve } from 'node:path'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'

const __dirname = process.cwd()
const xmlAttrsPrefix = '@_'
const includeAttrs = ['viewBox'].map((t) => `${xmlAttrsPrefix}${t}`)
const includeTags = ['svg', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'path', 'text', 'tspan', 'g', 'defs', 'use', 'linearGradient', 'pattern', 'mask', 'clipPath', 'filter']
const xmlOpt = { ignoreAttributes: false }

export async function start(options: ICLIArgs) {
  const dest = resolve(__dirname, options.dest)
  const parser = new XMLParser(xmlOpt)
  const builder = new XMLBuilder(xmlOpt)
  const svgDir = resolve(__dirname, options.src)
  const svgList = await readdir(svgDir)
  const components: { template: string; filename: string }[] = []
  const includeKey = [...includeAttrs, ...includeTags]

  await mkdir(dest, { recursive: true })
  for (let svgName of svgList) {
    const filepath = resolve(svgDir, svgName)
    const path = parse(filepath)
    if (path.ext !== '.svg') break
    const data = await readFile(filepath)
    const xml = parser.parse(data)
    const svg: Record<string, any> = {}
    Object.keys(xml['svg']).forEach((key) => {
      if (includeKey.includes(key)) {
        Reflect.set(svg, key, xml['svg'][key])
      }
    })
    svg[`${xmlAttrsPrefix}class`] = 'iconfont-svg'
    let template = builder.build({ template: { svg } })
    if (!options.colorful) {
      template = template.replace(/ fill="[^"]*"/g, ' fill="currentColor"')
    }
    components.push({
      template,
      filename: `${options.prefix}${path.name}.vue`,
    })
  }

  for (let component of components) {
    const outPath = resolve(dest, component.filename)
    if (options.allowOverride) {
      await writeFile(outPath, component.template)
    } else {
      try {
        await access(outPath)
        console.log(`${component.filename}已存在，跳过`)
      } catch (e) {
        await writeFile(outPath, component.template)
      }
    }
  }

  await generateTypes(options)
}

// 生成类型文件
async function generateTypes(options: ICLIArgs) {
  if (!options.type) return
  const filepath = resolve(__dirname, options.type)
  await mkdir(resolve(filepath, '..'), { recursive: true })
  const dest = resolve(__dirname, options.dest)
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
}
