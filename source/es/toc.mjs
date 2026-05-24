const sharedState = {
  observer: null,
  currentActiveIndex: -1,
  cleanupHandlers: [],
};

const generateHeadingId = (() => {
  const usedIds = new Map();

  const normalize = (text) => {
    let id = text.toLowerCase();
    id = id.replace(/[^\p{L}\p{N}\s\-_]/gu, '');
    id = id.replace(/\s+/g, '-');
    id = id.replace(/-+/g, '-');
    id = id.replace(/^-|-$/g, '');
    if (!id) id = 'heading';
    return id;
  };

  return (text, index) => {
    let base = normalize(text);
    let finalId = base;
    let counter = 1;
    while (usedIds.has(finalId)) {
      finalId = `${base}-${counter}`;
      counter++;
    }
    usedIds.set(finalId, true);
    return finalId;
  };
})();

const resetHeadingIdTracker = () => {
};

const createHeadingIdGenerator = () => {
  const usedIds = new Map();
  const normalize = (text) => {
    let id = text.toLowerCase();
    id = id.replace(/[^\p{L}\p{N}\s\-_]/gu, '');
    id = id.replace(/\s+/g, '-');
    id = id.replace(/-+/g, '-');
    id = id.replace(/^-|-$/g, '');
    if (!id) id = 'heading';
    return id;
  };
  return (text) => {
    let base = normalize(text);
    let finalId = base;
    let counter = 1;
    while (usedIds.has(finalId)) {
      finalId = `${base}-${counter}`;
      counter++;
    }
    usedIds.set(finalId, true);
    return finalId;
  };
};

const backToTopButton = (() => {
  const btn = document.querySelector('#backToTopButton');
  if (!btn) return null;
  btn.classList.add('hide');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return btn;
})();

const initTOC = (markdownContent, tocContainer) => {
  if (!markdownContent || !tocContainer) {
    console.warn('Missing markdown content or TOC container');
    return () => {};
  }

  if (sharedState.observer) {
    sharedState.observer.disconnect();
  }
  sharedState.cleanupHandlers.forEach(fn => fn());
  sharedState.cleanupHandlers = [];

  const headings = markdownContent.querySelectorAll('h2, h3, h4, h5, h6');
  if (headings.length === 0) return () => {};

  tocContainer.innerHTML = '';
  const liElements = [];
  const headingElements = [];
  const idGenerator = createHeadingIdGenerator();

  headings.forEach((heading, idx) => {
    const headingId = idGenerator(heading.textContent);
    heading.id = headingId;

    const level = heading.nodeName[1];
    const li = document.createElement('li');
    li.classList.add(`li-${level}`);
    li.textContent = heading.textContent;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tocContainer.appendChild(li);
    liElements.push(li);
    headingElements.push(heading);
  });

  const updateActiveHighlight = (activeIndex) => {
    if (sharedState.currentActiveIndex === activeIndex) return;
    if (sharedState.currentActiveIndex !== -1) {
      liElements[sharedState.currentActiveIndex]?.classList.remove('active');
    }
    if (activeIndex !== -1) {
      liElements[activeIndex]?.classList.add('active');
    }
    sharedState.currentActiveIndex = activeIndex;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length === 0) return;

      let closestEntry = visibleEntries.reduce((closest, current) => {
        const closestTop = closest.boundingClientRect.top;
        const currentTop = current.boundingClientRect.top;
        return currentTop < closestTop ? current : closest;
      });

      const activeIndex = headingElements.indexOf(closestEntry.target);
      updateActiveHighlight(activeIndex);
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -70% 0px',
    }
  );

  headingElements.forEach(heading => observer.observe(heading));
  sharedState.observer = observer;

  const toggleVisibility = () => {
    const scrollTrigger = window.scrollY > window.innerHeight * 0.4 - 5.5 * (window.SINGLE_REM || 16);
    tocContainer.classList.toggle('hide', !scrollTrigger);
    if (backToTopButton) {
      backToTopButton.classList.toggle('hide', !scrollTrigger);
      backToTopButton.hidden = !scrollTrigger;
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  const cleanupScroll = () => window.removeEventListener('scroll', toggleVisibility);
  sharedState.cleanupHandlers.push(cleanupScroll);
  toggleVisibility();

  const cleanup = () => {
    if (sharedState.observer) {
      sharedState.observer.disconnect();
      sharedState.observer = null;
    }
    sharedState.cleanupHandlers.forEach(fn => fn());
    sharedState.cleanupHandlers = [];
    sharedState.currentActiveIndex = -1;
  };
  sharedState.cleanup = cleanup;

  return cleanup;
};

export async function toc() {
  const tocContainer = document.getElementById('markdown_TOC');
  const content = document.getElementById('markdown_fillContent');
  if (content && tocContainer) {
    initTOC(content, tocContainer);
  } else {
    console.warn('Required elements #markdown_fillContent or #markdown_TOC not found');
  }
}

export function tocCleanup() {
  if (sharedState.cleanup) {
    sharedState.cleanup();
    delete sharedState.cleanup;
  }
  if (sharedState.updateFn) {
    window.removeEventListener('scroll', sharedState.updateFn);
    delete sharedState.updateFn;
  }
}