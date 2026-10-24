import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '../../data/categories';
import { store } from '../../config/store';
import { useCart } from '../../state/CartContext';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';

function SearchForm({ id, initialQuery, onDone }: { id: string; initialQuery: string; onDone?: () => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
    onDone?.();
  };
  return (
    <form role="search" className="search" onSubmit={submit}>
      <label htmlFor={id} className="visually-hidden">Search products</label>
      <Icon name="search" size={18} className="search__icon" />
      <input
        id={id}
        type="search"
        className="search__input"
        placeholder="Search headphones, kurtas, lamps…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="search__btn">Search</button>
    </form>
  );
}

export function Header() {
  const { count } = useCart();
  const location = useLocation();
  const [params] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const routeKey = `${location.pathname}${location.search}`;
  const [openRouteKey, setOpenRouteKey] = useState<string | null>(null);
  const open = openRouteKey === routeKey;

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  // Lock scroll, ESC to close, focus management
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.querySelector<HTMLElement>('input, a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenRouteKey(null);
    };
    window.addEventListener('keydown', onKey);
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      {store.announcement.enabled && (
        <div className="announce">
          <div className="container announce__inner">
            <span>{store.announcement.message}</span>
            {store.announcement.link && <Link to={store.announcement.link.href}>{store.announcement.link.label}</Link>}
          </div>
        </div>
      )}
      <header className="header">
        <div className="container header__bar">
          <button
            ref={toggleRef}
            className="icon-btn header__menu"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenRouteKey(routeKey)}
          >
            <Icon name="menu" />
          </button>
          <Logo />
          <div className="header__search">
            <SearchForm key={`d-${urlQuery}`} id="search-desktop" initialQuery={urlQuery} />
          </div>
          <nav className="header__actions" aria-label="Account and cart">
            <Link to="/account" className="icon-btn" aria-label="Account"><Icon name="user" /></Link>
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}>
              <Icon name="bag" />
              {count > 0 && <span className="cart-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}
            </Link>
          </nav>
        </div>
        <nav className="catnav" aria-label="Categories">
          <div className="container">
            <ul className="catnav__list">
              <li><NavLink to="/shop" end className="catnav__link">All products</NavLink></li>
              {sorted.map((c) => (
                <li key={c.id}><NavLink to={`/category/${c.slug}`} className="catnav__link">{c.shortName}</NavLink></li>
              ))}
              <li className="catnav__deal"><Link to="/shop?deals=1" className="catnav__link">Deals</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer__scrim" onClick={() => setOpenRouteKey(null)} />
        <div
          ref={drawerRef}
          id="mobile-menu"
          className="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          inert={!open}
        >
          <div className="drawer__head">
            <Logo />
            <button className="icon-btn" aria-label="Close menu" onClick={() => setOpenRouteKey(null)}>
              <Icon name="close" />
            </button>
          </div>
          <SearchForm key={`m-${urlQuery}`} id="search-mobile" initialQuery={urlQuery} onDone={() => setOpenRouteKey(null)} />
          <p className="drawer__label">Shop</p>
          <ul className="drawer__list" onClick={() => setOpenRouteKey(null)}>
            <li><Link to="/shop">All products <Icon name="chevron" size={16} /></Link></li>
            {sorted.map((c) => (
              <li key={c.id}><Link to={`/category/${c.slug}`}>{c.name} <Icon name="chevron" size={16} /></Link></li>
            ))}
            <li><Link to="/shop?deals=1">Deals <Icon name="chevron" size={16} /></Link></li>
          </ul>
          <p className="drawer__label">Help</p>
          <ul className="drawer__list drawer__list--small" onClick={() => setOpenRouteKey(null)}>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
}
