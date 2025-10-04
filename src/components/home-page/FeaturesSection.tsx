import { FeaturesSectionProps } from '@/types/home-page';

export function FeaturesSection({
  features = [],
}: Partial<FeaturesSectionProps> = {}) {
  // Placeholder features data - will be populated in later tasks
  const defaultFeatures = [
    {
      id: '1',
      title: 'Tender Lifecycle Management',
      description: 'Track from discovery to award',
      icon: '📋',
      benefits: ['Complete visibility', 'Process automation'],
    },
    {
      id: '2',
      title: 'Document Repository',
      description: 'Centralized file management with version control',
      icon: '📁',
      benefits: ['Version control', 'Secure storage'],
    },
    {
      id: '3',
      title: 'Deadline Tracking',
      description: 'Automated notifications and reminders',
      icon: '⏰',
      benefits: ['Never miss deadlines', 'Automated alerts'],
    },
    {
      id: '4',
      title: 'Status Dashboard',
      description: 'Visual overview of all tender activities',
      icon: '📊',
      benefits: ['Real-time insights', 'Visual reporting'],
    },
    {
      id: '5',
      title: 'Team Collaboration',
      description: 'Role-based access and workflow management',
      icon: '👥',
      benefits: ['Secure collaboration', 'Role management'],
    },
    {
      id: '6',
      title: 'Analytics & Insights',
      description: 'Performance tracking and success metrics',
      icon: '📈',
      benefits: ['Performance metrics', 'Success tracking'],
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Tender Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your tender process and increase
            your success rate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature) => (
            <div
              key={feature.id}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="text-sm text-gray-500">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
