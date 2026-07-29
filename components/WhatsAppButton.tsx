import WhatsAppIcon from "@/components/WhatsAppIcon";

type Props = {
  phone: string;
  message: string;
};

// Floating click-to-chat button, only rendered when a WhatsApp number is set
// in Site Settings — wa.me links work without any API/webhook integration,
// so this is a pure client-side link.
export default function WhatsAppButton({ phone, message }: Props) {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-100 ease-out hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
