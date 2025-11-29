# NEXT Theme

This is the default theme for Fewu 3. Inspired by [Fuwari theme for Astro](https://github.com/saicaca/fuwari).

[简体中文](README.zh-CN.md)

## Install

### Through `fewu-cli`

**Recommended**

Install `fewu-cli`:
```shell
pnpm add fewu-cli
```

Initialize workspace:
```shell
pnpm fewu init
```

Download theme and dependencies:
```shell
pnpm i
```

### Through NPM

```shell
pnpm add @fewu-swg/fewu-theme-next
```

### Through Git

```shell
git clone https://github.com/fewu-swg/fewu-theme-next themes/next
```

Install dependencies:

```sh
pnpm add @fortawesome/free-brands-svg-icons @material-symbols/svg-600
```

Or copy this `package.json` to working directory (where you put `config.yaml`) then execute `pnpm i`.

```json
{
  "dependencies": {
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@material-symbols/svg-600": "^0.27.2"
  }
}
```

## Features

* Support for Multi-language (with zh-CN, fr, en-US(default) langauge profile now)
* Support for Light/Dark mode (automatic switching)
* Support for senseless page navigating (Pjax-like)
* Responsive layout
* Comments (giscus)
* Table of content
* Open Graph Protocol

## Dependencies

* (npm) @fortawesome/free-brands-svg-icons
* (npm) @material-symbols/svg-600

## Article Features

All the following properties should be specify in front-matter.

`hidden: Boolean`: whether the article will be shown (This **CANNOT** prevent article from showing in categories/tags).

`disable_comment: Boolean`: whether the Comment Plugin (Giscus) will be disabled.

`disable_adjacent: Boolean`: whether the Adjacent Article Navigator (NextPage) will be disabled.

## Configurations

### Custom Navigate

Add `theme_next.additional_navs` (`Record<string,string|object>`) to your configuration file,
The key (name) must be a string, the value should be a url or Object, the url will be directly filled into `href`. For Object, see below.

Default, the key will be translated if it's been found in the translations file. Keys start with `^` will not be translated and the starting `^` will be removed.

```yaml
theme_next:
  additional_navs:
    ^About: /posts/about.md # Will not be translated
    About: /posts/about.md # Will be translated
    GitHub:
      isExternal: true # Whether not to use senseless page navigating
      title: GitHub # title, will not be translated
      url: https://github.com/ # URL
```

### Accent Color

Add `theme_next.accent_color` (`Number`) to define the default color of your site.

```yaml
theme_next:
  accent_color: 250 # this is the default blue
```

### Banner Image

Add `theme_next.banner` (`{url: string; credit: string; credit_url: string}`) to define custom banner image.

If `theme_next.banner.url` is not specified, the banner will be disabled.

If `theme_next.banner.credit` is specified, a copyright sign will be shown. If `theme_next.banner.credit_url` is specified, the sign will link to the specified URL.

```yaml
theme_next:
  banner:
    url: /banner.webp # URL
    credit:
    credit_url: