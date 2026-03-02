import type { Product } from "@/lib/types";

import imgArthro from "./ArhroVita.jpeg";
import imgArthroWebp from "./ArhroVita.webp";
import imgArthroAvif from "./ArhroVita.avif";
import imgCardi from "./CardiVita.jpeg";
import imgCardiWebp from "./CardiVita.webp";
import imgCardiAvif from "./CardiVita.avif";
import imgDia from "./DiaVita.jpeg";
import imgDiaWebp from "./DiaVita.webp";
import imgDiaAvif from "./DiaVita.avif";
import imgOpti from "./OptiVita.jpeg";
import imgOptiWebp from "./OptiVita.webp";
import imgOptiAvif from "./OptiVita.avif";
import imgPro from "./ProVita.jpeg";
import imgProWebp from "./ProVita.webp";
import imgProAvif from "./ProVita.avif";
import imgVitaFit from "./VitaFit.jpeg";
import imgVitaFitWebp from "./VitaFit.webp";
import imgVitaFitAvif from "./VitaFit.avif";
import imgStallion from "./Stallion_Power.jpeg";
import imgStallionWebp from "./Stallion_Power.webp";
import imgStallionAvif from "./Stallion_Power.avif";

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const mockProducts: Product[] = [
  {
    id: "arthrovita",
    title: "ArthroVita – Поддршка за зглобови",
    slug: "arthrovita",
    description:
      "Формула за подмачкување и флексибилност на зглобови со глукозамин, хондроитин и МСМ.",
    price: 2400,
    original_price: 4800,
    image_avif: imgArthroAvif,
    image_webp: imgArthroWebp,
    primary_image_url: imgArthro,
    image: imgArthroWebp,
    image_url: imgArthro,
    created_at: daysAgo(2),
  },
  {
    id: "cardivita",
    title: "CardiVita",
    slug: "cardivita",
    description:
      "Поддршка за кардиоваскуларно здравје со CoQ10, магнезиум и Б-витамини.",
    price: 2400,
    original_price: 4800,
    image_avif: imgCardiAvif,
    image_webp: imgCardiWebp,
    primary_image_url: imgCardi,
    image: imgCardiWebp,
    image_url: imgCardi,
    created_at: daysAgo(1),
  },
  {
    id: "diavita",
    title: "DiaVita – Рамнотежа на шеќер",
    slug: "diavita",
    description:
      "Билна поддршка за нормални нивоа на гликоза со цимет и берберин.",
    price: 2400,
    original_price: 4800,
    image_avif: imgDiaAvif,
    image_webp: imgDiaWebp,
    primary_image_url: imgDia,
    image: imgDiaWebp,
    image_url: imgDia,
    created_at: daysAgo(4),
  },
  {
    id: "optivita",
    title: "OptiVita – Визија & очи",
    slug: "optivita",
    description:
      "Лутеин, зеаксантин и боровинка за заштита и удобност на очите.",
    price: 2400,
    original_price: 4800,
    image_avif: imgOptiAvif,
    image_webp: imgOptiWebp,
    primary_image_url: imgOpti,
    image: imgOptiWebp,
    image_url: imgOpti,
    created_at: daysAgo(7),
  },
  {
    id: "provita",
    title: "ProVita – Имунитет",
    slug: "provita",
    description:
      "Цинк, витамин C и D3 за дневна одбрана и енергија.",
    price: 2400,
    original_price: 4800,
    image_avif: imgProAvif,
    image_webp: imgProWebp,
    primary_image_url: imgPro,
    image: imgProWebp,
    image_url: imgPro,
    created_at: daysAgo(10),
  },
  {
    id: "vitafit",
    title: "VitaFit – Дневен мултивитамин",
    slug: "vitafit",
    description:
      "Комплет од 23 нутриенти за тонус и виталност.",
    price: 2400,
    original_price: 4800,
    image_avif: imgVitaFitAvif,
    image_webp: imgVitaFitWebp,
    primary_image_url: imgVitaFit,
    image: imgVitaFitWebp,
    image_url: imgVitaFit,
    created_at: daysAgo(12),
  },
  {
    id: "stallion-power",
    title: "Stallion Power – Машка енергија",
    slug: "stallion-power",
    description:
      "Природна формула за сила и издржливост со мака и цинк.",
    price: 2400,
    original_price: 4800,
    image_avif: imgStallionAvif,
    image_webp: imgStallionWebp,
    primary_image_url: imgStallion,
    image: imgStallionWebp,
    image_url: imgStallion,
    created_at: daysAgo(3),
  },
];
