const domParser = new DOMParser();
const scriptCache = new Map();

function cleanupPreviousGiscus() {
    const tempScripts = document.querySelectorAll('[id^="__temp_giscus_script"]');
    tempScripts.forEach(script => script.remove());

    // 移除Giscus生成的评论容器和iframe（常见类名/选择器）
    const giscusSelectors = [
        '.giscus',
        '.giscus-frame',
        'iframe[title="giscus"]',
    ];
    giscusSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });
}

async function getScriptContent(src) {
    if (scriptCache.has(src)) {
        return scriptCache.get(src);
    }
    try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const content = await response.text();
        scriptCache.set(src, content);
        return content;
    } catch (error) {
        console.error(`Failed to get Giscus script: ${src}`, error);
        throw error;
    }
}

export async function findAndInitGiscus() {
    cleanupPreviousGiscus();

    const element = document.querySelector('._giscus_script');
    if (!element) {
        console.warn('Cannot detect {__giscus_script}, Skipped.');
        return;
    }

    const parsedDoc = domParser.parseFromString(element.textContent, 'text/html');
    const scriptElement = parsedDoc.querySelector('script');
    if (!scriptElement || !scriptElement.src) {
        console.error('Invalid config element');
        return;
    }

    const scriptId = `__temp_giscus_script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    scriptElement.id = scriptId;

    element.insertAdjacentElement('afterend', scriptElement);
    element.remove();

    try {
        const rawContent = await getScriptContent(scriptElement.src);
        const processedContent = rawContent.replace(
            /document\.currentScript/g,
            `document.querySelector("#${scriptId}")`
        );

        (0, eval)(processedContent);

        const tempScript = document.getElementById(scriptId);
        if (tempScript) tempScript.remove();
    } catch (error) {
        console.error('Failed to initalize giscus: ', error);
        const failedScript = document.getElementById(scriptId);
        if (failedScript) failedScript.remove();
    }
}