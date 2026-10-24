import { useEffect } from 'react';
import { store } from '../config/store';

interface Meta { title: string; description?: string; canonicalPath?: string; }

/** Sets document title, description, canonical and Open Graph tags for SPA routes. */
export function useDocumentMeta({ title, description, canonicalPath }: Meta) {
  useEffect(() => {
    document.title = title.includes(store.name) ? title : `${title} | ${store.name}`;
    const set = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta') as HTMLMetaElement;
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
    };
    if (description) {
      set('meta[name="description"]', 'name', 'description', description);
      set('meta[property="og:description"]', 'property', 'og:description', description);
    }
    set('meta[property="og:title"]', 'property', 'og:title', document.title);
    if (canonicalPath !== undefined) set('link[rel="canonical"]', 'rel', 'canonical', window.location.origin + canonicalPath);
  }, [title, description, canonicalPath]);
}
