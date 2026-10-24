import { Link } from 'react-router-dom';
import { store } from '../../config/store';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label={`${store.name} home`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--accent)" />
        <path d="M8 12h16l-1.4 11.2a2 2 0 0 1-2 1.8h-9.2a2 2 0 0 1-2-1.8L8 12Z" fill="none" stroke="#fff" strokeWidth="2" />
        <path d="M12.5 12V10a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{store.name.toLowerCase()}</span>
    </Link>
  );
}
