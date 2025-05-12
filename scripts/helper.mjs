import { join, relative } from "path";
import { _i18n, ltl } from "./language.mjs";
import SVGS, { get_material_symbols, reset_material_symbols } from "./svgs.mjs";
import { languages } from "./append_page.mjs";
import { get_fa_brand } from "./fontawesome.mjs";

let SVG_USED = [];

const get_svg  = (str) => {
    if (SVG_USED.includes(str)) {
        return SVGS[str].prefix + `<use xlink:href="#svg:${str}">` + SVGS[str].suffix;
    } else {
        SVG_USED.push(str);
        return SVGS[str].prefix + `<symbol id="svg:${str}">${SVGS[str].inner}</symbol><use xlink:href="#svg:${str}">` + SVGS[str].suffix;
    }
};

export default function (ctx) {
    let helpers = {
        i18n: (str)=> str,
        range: (start, end) => {
            let array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        },
        _icon: (str,type) => {
            if(str.startsWith('fa-brand:')){
                return get_fa_brand(str.replace('fa-brand:',''));
            } else if(str.startsWith('material-symbols:') && type) {
                return get_material_symbols(str.replace('material-symbols:',''),type);
            } else {
                return get_svg(str);
            }
        },
        get_svg,
        clear_build: () => {
            SVG_USED = [];
            reset_material_symbols();
        },
        post_url_for: (path) => {
            return join(ctx.config.root,relative(ctx.PUBLIC_DIRECTORY, path));
        },
        analyze_license: (str) => {
            let _str = String(str).toLowerCase();
            if(_str === 'private') {
                return {
                    type: 'private'
                }
            }
            if(_str === 'custom') {
                return {
                    type: 'custom'
                }
            }
            if(_str.startsWith('cc')){
                let types = ['by','nc','nd','sa'];
                let version = _str.replace(/[^0-9^.]/g,'') ?? '4.0';
                types = types.filter(v => _str.includes(v));
                return {
                    type: 'creative-common',
                    value: types,
                    version
                }
            }
            return {
                type: 'creative-common',
                value: ['by','nc','sa'],
                version: '4.0'
            }
        },
        get_fa_brand,
        ltl,
        _i18n: _i18n(ctx),
        _i18n_lang(current){
            return languages[current];
        }
    };
    ctx.plugin.helpers.array_unique = (array) => [... new Set(array)]
    Object.assign(ctx.plugin.helpers,helpers);
}
