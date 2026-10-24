import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/seo';

interface Props { title: string; body: string; }

/** Honest placeholder for routes that are scheduled for a later stage or need a backend. */
export default function InfoPage({ title, body }: Props) {
  useDocumentMeta({ title });
  return (
    <section className="section">
      <div className="container info-page">
        <span className="badge badge--demo">Not available yet</span>
        <h1 className="display">{title}</h1>
        <p className="muted">{body}</p>
        <div className="hero__ctas">
          <Link to="/" className="btn btn--accent">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
