import { compile, compileFile } from "pug";
import { dirname } from "path";
import { AbstractRenderer } from "@fewu-swg/abstract-types";

class PugRenderer implements AbstractRenderer {
    __fewu__ = 'renderer';

    toString(){
        return `Renderer<pug>@fewu-swg`
    }

    type = /\.pug$/;

    async render(template: string, templatePath: string, variables: object): Promise<string> {
        let compiled = compile(template, {
            filename: templatePath,
            basedir: dirname(templatePath)
        });
        return compiled(variables);
    }

    async renderFile(templatePath: string, variables: object): Promise<string> {
        return compileFile(templatePath, {
            filename: templatePath,
            basedir: dirname(templatePath)
        })(variables);
    }
}

export { PugRenderer, PugRenderer as renderer };