import { Link } from 'react-router-dom';
import { getCategoryById } from '../../data/categories';
import { discountPercent, formatINR, hasPriceRange, isInStock, minPrice } from '../../lib/format';
import type { Product } from '../../types/catalog';
import { SmartImage } from '../ui/SmartImage';

export function Price({ price, compareAt, from }: { price: number; compareAt?: number; from?: boolean }) {
  const off = discountPercent(price, compareAt);
  return (
    <p className="price">
      {from && <span className="price__from">From </span>}
      <span className="price__now">{formatINR(price)}</span>
      {off > 0 && (
        <>
          <s className="price__was"><span className="visually-hidden">Was </span>{formatINR(compareAt!)}</s>
          <span className="price__off">{off}% off</span>
        </>
      )}
    </p>
  );
}

/** Product card — framing (ratio, surface) comes from the product's category presentation. */
export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {
  const cat = getCategoryById(product.categoryId);
  const pres = cat?.presentation;
  const inStock = isInStock(product);
  const off = discountPercent(product.price, product.compareAtPrice);
  const optionSummary = product.options?.map((o) => `${o.values.length} ${o.name.toLowerCase()}s`).join(' · ');

  return (
    <article className={`pcard pcard--${product.categoryId}`}>
      <Link to={`/product/${product.slug}`} className="pcard__link">
        <div className="pcard__media">
          <SmartImage src={product.images[0].src} alt={product.images[0].alt} aspect={pres?.aspect ?? '1 / 1'}
            surface={pres?.surface} fit={pres?.fit} eager={eager} />
          <div className="pcard__badges">
            {!inStock && <span className="badge badge--muted">Out of stock</span>}
            {inStock && off > 0 && <span className="badge badge--deal">−{off}%</span>}
            {inStock && product.isNewArrival && <span className="badge badge--new">New</span>}
          </div>
        </div>
        <div className="pcard__body">
          <p className="pcard__meta">{product.brand ?? cat?.shortName}</p>
          <h3 className="pcard__title">{product.name}</h3>
          <Price price={minPrice(product)} compareAt={product.compareAtPrice} from={hasPriceRange(product)} />
          {optionSummary && <p className="pcard__opts">{optionSummary}</p>}
        </div>
      </Link>
    </article>
  );
}
