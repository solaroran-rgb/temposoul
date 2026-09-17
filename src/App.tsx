import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StarfieldBackground } from './components/StarfieldBackground';
import { GlobalControlCluster } from './components/GlobalControlCluster';
import { SiteNav } from './components/SiteNav';
import { TrustBanner } from './components/TrustEngine/TrustBanner';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProfilesProvider } from './contexts/ProfilesContext';
import { useI18n } from '@/i18n';
import { initAnalyticsFromRuntime, trackPageView } from '@/lib/analytics';
import { A22Routes } from '@/router/A22Routes';
import { b22Routes } from '@/routes/b22-routes';
import { c22Routes } from '@/routes/C22Routes';
import { A23Routes } from '@/router/A23Routes';
import { A24Routes } from '@/router/A24Routes';
import { B23Routes } from '@/router/B23Routes';
import { C23Routes } from '@/router/C23Routes';
import { D23Routes } from '@/router/D23Routes';
import { E23Routes } from '@/routes/E23Routes';
import { ComplianceGuard } from '@/components/platform/ComplianceGuard';

const InputPage = lazy(async () => {
  const module = await import('./pages/InputPage');
  return { default: module.InputPage };
});

const RecordsPage = lazy(async () => {
  const module = await import('./pages/RecordsPage');
  return { default: module.RecordsPage };
});

const ResultPage = lazy(async () => {
  const module = await import('./pages/ResultPage');
  return { default: module.ResultPage };
});

const TutorialPage = lazy(async () => {
  const module = await import('./pages/TutorialPage');
  return { default: module.TutorialPage };
});

const PrivacyPage = lazy(async () => {
  const module = await import('./pages/PrivacyPage');
  return { default: module.PrivacyPage };
});

const LoginPage = lazy(async () => {
  const module = await import('./pages/LoginPage');
  return { default: module.LoginPage };
});

const RegisterPage = lazy(async () => {
  const module = await import('./pages/RegisterPage');
  return { default: module.RegisterPage };
});

const LexiconPage = lazy(async () => {
  const module = await import('./pages/LexiconPage');
  return { default: module.LexiconPage };
});

const SkyPage = lazy(async () => {
  const module = await import('./pages/SkyPage/SkyPage');
  return { default: module.SkyPage };
});

// 第4轮专家交付新页面（路由接线收尾）
const DayunPage = lazy(async () => {
  const module = await import('./pages/bazi/DayunPage');
  return { default: module.DayunPage };
});

const LiunianPage = lazy(async () => {
  const module = await import('./pages/bazi/LiunianPage');
  return { default: module.LiunianPage };
});

const CompatibilityPage = lazy(async () => {
  const module = await import('./pages/bazi/CompatibilityPage');
  return { default: module.CompatibilityPage };
});

const AlmanacSelectPage = lazy(async () => {
  const module = await import('./pages/almanac/SelectPage');
  return { default: module.SelectPage };
});

const NameTestPage = lazy(async () => {
  const module = await import('./pages/name/NameTestPage');
  return { default: module.NameTestPage };
});

const SearchPage = lazy(async () => {
  const module = await import('./pages/platform/SearchPage');
  return { default: module.SearchPage };
});

const PricingPage = lazy(async () => {
  const module = await import('./pages/platform/PricingPage');
  return { default: module.PricingPage };
});

// 第6轮专家交付新页面（路由接线收尾）
const PalacesPage = lazy(async () => {
  const module = await import('./pages/ziwei/PalacesPage');
  return { default: module.PalacesPage };
});

const NatalPage = lazy(async () => {
  const module = await import('./pages/astrolabe/NatalPage');
  return { default: module.NatalPage };
});

const EventsPage = lazy(async () => {
  const module = await import('./pages/astro/EventsPage');
  return { default: module.EventsPage };
});

const DailyFortunePage = lazy(async () => {
  const module = await import('./pages/fortune/DailyFortunePage');
  return { default: module.default };
});

const DailySignPage = lazy(async () => {
  const module = await import('./pages/fortune/DailySignPage');
  return { default: module.DailySignPage };
});

const RemindersPage = lazy(async () => {
  const module = await import('./pages/platform/RemindersPage');
  return { default: module.RemindersPage };
});

