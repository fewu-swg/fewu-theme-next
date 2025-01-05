declare module 'fewu-renderer-markdown';

declare interface fewuRendererMarkdown {
    type: RegExp;

    render(content: string, templatePath?: string, variables?: object): Promise<string>;
    renderFile(templatePath: string, variables?: object): Promise<string>;
}

declare class FewuRendererMarkdown {
    type: RegExp;

    render(content: string, templatePath?: string, variables?: object): Promise<string>;
    renderFile(templatePath: string, variables?: object): Promise<string>;
}

export default fewuRendererMarkdown;