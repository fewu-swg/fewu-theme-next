import { join } from "path";

let languages = [];

export default function append_page(ctx) {
    for(let post of ctx.data.posts){
        if(!languages.includes(post.language)){
            languages.push(post.language);
        }
    }
    ctx.extend.append_pages.push({
        type: 'side_widget',
        get(ctx) {
            return [
                ...languages.map(v=> join(ctx.PUBLIC_DIRECTORY, `neo/side-widgets.${v}/index.html`))
            ];
        }
    },{
        type: 'page',
        get(ctx) {
            let array = [];
            for (let i = 0; i < Math.ceil(ctx.data.posts.filter(v=>!v.properties.hidden).length/10); i++) {
                array.push(join(ctx.PUBLIC_DIRECTORY, 'page', i.toString(), 'index.html'));
            }
            return array;
        }
    });
  if(ctx.config.theme_next?.title_in_path) {
    Object.entries(ctx.data.sources).forEach(([_,article]) => {
      if(article.properties['permalink:notitle']) return;
      article.path = join(article.path, article.title);
      article.relative_path = join(article.relative_path, article.title);
      article.web_absolute_path.strings.push(article.title);
      article.web_relative_path.strings.push(article.title);
      article.build_absolute_path.strings.push(article.title);
      article.build_relative_path.strings.push(article.title);
    });
  }
}

export {
    languages
};
