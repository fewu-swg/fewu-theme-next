# NEXT Theme

This is the default theme for Fewu 3. Inspired by [Fuwari theme for Astro](https://github.com/saicaca/fuwari).

## Install

### Through `fewu-cli`

**Recommend**

Install `fewu-cli`:
```shell
npm i fewu-cli
```

Initialize workspace:
```shell
npx fewu init
```

Download theme and dependencies:
```shell
npm i
```

### Through NPM

```shell
npm i @fewu-swg/fewu-theme-next
```

### Through Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

## Features

* Support for Light/Dark mode (automatic switching)
* Support for senseless page navigating (Pjax-like)
* Responsive layout
* Comments (giscus)
* Table of content

## Requirements

**NOTE**: If you install this theme by `fewu-cli`'s initialization feature, The requirements should already be put in `package.json`, just `npm i`.

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-400

```sh
npm i -S @fortawesome/free-brands-svg-icons @material-symbols/svg-400
```

Or copy this `package.json` to working directory (where you put `config.yaml`).

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-400": "^0.27.2"
  }
}
```