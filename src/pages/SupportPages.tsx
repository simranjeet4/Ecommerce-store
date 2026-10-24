import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { store } from '../config/store';
import { categories } from '../data/categories';
import { useDocumentMeta } from '../lib/seo';

/* ---------- About Us ---------- */
export function AboutPage() {
  useDocumentMeta({
    title: `About ${store.name}`,
    description: `Learn about ${store.name}, a multi-category marketplace designed for shoppers across India.`,
    canonicalPath: '/about',
  });

  return (
    <section className="section">
      <div className="container doc-page">
        <header className="doc-header">
          <span className="eyebrow">About the marketplace</span>
          <h1 className="display">Built for everyday and exceptional shopping across India.</h1>
          <p className="muted">
            {store.name} is a general multi-category e-commerce marketplace. All products, prices and business details
            currently displayed are editable demo placeholders for Phase 1 storefront development.
          </p>
        </header>

        <div className="doc-section">
          <h2>What {store.name} is</h2>
          <p>
            {store.name} is designed to bring together products from established brands, local businesses, independent
            labels and artisans under one roof — spanning electronics, clothing, jewellery, beauty, furniture, kitchen
            essentials, gifts and handmade crafts.
          </p>
          <p>
            Rather than forcing every product into an identical template, each department adapts its visual framing and
            product specifications to what shoppers actually need to know before buying.
          </p>
        </div>

        <div className="doc-section">
          <h2>Departments available in this storefront</h2>
          <ul className="doc-list">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="text-link">{c.name}</Link> — {c.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="doc-section">
          <h2>Current phase & roadmap</h2>
          <p>
            This release focuses on the customer-facing shopping experience: discovery, search, filtering, category
            browsing, variant selection, persistent shopping bag and checkout structure. Future phases will connect a
            live database, seller onboarding, multi-vendor inventory, courier serviceability and payment processing.
          </p>
        </div>

        <div className="doc-section">
          <h2>Business information (editable placeholder)</h2>
          <p>
            <strong>Legal entity:</strong> {store.legal.companyName}
            <br />
            <strong>GSTIN:</strong> {store.legal.gstin}
            <br />
            <strong>Registered address:</strong> {store.contact.address}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact Us ---------- */
export function ContactPage() {
  useDocumentMeta({
    title: 'Contact Us',
    description: `Get in touch with ${store.name} customer support.`,
    canonicalPath: '/contact',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('order');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (!message.trim() || message.trim().length < 10) {
      next.message = 'Please enter a message of at least 10 characters.';
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="doc-header" style={{ marginBottom: 'var(--space-6)' }}>
          <span className="eyebrow">Customer support</span>
          <h1 className="display">Contact us</h1>
          <p className="muted">
            Contact details below are editable placeholders defined in <code>src/config/store.ts</code>. Replace them
            with verified support channels before going live.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-cards">
            <div className="contact-card">
              <span className="badge badge--demo">Editable placeholder</span>
              <h2>Email support</h2>
              <p className="muted">{store.contact.email}</p>
            </div>
            <div className="contact-card">
              <span className="badge badge--demo">Editable placeholder</span>
              <h2>Phone & hours</h2>
              <p className="muted">{store.contact.phone}</p>
              <p className="muted">{store.contact.hours}</p>
            </div>
            <div className="contact-card">
              <span className="badge badge--demo">Editable placeholder</span>
              <h2>Registered office</h2>
              <p className="muted">{store.legal.companyName}</p>
              <p className="muted">{store.contact.address}</p>
            </div>
          </div>

          <div className="checkout-card">
            <h2 className="checkout-legend">Send a message (demo form)</h2>
            {submitted ? (
              <div className="demo-result" role="status">
                <div className="demo-result__head">
                  <Icon name="check" size={20} />
                  <h3>Message validated (demo mode)</h3>
                </div>
                <p>
                  Thank you, <strong>{name}</strong>. Your enquiry was validated in the browser. A backend support desk
                  or email service is not connected in this phase, so no message was transmitted.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                >
                  Send another demo message
                </button>
              </div>
            ) : (
              <form className="form-grid" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="ct-name">Your name *</label>
                  <input
                    id="ct-name"
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'ct-err-name' : undefined}
                  />
                  {errors.name && <p id="ct-err-name" className="field-error" role="alert">{errors.name}</p>}
                </div>

                <div className="field">
                  <label htmlFor="ct-email">Email address *</label>
                  <input
                    id="ct-email"
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'ct-err-email' : undefined}
                  />
                  {errors.email && <p id="ct-err-email" className="field-error" role="alert">{errors.email}</p>}
                </div>

                <div className="field form-grid__full">
                  <label htmlFor="ct-topic">Topic</label>
                  <select
                    id="ct-topic"
                    className="input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="order">Product or order question</option>
                    <option value="shipping">Shipping & delivery</option>
                    <option value="returns">Returns & refunds</option>
                    <option value="other">General feedback</option>
                  </select>
                </div>

                <div className="field form-grid__full">
                  <label htmlFor="ct-msg">Message *</label>
                  <textarea
                    id="ct-msg"
                    className="input textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'ct-err-msg' : undefined}
                  />
                  {errors.message && <p id="ct-err-msg" className="field-error" role="alert">{errors.message}</p>}
                </div>

                <div className="form-grid__full">
                  <button type="submit" className="btn btn--accent">Validate message</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ Page ---------- */
export function FaqPage() {
  useDocumentMeta({
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about browsing, pricing, shipping and demo mode on Bazaarly.',
    canonicalPath: '/faq',
  });

  const faqs = [
    {
      q: 'Are the products and prices on this website real?',
      a: 'No. Every product, price, discount badge and inventory count in this build is sample data created to demonstrate the multi-category storefront.',
    },
    {
      q: 'What currency are prices displayed in?',
      a: 'All prices are displayed in Indian Rupees (INR, ₹) formatted for the Indian numbering system.',
    },
    {
      q: 'Can I place a real order or make a payment right now?',
      a: 'Not yet. The checkout page validates Indian shipping addresses and previews order summaries, but payment processing and order creation require a backend server and payment gateway integration in a future phase.',
    },
    {
      q: 'Does my shopping cart stay saved if I refresh the page?',
      a: 'Yes. Your selected product IDs, variant IDs and quantities are saved in your browser’s local storage. No personal or payment information is ever stored in local storage.',
    },
    {
      q: 'How will multi-seller orders work in the future?',
      a: 'The product data model already supports seller ownership (sellerId) and variant-specific inventory so that multiple sellers and split shipments can be introduced without rebuilding the storefront.',
    },
  ];

  return (
    <section className="section">
      <div className="container doc-page">
        <header className="doc-header">
          <span className="eyebrow">Help centre</span>
          <h1 className="display">Frequently asked questions</h1>
          <p className="muted">
            Common questions about this marketplace storefront and what is included in the current phase.
          </p>
        </header>

        <div className="faq-list">
          {faqs.map((item, idx) => (
            <details key={item.q} className="faq-item" open={idx === 0}>
              <summary>
                <span>{item.q}</span>
                <Icon name="chevron" size={18} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Shared Policy Template ---------- */
interface PolicySection {
  heading: string;
  body: string[];
}

export function PolicyPage({
  title,
  canonicalPath,
  summary,
  sections,
}: {
  title: string;
  canonicalPath: string;
  summary: string;
  sections: PolicySection[];
}) {
  useDocumentMeta({ title, description: summary, canonicalPath });

  return (
    <section className="section">
      <div className="container doc-page">
        <header className="doc-header">
          <div>
            <span className="badge badge--demo">Editable policy template — replace before launch</span>
          </div>
          <h1 className="display">{title}</h1>
          <p className="muted">{summary}</p>
        </header>

        {sections.map((sec) => (
          <div key={sec.heading} className="doc-section">
            <h2>{sec.heading}</h2>
            {sec.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ))}

        <div className="doc-section">
          <h2>Contact for policy questions</h2>
          <p>
            Entity: {store.legal.companyName} · Email: {store.contact.email} · Address: {store.contact.address}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      canonicalPath="/shipping-policy"
      summary="Placeholder shipping policy structure for domestic orders within India. Final courier partners, dispatch SLAs and shipping charges must be reviewed and approved before commercial launch."
      sections={[
        {
          heading: '1. Serviceable locations (placeholder)',
          body: [
            'This marketplace is designed for deliveries across India using 6-digit PIN code serviceability checks. International shipping and export operations are not enabled in this phase.',
          ],
        },
        {
          heading: '2. Dispatch & delivery estimates (placeholder)',
          body: [
            '[Specify standard dispatch window, e.g., X–Y business days, and how bulky furniture or made-to-order craft items differ from ready-to-ship electronics or apparel.]',
          ],
        },
        {
          heading: '3. Shipping charges (placeholder)',
          body: [
            '[Specify flat-rate, weight-based or order-value threshold shipping rules in INR once logistics providers are integrated.]',
          ],
        },
      ]}
    />
  );
}

export function ReturnsPolicyPage() {
  return (
    <PolicyPage
      title="Returns & Refunds Policy"
      canonicalPath="/returns-policy"
      summary="Placeholder returns, replacements and refund policy template. Replace bracketed sections with your legally reviewed operational terms before accepting customer orders."
      sections={[
        {
          heading: '1. Return eligibility by category (placeholder)',
          body: [
            '[Define return or replacement windows per category — for example, size exchanges on apparel, defective-only replacements on electronics, and hygiene exclusions on opened personal care items.]',
          ],
        },
        {
          heading: '2. Condition of returned items (placeholder)',
          body: [
            '[Specify requirements for original packaging, tags, accessories and serial numbers.]',
          ],
        },
        {
          heading: '3. Refund processing (placeholder)',
          body: [
            '[Specify how refunds in INR are initiated once returned items pass quality inspection and the expected bank/UPI settlement timelines.]',
          ],
        },
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      canonicalPath="/privacy-policy"
      summary="Placeholder privacy notice template. Replace with a legally reviewed privacy policy compliant with applicable Indian data protection laws (including the Digital Personal Data Protection Act)."
      sections={[
        {
          heading: '1. Information handled in this demo storefront',
          body: [
            'In the current frontend-only demo phase, the website stores only shopping cart product IDs, variant IDs and quantities in your browser’s localStorage so your cart persists across page refreshes.',
            'No personal contact details, shipping addresses or payment credentials are stored in localStorage or transmitted to any server.',
          ],
        },
        {
          heading: '2. Information collection when live (placeholder)',
          body: [
            '[Document what customer data (name, address, phone, email, order history) will be collected, the lawful purpose of processing, retention periods and third-party processors such as couriers and payment gateways.]',
          ],
        },
        {
          heading: '3. Grievance officer / privacy contact (placeholder)',
          body: [
            '[Insert designated Grievance Officer / Data Protection contact name, email and address as required by Indian regulations.]',
          ],
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      canonicalPath="/terms"
      summary="Placeholder terms of use and conditions of sale template. Must be reviewed by legal counsel before live marketplace operations."
      sections={[
        {
          heading: '1. Demo status of current storefront',
          body: [
            'All listings, prices, specifications and promotional banners currently displayed on this site are non-binding sample data for demonstration purposes only.',
          ],
        },
        {
          heading: '2. Marketplace terms (placeholder)',
          body: [
            '[Define customer account responsibilities, pricing and tax disclosures in INR, order acceptance rules, cancellation terms, limitation of liability and governing law/jurisdiction in India.]',
          ],
        },
      ]}
    />
  );
}

export function NotFoundPage() {
  useDocumentMeta({ title: '404 — Page Not Found' });
  return (
    <section className="section">
      <div className="container info-page">
        <span className="badge badge--muted">Error 404</span>
        <h1 className="display">We couldn’t find that page</h1>
        <p className="muted">
          The link you followed may be broken or the page may have moved. Try searching above or explore our
          departments.
        </p>
        <div className="hero__ctas">
          <Link to="/shop" className="btn btn--accent">Shop all products</Link>
          <Link to="/" className="btn btn--ghost">Back to homepage</Link>
        </div>
      </div>
    </section>
  );
}
