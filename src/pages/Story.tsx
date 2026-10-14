import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Img } from "@/components/ui";
import { Breadcrumbs, ShareLinks, StoryCard, StoryMetaLine, VideoBlock } from "@/components/sections";
import NotFound from "./NotFound";
import { Seo, breadcrumbLd } from "@/lib/head";
import { getStoryBody, loadStoryBody } from "@/lib/bodies";
import { formatDate, pillarBySlug, pillarPath, relatedStories, SITE_URL, site, storyBySlug, storyPath } from "@/lib/content";
import { getImage, getMedia, ogImageUrl } from "@/lib/images";
import { track } from "@/lib/analytics";

export default function StoryPage() {
  const { slug = "" } = useParams();
  const story = storyBySlug.get(slug);
  const [body, setBody] = useState<string | undefined>(() => getStoryBody(slug));

  useEffect(() => {
    let alive = true;
    const cached = getStoryBody(slug);
    if (cached) setBody(cached);
    else {
      setBody(undefined);
      loadStoryBody(slug).then((html) => alive && setBody(html));
    }
    return () => {
      alive = false;
    };
  }, [slug]);

  if (!story) return <NotFound />;

  const path = storyPath(story.slug);
  const primary = story.pillars[0] ? pillarBySlug.get(story.pillars[0]) : undefined;
  const related = relatedStories(story, 3);
  const isFrench = story.slug.startsWith("the-french-initiative");
  const caption = story.image ? getMedia(story.image) : null;
  const cover = story.image ? getImage(story.image) : null;
  const lowRes = Boolean(cover && cover.w < 1000);
  const mosaic = lowRes && story.gallery.length >= 2 ? [story.image!, ...story.gallery.slice(0, 2)] : null;
  const gallery = mosaic ? story.gallery.slice(2) : story.gallery;

  return (
    <>
      <Seo
        title={story.title}
        description={story.standfirst ?? story.excerpt}
        path={path}
        image={story.image}
        imageAlt={story.imageAlt ?? undefined}
        type="article"
        publishedTime={story.date}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": story.kind === "Field report" ? "NewsArticle" : "Article",
            headline: story.title,
            description: story.standfirst ?? story.excerpt,
            datePublished: story.date,
            image: story.image ? [`${SITE_URL}${ogImageUrl(story.image)}`] : undefined,
            mainEntityOfPage: `${SITE_URL}${path}`,
            author: { "@type": "Organization", name: site.name, url: SITE_URL },
            publisher: { "@id": `${SITE_URL}/#organization` },
            articleSection: primary?.name,
            inLanguage: "en-KE",
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "News & Stories", path: "/news" },
            { name: story.title, path },
          ]),
        ]}
      />

      <article>
        <header className="shell pb-10 pt-6 sm:pt-8 lg:pt-10">
          <div className="mx-auto max-w-4xl">
            <Breadcrumbs items={[{ name: "News & Stories", path: "/news" }, ...(primary ? [{ name: primary.name, path: `/news?pillar=${primary.slug}` }] : [])]} />
            <StoryMetaLine story={story} />
            <h1 className="mt-5 text-display-lg">{story.title}</h1>
            {(story.standfirst ?? story.excerpt) && <p className="mt-6 max-w-3xl text-lead text-ink-soft">{story.standfirst ?? story.excerpt}</p>}
            <div className="mt-8 flex flex-col gap-5 border-t border-forest-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-mute">
                <time dateTime={story.date}>{formatDate(story.date)}</time> · {story.readingMinutes} min read · {site.name}
              </p>
              <ShareLinks title={story.title} path={path} />
            </div>
          </div>
        </header>

        {mosaic && (
          <figure className="shell">
            <ul className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3 sm:gap-4">
              {mosaic.map((m, i) => (
                <li key={m} className={i === 0 ? "" : "hidden sm:block"}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-forest-100">
                    <Img src={m} alt={i === 0 ? story.imageAlt ?? undefined : undefined} fill priority={i === 0} sizes="(min-width: 640px) 33vw, 100vw" />
                  </div>
                </li>
              ))}
            </ul>
            {caption?.caption && <figcaption className="mx-auto mt-3 max-w-6xl text-sm text-ink-mute">{caption.caption}</figcaption>}
          </figure>
        )}
        {story.image && !mosaic && (
          <figure className="shell">
            <div className={"relative mx-auto aspect-[16/9] overflow-hidden rounded-card bg-forest-100 " + (lowRes ? "max-w-3xl" : "max-w-6xl")}>
              <Img src={story.image} alt={story.imageAlt ?? undefined} fill priority sizes="(min-width: 1280px) 1150px, 100vw" />
            </div>
            {(caption?.caption || caption?.credit === "Pexels") && (
              <figcaption className={"mx-auto mt-3 text-sm text-ink-mute " + (lowRes ? "max-w-3xl" : "max-w-6xl")}>
                {caption?.caption ?? "Illustrative image"}
                {caption?.credit === "Pexels" && <span> · Stock photograph</span>}
              </figcaption>
            )}
          </figure>
        )}

        <div className="shell py-14 lg:py-20">
          {body ? (
            <div className="prose-story" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <div className="prose-story" aria-busy="true">
              <p className="text-ink-mute">Loading story…</p>
            </div>
          )}

          {isFrench && (
            <div className="on-dark mx-auto mt-16 max-w-4xl rounded-card bg-forest-950 p-5 sm:p-8">
              <VideoBlock
                src="/media/french-initiative-performance.mp4"
                poster="french-initiative-performance"
                title="French Initiative beneficiaries performing"
                caption="Beneficiaries of the French Initiative. Faces are blurred to protect the children."
              />
            </div>
          )}

          {gallery.length > 0 && (
            <section aria-label="Photo gallery" className="mx-auto mt-16 max-w-6xl">
              <Eyebrow className="mb-6">In pictures</Eyebrow>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {gallery.map((g) => (
                  <li key={g}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-forest-100">
                        <Img src={g} fill sizes="(min-width: 1024px) 280px, 50vw" />
                      </div>
                      {getMedia(g).caption && <figcaption className="mt-2 text-xs text-ink-mute">{getMedia(g).caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="mx-auto mt-16 max-w-prose border-t border-forest-900/10 pt-8">
            <p className="text-sm font-semibold text-forest-900">Filed under</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {story.pillars.map((p) => {
                const pl = pillarBySlug.get(p);
                return pl ? (
                  <li key={p}>
                    <Link to={pillarPath(p)} className="chip">{pl.name}</Link>
                  </li>
                ) : null;
              })}
            </ul>
            <div className="on-dark mt-10 rounded-card bg-forest-900 p-7 sm:p-9">
              <h2 className="text-[1.5rem] leading-snug text-cream-50">Help make the next story possible.</h2>
              <p className="mt-2 text-cream-50/75">Your gift or your time goes straight into programmes like this one.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/get-involved" className="btn btn-gold" onClick={() => track("Donate CTA", { location: "story", story: story.slug })}>
                  Donate <ArrowRight aria-hidden className="arrow" />
                </Link>
                <Link to="/get-involved/volunteer" className="btn btn-outline-light">Volunteer</Link>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section border-t border-forest-900/10 bg-cream-150" aria-labelledby="related-heading">
          <div className="shell">
            <h2 id="related-heading" className="text-display-sm">Related stories</h2>
            <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
