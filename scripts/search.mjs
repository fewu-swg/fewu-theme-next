import { writeFile } from "fs/promises";
import { join } from "path";

export default function search(ctx) {
    let search = {};
    ctx.data.posts.forEach(v => {
        search[v.relative_path] = {
            t: v.title,
            c: v.raw.replace(/(^#{1,6}\s+|\!?\[.*?\]\(.*?\)|{3}[\s\S]*?{3})/gm, '').trim()
        };
    });
    ctx.on('afterDeploy', async (ctx) => {
        await writeFile(join(ctx.PUBLIC_DIRECTORY, 'search.json'), JSON.stringify(search), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
}