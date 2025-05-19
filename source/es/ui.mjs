import { navBarInit } from './navBar.mjs';
import { toc } from './toc.mjs';
import { findAndInitGiscus } from './giscus.mjs';
import Reload from './smoothNav.mjs';

((window) => {
    window.SINGLE_REM = parseInt(window.getComputedStyle(document.documentElement).fontSize);
    globalThis.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
})(window);

(function (window) {
    window.passedLocation = [window.location.href];
    window.onpopstate = function () {
        passedLocation.pop();
        if (!passedLocation.length) return;
        window.Reload.goTo(passedLocation[passedLocation.length - 1], true, DoOthers);
    };
    window.Reload = Reload;
})(window, void 0);

export function DoOthers() {
    document.body.classList.remove('main-anim-finished');
    // giscus
    findAndInitGiscus();
    // TOC
    toc();
    // NavigationBar
    navBarInit();
    // Smooth Navigate
    Reload.applyTo('a:is(.--smooth,.__)', DoOthers);
    // highlight
    setTimeout(() => {
        if (window.hljs) {
            hljs.highlightAll();
        }
        document.querySelectorAll('#markdown_fillContent pre').forEach(element => {
            let code = element.querySelector('code');
            let con = document.createElement('div'), len = code.textContent.split("\n").length;
            con.classList.add('line-index');
            con.setAttribute('aria-hidden', true);
            for (let i = 1; i < len; i++) {
                let index_el = document.createElement('i');
                index_el.textContent = i;
                con.appendChild(index_el);
            }
            element.appendChild(con);
        });
    }, 500);
    // animation
    document.body.classList.add('main-anim');
    setTimeout(() => {
        document.body.classList.remove('main-anim');
        document.body.classList.add('main-anim-finished');
    }, 350);
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('0xarch.github.io/color-hue'))
        document.documentElement.style.setProperty('--config-hue', localStorage.getItem('0xarch.github.io/color-hue'));
    new Promise((resolve, reject) => {
        try {
            if (document.getElementById('NEO_SIDE')) {
                fetch(`/neo/side-widgets.${document.documentElement.lang}/index.html`)
                    .then((resp) => resp.text())
                    .then((value) => {
                        document.getElementById('NEO_SIDE').innerHTML = value;
                        resolve();
                    });
            } else {
                resolve();
            }
        } catch (e) { }
    }).then(() => {
        document.body.classList.add('dom-loaded');
        setTimeout(scrollToTop, 0);
        DoOthers();
        try {
            const NAV_ROOT = document.querySelector('header.global');
            NAV_ROOT.classList.add('anim');
            setTimeout(() => {
                NAV_ROOT.classList.remove('anim')
            }, 500);
        } catch (e) { }
    });
})
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
document.addEventListener('DOMContentLoaded',()=>{
    if(document.querySelector('meta[data-nosplash="1"]') && window.location.href.endsWith('/')){
        history.replaceState('','', window.location.href.slice(0,window.location.href.length-1));
    }
})