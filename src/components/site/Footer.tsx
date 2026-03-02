import { Link } from "react-router-dom";
import VitaCall_Logo from "@/assets/vita-call-logo.png";

const footerLinks = {
  useful: [
    { name: "Почетна", href: "/" },
    { name: "Производи", href: "/products" },
    { name: "За нас", href: "/about" },
    { name: "Контакт", href: "/contact" },
  ],
  additional: [
    { name: "Телефонска Продажба", href: "/products" },
    { name: "Outsource Call Center", href: "/about" },
    { name: "Customer Support 24/7", href: "/contact" },
    { name: "Прашања и одговори", href: "/faq" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-primary mb-4 font-[var(--font-script)]">
              <Link
                to="/"
                className="relative flex items-center justify-center group"
              >
                <img
                  src={VitaCall_Logo}
                  alt="Vita Call call center Македонија лого"
                  className="
      h-14 sm:h-16 w-auto object-contain
      transition-transform duration-300 ease-out
      group-hover:scale-110
      transform-gpu will-change-transform
    "
                />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Vita Call е професионален call center Македонија тим за
              телемаркетинг, телефонска продажба и outsource call center
              операции. Обезбедуваме customer support услуги за бизниси во
              Северна Македонија.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Корисни линкови
            </h3>
            <ul className="space-y-3">
              {footerLinks.useful.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
              Додатни информации
            </h3>
            <ul className="space-y-3">
              {footerLinks.additional.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vita Call. Сите права задржани.
          </p>
        </div>
      </div>
    </footer>
  );
}
