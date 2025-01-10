import MarkdownIt from "markdown-it";
import markdownItAbbr from "markdown-it-abbr/dist/markdown-it-abbr.js";
import markdownItAdmonition from "markdown-it-admonition";
import alert from "markdown-it-alert";
import markdownItMark from "markdown-it-mark/dist/markdown-it-mark.js";
import markdownItSub from "markdown-it-sub/dist/markdown-it-sub.js";
import markdownItSup from "markdown-it-sup/dist/markdown-it-sup.js";
import hljs from "highlightjs";

import { readFile } from "fs/promises";

const md = MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return '';
    }
});

md
    .use(markdownItAbbr)
    .use(markdownItAdmonition, {
        types: ["abstract", "attention", "caution", "error", "info", "note", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"]
    })
    .use(alert.default)
    .use(markdownItMark)
    .use(markdownItSub)
    .use(markdownItSup)

class FewuRendererMarkdown {
    type = /\.md$/;

    /**
     * @param {string} template 
     * @param {string?} templatePath 
     * @param {object?} variables 
     * @returns {Promise<string>}
     */
    async render(template, templatePath, variables) {
        return md.render(template);
    }

    /**
     * @param {string} templatePath 
     * @param {object?} variables 
     * @returns {Promise<string>}
     */
    async renderFile(templatePath, variables) {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return this.render(content);
    }
}

const fewuRendererMarkdown = new FewuRendererMarkdown();

export default fewuRendererMarkdown;
