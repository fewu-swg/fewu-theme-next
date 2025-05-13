# NEXT

这是 Fewu 3 的默认主题。受 [Fuwari 主题](https://github.com/saicaca/fuwari) 启发。

[English](README.md)

## 安装

### 通过 `fewu-cli`

**推荐此方式**

安装 `fewu-cli`:
```shell
npm i fewu-cli
```

初始化工作区：
```shell
npx fewu init
```

下载主题和依赖：
```shell
npm i
```

### 通过 NPM

```shell
npm i @fewu-swg/fewu-theme-next
```

### 通过 Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

处理依赖：

```sh
npm i -S @fortawesome/free-brands-svg-icons @material-symbols/svg-400
```

或将此 `package.json` 复制到工作区下，然后执行 `npm i`：

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-400": "^0.27.2"
  }
}
```

## 功能

* 支持亮暗主题（自动切换）
* 支持无感导航（类Pjax）
* 响应式布局
* 评论系统（支持giscus）
* 文章目录

## 依赖项

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-400