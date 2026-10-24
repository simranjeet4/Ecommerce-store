import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { store } from '../../config/store';
import { Logo } from '../ui/Logo';

const help = [
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact us' },
  { to: '/shipping-policy', label: 'Shipping policy' },
  { to: '/returns-policy', label: 'Returns & refunds' },
];
const company = [
  { to: '/about', label: 'About us' },
  { to: '/privacy-policy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms & conditions' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>{store.tagline}</p>
          <address>
            <span>{store.legal.companyName}</span>
            <span>{store.contact.address}</span>
            <span>{store.contact.email}</span>
            <span>{store.contact.phone} · {store.contact.hours}</span>
          </address>
        </div>
        <nav aria-label="Shop categories">
          <h2>Shop</h2>
          <ul>{categories.map((c) => <li key={c.id}><Link to={`/category/${c.slug}`}>{c.shortName}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Customer support">
          <h2>Support</h2>
          <ul>{help.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Company">
          <h2>Company</h2>
          <ul>{company.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
        </nav>
      </div>
      <div className="container footer__base">
        <span>© {new Date().getFullYear()} {store.name}. Demo storefront — all products and prices are sample data.</span>
        <span>Prices in INR · {store.legal.gstin}</span>
      </div>
    </footer>
  );
}
