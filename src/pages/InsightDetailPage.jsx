import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getInsightBySlug, getAllInsights } from '../services/insightsService';
import { getCtaSection } from '../services/ctaSectionService';
import '../css/insight-detail-page.css';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const BACK_ARROW   = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const CALENDAR_ICN = <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const USER_ICN     = <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const TAG_ICN      = <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const CLOCK_ICN    = <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IMG_ICN      = <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const ARROW_ICN    = <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const LI_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TW_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;

const FALLBACK_CTA = {
  title: 'Want More Insights Like This?',
  description: 'Subscribe to our newsletter and get the latest research delivered to your inbox.',
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Browse All Insights',
  secondaryButtonUrl: '/insights',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function readingTime(text) {
  if (!text) return '5 min read';
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function getInitials(name) {
  if (!name) return 'VI';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

/* ─── Article content renderer ───────────────────────────────────────────── */
function ArticleContent({ summary }) {
  return (
    <div className="insight-article__content-placeholder">
      <p className="insight-article__content-para">
        The landscape of enterprise operations is undergoing a fundamental shift.
        Organisations that once relied on linear, process-driven models are now
        discovering that competitive advantage comes from the intersection of
        human expertise, intelligent technology, and data-led decision making.
      </p>

      <h3 className="insight-article__content-subheading">
        The Changing Nature of Enterprise Challenges
      </h3>

      <p className="insight-article__content-para">
        Customer expectations have never been higher. Digital-native competitors
        are setting new standards for speed, personalisation, and transparency —
        forcing traditional enterprises to rethink how they operate from the
        ground up. At the same time, regulatory complexity is increasing across
        every major market, adding further pressure to already stretched
        operational teams.
      </p>

      <p className="insight-article__content-para">
        Organisations that are succeeding in this environment share a common set
        of characteristics. They are investing in automation not to cut headcount
        but to redeploy talent to higher-value activities. They are using
        analytics not just to report on the past but to predict and shape the
        future. And they are designing customer experiences that build genuine
        loyalty rather than simply resolving transactions.
      </p>

      <h3 className="insight-article__content-subheading">
        Key Themes for Leaders
      </h3>

      <ul className="insight-article__content-list">
        <li>Intelligent automation creates capacity for human-led value creation, not replacement.</li>
        <li>Data-driven operations require investment in governance as much as technology.</li>
        <li>Customer experience is now a board-level priority, not just a contact centre metric.</li>
        <li>Ecosystem partnerships accelerate transformation more effectively than build-only approaches.</li>
        <li>ESG credentials are increasingly a factor in vendor and partner selection.</li>
      </ul>

      <p className="insight-article__content-para">
        The organisations that will define the next decade are those making these
        investments today — building the capabilities, the culture, and the
        technology foundations that will allow them to adapt continuously rather
        than react episodically.
      </p>

      <h3 className="insight-article__content-subheading">
        What This Means in Practice
      </h3>

      <p className="insight-article__content-para">
        For operational leaders, the implication is clear: the transformation
        agenda cannot be owned by IT alone. Business units must be active
        participants in identifying automation opportunities, validating
        analytical models, and designing the customer journeys that technology
        will ultimately deliver. Cross-functional collaboration is not a
        nice-to-have — it is the operating model of the future.
      </p>
    </div>
  );
}

/* ─── Related article card (compact) ────────────────────────────────────── */
function RelatedArticleCard({ slug, title, category, publishedDate, imageUrl }) {
  return (
    <div className="article-card">
      <div className="article-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="article-card__image" />
        ) : (
          <div className="article-card__image-placeholder">{IMG_ICN}</div>
        )}
        {category && (
          <span className="article-card__category-badge">{category}</span>
        )}
      </div>
      <div className="article-card__body">
        <h3 className="article-card__title">{title}</h3>
      </div>
      <div className="article-card__footer">
        <div className="article-card__meta">
          {CALENDAR_ICN}
          <span>{formatDate(publishedDate)}</span>
        </div>
        <Link to={`/insights/${slug}`} className="article-card__read-link">
          Read {ARROW_ICN}
        </Link>
      </div>
    </div>
  );
}

/* ─── Not found ──────────────────────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="insight-not-found">
      <h2 className="insight-not-found__title">Article Not Found</h2>
      <p className="insight-not-found__text">
        The article you are looking for does not exist or may have been moved.
      </p>
      <Link to="/insights" className="btn btn--primary">Back to Insights</Link>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function InsightDetailPage() {
  const { slug } = useParams();
  const [insight, setInsight]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cta, setCta]           = useState(FALLBACK_CTA);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    Promise.all([
      getInsightBySlug(slug),
      getAllInsights(),
    ])
      .then(([insRes, allRes]) => {
        setInsight(insRes.data);
        const others = (allRes.data || []).filter((a) => a.slug !== slug);
        const sameCategory = others.filter(
          (a) => a.category === insRes.data?.category,
        );
        const rest = others.filter((a) => a.category !== insRes.data?.category);
        setRelated([...sameCategory, ...rest].slice(0, 3));
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));

    getCtaSection('insight_detail')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});
  }, [slug]);

  if (loading)               return <Loader />;
  if (notFound || !insight)  return <NotFound />;

  const initials = getInitials(insight.author);

  return (
    <div className="insight-detail-page">

      {/* ── Hero ── */}
      <PageHero
        eyebrow={insight.category || 'Insights'}
        title={insight.title}
        description={insight.summary}
      >
        <Link to="/insights" className="insight-detail__back">
          {BACK_ARROW} Back to Insights
        </Link>
      </PageHero>

      {/* ── Article + Sidebar ── */}
      <section className="insight-article">
        <div className="insight-article__container">

          {/* Main */}
          <div className="insight-article__main">

            {/* Metadata Bar */}
            <div className="insight-article__meta">
              {insight.category && (
                <span className="insight-article__category-badge">{insight.category}</span>
              )}
              {insight.author && (
                <>
                  <span className="insight-article__meta-dot" />
                  <span className="insight-article__meta-item">
                    {USER_ICN} {insight.author}
                  </span>
                </>
              )}
              {insight.publishedDate && (
                <>
                  <span className="insight-article__meta-dot" />
                  <span className="insight-article__meta-item">
                    {CALENDAR_ICN} {formatDate(insight.publishedDate)}
                  </span>
                </>
              )}
              <span className="insight-article__meta-dot" />
              <span className="insight-article__meta-item">
                {CLOCK_ICN} {readingTime(insight.content)}
              </span>
            </div>

            {/* Hero Image */}
            {insight.imageUrl ? (
              <img
                src={insight.imageUrl}
                alt={insight.title}
                className="insight-article__hero-image"
              />
            ) : (
              <div className="insight-article__hero-placeholder">{IMG_ICN}</div>
            )}

            {/* Summary Pull Quote */}
            {insight.summary && (
              <blockquote className="insight-article__summary">
                {insight.summary}
              </blockquote>
            )}

            {/* Article Body */}
            <ArticleContent summary={insight.summary} />

            {/* Share Strip */}
            <div className="insight-article__share">
              <span className="insight-article__share-label">Share this article:</span>
              <button className="insight-article__share-btn">{LI_ICON} LinkedIn</button>
              <button className="insight-article__share-btn">{TW_ICON} Twitter</button>
            </div>

            {/* Author Block */}
            {insight.author && (
              <div className="insight-article__author">
                <div className="insight-article__author-avatar">{initials}</div>
                <div className="insight-article__author-info">
                  <span className="insight-article__author-label">Written by</span>
                  <span className="insight-article__author-name">{insight.author}</span>
                  <span className="insight-article__author-role">
                    Senior Analyst, Visionary Inspire
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="insight-article__sidebar">

            {/* CTA Card */}
            <div className="insight-sidebar-card">
              <span className="insight-sidebar-card__title">Get Expert Advice</span>
              <p className="insight-sidebar-card__cta-title">
                Ready to apply these insights in your organisation?
              </p>
              <p className="insight-sidebar-card__cta-text">
                Our specialists can help you design and implement solutions tailored
                to your specific business challenges.
              </p>
              <Link to="/contact" className="btn btn--primary">Speak to an Expert</Link>
            </div>

            {/* Category Tag */}
            {insight.category && (
              <div className="insight-sidebar-card">
                <span className="insight-sidebar-card__title">Category</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {TAG_ICN} {insight.category}
                </span>
                <Link
                  to={`/insights?category=${encodeURIComponent(insight.category)}`}
                  className="btn btn--outline"
                  style={{ fontSize: 'var(--font-size-xs)', padding: '0.5rem 1rem' }}
                >
                  More in {insight.category}
                </Link>
              </div>
            )}

          </aside>
        </div>
      </section>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <section className="insight-related">
          <div className="insight-related__container">
            <SectionHeading
              eyebrow="Keep Reading"
              title="Related Articles"
              subtitle="More insights from the Visionary Inspire research and editorial team."
            />
            <CardGrid columns={3}>
              {related.map((a) => (
                <RelatedArticleCard
                  key={a.id}
                  slug={a.slug}
                  title={a.title}
                  category={a.category}
                  publishedDate={a.publishedDate}
                  imageUrl={a.imageUrl}
                />
              ))}
            </CardGrid>
          </div>
        </section>
      )}

      <CTABanner
        title={cta.title}
        subtitle={cta.description}
        primaryLabel={cta.primaryButtonText}
        primaryTo={cta.primaryButtonUrl}
        secondaryLabel={cta.secondaryButtonText}
        secondaryTo={cta.secondaryButtonUrl}
      />
    </div>
  );
}
