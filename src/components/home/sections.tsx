import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { HomeSection } from '../../config/homepage';
import { store } from '../../config/store';
import { categories, getCategoryById } from '../../data/categories';
import { img } from '../../data/images';
import { promotions } from '../../data/promotions';
import { catalog } from '../../services/catalog';
import { ProductCard } from '../product/ProductCard';
import { Icon } from '../ui/Icon';
import { SmartImage } from '../ui/SmartImage';

/* ---------- Hero ---------- */
export function Hero() {
  const chips = categories.slice(0, 6);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">A marketplace for India</span>
          <h1 id="hero-title" className="display hero__title">
            From your desk <em>to</em> your doorstep décor — <span>all in one bazaar.</span>
          </h1>
          <p className="hero__lead">
            Electronics, fashion, beauty, home, kitchen and handmade crafts from brands, local businesses and
            independent makers. Clear prices in rupees, no guesswork.
          </p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--accent">Start shopping <Icon name="arrow" size={18} /></Link>
            <Link to="/shop?deals=1" className="btn btn--ghost">See demo deals</Link>
          </div>
          <ul className="hero__chips" aria-label="Popular categories">
            {chips.map((c) => <li key={c.id}><Link to={`/category/${c.slug}`}>{c.shortName}</Link></li>)}
          </ul>
        </div>
        <div className="hero__visual">
          <SmartImage src={img.hero} alt="Headphones, a kurta, jewellery, skincare and home décor arranged together"
            aspect="4 / 3.4" eager className="hero__img" />
          <Link to="/category/fashion-jewellery" className="hero__tile hero__tile--a">
            <SmartImage src={img.jewelleryEditorial} alt="" aspect="1 / 1" eager />
            <span>Festive jewellery <Icon name="arrow" size={14} /></span>
          </Link>
          <Link to="/category/electronics" className="hero__tile hero__tile--b">
            <SmartImage src={img.headphones} alt="" aspect="1 / 1" surface="#ECEEF0" />
            <span>Audio & wearables <Icon name="arrow" size={14} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Category grid (bento) ---------- */
export function CategoryGrid({ title }: { title: string }) {
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  return (
    <section className="section" aria-labelledby="cat-grid-title">
      <div className="container">
        <div className="section-head">
          <div><span className="eyebrow">{sorted.length} departments</span><h2 id="cat-grid-title">{title}</h2></div>
          <Link to="/shop" className="link-arrow">Browse everything <Icon name="arrow" size={16} /></Link>
        </div>
        <ul className="catgrid">
          {sorted.map((c, i) => (
            <li key={c.id} className={`catgrid__item catgrid__item--${i}`}>
              <Link to={`/category/${c.slug}`} className="catgrid__link">
                <SmartImage src={c.image.src} alt={c.image.alt} surface={c.presentation.surface} className="catgrid__img" />
                <div className="catgrid__label">
                  <h3>{c.shortName}</h3>
                  <p>{c.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Product rail ---------- */
export function ProductRail({ title, eyebrow, source, viewAll }: Extract<HomeSection, { type: 'productRail' }>) {
  const items = catalog[source](8);
  if (!items.length) return null;
  const id = `rail-${source}`;
  return (
    <section className="section" aria-labelledby={id}>
      <div className="container">
        <div className="section-head">
          <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2 id={id}>{title}</h2></div>
          {viewAll && <Link to={viewAll} className="link-arrow">View all <Icon name="arrow" size={16} /></Link>}
        </div>
        <ul className="rail">
          {items.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Promo ---------- */
export function Promo() {
  const { primary, secondary } = promotions;
  const picks = catalog.all().filter((p) => p.tags.includes(primary.tag)).slice(0, 3);
  return (
    <section className="section" aria-labelledby="promo-title">
      <div className="container promo">
        <div className="promo__main">
          <span className="badge badge--demo">{primary.eyebrow}</span>
          <h2 id="promo-title" className="display">{primary.title}</h2>
          <p>{primary.body}</p>
          <Link to={primary.cta.href} className="btn btn--light">{primary.cta.label} <Icon name="arrow" size={18} /></Link>
          <ul className="promo__picks">
            {picks.map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.slug}`} aria-label={p.name}>
                  <SmartImage src={p.images[0].src} alt="" aspect="1 / 1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="promo__side">
          {secondary.map((s) => (
            <Link key={s.title} to={s.href} className="promo__card">
              <div><h3>{s.title}</h3><p>{s.body}</p></div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Category collections (three distinct layouts) ---------- */
export function Collection({ categoryIds, title, eyebrow, blurb, layout }: Extract<HomeSection, { type: 'collection' }>) {
  const items = categoryIds.flatMap((id) => catalog.byCategory(id)).slice(0, layout === 'tech' ? 4 : 4);
  const cats = categoryIds.map(getCategoryById).filter(Boolean);
  const lead = cats[0]!;
  const heroImage = layout === 'style' ? img.fashionEditorial : layout === 'lifestyle' ? img.sofa : img.keyboard;
  const id = `col-${layout}`;
  return (
    <section className={`section collection collection--${layout}`} aria-labelledby={id}>
      <div className="container collection__grid">
        <div className="collection__intro">
          <SmartImage src={heroImage} alt="" className="collection__img" />
          <div className="collection__copy">
            <span className="eyebrow">{eyebrow}</span>
            <h2 id={id} className="display">{title}</h2>
            <p>{blurb}</p>
            <div className="collection__links">
              {cats.map((c) => (
                <Link key={c!.id} to={`/category/${c!.slug}`} className="link-arrow">
                  Shop {c!.shortName.toLowerCase()} <Icon name="arrow" size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <ul className="collection__products" aria-label={`${lead.shortName} products`}>
          {items.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Value proposition (no unverifiable claims) ---------- */
export function ValueProps() {
  const items = [
    { icon: 'store' as const, title: 'Many makers, one cart', body: 'Products from brands, local businesses and independent artisans in a single checkout.' },
    { icon: 'info' as const, title: 'Honest product pages', body: 'Prices in INR, real specifications and only the details that matter for each product type.' },
    { icon: 'truck' as const, title: 'Delivery across India', body: 'Delivery estimates will be shown per product and PIN code once logistics are connected.' },
    { icon: 'returns' as const, title: 'Clear return terms', body: 'Return eligibility will be shown on every product page. Policy details are being finalised.' },
  ];
  return (
    <section className="section section--tint" aria-labelledby="value-title">
      <div className="container">
        <div className="value__head">
          <span className="eyebrow">Why {store.name}</span>
          <h2 id="value-title" className="display">A marketplace built around how India actually shops.</h2>
        </div>
        <ul className="value">
          {items.map((v, i) => (
            <li key={v.title}>
              <span className="value__num">0{i + 1}</span>
              <Icon name={v.icon} size={26} />
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError('Please enter a valid email, like name@example.com.');
    setError('');
    setDone(true);
  };
  return (
    <section className="section" aria-labelledby="nl-title">
      <div className="container">
        <div className="newsletter">
          <div>
            <h2 id="nl-title" className="display">New arrivals and offers, now and then.</h2>
            <p>One thoughtful email at most a week. Unsubscribe any time.</p>
          </div>
          {done ? (
            <div className="newsletter__done" role="status">
              <Icon name="check" /> <span>Thanks! This is a demo — <strong>{email}</strong> was validated but not stored. A mailing provider will be connected later.</span>
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="nl-email">Email address</label>
                <div className="newsletter__row">
                  <input id="nl-email" type="email" className="input" placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    aria-invalid={!!error} aria-describedby={error ? 'nl-error' : undefined} autoComplete="email" />
                  <button type="submit" className="btn btn--accent">Subscribe</button>
                </div>
                {error && <p id="nl-error" className="field-error" role="alert">{error}</p>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
