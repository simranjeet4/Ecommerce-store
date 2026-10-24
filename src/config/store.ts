/**
 * Editable store configuration. Replace bracketed placeholders with real business details
 * before launch. Nothing here should be presented as a verified claim.
 */
export const store = {
  name: 'Bazaarly',
  tagline: 'One marketplace for everyday and exceptional finds.',
  announcement: {
    enabled: true,
    message: 'Demo storefront — products, prices and offers shown are sample data.',
    link: { label: 'Learn more', href: '/about' },
  },
  currency: 'INR',
  contact: {
    email: '[support@yourdomain.in]',
    phone: '[+91 XXXXX XXXXX]',
    hours: '[Mon–Sat, 10:00–18:00 IST]',
    address: '[Registered business address, City, State, PIN]',
  },
  legal: {
    companyName: '[Registered company name]',
    gstin: '[GSTIN — to be added]',
  },
  social: [] as { label: string; href: string }[],
};
