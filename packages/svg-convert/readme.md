### 描述

将svg图标转成vue组件。

命令名为`svg-convert`，也可以使用短命令`sc`。

### 示例

package.json

```json
{
  "scripts": {
    "svg:solid": "sc -s svg/solid -d src/components/svg-icon --prefix=icon- -O",
    "svg:color": "sc -s svg/colorful -d src/components/svg-icon --prefix=icon- -cO"
  }
}
```

### 命令行选项

```text
Usage: svg-creator [options]

Options:
  -c, --colorful         svg彩色 (default: false)
  -O, --allow-override   允许覆盖 (default: false)
  --prefix [string]      组件前缀
  -t, --type <filepath>  类型输出位置（文件）
  -s, --src <dirname>    svg源目录
  -d, --dest <dirname>   组件输出目录
  -h, --help             display help for command
```

**注意**：`--type`指定的路径包含`src`时，会被替换为`@`
