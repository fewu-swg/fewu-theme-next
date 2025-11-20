# NEXT

这是 Fewu 3 的默认主题。受 [Fuwari 主题](https://github.com/saicaca/fuwari) 启发。

[English](README.md)

## 安装

### 通过 `fewu-cli`

**推荐此方式**

安装 `fewu-cli`:
```shell
pnpm add fewu-cli
```

初始化工作区：
```shell
pnpm fewu init
```

下载主题和依赖：
```shell
pnpm i
```

### 通过 NPM

```shell
pnpm add @fewu-swg/fewu-theme-next
```

### 通过 Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

处理依赖：

```sh
pnpm add @fortawesome/free-brands-svg-icons @material-symbols/svg-400
```

或将此 `package.json` 复制到工作区下，然后执行 `pnpm i`：

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-600": "^0.27.2"
  }
}
```

## 功能

* 支持多语言（目前有zh-CN,fr,en(默认)的语言文件）
* 支持亮暗主题（自动切换）
* 支持页内导航（类Pjax）
* 响应式布局
* 评论系统（支持giscus）
* 文章目录
* Open Graph 协议

## 依赖项

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-600

## 配置

### 自定义导航栏

添加 `theme_next.additional_navs` (`Record<string,string>`) 到你的配置文件中,
键(导航名)必须是字符串, 值为URL或对象。若为URL，值将被直接填入`href`，若为对象则参下。

默认情况下, 若语言文件中包含键, 则键会被翻译. 以 `^` 开头的键将不会被翻译, `^` 将在生成时被移除.

```yaml
theme_next:
  additional_navs:
    ^About: /posts/about.md # 不会翻译
    About: /posts/about.md # 会翻译
    GitHub:
      isExternal: true # 控制是否使用页内导航
      title: GitHub # 标题，不会翻译
      url: https://github.com/ # URL
```