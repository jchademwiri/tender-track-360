import { TestimonialsSectionProps } from '@/types/home-page';

export function TestimonialsSection({
  testimonials = [],
}: Partial<TestimonialsSectionProps> = {}) {
  // Placeholder testimonials data - will be populated in later tasks
  const defaultTestimonials = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      role: 'Procurement Director',
      content:
        'Tender Track 360 has transformed our tender management process. We&apos;ve seen a 40% increase in our success rate since implementation.',
      avatar: undefined,
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'Global Industries',
      role: 'Operations Manager',
      content:
        'The automated deadline tracking alone has saved us countless hours and prevented missed opportunities.',
      avatar: undefined,
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      company: 'Innovation Partners',
      role: 'Business Development Lead',
      content:
        'The collaboration features have improved our team coordination significantly. Everyone stays informed and aligned.',
      avatar: undefined,
    },
  ];

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of organizations that have transformed their tender
            management process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <div className="mb-4">
                <p className="text-card-foreground italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold mr-4">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="text-sm text-muted-foreground mb-4">
            Trusted by leading organizations
          </div>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="bg-muted h-8 w-24 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
              TechCorp
            </div>
            <div className="bg-muted h-8 w-24 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
              Global Inc
            </div>
            <div className="bg-muted h-8 w-24 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
              Innovation
            </div>
            <div className="bg-muted h-8 w-24 rounded flex items-center justify-center text-xs font-medium text-muted-foreground">
              Solutions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
