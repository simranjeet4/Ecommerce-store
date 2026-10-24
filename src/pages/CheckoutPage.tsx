import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { SmartImage } from '../components/ui/SmartImage';
import { formatINR, variantLabel } from '../lib/format';
import { useDocumentMeta } from '../lib/seo';
import { useCart } from '../state/CartContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

interface CheckoutFormState {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
}

type FormErrors = Partial<Record<keyof CheckoutFormState, string>>;

export default function CheckoutPage() {
  const { lines, count, subtotal } = useCart();

  useDocumentMeta({
    title: 'Checkout (Demo Foundation)',
    description: 'Demo checkout interface for Indian shipping addresses and order review.',
    canonicalPath: '/checkout',
  });

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  if (lines.length === 0) {
    return (
      <section className="section">
        <div className="container info-page">
          <span className="badge badge--demo">Checkout</span>
          <h1 className="display">Your cart is empty</h1>
          <p className="muted">Add at least one item to your cart before proceeding to checkout.</p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--accent">Browse products</Link>
            <Link to="/cart" className="btn btn--ghost">Back to cart</Link>
          </div>
        </div>
      </section>
    );
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Please enter the recipient’s full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address for order updates.';
    }
    if (!/^[6-9][0-9]{9}$/.test(form.phone.trim())) {
      next.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!form.addressLine1.trim()) {
      next.addressLine1 = 'Please enter flat, house or building details.';
    }
    if (!form.addressLine2.trim()) {
      next.addressLine2 = 'Please enter street, area or locality.';
    }
    if (!form.city.trim()) {
      next.city = 'Please enter your city or town.';
    }
    if (!form.state) {
      next.state = 'Please select a state or union territory.';
    }
    if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
      next.pincode = 'Please enter a valid 6-digit Indian PIN code.';
    }
    return next;
  };

  const updateField = <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setDemoSubmitted(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setDemoSubmitted(false);
      return;
    }
    setErrors({});
    setDemoSubmitted(true);
  };

  return (
    <section className="section checkout-page" aria-labelledby="checkout-heading">
      <div className="container">
        <div className="demo-callout" role="note">
          <Icon name="info" size={20} />
          <div>
            <strong>Demo checkout foundation — no payment or real order will be placed.</strong>
            <p>
              This storefront does not yet have a configured backend or payment gateway. Form fields are validated in
              your browser only and are never saved to local storage.
            </p>
          </div>
        </div>

        <div className="shop-header">
          <div>
            <span className="eyebrow">Step 1 of 1 · Order review</span>
            <h1 id="checkout-heading" className="display">Checkout</h1>
          </div>
          <Link to="/cart" className="link-arrow">Edit cart ({count})</Link>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
          <div className="checkout-main">
            {/* 1. Contact information */}
            <fieldset className="checkout-card">
              <legend className="checkout-legend">1. Customer contact</legend>
              <div className="form-grid">
                <div className="field form-grid__full">
                  <label htmlFor="co-name">Full name *</label>
                  <input
                    id="co-name"
                    type="text"
                    className="input"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'err-name' : undefined}
                  />
                  {errors.fullName && <p id="err-name" className="field-error" role="alert">{errors.fullName}</p>}
                </div>

                <div className="field">
                  <label htmlFor="co-email">Email address *</label>
                  <input
                    id="co-email"
                    type="email"
                    className="input"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {errors.email && <p id="err-email" className="field-error" role="alert">{errors.email}</p>}
                </div>

                <div className="field">
                  <label htmlFor="co-phone">Mobile number (+91) *</label>
                  <input
                    id="co-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="input"
                    autoComplete="tel-national"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'err-phone' : undefined}
                  />
                  {errors.phone && <p id="err-phone" className="field-error" role="alert">{errors.phone}</p>}
                </div>
              </div>
            </fieldset>

            {/* 2. Indian shipping address */}
            <fieldset className="checkout-card">
              <legend className="checkout-legend">2. Shipping address (India)</legend>
              <div className="form-grid">
                <div className="field form-grid__full">
                  <label htmlFor="co-line1">Flat, house no., building, company, apartment *</label>
                  <input
                    id="co-line1"
                    type="text"
                    className="input"
                    autoComplete="address-line1"
                    value={form.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    aria-invalid={!!errors.addressLine1}
                    aria-describedby={errors.addressLine1 ? 'err-line1' : undefined}
                  />
                  {errors.addressLine1 && <p id="err-line1" className="field-error" role="alert">{errors.addressLine1}</p>}
                </div>

                <div className="field form-grid__full">
                  <label htmlFor="co-line2">Area, street, sector, village *</label>
                  <input
                    id="co-line2"
                    type="text"
                    className="input"
                    autoComplete="address-line2"
                    value={form.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                    aria-invalid={!!errors.addressLine2}
                    aria-describedby={errors.addressLine2 ? 'err-line2' : undefined}
                  />
                  {errors.addressLine2 && <p id="err-line2" className="field-error" role="alert">{errors.addressLine2}</p>}
                </div>

                <div className="field">
                  <label htmlFor="co-landmark">Landmark (optional)</label>
                  <input
                    id="co-landmark"
                    type="text"
                    className="input"
                    placeholder="Near metro station, park, etc."
                    value={form.landmark}
                    onChange={(e) => updateField('landmark', e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="co-pin">PIN code *</label>
                  <input
                    id="co-pin"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="input"
                    autoComplete="postal-code"
                    placeholder="6-digit PIN"
                    value={form.pincode}
                    onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))}
                    aria-invalid={!!errors.pincode}
                    aria-describedby={errors.pincode ? 'err-pin' : undefined}
                  />
                  {errors.pincode && <p id="err-pin" className="field-error" role="alert">{errors.pincode}</p>}
                </div>

                <div className="field">
                  <label htmlFor="co-city">Town / City *</label>
                  <input
                    id="co-city"
                    type="text"
                    className="input"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'err-city' : undefined}
                  />
                  {errors.city && <p id="err-city" className="field-error" role="alert">{errors.city}</p>}
                </div>

                <div className="field">
                  <label htmlFor="co-state">State / Union Territory *</label>
                  <select
                    id="co-state"
                    className="input"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? 'err-state' : undefined}
                  >
                    <option value="">Select state…</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  {errors.state && <p id="err-state" className="field-error" role="alert">{errors.state}</p>}
                </div>
              </div>
            </fieldset>

            {/* 3. Payment method placeholder */}
            <fieldset className="checkout-card">
              <legend className="checkout-legend">3. Payment method (placeholder)</legend>
              <p className="muted checkout-subnote">
                Payment gateway integration (UPI, cards, netbanking) requires a backend server. Selecting an option
                below previews the checkout structure only — no payment credentials are collected.
              </p>
              <div className="payment-options" role="radiogroup" aria-label="Payment method placeholder">
                {[
                  { id: 'upi', title: 'UPI (Placeholder)', desc: 'Google Pay, PhonePe, BHIM — requires gateway integration' },
                  { id: 'card', title: 'Credit / Debit Card (Placeholder)', desc: 'RuPay, Visa, Mastercard — requires PCI-compliant gateway' },
                  { id: 'netbanking', title: 'NetBanking (Placeholder)', desc: 'All major Indian banks — requires gateway integration' },
                  { id: 'cod', title: 'Pay on Delivery (Placeholder)', desc: 'Subject to PIN code & seller eligibility rules' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`pay-option ${form.paymentMethod === opt.id ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={form.paymentMethod === opt.id}
                      onChange={() => updateField('paymentMethod', opt.id as CheckoutFormState['paymentMethod'])}
                    />
                    <div>
                      <strong>{opt.title}</strong>
                      <p className="muted">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {demoSubmitted && (
              <div className="demo-result" role="status" aria-live="polite">
                <div className="demo-result__head">
                  <Icon name="info" size={22} />
                  <h2>Demo review complete — no order was placed</h2>
                </div>
                <p>
                  Your contact and shipping details for <strong>{form.fullName}</strong> ({form.city}, {form.state} –{' '}
                  {form.pincode}) passed client-side validation. Because this phase includes only the customer-facing
                  storefront without a backend or payment processor, no transaction was executed and your cart has been
                  preserved.
                </p>
                <div className="hero__ctas">
                  <Link to="/cart" className="btn btn--ghost btn--sm">Return to cart</Link>
                  <Link to="/shop" className="btn btn--accent btn--sm">Continue browsing</Link>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <aside className="cart-summary" aria-labelledby="co-summary-heading">
            <div className="summary-head-row">
              <h2 id="co-summary-heading" className="display">Order summary</h2>
              <span className="badge badge--demo">Demo</span>
            </div>

            <ul className="co-items">
              {lines.map((line) => (
                <li key={line.key} className="co-item">
                  <SmartImage
                    src={line.product.images[0].src}
                    alt={line.product.images[0].alt}
                    aspect="1 / 1"
                    className="co-item__img"
                  />
                  <div className="co-item__info">
                    <p className="co-item__name">{line.product.name}</p>
                    {line.variant && <p className="muted">{variantLabel(line.variant)}</p>}
                    <p className="muted">Qty: {line.quantity}</p>
                  </div>
                  <p className="co-item__price">{formatINR(line.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <dl className="summary-rows">
              <div className="summary-row">
                <dt>Items subtotal ({count})</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="summary-row">
                <dt>Shipping cost</dt>
                <dd className="muted">Placeholder (TBD by backend)</dd>
              </div>
              <div className="summary-row summary-row--total">
                <dt>Estimated total</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn btn--accent btn--block">
              Validate & review demo order
            </button>
            <p className="summary-note muted">
              By clicking above, your address form will be validated locally. No payment will be charged.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}
