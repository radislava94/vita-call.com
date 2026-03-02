import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="hero" className="relative py-20 lg:py-28 flex items-center justify-center text-center overflow-hidden">
      {/* soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-background" />

      {/* centered content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-[var(--font-script)]">
          Професионален Call Center во Македонија
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Vita Call е call center Македонија фокусиран на мерливи резултати за
          локални и регионални компании. Нашиот тим води професионален
          телемаркетинг, организира телефонска продажба и обезбедува outsource
          call center модели според вашата индустрија. Со јасни скрипти,
          CRM-процеси и контрола на квалитет, добивате повеќе конверзии,
          побрза обработка на лидови и стабилна customer support услуга.
          Без разлика дали ви треба влезен или излезен call center Македонија
          сервис, креираме решение што го зголемува приходот и го подобрува
          искуството на клиентите.
        </p>

        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Link to="/products">ПРОИЗВОДИ</Link>
        </Button>
      </div>
    </section>
  );
}
