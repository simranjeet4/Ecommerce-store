import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Icon } from '../components/ui/Icon';
import { SmartImage } from '../components/ui/SmartImage';
import { getCategoryById } from '../data/categories';
import { formatINR, variantLabel } from '../lib/format';
import { useDocumentMeta } from '../lib/seo';
import { catalog } from '../services/catalog';
import { useCart } from '../state/CartContext';

export default function CartPage() {
  const { lines, count, subtotal, setQty, remove, clear } = useCart();

  useDocumentMeta({
    title: `Shopping Cart (${count})`,
    description: 'Review the items in your Bazaarly shopping cart.',
    canonicalPath: '/cart',
  });

  if (lines.length === 0) {
    const suggestions = catalog.featured(4);
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state cart-empty">
            <Icon name="bag" size={32} />
            <h1 className="display">Your shopping bag is empty</h1>
            <p className="muted">
              Explore electronics, fashion, jewellery, home décor and kitchen essentials across our departments.
            </p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn btn--accent">
                Continue shopping <Icon name="arrow" size={18} />
              </Link>
              <Link to="/shop?deals=1" className="btn btn--ghost">View demo deals</Link>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="cart-suggestions">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Popular picks</span>
                  <h2>You might like these</h2>
                </div>
                <Link to="/shop" className="link-arrow">Browse all <Icon name="arrow" size={16} /></Link>
              </div>
              <ul className="product-grid product-grid--4">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-page" aria-labelledby="cart-heading">
      <div className="container">
        <div className="shop-header">
          <div>
            <span className="eyebrow">Your bag</span>
            <h1 id="cart-heading" className="display">
              Shopping cart ({count} item{count === 1 ? '' : 's'})
            </h1>
          </div>
          <div className="cart-header-actions">
            <Link to="/shop" className="link-arrow">Continue shopping</Link>
            <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
              Clear cart
            </button>
          </div>
        </div>

        <div className="cart-layout">
          <ul className="cart-lines" aria-label="Cart items">
            {lines.map((line) => {
              const cat = getCategoryById(line.product.categoryId);
              const vLabel = variantLabel(line.variant);
              return (
                <li key={line.key} className="cart-line">
                  <Link to={`/product/${line.product.slug}`} className="cart-line__media">
                    <SmartImage
                      src={line.product.images[0].src}
                      alt={line.product.images[0].alt}
                      aspect="1 / 1"
                      surface={cat?.presentation.surface}
                    />
                  </Link>

                  <div className="cart-line__body">
                    <div className="cart-line__top">
                      <div>
                        {line.product.brand && <p className="pcard__meta">{line.product.brand}</p>}
                        <h2 className="cart-line__title">
                          <Link to={`/product/${line.product.slug}`}>{line.product.name}</Link>
                        </h2>
                        {vLabel && <p className="cart-line__variant">{vLabel}</p>}
                        <p className="cart-line__unit muted">{formatINR(line.unitPrice)} each</p>
                      </div>
                      <p className="cart-line__total">{formatINR(line.lineTotal)}</p>
                    </div>

                    <div className="cart-line__controls">
                      <div className="qty-control qty-control--sm" aria-label={`Quantity for ${line.product.name}`}>
                        <button
                          type="button"
                          className="qty-btn"
                          aria-label={`Decrease quantity of ${line.product.name}`}
                          onClick={() => setQty(line.key, line.quantity - 1)}
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          aria-label={`Quantity of ${line.product.name}`}
                          min={1}
                          max={line.maxQty}
                          value={line.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (Number.isFinite(val) && val >= 1) {
                              setQty(line.key, Math.min(line.maxQty, Math.floor(val)));
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="qty-btn"
                          aria-label={`Increase quantity of ${line.product.name}`}
                          disabled={line.quantity >= line.maxQty}
                          onClick={() => setQty(line.key, line.quantity + 1)}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => remove(line.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="cart-summary" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="display">Order summary</h2>
            <dl className="summary-rows">
              <div className="summary-row">
                <dt>Items subtotal ({count})</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="summary-row">
                <dt>Shipping estimate</dt>
                <dd className="muted">Calculated at checkout (placeholder)</dd>
              </div>
              <div className="summary-row summary-row--total">
                <dt>Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
            </dl>
            <p className="summary-note muted">
              Prices are in INR. In a live deployment, item prices and seller stock are re-validated on the server
              before payment.
            </p>
            <Link to="/checkout" className="btn btn--accent btn--block">
              Proceed to checkout <Icon name="arrow" size={18} />
            </Link>
            <Link to="/shop" className="btn btn--ghost btn--block">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
