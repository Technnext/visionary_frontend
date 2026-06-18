import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import SectionHeading from '../components/common/SectionHeading';
import CardGrid from '../components/common/CardGrid';
import CTABanner from '../components/common/CTABanner';
import Loader from '../components/common/Loader';
import { getAllInsights, getFeaturedInsights } from '../services/insightsService';
import { getCtaSection } from '../services/ctaSectionService';
import { getHeroSection } from '../services/heroSectionService';
import '../css/insights-page.css';

const PAGE_SIZE = 6;

const FALLBACK_HERO = {
  eyebrow: 'Insights & Resources',
  title: 'Ideas, Research & Perspectives That Move Business Forward',
  subtitle: 'Explore our latest thinking on customer experience, intelligent automation, data analytics, and the trends shaping global enterprise operations.',
};

const FALLBACK_CTA = {
  title: 'Want the Latest Insights Delivered to Your Inbox?',
  description: 'Subscribe to our newsletter and stay ahead of the trends shaping your industry.',
  primaryButtonText: 'Get in Touch',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'View All Services',
  secondaryButtonUrl: '/services',
};

const SEARCH_ICON = (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const CALENDAR_ICON = (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const USER_ICON = (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IMG_ICON = (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const ARROW_ICON = (
  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const CHEVRON_L = (
  <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
);
const CHEVRON_R = (
  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
);

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function ArticleCard({ slug, title, summary, category, author, publishedDate, imageUrl }) {
  return (
    <div className="article-card">
      <div className="article-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="article-card__image" />
        ) : (
          <div className="article-card__image-placeholder">{IMG_ICON}</div>
        )}
        {category && (
          <span className="article-card__category-badge">{category}</span>
        )}
      </div>
      <div className="article-card__body">
        <h3 className="article-card__title">{title}</h3>
        {summary && <p className="article-card__summary">{summary}</p>}
      </div>
      <div className="article-card__footer">
        <div className="article-card__meta">
          {author && <>{USER_ICON}<span>{author}</span></>}
          {author && publishedDate && <span>&middot;</span>}
          {publishedDate && <>{CALENDAR_ICON}<span>{formatDate(publishedDate)}</span></>}
        </div>
        <Link to={`/insights/${slug}`} className="article-card__read-link">
          Read More {ARROW_ICON}
        </Link>
      </div>
    </div>
  );
}

function FeaturedSpotlight({ article }) {
  if (!article) return null;
  return (
    <div className="insights-featured__card">
      <div className="insights-featured__image-wrap">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="insights-featured__image" />
        ) : (
          <div className="insights-featured__image-placeholder">{IMG_ICON}</div>
        )}
        <span className="insights-featured__badge">Featured</span>
      </div>
      <div className="insights-featured__content">
        {article.category && (
          <span className="insights-featured__category">{article.category}</span>
        )}
        <h2 className="insights-featured__title">{article.title}</h2>
        {article.summary && (
          <p className="insights-featured__summary">{article.summary}</p>
        )}
        <div className="insights-featured__meta">
          {article.author && (
            <span className="insights-featured__meta-item">
              {USER_ICON} {article.author}
            </span>
          )}
          {article.author && article.publishedDate && (
            <span className="insights-featured__meta-dot" />
          )}
          {article.publishedDate && (
            <span className="insights-featured__meta-item">
              {CALENDAR_ICON} {formatDate(article.publishedDate)}
            </span>
          )}
        </div>
        <Link to={`/insights/${article.slug}`} className="btn btn--primary insights-featured__cta">
          Read Article {ARROW_ICON}
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="insights-empty">
      <div className="insights-empty__icon">{SEARCH_ICON}</div>
      <h3 className="insights-empty__title">
        {filtered ? 'No matching articles found' : 'No articles available'}
      </h3>
      <p className="insights-empty__text">
        {filtered
          ? 'Try a different category or search term.'
          : 'Check back soon for new insights and resources.'}
      </p>
    </div>
  );
}

export default function InsightsPage() {
  const [articles, setArticles]     = useState([]);
  const [featured, setFeatured]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActive] = useState('All');
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [cta, setCta]               = useState(FALLBACK_CTA);
  const [hero, setHero]             = useState(FALLBACK_HERO);

  useEffect(() => {
    Promise.all([getAllInsights(), getFeaturedInsights()])
      .then(([allRes, featRes]) => {
        setArticles(allRes.data || []);
        const featList = featRes.data || [];
        setFeatured(featList.length > 0 ? featList[0] : null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    getCtaSection('insights')
      .then((res) => { if (res.data) setCta(res.data); })
      .catch(() => {});

    getHeroSection('insights')
      .then((res) => { if (res.data) setHero(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const categories = useMemo(
    () => ['All', ...new Set(articles.map((a) => a.category).filter(Boolean))],
    [articles],
  );

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q) ||
          a.author?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [articles, activeCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = activeCategory !== 'All' || search.trim() !== '';

  return (
    <div className="insights-page">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.subtitle}
      />

      {/* ── Featured Spotlight ── */}
      {!loading && featured && (
        <section className="insights-featured">
          <div className="insights-featured__container">
            <SectionHeading eyebrow="Featured" title="Editor's Pick" />
            <FeaturedSpotlight article={featured} />
          </div>
        </section>
      )}

      {/* ── Toolbar: Tabs + Search ── */}
      <div className="insights-toolbar">
        <div className="insights-toolbar__container">
          <div className="insights-toolbar__tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`insights-toolbar__tab${activeCategory === cat ? ' insights-toolbar__tab--active' : ''}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="insights-toolbar__search">
            {SEARCH_ICON}
            <input
              type="text"
              className="insights-toolbar__search-input"
              placeholder="Search articles&hellip;"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search insights"
            />
          </div>
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <section className="insights-grid-section">
        <div className="insights-grid-section__container">
          <SectionHeading
            eyebrow={activeCategory === 'All' ? 'All Insights' : activeCategory}
            title={
              search.trim()
                ? `Results for "${search}"`
                : activeCategory === 'All'
                ? 'Latest Insights'
                : `${activeCategory} Articles`
            }
            subtitle={`${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          />

          {loading ? (
            <Loader />
          ) : paginated.length === 0 ? (
            <EmptyState filtered={isFiltered} />
          ) : (
            <CardGrid columns={3}>
              {paginated.map((article) => (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  summary={article.summary}
                  category={article.category}
                  author={article.author}
                  publishedDate={article.publishedDate}
                  imageUrl={article.imageUrl}
                />
              ))}
            </CardGrid>
          )}

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="insights-pagination">
              <button
                className="insights-pagination__btn insights-pagination__btn--nav"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                {CHEVRON_L}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`insights-pagination__btn${page === p ? ' insights-pagination__btn--active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                className="insights-pagination__btn insights-pagination__btn--nav"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                {CHEVRON_R}
              </button>
            </div>
          )}
        </div>
      </section>

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
