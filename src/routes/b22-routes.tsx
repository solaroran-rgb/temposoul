import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';

const CrystalsPage = lazy(() => import('@/pages/fortune/CrystalsPage'));
const PlanetsListPage = lazy(() => import('@/pages/knowledge/PlanetsListPage'));
const PlanetDetailPage = lazy(() => import('@/pages/knowledge/PlanetDetailPage'));
const AstroWikiIndexPage = lazy(() => import('@/pages/wiki/AstroWikiIndexPage'));
const AstroWikiEntryPage = lazy(() => import('@/pages/wiki/AstroWikiEntryPage'));
const ParentingPage = lazy(() => import('@/pages/astrology/ParentingPage'));

const RouteFallback = () => (
 <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
 <div className="skeleton-line" style={{ height: '24px', width: '60%', margin: '0 auto 16px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '80%', margin: '0 auto' }}></div>
 </div>
);

export const b22Routes = (
 <>
 <Route path="/fortune/crystals" element={<Suspense fallback={<RouteFallback />}><CrystalsPage /></Suspense>} />
 <Route path="/knowledge/planets" element={<Suspense fallback={<RouteFallback />}><PlanetsListPage /></Suspense>} />
 <Route path="/knowledge/planets/:slug" element={<Suspense fallback={<RouteFallback />}><PlanetDetailPage /></Suspense>} />
 <Route path="/wiki/astrology" element={<Suspense fallback={<RouteFallback />}><AstroWikiIndexPage /></Suspense>} />
 <Route path="/wiki/astrology/:id" element={<Suspense fallback={<RouteFallback />}><AstroWikiEntryPage /></Suspense>} />
 <Route path="/astrology/parenting" element={<Suspense fallback={<RouteFallback />}><ParentingPage /></Suspense>} />
 </>
);