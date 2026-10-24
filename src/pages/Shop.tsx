import { useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';
import { categories, getCategoryById } from '../data/categories';
import { attributeValuesFor, filterAndSortProducts, type SortOption } from '../lib/filters';
import { formatINR } from '../lib/format';
import { useDocumentMeta } from '../lib/seo';
import { catalog } from '../services/catalog';

const PAGE_SIZE = 12;

const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: 'All prices' },
  { label: 'Under ₹1,000', max: 1000 },
  { label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 – ₹7,500', min: 2500, max: 7500 },
  { label: 'Above ₹7,500', min: 7500 },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const q = params.get('q') ?? '';
  const categoryId = params.get('category') ?? '';
  const minPriceParam = params.get('min');
  const maxPriceParam = params.get('max');
  const inStockOnly = params.get('stock') === '1';
  const dealsOnly = params.get('deals') === '1';
  const tag = params.get('tag') ?? '';
  const sort = (params.get('sort') as SortOption) || 'relevance';
  const attrKey = params.get('attrKey') ?? '';
  const attrVal = params.get('attrVal') ?? '';

  const minPrice = minPriceParam && !Number.isNaN(Number(minPriceParam)) ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam && !Number.isNaN(Number(maxPriceParam)) ? Number(maxPriceParam) : undefined;

  const activeCategory = categoryId ? getCategoryById(categoryId) : undefined;

  useDocumentMeta({
    title: q ? `Search "${q}" — Shop` : activeCategory ? `${activeCategory.name} — Shop` : 'Shop All Products',
    description:
      'Browse electronics, fashion, jewellery, beauty, furniture, handmade crafts, gifts and kitchen essentials with INR pricing.',
    canonicalPath: '/shop',
  });

  const allProducts = useMemo(() => catalog.all(), []);

  const categoryScopedProducts = useMemo(
    () => (categoryId ? allProducts.filter((p) => p.categoryId === categoryId) : allProducts),
    [allProducts, categoryId],
  );

  const primaryFilterAttr = activeCategory?.filterAttributes?.[0];
  const primaryAttrOptions = useMemo(
    () => (primaryFilterAttr ? attributeValuesFor(categoryScopedProducts, primaryFilterAttr) : []),
    [categoryScopedProducts, primaryFilterAttr],
  );

  const filtered = useMemo(
    () =>
      filterAndSortProducts(allProducts, {
        q,
        categoryId: categoryId || undefined,
        minPrice,
        maxPrice,
        inStockOnly,
        dealsOnly,
        tag: tag || undefined,
        attributeFilters: attrKey && attrVal ? { [attrKey]: attrVal } : undefined,
        sort,
      }),
    [allProducts, q, categoryId, minPrice, maxPrice, inStockOnly, dealsOnly, tag, attrKey, attrVal, sort],
  );

  const updateParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    }
    setParams(next);
    setVisibleCount(PAGE_SIZE);
  };

  const clearAll = () => {
    setParams(new URLSearchParams());
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters = Boolean(
    q || categoryId || minPrice !== undefined || maxPrice !== undefined || inStockOnly || dealsOnly || tag || attrVal,
  );

  const handlePriceForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const minRaw = String(fd.get('min') ?? '').trim();
    const maxRaw = String(fd.get('max') ?? '').trim();
    updateParam({
      min: minRaw ? String(Math.max(0, Number(minRaw))) : null,
      max: maxRaw ? String(Math.max(0, Number(maxRaw))) : null,
    });
  };

  const shown = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - shown.length);

  return (
    <section className="section shop-page" aria-labelledby="shop-heading">
      <div className="container">
        <div className="shop-header">
          <div>
            <span className="eyebrow">Marketplace catalogue</span>
            <h1 id="shop-heading" className="display">
              {q ? `Results for “${q}”` : dealsOnly ? 'Demo deals & promotional picks' : 'All products'}
            </h1>
          </div>
          <p className="muted" aria-live="polite">
            Showing <strong>{shown.length}</strong> of <strong>{filtered.length}</strong> product{filtered.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Category pill bar */}
        <nav className="shop-catbar" aria-label="Filter by category">
          <button
            type="button"
            className={`pill ${!categoryId ? 'is-active' : ''}`}
            onClick={() => updateParam({ category: null, attrKey: null, attrVal: null })}
          >
            All departments
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pill ${categoryId === c.id ? 'is-active' : ''}`}
              onClick={() => updateParam({ category: c.id, attrKey: null, attrVal: null })}
            >
              {c.shortName}
            </button>
          ))}
        </nav>

        <div className="shop-layout">
          {/* Sidebar filters */}
          <aside className="shop-sidebar" aria-label="Product filters">
            <div className="filter-block">
              <label htmlFor="shop-inline-search" className="filter-title">Search within results</label>
              <div className="filter-search">
                <input
                  id="shop-inline-search"
                  type="search"
                  className="input"
                  placeholder="Keyword, brand or tag…"
                  value={q}
                  onChange={(e) => updateParam({ q: e.target.value || null })}
                />
              </div>
            </div>

            <div className="filter-block">
              <p className="filter-title">Price range (INR)</p>
              <ul className="filter-list">
                {PRICE_PRESETS.map((preset) => {
                  const active = minPrice === preset.min && maxPrice === preset.max;
                  return (
                    <li key={preset.label}>
                      <button
                        type="button"
                        className={`filter-choice ${active ? 'is-active' : ''}`}
                        onClick={() =>
                          updateParam({
                            min: preset.min !== undefined ? String(preset.min) : null,
                            max: preset.max !== undefined ? String(preset.max) : null,
                          })
                        }
                      >
                        {preset.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <form
                key={`${minPrice ?? ''}-${maxPrice ?? ''}`}
                className="price-range-form"
                onSubmit={handlePriceForm}
                aria-label="Custom price range"
              >
                <div className="price-range-inputs">
                  <div>
                    <label htmlFor="min-price" className="visually-hidden">Minimum price in INR</label>
                    <input
                      id="min-price"
                      name="min"
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Min ₹"
                      defaultValue={minPrice ?? ''}
                      className="input input--sm"
                    />
                  </div>
                  <span aria-hidden="true">–</span>
                  <div>
                    <label htmlFor="max-price" className="visually-hidden">Maximum price in INR</label>
                    <input
                      id="max-price"
                      name="max"
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Max ₹"
                      defaultValue={maxPrice ?? ''}
                      className="input input--sm"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--ghost btn--sm">Apply price</button>
              </form>
            </div>

            <div className="filter-block">
              <p className="filter-title">Availability & offers</p>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam({ stock: e.target.checked ? '1' : null })}
                />
                <span>In stock only</span>
              </label>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={(e) => updateParam({ deals: e.target.checked ? '1' : null })}
                />
                <span>Demo deals (discounted)</span>
              </label>
            </div>

            {primaryFilterAttr && primaryAttrOptions.length > 0 && (
              <div className="filter-block">
                <p className="filter-title">{primaryFilterAttr}</p>
                <ul className="filter-list">
                  <li>
                    <button
                      type="button"
                      className={`filter-choice ${!attrVal ? 'is-active' : ''}`}
                      onClick={() => updateParam({ attrKey: null, attrVal: null })}
                    >
                      All
                    </button>
                  </li>
                  {primaryAttrOptions.map((val) => (
                    <li key={val}>
                      <button
                        type="button"
                        className={`filter-choice ${attrKey === primaryFilterAttr && attrVal === val ? 'is-active' : ''}`}
                        onClick={() => updateParam({ attrKey: primaryFilterAttr, attrVal: val })}
                      >
                        {val}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasActiveFilters && (
              <button type="button" className="btn btn--ghost btn--sm btn--block" onClick={clearAll}>
                Clear all filters
              </button>
            )}
          </aside>

          {/* Main grid */}
          <div className="shop-main">
            <div className="shop-toolbar">
              <div className="active-chips">
                {activeCategory && (
                  <button
                    type="button"
                    className="chip"
                    onClick={() => updateParam({ category: null, attrKey: null, attrVal: null })}
                  >
                    {activeCategory.shortName} <Icon name="close" size={14} />
                  </button>
                )}
                {q && (
                  <button type="button" className="chip" onClick={() => updateParam({ q: null })}>
                    “{q}” <Icon name="close" size={14} />
                  </button>
                )}
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <button type="button" className="chip" onClick={() => updateParam({ min: null, max: null })}>
                    {minPrice !== undefined ? formatINR(minPrice) : '₹0'} –{' '}
                    {maxPrice !== undefined ? formatINR(maxPrice) : 'Any'} <Icon name="close" size={14} />
                  </button>
                )}
                {inStockOnly && (
                  <button type="button" className="chip" onClick={() => updateParam({ stock: null })}>
                    In stock <Icon name="close" size={14} />
                  </button>
                )}
                {dealsOnly && (
                  <button type="button" className="chip" onClick={() => updateParam({ deals: null })}>
                    Deals <Icon name="close" size={14} />
                  </button>
                )}
                {tag && (
                  <button type="button" className="chip" onClick={() => updateParam({ tag: null })}>
                    #{tag} <Icon name="close" size={14} />
                  </button>
                )}
                {attrVal && (
                  <button type="button" className="chip" onClick={() => updateParam({ attrKey: null, attrVal: null })}>
                    {attrKey}: {attrVal} <Icon name="close" size={14} />
                  </button>
                )}
                {hasActiveFilters && (
                  <button type="button" className="chip chip--clear" onClick={clearAll}>
                    Clear all
                  </button>
                )}
              </div>

              <div className="sort-control">
                <label htmlFor="sort-select">Sort by</label>
                <select
                  id="sort-select"
                  className="input input--sm"
                  value={sort}
                  onChange={(e) => updateParam({ sort: e.target.value === 'relevance' ? null : e.target.value })}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest arrivals</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
            </div>

            {shown.length === 0 ? (
              <div className="empty-state" role="status">
                <h2 className="display">No products match those filters</h2>
                <p className="muted">Try removing a filter or searching with a broader term.</p>
                <button type="button" className="btn btn--accent" onClick={clearAll}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <ul className="product-grid">
                  {shown.map((p, idx) => (
                    <li key={p.id}>
                      <ProductCard product={p} eager={idx < 4} />
                    </li>
                  ))}
                </ul>

                {remaining > 0 && (
                  <div className="load-more">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      Load more products ({remaining} remaining)
                    </button>
                  </div>
                )}
              </>
            )}

            {activeCategory && (
              <div className="shop-cat-banner">
                <div>
                  <span className="eyebrow">Dedicated department</span>
                  <h3>Looking specifically for {activeCategory.name}?</h3>
                </div>
                <Link to={`/category/${activeCategory.slug}`} className="btn btn--ghost btn--sm">
                  Visit {activeCategory.shortName} page <Icon name="arrow" size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
