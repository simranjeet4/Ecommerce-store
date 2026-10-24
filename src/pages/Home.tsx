import { homepage, type HomeSection } from '../config/homepage';
import { store } from '../config/store';
import { CategoryGrid, Collection, Hero, Newsletter, ProductRail, Promo, ValueProps } from '../components/home/sections';
import { useDocumentMeta } from '../lib/seo';

function renderSection(s: HomeSection, i: number) {
  switch (s.type) {
    case 'hero': return <Hero key={i} />;
    case 'categoryGrid': return <CategoryGrid key={i} title={s.title} />;
    case 'productRail': return <ProductRail key={i} {...s} />;
    case 'promo': return <Promo key={i} />;
    case 'collection': return <Collection key={i} {...s} />;
    case 'valueProps': return <ValueProps key={i} />;
    case 'newsletter': return <Newsletter key={i} />;
  }
}

export default function Home() {
  useDocumentMeta({
    title: `${store.name} — Shop electronics, fashion, home & more in India`,
    description: 'A multi-category marketplace for India: electronics, fashion, jewellery, beauty, home, kitchen and handmade crafts. Prices in INR.',
    canonicalPath: '/',
  });
  return <>{homepage.map(renderSection)}</>;
}
