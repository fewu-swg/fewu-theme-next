import { onPageProcess } from "./ui.mjs";

const d = (fn, delay) => {
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), delay);
    });
}

export const sharedObject = {
    observer: null
};

export function navBarInit() {
    try {
        const NAV_ROOT = document.querySelector('#NEO_HEADER');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.remove('focus');
                } else {
                    document.body.classList.add('focus');
                }
            });
        }, {
            rootMargin: '-1px',
            threshold: 0
        });

        const observeMarker = document.querySelector('#OBSERVE_MARKER');
        if (observeMarker) {
            observer.observe(observeMarker);
            sharedObject.observer = observer;
        }

        palette();
        hamburger();
        search();
        NAV_ROOT.setAttribute('mounted', 'true');
    } catch (e) {
        console.error(e);
    }
}

export function navBarCleanup() {
    if (sharedObject.observer) {
        sharedObject.observer.disconnect();
        sharedObject.observer = null;
    }
}

/**
 * 
 * @param {Element} triggerElement 
 * @param {Element} targetElement 
 * @param {(on: boolean) => any} callback 
 * @returns {(ev: Event) => void}
 */
function __listen(triggerElement, targetElement, callback) {
    let on = false;
    let event = (e) => {
        if (e.target === triggerElement || e.target === targetElement || triggerElement.contains(e.target) || targetElement.contains(e.target)) {
            return;
        } else {
            on = false;
            callback();
        }
    };
    triggerElement.addEventListener('click', () => {
        on = !on;
        callback(on);
        if (on) {
            document.addEventListener('click', event);
        } else {
            document.removeEventListener('click', event);
        }
    });
    return event;
}

function hamburger() {
    const NAV_ROOT = document.querySelector('header.global');
    const NAV_BAR_TOGGLE = NAV_ROOT.querySelector('.toggle');
    const menuElement = NAV_ROOT.querySelector('.links');
    __listen(NAV_BAR_TOGGLE, menuElement, (panelIsOn) => {
        NAV_ROOT.classList[panelIsOn ? 'add' : 'remove']('collapsed');
    });
}

function palette() {
    let paletteButton = document.getElementById('headerButtonPalette');
    let palettePanel = document.getElementById('headerComponentPalette');
    __listen(paletteButton, palettePanel, (on) => {
        palettePanel.classList[on ? 'add' : 'remove']('on');
    });
    let numberShower = palettePanel.querySelector('.number-show');
    let resetter = palettePanel.querySelector('.reset-button');
    let inputer = palettePanel.querySelector('input.scroller');
    let docRoot = document.querySelector(':root');
    let defaultValue = inputer.getAttribute('default');
    if (localStorage.getItem('0xarch.github.io/color-hue')) {
        let hue = localStorage.getItem('0xarch.github.io/color-hue');
        numberShower.innerHTML = hue;
        docRoot.style.setProperty('--config-hue', hue);
        inputer.value = parseInt(hue);
    } else {
        numberShower.innerHTML = defaultValue;
        inputer.value = defaultValue;
    };
    resetter.addEventListener('click', d(() => {
        numberShower.innerHTML = defaultValue;
        localStorage.removeItem('0xarch.github.io/color-hue');
        docRoot.style.setProperty('--config-hue', defaultValue);
        inputer.value = defaultValue;
    }));
    inputer.addEventListener('input', d(() => {
        numberShower.innerHTML = inputer.value;
        docRoot.style.setProperty('--config-hue', inputer.value);
    }));
    inputer.addEventListener('change', d(() => {
        numberShower.innerHTML = inputer.value;
        localStorage.setItem('0xarch.github.io/color-hue', inputer.value);
        docRoot.style.setProperty('--config-hue', inputer.value);
    }));
}

function search() {
    const Button = document.getElementById('headerButtonSearch');
    const Menu = document.getElementById('headerComponentSearch');
    __listen(Button, Menu, (on) => {
        Menu.classList[on ? 'add' : 'remove']('on');
    });
    let objPromise = (async () => {
        let raw = await fetch("/search.json");
        let json = await raw.json();
        return Object.entries(json);
    })();
    /**
     * @type {HTMLInputElement}
     */
    let input = Menu.querySelector('input');
    let clearButton = Menu.querySelector('.clear');
    let searchButton = Menu.querySelector('.search');
    let resultContainer = Menu.querySelector('.resultContainer');
    let shouldRun = true;
    async function doSearch() {
        if (!shouldRun) return;
        shouldRun = false;
        let leastTimer = new Promise((r) => {
            setTimeout(() => {
                r();
            }, 350);
        })
        let obj = await objPromise;
        let queryString = input.value;
        let results = [];
        if (queryString === '') {
        } else {
            for (let [k, v] of obj) {
                if (typeof v.c === 'string' && v.c.includes(queryString)) {
                    results.push([k, v.t]);
                } else if (typeof v.t === 'string' && v.t.includes(queryString)) {
                    results.push([k, v.t]);
                }
            }
            resultContainer.innerHTML = '';
            results.forEach(v => {
                resultContainer.innerHTML += `<a class="--smooth" href=${v[0].startsWith('/') ? '' : '/'}${v[0]}><b>${v[1]}</b><span>${v[0]}</span></a>`;
            });
            window?.__smoothNavigator?.applyTo('a.--smooth', onPageProcess);
        }
        await leastTimer;
        shouldRun = true;
    }
    input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            doSearch();
        }
    });
    searchButton.addEventListener('click', () => {
        doSearch();
    });
    clearButton.addEventListener('click', () => {
        input.value = '';
        resultContainer.innerHTML = '';
    })
}
