const DOMParserI = new DOMParser();

function _stripHash(url) {
    return url.split('#')[0];
}

export class SmoothNavigator {
    targetDocument;
    passedLocations = [];
    defaultCallback;
    preCallback;
    /**
     * 
     * @param {Window} targetWindow 
     * @param {Function} callback 
     * @param {Function?} precallback
     */
    constructor(targetWindow, callback, preCallback) {
        this.targetDocument = targetWindow.document;
        this.defaultCallback = callback;
        this.preCallback = preCallback;
        this.passedLocations.push(targetWindow.location.href);
        targetWindow.addEventListener('popstate', (event) => {
            const currentUrl = targetWindow.location.href;
            const lastUrl = this.passedLocations[this.passedLocations.length - 1];
            // hashchange popstate
            if (lastUrl && _stripHash(currentUrl) === _stripHash(lastUrl)) {
                this.passedLocations[this.passedLocations.length - 1] = currentUrl;
                return;
            }
            this.passedLocations.pop();
            if (!this.passedLocations.length) return;
            this.navigate(this.passedLocations[this.passedLocations.length - 1], this.defaultCallback, { isBack: true });
        });
    }

    async navigate(url, callback, {
        isBack = false,
        scrollToTop = true,
    } = {}) {
        await this.preCallback?.(url);
        const document = this.targetDocument;
        document.body.classList.add(`being-replaced`);
        if (scrollToTop) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: `smooth`,
            });
        }
        let NEO_REPLACE_NODE = document.querySelector('#NEO_REPLACE');
        document.querySelector('header.global').classList.remove('collapsed');
        let least_timer = new Promise(resolve => setTimeout(resolve, 250)), lang_timer = new Promise(resolve => setTimeout(resolve, 500)); // for animation
        let content = await (await fetch(url)).text();
        let newDocument = DOMParserI.parseFromString(content, 'text/html');
        let targetLanguage = newDocument.documentElement.lang, currentLanguage = document.documentElement.lang;
        if (targetLanguage != currentLanguage) {
            document.body.classList.remove('dom-loaded');
        }
        await least_timer;
        // set url
        if (!isBack) this.passedLocations.push(url);
        window.history[isBack ? 'replaceState' : 'pushState']('', '', url);
        // process head.
        document.head.querySelector('title').innerHTML = newDocument.head.querySelector('title').innerHTML;
        document.head.querySelectorAll('meta').forEach(el => el.remove());
        newDocument.head.querySelectorAll('meta').forEach(el => document.head.appendChild(el));
        const rawLinkProperties = Array.from(document.head.querySelectorAll('link[data-sc]')).map(el => `${el.rel}=${el.href}`);
        const links = [];  
        newDocument.head.querySelectorAll('link[data-sc]').forEach(el => {
          if(rawLinkProperties.includes(`${el.rel}=${el.href}`)) return;
          document.head.appendChild(el);
          links.push(el);
        });
        // process multi-language
        if (targetLanguage != currentLanguage) {
            try {
                let targetSideWidget = await (await fetch(`/neo/side-widgets.${targetLanguage}/index.html`)).text();
                document.querySelector('#NEO_SIDE').innerHTML = targetSideWidget;
                let currentNav = document.body.querySelector('header.global');
                let targetNav = newDocument.body.querySelector('header.global');
                currentNav.innerHTML = targetNav.innerHTML;
                currentNav.removeAttribute('mounted');
            } catch (e) {
            }
            document.documentElement.lang = targetLanguage;
            await lang_timer;
            document.body.classList.add('dom-loaded');
        }
        // process body
        document.body.classList.add('not-ready');
        document.body.classList.remove('being-replaced');
        NEO_REPLACE_NODE.innerHTML = newDocument.querySelector('#NEO_REPLACE').innerHTML;
        document.body.classList.remove('not-ready');
        const load_waiter = Promise.allSettled(links.map(link => {
          return new Promise((resolve) => {
            if (link.sheet) {
              resolve();
              return;
            }
            const onLoad = () => {
              link.removeEventListener('load', onLoad);
              link.removeEventListener('error', onError);
              resolve();
            };
            link.addEventListener('load', onLoad);
            link.addEventListener('error', onLoad);
          });
        }));
        const load_timeout = new Promise(resolve => setTimeout(resolve, 1500));
        await Promise.race([ load_waiter, load_timeout ]);
        // scroll pos
        callback();
    }
    applyTo(selectors, callback, regCallback) {
        const document = this.targetDocument;
        document.querySelectorAll(selectors).forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(el.href, callback);
            })
            regCallback(el);
        })
    }
}
