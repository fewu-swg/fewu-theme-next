const sharedObject = {
    updateFn: undefined,
}

const backToTop = () => {
    let backToTopButton = document.querySelector('#backToTopButton');
    backToTopButton.classList.add('hide');
    backToTopButton?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    })
    return {
        element: backToTopButton
    }
}

const TOC = (markdown_content, toc) => {
    let { element: backToTopButton } = backToTop();
    let toc_update_fn_open = () => { };
    let toc_update_fn_close = () => { };
    if (!markdown_content) {
        console.warn(`No {markdown_content} specified. Disable TOC`);
    } else if (!toc) {
        console.warn(`No {toc} specified. Disable TOC`);
    } else {
        let tocList = markdown_content.querySelectorAll("h2, h3, h4, h5, h6");
        let liList = [];
        tocList.forEach((v) => {
            const H = v.nodeName[1];
            let li = document.createElement('li');
            li.classList.add(`li-${H}`);
            v.id = v.textContent.replace(/ /g, '_');
            li.textContent = v.textContent;
            li.addEventListener("click", () => {
                window.scrollBy({ top: v.getBoundingClientRect().y, behavior: "smooth" });
            });
            toc.appendChild(li);
            liList.push(li);
        })
        let tocArr = Array.from(tocList);
        const removeClass = () => {
            liList.forEach(v => v.classList.remove("active"));
        }
        toc_update_fn_open = () => {
            toc.classList.remove('hide');
            for (let i = 0; i < tocArr.length; i++) {
                let v = tocArr[i];
                let rect = v.getBoundingClientRect();
                let top = rect.top + rect.height;
                if (top > 0) {
                    removeClass();
                    let li = liList[i];
                    li.classList.add('active');
                    break;
                }
            }
        }
        toc_update_fn_close = () => {
            toc.classList.add('hide');
        }
    }
    const update = () => {
        if (window.scrollY > visualViewport.height / 100 * 40 - 5.5 * window.SINGLE_REM) {
            toc_update_fn_open();
            backToTopButton?.classList?.remove('hide');
            backToTopButton?.setAttribute('hidden', false);
        } else {
            toc_update_fn_close();
            backToTopButton?.classList?.add('hide');
        }
    }

    let ticking = false;
    sharedObject.updateFn = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            })
        }
        ticking = true;
    }
    window.addEventListener("scroll", sharedObject.updateFn);
    update();
}

export async function toc() {
    let toc = document.getElementById('markdown_TOC');
    let md_content = document.getElementById('markdown_fillContent');
    TOC(md_content, toc);
}

export function tocCleanup() {
    window.removeEventListener("scroll", sharedObject.updateFn);
}