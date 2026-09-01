export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products", hasDropdown: true },
  { label: "Projects", href: "/projects" },
] as const;

export const socialLinks = [
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://facebook.com/yourpage",
  },
  { label: "WhatsApp", icon: "whatsapp", href: "https://wa.me/18005550142" },
  { label: "Call us", icon: "phone", href: "tel:18005550142" },
  { label: "Email us", icon: "email", href: "mailto:info@yourcompany.com" },
  { label: "Viber", icon: "viber", href: "viber://chat?number=18005550142" },
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://instagram.com/yourpage",
  },
  { label: "Telegram", icon: "telegram", href: "https://t.me/yourpage" },
] as const;
