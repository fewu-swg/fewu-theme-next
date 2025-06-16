import Reload from "./smoothNav.mjs";
import { onPageProcess } from "./ui.mjs";

export function navBarInit() {
    try {
        const NAV_ROOT = document.querySelector('header.global');
        // Global Focus
        let lastKnownScrollPosition = 0;
        let ticking = false;
        function NavFloatToggle(scrollPos) {
            if (scrollPos >= visualViewport.height / 100 * 37.75 - 5.5 * SINGLE_REM) {
                document.body.classList.add('focus');
            } else {
                document.body.classList.remove('focus');
            }
        }
        document.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY != lastKnownScrollPosition) {
                        NavFloatToggle(window.scrollY);
                        lastKnownScrollPosition = window.scrollY;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
        palette();
        hamburger();
        search();
        NAV_ROOT.setAttribute('mounted', 'true');
    } catch (e) {
        console.error(e);
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
    __listen(paletteButton, palettePanel,(on)=>{
        palettePanel.classList[on ? 'add' : 'remove']('on');
    });
    let numberShower = palettePanel.querySelector('.number-show');
    let resetter = palettePanel.querySelector('.reset-button');
    let inputer = palettePanel.querySelector('input.scroller');
    let docRoot = document.querySelector(':root');
    if (localStorage.getItem('0xarch.github.io/color-hue')) {
        let hue = localStorage.getItem('0xarch.github.io/color-hue');
        numberShower.innerHTML = hue;
        docRoot.style.setProperty('--config-hue', hue);
        inputer.value = parseInt(hue);
    } else {
        numberShower.innerHTML = 250;
        inputer.value = 250;
    };
    resetter.addEventListener('click', () => {
        numberShower.innerHTML = '250';
        localStorage.removeItem('0xarch.github.io/color-hue');
        docRoot.style.setProperty('--config-hue', 250);
        inputer.value = 250;
    })
    inputer.addEventListener('input', () => {
        numberShower.innerHTML = inputer.value;
        docRoot.style.setProperty('--config-hue', inputer.value);
    });
    inputer.addEventListener('change', () => {
        numberShower.innerHTML = inputer.value;
        localStorage.setItem('0xarch.github.io/color-hue', inputer.value);
        docRoot.style.setProperty('--config-hue', inputer.value);
    });
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
                resultContainer.innerHTML += `<a class="--smooth" href=/${v[0]}><b>${v[1]}</b><span>${v[0]}</span></a>`;
            });
            Reload.applyTo('a.--smooth', onPageProcess);
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