const MembershipPage = lazy(async () => {
  const module = await import('./pages/platform/MembershipPage');
  return { default: module.MembershipPage };
});

const NamesPage = lazy(async () => {
  const module = await import('./pages/name/NamesPage');
  return { default: module.NamesPage };
});

const NameReportPage = lazy(async () => {
  const module = await import('./pages/name/NameReportPage');
  return { default: module.NameReportPage };
});

const BirthChartSharePage = lazy(async () => {
  const module = await import('./pages/share/BirthChartPage');
  return { default: module.BirthChartPage };
});

const BaziTopicsPage = lazy(async () => {
  const module = await import('./pages/bazi/TopicsPage');
  return { default: module.TopicsPage };
});

const CompliancePage = lazy(async () => {
  const module = await import('./pages/platform/CompliancePage');
  return { default: module.CompliancePage };
});

const KangxiPage = lazy(async () => {
  const module = await import('./pages/name/KangxiPage');
  return { default: module.KangxiPage };
});

const KangxiCharPage = lazy(async () => {
  const module = await import('./pages/name/KangxiCharPage');
  return { default: module.KangxiCharPage };
});

// 第11轮批1 R3 新页面（路由接线收尾：A10/B'/C11/D9）
const FiveElementsPage = lazy(async () => {
  const module = await import('./pages/bazi/FiveElementsPage');
  return { default: module.FiveElementsPage };
});

const BaziDailyPage = lazy(async () => {
  const module = await import('./pages/bazi/DailyPage');
  return { default: module.DailyPage };
});

const MarriagePage = lazy(async () => {
  const module = await import('./pages/bazi/MarriagePage');
  return { default: module.MarriagePage };
});

const StarsPage = lazy(async () => {
  const module = await import('./pages/ziwei/StarsPage');
  return { default: module.StarsPage };
});

const StarDetailPage = lazy(async () => {
  const module = await import('./pages/ziwei/StarDetailPage');
  return { default: module.StarDetailPage };
});

const ZhugePage = lazy(async () => {
  const module = await import('./pages/divination/ZhugePage');
  return { default: module.default };
});

const SpreadsPage = lazy(async () => {
  const module = await import('./pages/divination/SpreadsPage');
  return { default: module.SpreadsPage };
});

const SpreadDetailPage = lazy(async () => {
  const module = await import('./pages/divination/SpreadDetailPage');
  return { default: module.SpreadDetailPage };
});

const AlmanacPage = lazy(async () => {
  const module = await import('./pages/almanac/AlmanacPage');
  return { default: module.default };
});

const ZodiacFortunePage = lazy(async () => {
  const module = await import('./pages/zodiac/ZodiacFortunePage');
  return { default: module.default };
});

const ZodiacCompatibilityPage = lazy(async () => {
  const module = await import('./pages/zodiac/ZodiacCompatibilityPage');
  return { default: module.default };
});

const FortuneRhythmPage = lazy(async () => {
  const module = await import('./pages/fortune/FortuneRhythmPage');
  return { default: module.default };
});

const LingSignPage = lazy(async () => {
  const module = await import('./pages/divination/DailySignPage');
  return { default: module.default };
});

const NameCompatibilityPage = lazy(async () => {
  const module = await import('./pages/name/NameCompatibilityPage');
  return { default: module.NameCompatibilityPage };
});

const KnowledgeListPage = lazy(async () => {
  const module = await import('./pages/knowledge/KnowledgeListPage');
  return { default: module.KnowledgeListPage };
});

const KnowledgeGanzhiPage = lazy(async () => {
  const module = await import('./pages/knowledge/GanzhiHubPage');
  return { default: module.GanzhiHubPage };
});

const KnowledgeDetailPage = lazy(async () => {
  const module = await import('./pages/knowledge/KnowledgeDetailPage');
  return { default: module.KnowledgeDetailPage };
});

const FaqPage = lazy(async () => {
  const module = await import('./pages/platform/FaqPage');
  return { default: module.FaqPage };
});

const FavoritesPage = lazy(async () => {
  const module = await import('./pages/platform/FavoritesPage');
  return { default: module.FavoritesPage };
});

const ProfilePage = lazy(async () => {
  const module = await import('./pages/platform/ProfilePage');
  return { default: module.ProfilePage };
});

