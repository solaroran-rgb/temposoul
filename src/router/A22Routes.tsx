import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const CeziPage = lazy(() => import('@/pages/divination/CeziPage'));
const FingerprintPage = lazy(() => import('@/pages/divination/FingerprintPage'));
const NumerologyPage = lazy(() => import('@/pages/divination/NumerologyPage'));
const BirthCodePage = lazy(() => import('@/pages/divination/BirthCodePage'));
const BirthFlowerPage = lazy(() => import('@/pages/divination/BirthFlowerPage'));
const TestsPage = lazy(() => import('@/pages/tests/TestsPage'));
const BloodTypePage = lazy(() => import('@/pages/knowledge/BloodTypePage'));
const BloodTypeDetailPage = lazy(() => import('@/pages/knowledge/BloodTypeDetailPage'));
const SuperstitionPage = lazy(() => import('@/pages/divination/SuperstitionPage'));
const DailyTarotPage = lazy(() => import('@/pages/tarot/DailyTarotPage'));
const RunesPage = lazy(() => import('@/pages/runes/RunesPage'));
const PalmPage = lazy(() => import('@/pages/divination/PalmPage'));
const EphemerisPage = lazy(() => import('@/pages/astrolabe/EphemerisPage'));
const ZhugePage = lazy(() => import('@/pages/divination/ZhugePage'));

export const A22Routes = (
  <>
    <Route path="/divination/cezi" element={<Suspense fallback={<RouteFallback />}><CeziPage /></Suspense>} />
    <Route path="/divination/fingerprint" element={<Suspense fallback={<RouteFallback />}><FingerprintPage /></Suspense>} />
    <Route path="/divination/numerology" element={<Suspense fallback={<RouteFallback />}><NumerologyPage /></Suspense>} />
    <Route path="/divination/birth-code" element={<Suspense fallback={<RouteFallback />}><BirthCodePage /></Suspense>} />
    <Route path="/divination/birth-flower" element={<Suspense fallback={<RouteFallback />}><BirthFlowerPage /></Suspense>} />
    <Route path="/tests" element={<Suspense fallback={<RouteFallback />}><TestsPage /></Suspense>} />
    <Route path="/knowledge/blood-type" element={<Suspense fallback={<RouteFallback />}><BloodTypePage /></Suspense>} />
    <Route path="/knowledge/blood-type/:type" element={<Suspense fallback={<RouteFallback />}><BloodTypeDetailPage /></Suspense>} />
    <Route path="/divination/superstition" element={<Suspense fallback={<RouteFallback />}><SuperstitionPage /></Suspense>} />
    <Route path="/tarot/daily" element={<Suspense fallback={<RouteFallback />}><DailyTarotPage /></Suspense>} />
    <Route path="/runes" element={<Suspense fallback={<RouteFallback />}><RunesPage /></Suspense>} />
    <Route path="/divination/palm" element={<Suspense fallback={<RouteFallback />}><PalmPage /></Suspense>} />
    <Route path="/astrolabe/ephemeris" element={<Suspense fallback={<RouteFallback />}><EphemerisPage /></Suspense>} />
    <Route path="/divination/zhuge" element={<Suspense fallback={<RouteFallback />}><ZhugePage /></Suspense>} />
  </>
);
