const BASE = 'https://br-royal-dust-ay28petz.storage.c-5.us-east-2.aws.neon.tech/lstar-images';

const team = [
  { name: 'Michael Ferrari', role: 'Founder & CEO', img: `${BASE}/images/team-1.jpg` },
  { name: 'Sarah Wellington', role: 'Head of Sales', img: `${BASE}/images/team-2.jpg` },
  { name: 'James Osei', role: 'Lead Mechanic', img: `${BASE}/images/team-3.jpg` },
  { name: 'Elena Petrova', role: 'Client Relations', img: `${BASE}/images/team-4.jpg` },
];

export function TeamSection() {
  return (
    <section id="team" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals committed to finding you the perfect vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <div
              key={m.name}
              className="group text-center p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg">{m.name}</h3>
              <p className="text-sm text-primary font-medium">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