// 批2 R4 新页面（A9+B6+C9+D7 路由接线）
const ShishenListPage = lazy(() => import('./pages/bazi/ShishenListPage'));
const ShishenDetailPage = lazy(() => import('./pages/bazi/ShishenDetailPage'));
const ShenshaPage = lazy(() => import('./pages/bazi/ShenshaPage'));
const SihuaPage = lazy(() => import('./pages/ziwei/SihuaPage'));
const PatternListPage = lazy(() => import('./pages/ziwei/PatternListPage'));
const PatternDetailPage = lazy(() => import('./pages/ziwei/PatternDetailPage'));
const ZiweiLimitsPage = lazy(() => import('./pages/ziwei/LimitsPage'));
const PalaceStarPage = lazy(() => import('./pages/ziwei/PalaceStarPage'));
const TransitsPage = lazy(() => import('./pages/astrolabe/TransitsPage'));
const IsLuckyPage = lazy(() => import('./pages/almanac/IsLuckyPage'));
const WanNianLiPage = lazy(() => import('./pages/almanac/WanNianLiPage'));
const DirectionsPage = lazy(() => import('./pages/almanac/DirectionsPage'));
const ZodiacDetailPage = lazy(() => import('./pages/astrology/ZodiacDetailPage'));
const ZodiacWikiPage = lazy(() => import('./pages/astrology/ZodiacWikiPage'));
const ZodiacProfilePage = lazy(() => import('./pages/fortune/ZodiacProfilePage'));
const TarotLexiconPage = lazy(() => import('./pages/tarot/TarotLexiconPage'));
const TarotLexiconDetailPage = lazy(() => import('./pages/tarot/TarotLexiconDetailPage'));
const HexagramsPage = lazy(() => import('./pages/yijing/HexagramsPage'));
const HexagramDetailPage = lazy(() => import('./pages/yijing/HexagramDetailPage'));
const NameDictionaryPage = lazy(() => import('./pages/names/NameDictionaryPage'));
const NameCharDetailPage = lazy(() => import('./pages/names/NameCharDetailPage'));
const ChengguPage = lazy(() => import('./pages/divination/ChengguPage'));
const NumberFortunePage = lazy(() => import('./pages/divination/NumberFortunePage'));
const DreamPage = lazy(() => import('./pages/divination/DreamPage'));
const RetrogradePage = lazy(() => import('./pages/astrolabe/RetrogradePage'));
const ZiweiStarsListPage = lazy(() => import('./pages/knowledge/ZiweiStarsListPage'));
const ZiweiStarDetailPage = lazy(() => import('./pages/knowledge/ZiweiStarDetailPage'));
const ZiweiPalacesListPage = lazy(() => import('./pages/knowledge/ZiweiPalacesListPage'));
const ZiweiPalaceDetailPage = lazy(() => import('./pages/knowledge/ZiweiPalaceDetailPage'));
const LoveDivinationPage = lazy(() => import('./pages/divination/LoveDivinationPage'));
const VideoChannelPage = lazy(() => import('./pages/video/VideoChannelPage'));

// 批3a D21C21：社区/会员(C) + 咨询/专家/账户/商城/联盟(D) 路由接线
const ForumPage = lazy(() => import('./pages/community/ForumPage'));
const PostDetailPage = lazy(() => import('./pages/community/PostDetailPage'));
const BountyListPage = lazy(() => import('./pages/community/BountyListPage'));
const ShareWallPage = lazy(() => import('./pages/community/ShareWallPage'));
const VipPage = lazy(() => import('./pages/vip/VipPage'));
const AdvisorsPage = lazy(() => import('./pages/consult/AdvisorsPage'));
const ChatPage = lazy(() => import('./pages/consult/ChatPage'));
const MatchPage = lazy(() => import('./pages/consult/MatchPage'));
const FreeTrialPage = lazy(() => import('./pages/consult/FreeTrialPage'));
const AdvisorProfilePage = lazy(() => import('./pages/consult/AdvisorProfilePage'));
const ApplyPage = lazy(() => import('./pages/consult/ApplyPage'));
const TeamPage = lazy(() => import('./pages/experts/TeamPage'));
const TopUpPage = lazy(() => import('./pages/account/TopUpPage'));
const RewardsPage = lazy(() => import('./pages/account/RewardsPage'));
const ProductsPage = lazy(() => import('./pages/shop/ProductsPage'));
const ProgramPage = lazy(() => import('./pages/affiliate/ProgramPage'));

