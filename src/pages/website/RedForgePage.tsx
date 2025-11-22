import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RedForgePage() {
  const { t } = useTranslation('red-forge');

  return (
    <div className="min-h-screen bg-gray-950 text-birch-white pt-16">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-red-900/30 rounded-full border border-red-800">
                <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                  {t('hero.badge')}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-birch-white leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl lg:text-2xl text-birch-white/80 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:samuel@dynorobotics.se"
                  className="inline-flex items-center justify-center px-6 py-3 bg-red-700 hover:bg-red-600 text-white border-red-600 font-medium rounded-lg transition-colors"
                >
                  {t('hero.cta_primary')}
                </a>
                <a
                  href="#location"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-birch-white text-birch-white hover:bg-birch-white hover:text-gray-950 font-medium rounded-lg transition-colors"
                >
                  {t('hero.cta_secondary')}
                </a>
              </div>
            </div>
            <div className="relative max-w-2xl">
              <img
                src="/images/red-forge-hero.png"
                alt={t('hero.image_alt')}
                className="w-full h-auto rounded-2xl shadow-2xl border border-red-900/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-20 lg:py-32 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-birch-white mb-6">
              {t('vision.title')}
            </h2>
            <p className="text-xl text-birch-white/70 max-w-3xl mx-auto leading-relaxed">
              {t('vision.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Principle 1 */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center gap-3">
                  <span className="text-3xl">🏢</span>
                  {t('vision.principles.startup_culture.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed">
                  {t('vision.principles.startup_culture.description')}
                </p>
              </CardContent>
            </Card>

            {/* Principle 2 */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center gap-3">
                  <span className="text-3xl">🔒</span>
                  {t('vision.principles.serious_security.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed">
                  {t('vision.principles.serious_security.description')}
                </p>
              </CardContent>
            </Card>

            {/* Principle 3 */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center gap-3">
                  <span className="text-3xl">🤝</span>
                  {t('vision.principles.collaboration.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed">
                  {t('vision.principles.collaboration.description')}
                </p>
              </CardContent>
            </Card>

            {/* Principle 4 */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  {t('vision.principles.tech_hub.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed">
                  {t('vision.principles.tech_hub.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Facility Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-birch-white mb-6">
              {t('facility.title')}
            </h2>
            <p className="text-xl text-birch-white/70 max-w-3xl mx-auto leading-relaxed">
              {t('facility.subtitle')}
            </p>
          </div>

          {/* Floor Plan */}
          <div className="mb-16">
            <img
              src="/images/red-forge-floor-plan.png"
              alt={t('facility.floor_plan_alt')}
              className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl border border-red-900/30"
            />
          </div>

          {/* Zones */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Common Area */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src="/images/red-forge-common-area.png"
                  alt={t('facility.zones.common_area.image_alt')}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white">
                  {t('facility.zones.common_area.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed mb-4">
                  {t('facility.zones.common_area.description')}
                </p>
                <ul className="space-y-2 text-sm text-birch-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.common_area.features.0')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.common_area.features.1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.common_area.features.2')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Meeting Room */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-blue-900/30 shadow-xl group lagom-hover">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src="/images/red-forge-meeting-room.png"
                  alt={t('facility.zones.meeting_room.image_alt')}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center justify-between">
                  {t('facility.zones.meeting_room.title')}
                  <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full border border-blue-800">
                    {t('facility.zones.meeting_room.badge')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed mb-4">
                  {t('facility.zones.meeting_room.description')}
                </p>
                <ul className="space-y-2 text-sm text-birch-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.meeting_room.features.0')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.meeting_room.features.1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.meeting_room.features.2')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Secure Development */}
            <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-red-900/30 shadow-xl group lagom-hover">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src="/images/red-forge-door.png"
                  alt={t('facility.zones.secure_dev.image_alt')}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-birch-white flex items-center justify-between">
                  {t('facility.zones.secure_dev.title')}
                  <span className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded-full border border-red-800">
                    {t('facility.zones.secure_dev.badge')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-birch-white/70 leading-relaxed mb-4">
                  {t('facility.zones.secure_dev.description')}
                </p>
                <ul className="space-y-2 text-sm text-birch-white/60">
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.secure_dev.features.0')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.secure_dev.features.1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage-green-dark">✓</span>
                    {t('facility.zones.secure_dev.features.2')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 lg:py-32 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-birch-white">
                {t('location.title')}
              </h2>
              <p className="text-xl text-birch-white/70 leading-relaxed">
                {t('location.description')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-semibold text-birch-white mb-1">
                      {t('location.options.ebbe_park.title')}
                    </h3>
                    <p className="text-sm text-birch-white/60">
                      {t('location.options.ebbe_park.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <h3 className="font-semibold text-birch-white mb-1">
                      {t('location.options.remote_first.title')}
                    </h3>
                    <p className="text-sm text-birch-white/60">
                      {t('location.options.remote_first.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 border border-red-900/30">
              <h3 className="text-2xl font-bold text-birch-white mb-6">
                {t('location.timeline.title')}
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage-green-dark/20 border-2 border-sage-green-dark flex items-center justify-center">
                    <span className="text-sage-green-dark font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-birch-white mb-1">
                      {t('location.timeline.phases.0.title')}
                    </h4>
                    <p className="text-sm text-birch-white/60">
                      {t('location.timeline.phases.0.description')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-900/20 border-2 border-red-700 flex items-center justify-center">
                    <span className="text-red-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-birch-white mb-1">
                      {t('location.timeline.phases.1.title')}
                    </h4>
                    <p className="text-sm text-birch-white/60">
                      {t('location.timeline.phases.1.description')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-birch-white mb-1">
                      {t('location.timeline.phases.2.title')}
                    </h4>
                    <p className="text-sm text-birch-white/60">
                      {t('location.timeline.phases.2.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-red-950/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-birch-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-birch-white/70 mb-8 leading-relaxed">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:samuel@dynorobotics.se"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-700 hover:bg-red-600 text-white border-red-600 font-medium rounded-lg transition-colors"
            >
              {t('cta.primary')}
            </a>
            <a
              href="/defense"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-birch-white text-birch-white hover:bg-birch-white hover:text-gray-950 font-medium rounded-lg transition-colors"
            >
              {t('cta.secondary')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

