import { useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Price, ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';
import { SmartImage } from '../components/ui/SmartImage';
import { store } from '../config/store';
import { getCategoryById } from '../data/categories';
import { isInStock, variantLabel } from '../lib/format';
import { useDocumentMeta } from '../lib/seo';
import { catalog } from '../services/catalog';
import { MAX_PER_LINE, useCart } from '../state/CartContext';
import type { Product, ProductVariant } from '../types/catalog';

function findInitialOptions(product: Product): Record<string, string> {
  if (!product.options?.length) return {};
  const firstInStock = product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];
  if (firstInStock) return { ...firstInStock.optionValues };
  return Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]));
}

function ProductDetailContent({ product }: { product: Product }) {
  const { add } = useCart();
  const category = getCategoryById(product.categoryId);
  const pres = category?.presentation;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => findInitialOptions(product));
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  // Delivery estimate placeholder state
  const [pincode, setPincode] = useState('');
  const [pinStatus, setPinStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!product.variants?.length) return undefined;
    return product.variants.find((v) =>
      Object.entries(selectedOptions).every(([k, val]) => v.optionValues[k] === val),
    );
  }, [product, selectedOptions]);

  const unitPrice = activeVariant?.price ?? product.price;
  const compareAt = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const availableStock = product.variants?.length ? (activeVariant?.stock ?? 0) : product.stock;
  const maxSelectableQty = Math.max(1, Math.min(availableStock, MAX_PER_LINE));
  const clampedQty = Math.min(qty, maxSelectableQty);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    setAddedMsg(false);
  };

  const isOptionValueInStock = (optionName: string, value: string) => {
    if (!product.variants?.length) return true;
    const hypothetical = { ...selectedOptions, [optionName]: value };
    const match = product.variants.find((v) =>
      Object.entries(hypothetical).every(([k, val]) => v.optionValues[k] === val),
    );
    return match ? match.stock > 0 : false;
  };

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    add(product.id, activeVariant?.id, clampedQty);
    setAddedMsg(true);
  };

  const handlePinCheck = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
      setPinStatus({ ok: false, text: 'Please enter a valid 6-digit Indian PIN code (e.g. 400001).' });
      return;
    }
    setPinStatus({
      ok: true,
      text: `PIN ${cleaned}: Delivery estimate placeholder (typically 3–7 business days once courier APIs are connected).`,
    });
  };

  const attributeEntries = Object.entries(product.attributes);
  const related = useMemo(() => catalog.related(product, 4), [product]);

  // Honest JSON-LD Product structured data — no fabricated ratings or claims
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((i) => (i.src.startsWith('http') ? i.src : `${window.location.origin}${i.src}`)),
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    category: category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: unitPrice,
      availability: isInStock(product) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${window.location.origin}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section pdp">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            {category && (
              <>
                <Link to={`/category/${category.slug}`}>{category.shortName}</Link>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="pdp__grid">
            {/* Gallery */}
            <div className="pdp__gallery">
              <div className="pdp__stage">
                <SmartImage
                  src={product.images[activeImage]?.src ?? product.images[0].src}
                  alt={product.images[activeImage]?.alt ?? product.images[0].alt}
                  aspect={pres?.aspect ?? '1 / 1'}
                  surface={pres?.surface}
                  fit={pres?.fit}
                  eager
                  className="pdp__main-img"
                />
                {product.isDemo && <span className="badge badge--demo pdp__demo-badge">Demo product</span>}
              </div>

              {product.images.length > 1 && (
                <ul className="pdp__thumbs" aria-label="Product views">
                  {product.images.map((imgItem, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        className={`pdp__thumb ${idx === activeImage ? 'is-active' : ''}`}
                        aria-label={`View image ${idx + 1}: ${imgItem.alt}`}
                        onClick={() => setActiveImage(idx)}
                      >
                        <SmartImage src={imgItem.src} alt="" aspect="1 / 1" surface={pres?.surface} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Summary & purchase controls */}
            <div className="pdp__info">
              <div className="pdp__meta-row">
                {product.brand && <span className="pdp__brand">{product.brand}</span>}
                {product.subcategory && <span className="badge badge--muted">{product.subcategory}</span>}
              </div>

              <h1 className="display pdp__title">{product.name}</h1>

              <div className="pdp__price-box">
                <Price price={unitPrice} compareAt={compareAt} />
                <span className="muted pdp__tax-note">Inclusive of all taxes (demo pricing in INR)</span>
              </div>

              <p className="pdp__desc">{product.description}</p>

              {/* Variant pickers */}
              {product.options?.map((opt) => (
                <div key={opt.name} className="pdp__option-group">
                  <div className="pdp__option-head">
                    <span className="pdp__option-label">{opt.name}:</span>
                    <strong>{selectedOptions[opt.name]}</strong>
                  </div>
                  <div className="pdp__option-values" role="radiogroup" aria-label={opt.name}>
                    {opt.values.map((val) => {
                      const selected = selectedOptions[opt.name] === val;
                      const inStock = isOptionValueInStock(opt.name, val);
                      return (
                        <button
                          key={val}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`opt-pill ${selected ? 'is-selected' : ''} ${!inStock ? 'is-oos' : ''}`}
                          onClick={() => handleOptionChange(opt.name, val)}
                        >
                          {val}
                          {!inStock && <span className="visually-hidden"> (Out of stock)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Stock availability */}
              <div className="pdp__stock" role="status" aria-live="polite">
                {availableStock > 5 && (
                  <span className="stock-pill stock-pill--in">In stock ({availableStock} available in demo inventory)</span>
                )}
                {availableStock > 0 && availableStock <= 5 && (
                  <span className="stock-pill stock-pill--low">Low stock — only {availableStock} left</span>
                )}
                {availableStock <= 0 && <span className="stock-pill stock-pill--out">Out of stock for this selection</span>}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="pdp__purchase">
                <div className="qty-control" aria-label="Quantity">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Decrease quantity"
                    disabled={availableStock <= 0 || clampedQty <= 1}
                    onClick={() => setQty(Math.max(1, clampedQty - 1))}
                  >
                    <Icon name="minus" size={16} />
                  </button>
                  <input
                    type="number"
                    aria-label="Quantity"
                    className="qty-input"
                    min={1}
                    max={maxSelectableQty}
                    disabled={availableStock <= 0}
                    value={availableStock <= 0 ? 0 : clampedQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) {
                        setQty(Math.max(1, Math.min(maxSelectableQty, Math.floor(val))));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Increase quantity"
                    disabled={availableStock <= 0 || clampedQty >= maxSelectableQty}
                    onClick={() => setQty(Math.min(maxSelectableQty, clampedQty + 1))}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn--accent pdp__add-btn"
                  disabled={availableStock <= 0}
                  onClick={handleAddToCart}
                >
                  <Icon name="bag" size={18} />
                  {availableStock > 0 ? 'Add to cart' : 'Unavailable'}
                </button>
              </div>

              {addedMsg && (
                <div className="pdp__added-banner" role="status">
                  <div>
                    <Icon name="check" size={18} />
                    <span>
                      Added <strong>{clampedQty} × {product.name}</strong>
                      {activeVariant ? ` (${variantLabel(activeVariant)})` : ''} to your cart.
                    </span>
                  </div>
                  <Link to="/cart" className="btn btn--sm">View cart</Link>
                </div>
              )}

              {/* Category-specific attributes (only displayed when relevant) */}
              {attributeEntries.length > 0 && (
                <div className="pdp__section">
                  <h2 className="pdp__subhead">Product highlights</h2>
                  <dl className="attr-grid">
                    {attributeEntries.map(([label, value]) => (
                      <div key={label} className="attr-grid__item">
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Technical / item specifications (only displayed when present) */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="pdp__section">
                  <h2 className="pdp__subhead">Specifications</h2>
                  <dl className="spec-table">
                    {product.specifications.map((s) => (
                      <div key={s.label} className="spec-table__row">
                        <dt>{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Delivery & Returns placeholders */}
              <div className="pdp__service-cards">
                <div className="service-card">
                  <div className="service-card__head">
                    <Icon name="truck" size={20} />
                    <h3>Delivery estimate (placeholder)</h3>
                  </div>
                  <form className="pin-form" onSubmit={handlePinCheck} noValidate>
                    <label htmlFor="pin-input" className="visually-hidden">Enter 6-digit Indian PIN code</label>
                    <input
                      id="pin-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN (e.g. 560001)"
                      className="input input--sm"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    />
                    <button type="submit" className="btn btn--ghost btn--sm">Check</button>
                  </form>
                  {pinStatus && (
                    <p className={pinStatus.ok ? 'pin-msg pin-msg--ok' : 'field-error'} role="status">
                      {pinStatus.text}
                    </p>
                  )}
                </div>

                <div className="service-card">
                  <div className="service-card__head">
                    <Icon name="returns" size={20} />
                    <h3>Returns & exchange information</h3>
                  </div>
                  <p className="muted">
                    Return eligibility and replacement windows will be configured per category before launch.{' '}
                    <Link to="/returns-policy" className="text-link">Read the returns policy placeholder</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tint" aria-labelledby="related-heading">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">More from {category?.shortName ?? store.name}</span>
                <h2 id="related-heading">Related products</h2>
              </div>
              {category && (
                <Link to={`/category/${category.slug}`} className="link-arrow">
                  View all in {category.shortName} <Icon name="arrow" size={16} />
                </Link>
              )}
            </div>
            <ul className="product-grid product-grid--4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const product = catalog.bySlug(slug);

  useDocumentMeta({
    title: product ? `${product.name} — ₹${product.price.toLocaleString('en-IN')}` : 'Product not found',
    description: product?.description,
    canonicalPath: product ? `/product/${product.slug}` : undefined,
  });

  if (!product) {
    return (
      <section className="section">
        <div className="container info-page">
          <span className="badge badge--muted">404 · Product</span>
          <h1 className="display">Product not found</h1>
          <p className="muted">This item may have been removed or its link has changed.</p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--accent">Browse all products</Link>
            <Link to="/" className="btn btn--ghost">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}
