import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';
import { SmartImage } from '../components/ui/SmartImage';
import { categories, getCategoryBySlug } from '../data/categories';
import { attributeValuesFor, filterAndSortProducts, type SortOption } from '../lib/filters';
import { useDocumentMeta } from '../lib/seo';
import { catalog } from '../services/catalog';

const PRICE_RANGES: { id: string; label: string; min?: number; max?: number }[] = [
  { id: 'all', label: 'Any price' },
  { id: 'u1000', label: 'Under ₹1,000', max: 1000 },
  { id: '1k-3k', label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { id: '3k-10k', label: '₹3,000 – ₹10,000', min: 3000, max: 10000 },
  { id: '10k+', label: 'Above ₹10,000', min: 10000 },
];

export default function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const category = getCategoryBySlug(slug);

  const sub = params.get('sub') ?? '';
  const priceBand = params.get('price') ?? 'all';
  const inStockOnly = params.get('stock') === '1';
  const sort = (params.get('sort') as SortOption) || 'relevance';
  const attrKey = params.get('attrKey') ?? '';
  const attrVal = params.get('attrVal') ?? '';
  const [searchTerm, setSearchTerm] = useState('');

  useDocumentMeta({
    title: category ? `${category.name} — Shop in INR` : 'Category not found',
    description: category?.description ?? 'Explore categories across Bazaarly.',
    canonicalPath: category ? `/category/${category.slug}` : undefined,
  });

  const categoryProducts = useMemo(
    () => (category ? catalog.byCategory(category.id) : []),
    [category],
  );

  const subcategories = useMemo(() => {
    const set = new Set<string>();
    for (const p of categoryProducts) {
      if (p.subcategory) set.add(p.subcategory);
    }
    return [...set];
  }, [categoryProducts]);

  const filterAttrName = category?.filterAttributes?.[0];
  const filterAttrValues = useMemo(
    () => (filterAttrName ? attributeValuesFor(categoryProducts, filterAttrName) : []),
    [categoryProducts, filterAttrName],
  );

  const selectedPrice = PRICE_RANGES.find((r) => r.id === priceBand) ?? PRICE_RANGES[0];

  const filtered = useMemo(() => {
    const base = sub ? categoryProducts.filter((p) => p.subcategory === sub) : categoryProducts;
    return filterAndSortProducts(base, {
      q: searchTerm,
      minPrice: selectedPrice.min,
      maxPrice: selectedPrice.max,
      inStockOnly,
      attributeFilters: attrKey && attrVal ? { [attrKey]: attrVal } : undefined,
      sort,
    });
  }, [categoryProducts, sub, searchTerm, selectedPrice, inStockOnly, attrKey, attrVal, sort]);

  if (!category) {
    return (
      <section className="section">
        <div className="container info-page">
          <span className="badge badge--muted">404 · Category</span>
          <h1 className="display">We couldn’t find that department</h1>
          <p className="muted">The category link may have changed. Explore all departments below.</p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--accent">Browse all products</Link>
            <Link to="/" className="btn btn--ghost">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  const updateParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(updates)) {
      if (!v) next.delete(k);
      else next.set(k, v);
    }
    setParams(next);
  };

  const clearFilters = () => {
    setParams(new URLSearchParams());
    setSearchTerm('');
  };

  const hasFilters = Boolean(sub || priceBand !== 'all' || inStockOnly || attrVal || searchTerm.trim());
  const otherCategories = categories.filter((c) => c.id !== category.id);

  return (
    <>
      <section className="cat-hero" style={{ background: category.presentation.surface }}>
        <div className="container cat-hero__grid">
          <div className="cat-hero__copy">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/shop">Shop</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{category.shortName}</span>
            </nav>
            <span className="eyebrow">{category.tagline}</span>
            <h1 className="display">{category.name}</h1>
            <p>{category.description}</p>
            {subcategories.length > 0 && (
              <div className="cat-subpills" role="group" aria-label="Subcategories">
                <button
                  type="button"
                  className={`pill ${!sub ? 'is-active' : ''}`}
                  onClick={() => updateParam({ sub: null })}
                >
                  All ({categoryProducts.length})
                </button>
                {subcategories.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pill ${sub === s ? 'is-active' : ''}`}
                    onClick={() => updateParam({ sub: sub === s ? null : s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="cat-hero__media">
            <SmartImage
              src={category.image.src}
              alt={category.image.alt}
              aspect={category.presentation.aspect}
              surface={category.presentation.surface}
              eager
              className="cat-hero__img"
            />
          </div>
        </div>
      </section>

      <section className="section" aria-label={`${category.name} products`}>
        <div className="container">
          <div className="cat-filter-bar">
            <div className="cat-filter-controls">
              <div className="cat-filter-item">
                <label htmlFor="cat-search" className="visually-hidden">Search in {category.shortName}</label>
                <input
                  id="cat-search"
                  type="search"
                  className="input input--sm"
                  placeholder={`Search in ${category.shortName.toLowerCase()}…`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="cat-filter-item">
                <label htmlFor="cat-price" className="visually-hidden">Price range</label>
                <select
                  id="cat-price"
                  className="input input--sm"
                  value={priceBand}
                  onChange={(e) => updateParam({ price: e.target.value === 'all' ? null : e.target.value })}
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              {filterAttrName && filterAttrValues.length > 0 && (
                <div className="cat-filter-item">
                  <label htmlFor="cat-attr" className="visually-hidden">{filterAttrName}</label>
                  <select
                    id="cat-attr"
                    className="input input--sm"
                    value={attrVal}
                    onChange={(e) =>
                      updateParam({
                        attrKey: e.target.value ? filterAttrName : null,
                        attrVal: e.target.value || null,
                      })
                    }
                  >
                    <option value="">All {filterAttrName.toLowerCase()}</option>
                    {filterAttrValues.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              )}

              <label className="check-row check-row--inline">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam({ stock: e.target.checked ? '1' : null })}
                />
                <span>In stock only</span>
              </label>

              {hasFilters && (
                <button type="button" className="chip chip--clear" onClick={clearFilters}>
                  Reset filters
                </button>
              )}
            </div>

            <div className="sort-control">
              <span className="muted">{filtered.length} item{filtered.length === 1 ? '' : 's'}</span>
              <label htmlFor="cat-sort" className="visually-hidden">Sort products</label>
              <select
                id="cat-sort"
                className="input input--sm"
                value={sort}
                onChange={(e) => updateParam({ sort: e.target.value === 'relevance' ? null : e.target.value })}
              >
                <option value="relevance">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state" role="status">
              <h2 className="display">No matching items in {category.shortName}</h2>
              <p className="muted">Try resetting your filters or explore our full catalogue.</p>
              <button type="button" className="btn btn--accent" onClick={clearFilters}>
                Reset category filters
              </button>
            </div>
          ) : (
            <ul className="product-grid product-grid--4">
              {filtered.map((p, idx) => (
                <li key={p.id}>
                  <ProductCard product={p} eager={idx < 4} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="other-depts">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Keep exploring</span>
              <h2 id="other-depts">Other departments</h2>
            </div>
            <Link to="/shop" className="link-arrow">All products <Icon name="arrow" size={16} /></Link>
          </div>
          <ul className="dept-strip">
            {otherCategories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="dept-card">
                  <span>{c.shortName}</span>
                  <small className="muted">{c.tagline}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
