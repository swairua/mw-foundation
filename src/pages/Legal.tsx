import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { Seo } from "@/lib/head";
import { getPageBody, loadPageBody } from "@/lib/bodies";

const DOCS = {
  "privacy-policy": { title: "Privacy Policy", description: "How the Mercy Wanjau Foundation collects, uses and protects personal information, in line with Kenya's Data Protection Act, 2019." },
  "terms-of-use": { title: "Terms of Use", description: "The terms that apply when you use mw-foundation.org." },
} as const;

export default function Legal({ doc }: { doc: keyof typeof DOCS }) {
  const meta = DOCS[doc];
  const [body, setBody] = useState(() => getPageBody(doc));
  useEffect(() => {
    if (!getPageBody(doc)) loadPageBody(doc).then(setBody);
    else setBody(getPageBody(doc));
  }, [doc]);

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={`/${doc}`} />
      <section className="shell pb-24 pt-6 sm:pt-8 lg:pt-10">
        <div className="mx-auto max-w-prose">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: meta.title }]} />
          <Eyebrow className="mb-6">Legal</Eyebrow>
          <h1 className="text-display-lg">{meta.title}</h1>
        </div>
        <div className="mt-12">
          {body ? <div className="prose-story" dangerouslySetInnerHTML={{ __html: body }} /> : <p className="prose-story text-ink-mute">Loading…</p>}
        </div>
      </section>
    </>
  );
}
