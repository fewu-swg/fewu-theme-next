import MarkdownIt from "markdown-it";
import markdownItAdmonition from "markdown-it-admonition";
import hljs from "highlightjs";
import { abbr } from "@mdit/plugin-abbr";
import { alert } from "@mdit/plugin-alert";
import { footnote } from "@mdit/plugin-footnote";
import { mark } from "@mdit/plugin-mark";
import { sub } from "@mdit/plugin-sub";
import { sup } from "@mdit/plugin-sup";

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
    .use(abbr)
    .use(markdownItAdmonition, {
        types: ["abstract", "attention", "caution", "error", "info", "note", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"]
    })
    .use(alert, {
        alertNames: [
            "abstract", "attention", "caution", "error", "info", "note", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"
        ]
    })
    .use(footnote)
    .use(mark)
    .use(sub)
    .use(sup)

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
