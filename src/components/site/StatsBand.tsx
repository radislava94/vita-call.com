const stats = [
  { value: "4+", label: "години искуство", description: "во природната медицина" },
  { value: "56k+", label: "нарачки", description: "задоволни купувачи" },
  { value: "100%", label: "задоволство", description: "гаранција за квалитет" }
];

export function StatsBand() {
  return (
    <section id="support" className="py-16 bg-gradient-to-r from-primary/5 via-primary-light/10 to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Customer Support 24/7
          </h2>
          <p className="text-lg text-muted-foreground">
            Континуирана customer support достапност за побрза реакција и
            поголемо задоволство на клиентите.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="mb-2">
                <span className="text-4xl md:text-5xl font-bold text-primary group-hover:text-primary-light transition-colors">
                  {stat.value}
                </span>
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold text-foreground uppercase tracking-wide mb-1">
                {stat.label}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}