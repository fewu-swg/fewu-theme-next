declare module 'fewu-renderer-markdown';

declare class fewuRendererMarkdown {
    static type: RegExp;

    static render(content: string, templatePath?: string, variables?: object): Promise<string>;
    static renderFile(templatePath: string, variables?: object): Promise<string>;
}

declare class FewuRendererMarkdown {
    type: RegExp;

    render(content: string, templatePath?: string, variables?: object): Promise<string>;
    renderFile(templatePath: string, variables?: object): Promise<string>;
}

export default fewuRendererMarkdown;