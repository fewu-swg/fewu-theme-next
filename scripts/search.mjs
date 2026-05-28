import { writeFile } from "fs/promises";
import { join } from "path";

export default function search(ctx) {
  let search = {};

  ctx.on('afterDeploy', async (ctx) => {
    try {
      console.log(`[THEME] Generating search cache`);
      Object.values(ctx.data.sources).forEach(v => {
      search[v.web_relative_path.toString()+'/'] = {
      t: v.title,
      c: v.raw.split('\n').map(v => v.trim()).join('').replaceAll(/(^#{1,6}\s+|\!?\[.*?\]\(.*?\)|[<>]|[\s\S]*?)/gm, '').trim()
      };
      });
      const path = join(ctx.PUBLIC_DIRECTORY, 'search.json');
      console.log(`[THEME] Pushing search cache to ${path}`);
      await writeFile(path, JSON.stringify(search), (err) => {
        if (err) {
          console.error(err);
        }
      });
    } catch(e) {
      console.error(`[THEME] Got errors while generating search cache: ${e}`);
    }
  });
}