function RouteFallback() {
  return (
    <div className="route-loading" aria-hidden="true">
      <div className="route-loading-skeleton">
        <span className="skeleton-block route-loading-skeleton-title" />
        <span className="skeleton-block route-loading-skeleton-line" />
        <span className="skeleton-block route-loading-skeleton-line route-loading-skeleton-line-short" />
        <div className="route-loading-skeleton-grid">
          <span className="skeleton-block route-loading-skeleton-card" />
          <span className="skeleton-block route-loading-skeleton-card" />
          <span className="skeleton-block route-loading-skeleton-card" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useI18n();
  const location = useLocation();
  const isSkyImmersive = location.pathname === '/sky';

  useEffect(() => {
    initAnalyticsFromRuntime();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <FavoritesProvider>
      <ProfilesProvider>
        {!isSkyImmersive && <StarfieldBackground />}
        {!isSkyImmersive && <SiteNav />}
        {!isSkyImmersive && <GlobalControlCluster />}
        {/* P1-2 Trust Engine: global mount — T1 tutorial / T6 result (no-op on other routes). */}
        {!isSkyImmersive && <TrustBanner />}
        <Suspense fallback={<RouteFallback />}>
          <ErrorBoundary>
            <main>
              <Routes>
                <Route path="/" element={<InputPage />} />
                <Route path="/sky" element={<SkyPage />} />
                <Route path="/tutorial" element={<TutorialPage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/bazi/dayun" element={<DayunPage />} />
                <Route path="/bazi/liunian" element={<LiunianPage />} />
                <Route path="/bazi/compatibility" element={<CompatibilityPage />} />
                <Route path="/ziwei/palaces" element={<PalacesPage />} />
                <Route path="/astrolabe/natal" element={<NatalPage />} />
                <Route path="/bazi/topics/:topic" element={<BaziTopicsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/lexicon" element={<LexiconPage />} />
                <Route path="/almanac/select" element={<AlmanacSelectPage />} />
                <Route path="/name-test" element={<NameTestPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/astro/events" element={<EventsPage />} />
                <Route path="/fortune/daily" element={<DailyFortunePage />} />
                <Route path="/daily-fortune" element={<DailySignPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/names" element={<NamesPage />} />
                <Route path="/name-report" element={<NameReportPage />} />
                <Route path="/share/birth-chart" element={<BirthChartSharePage />} />
                <Route path="/kangxi" element={<KangxiPage />} />
                <Route path="/kangxi/:char" element={<KangxiCharPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
                <Route path="/bazi/five-elements" element={<FiveElementsPage />} />
                <Route path="/bazi/daily" element={<BaziDailyPage />} />
                <Route path="/bazi/marriage" element={<MarriagePage />} />
                <Route path="/ziwei/stars" element={<StarsPage />} />
                <Route path="/ziwei/stars/:starId" element={<StarDetailPage />} />
                <Route path="/divination/zhuge" element={<ZhugePage />} />
                <Route path="/tarot/spreads" element={<SpreadsPage />} />
                <Route path="/tarot/spreads/:spreadId" element={<SpreadDetailPage />} />
                <Route path="/almanac" element={<AlmanacPage />} />
                <Route path="/zodiac/fortune" element={<ZodiacFortunePage />} />
                <Route path="/zodiac/compatibility" element={<ZodiacCompatibilityPage />} />
                <Route path="/fortune/rhythm" element={<FortuneRhythmPage />} />
                <Route path="/lingsign/:code" element={<LingSignPage type="lingsign" />} />
                <Route path="/name/compatibility" element={<NameCompatibilityPage />} />
                <Route path="/knowledge/ganzhi" element={<KnowledgeGanzhiPage />} />
                <Route path="/knowledge" element={<KnowledgeListPage />} />
                <Route path="/knowledge/:slug" element={<KnowledgeDetailPage />} />
                {/* 批2 R4 新路由 */}
                <Route path="/bazi/shishen" element={<ShishenListPage />} />
                <Route path="/bazi/shishen/:key" element={<ShishenDetailPage />} />
                <Route path="/bazi/shensha" element={<ShenshaPage />} />
                <Route path="/ziwei/sihua" element={<SihuaPage />} />
                <Route path="/ziwei/patterns" element={<PatternListPage />} />
                <Route path="/ziwei/patterns/:key" element={<PatternDetailPage />} />
                <Route path="/ziwei/limits" element={<ZiweiLimitsPage />} />
                <Route path="/ziwei/palace-star" element={<PalaceStarPage />} />
                <Route path="/astrolabe/transits" element={<TransitsPage />} />
                <Route path="/almanac/is-lucky/marriage" element={<IsLuckyPage />} />
                <Route path="/almanac/calendar" element={<WanNianLiPage />} />
                <Route path="/almanac/directions" element={<DirectionsPage />} />
                <Route path="/astrology/zodiac" element={<ZodiacWikiPage />} />
                <Route path="/astrology/zodiac/:signId" element={<ZodiacDetailPage />} />
                <Route path="/fortune/zodiac-profile" element={<ZodiacProfilePage />} />
                <Route path="/tarot/lexicon" element={<TarotLexiconPage />} />
                <Route path="/tarot/lexicon/:slug" element={<TarotLexiconDetailPage />} />
                <Route path="/yijing/hexagrams" element={<HexagramsPage />} />
                <Route path="/yijing/hexagrams/:index" element={<HexagramDetailPage />} />
                <Route path="/names/dictionary" element={<NameDictionaryPage />} />
                <Route path="/names/dictionary/:char" element={<NameCharDetailPage />} />
                <Route path="/divination/chenggu" element={<ChengguPage />} />
                <Route path="/divination/number" element={<NumberFortunePage />} />
                <Route path="/divination/dream" element={<DreamPage />} />
                <Route path="/astrolabe/retrograde" element={<RetrogradePage />} />
                <Route path="/knowledge/ziwei-stars" element={<ZiweiStarsListPage />} />
                <Route path="/knowledge/ziwei-stars/:starId" element={<ZiweiStarDetailPage />} />
                <Route path="/knowledge/ziwei-palaces" element={<ZiweiPalacesListPage />} />
                <Route
                  path="/knowledge/ziwei-palaces/:palaceId"
                  element={<ZiweiPalaceDetailPage />}
                />
                <Route path="/divination/love" element={<LoveDivinationPage />} />
                <Route path="/video" element={<VideoChannelPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* 批3a D21C21 路由：C 社区/会员 + D 咨询/专家/账户/商城/联盟 */}
                <Route path="/community" element={<ForumPage />} />
                <Route path="/community/board/:boardId" element={<ForumPage />} />
                <Route path="/community/post/:postId" element={<PostDetailPage />} />
                <Route path="/community/bounty" element={<BountyListPage />} />
                <Route path="/community/wall" element={<ShareWallPage />} />
                <Route path="/vip" element={<VipPage />} />
                <Route path="/consult" element={<AdvisorsPage />} />
                <Route path="/consult/chat" element={<ChatPage />} />
                <Route path="/consult/match" element={<MatchPage />} />
                <Route path="/consult/free" element={<FreeTrialPage />} />
                <Route path="/consult/advisors/:id" element={<AdvisorProfilePage />} />
                <Route path="/consult/apply" element={<ApplyPage />} />
                <Route path="/experts" element={<TeamPage />} />
                <Route path="/account/credits" element={<TopUpPage />} />
                <Route path="/account/rewards" element={<RewardsPage />} />
                <Route path="/shop" element={<ProductsPage />} />
                <Route path="/affiliate" element={<ProgramPage />} />
                {A22Routes}
                {b22Routes}
                {c22Routes}
                {A23Routes}
                {A24Routes}
                {B23Routes}
                {C23Routes}
                {D23Routes}
                {E23Routes}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ComplianceGuard />
            </main>
          </ErrorBoundary>
          {!isSkyImmersive && (
            <footer
              className="global-disclaimer"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: '6px 12px',
                fontSize: 11,
                lineHeight: 1.4,
                textAlign: 'center',
                color: '#d8cfe0',
                background: 'rgba(19, 16, 25, 0.92)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {t('disclaimer')}
            </footer>
          )}
        </Suspense>
      </ProfilesProvider>
    </FavoritesProvider>
  );
}
