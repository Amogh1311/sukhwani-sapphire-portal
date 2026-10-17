/**
 * Strip everything except digits so "+91 98765 43210" → "919876543210",
 * which is the form WhatsApp's `wa.me` short-link expects.
 */
export function toWhatsAppLink(phone: string, prefilledText?: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  const q = prefilledText
    ? `?text=${encodeURIComponent(prefilledText)}`
    : '';
  return `https://wa.me/${digits}${q}`;
}

type Props = {
  phone: string;
  name?: string;
  className?: string;
};

export function WhatsAppIcon({ phone, name, className = '' }: Props) {
  const href = toWhatsAppLink(
    phone,
    name ? `Hi ${name}, reaching out from Sukhwani Sapphire.` : undefined
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${name ?? 'contact'} on WhatsApp`}
      title="Chat on WhatsApp"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:scale-105 hover:bg-[#1ea855] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M19.11 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.27-1.69a9.9 9.9 0 0 0 5.77 1.84h.01c5.46 0 9.89-4.45 9.89-9.91 0-2.65-1.03-5.14-2.83-6.96zm-7.07 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-2.53.84.85-2.47-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.54-3.7 8.22-8.25 8.22zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
      </svg>
    </a>
  );
}
