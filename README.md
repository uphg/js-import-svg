# SVG 生成引入页面的 JS 文件

使用 Node.js 将多个 SVG 文件快速生成为一个 JS 文件，方便引入页面

运行

```sh
node utils/cli.js
```

默认会将 `icons` 目录下的所有 SVG 文件（支持嵌套目录）转为一段 JS 代码导入至 `result/import-svg.js` 中

使用方法，以引入一个 `alarm.svg` SVG 文件为例：

```html
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-alarm"></use>
</svg>
```