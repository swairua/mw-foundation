import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImage, getMedia, imageUrl, srcSet } from "@/lib/images";
import { IS_PRODUCTION, isTodo, todoLabel } from "@/lib/content";
import { cx, useInView } from "@/lib/hooks";

/** Renders "*text*" segments as italic serif accent words. */
export function Accent({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 ? <em key={i} className="accent">{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("eyebrow", className)}>{children}</p>;
}

/** Shows content values; values starting with TODO render as a highlighted placeholder (hidden in production). */
export function T({ value, fallback = null }: { value: string | null | undefined; fallback?: ReactNode }) {
  if (value == null || value === "") return <>{fallback}</>;
  if (isTodo(value)) {
    return IS_PRODUCTION ? <>{fallback}</> : <span className="todo">[{todoLabel(value)}]</span>;
  }
  return <>{value}</>;
}

export function Placeholder({ children }: { children: ReactNode }) {
  return IS_PRODUCTION ? null : <span className="todo">[{children}]</span>;
}

type ImgProps = {
  src: string;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  focus?: string;
  style?: CSSProperties;
};

export function Img({ src, alt, sizes, className, priority, fill, focus, style }: ImgProps) {
  const img = getImage(src);
  const info = getMedia(src);
  if (!img) return null;
  return (
    <img
      src={imageUrl(src, 1200)}
      srcSet={srcSet(src)}
      sizes={sizes}
      width={img.w}
      height={img.h}
      alt={alt ?? info.alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      // @ts-expect-error -- fetchpriority is valid HTML; React 18 passes it through lowercase
      fetchpriority={priority ? "high" : undefined}
      className={cx(fill && "absolute inset-0 h-full w-full object-cover", className)}
      style={{ objectPosition: focus ?? info.focus ?? "50% 50%", backgroundColor: img.color, ...style }}
    />
  );
}

type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  variant?: "gold" | "forest" | "outline" | "outline-light";
  size?: "sm" | "md";
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

export function ButtonLink({ to, children, variant = "gold", size = "md", arrow = true, className, onClick }: ButtonLinkProps) {
  const cls = cx("btn", `btn-${variant}`, size === "sm" && "btn-sm", className);
  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden className="arrow" strokeWidth={2} />}
    </>
  );
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={cls} onClick={onClick} rel={to.startsWith("http") ? "noopener noreferrer" : undefined}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} onClick={onClick}>
      {content}
    </Link>
  );
}

export function ArrowLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cx("link-arrow", className)}>
      {children}
      <ArrowRight aria-hidden strokeWidth={2} />
    </Link>
  );
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...rest
}: { as?: ElementType; delay?: number; className?: string; children: ReactNode } & Record<string, unknown>) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cx("reveal", inView && "is-visible", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: H = "h2",
  className,
  action,
  id,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "split";
  as?: "h1" | "h2";
  className?: string;
  action?: ReactNode;
}) {
  if (align === "split") {
    return (
      <div className={cx("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
        <div className="lg:col-span-7">
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <H id={id} className="text-display-md">
            <Accent text={title} />
          </H>
        </div>
        <div className="lg:col-span-5 lg:pb-1">
          {intro && <div className="text-lead text-ink-soft">{intro}</div>}
          {action && <div className="mt-6">{action}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className={cx("max-w-3xl", className)}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <H id={id} className="text-display-md">
        <Accent text={title} />
      </H>
      {intro && <div className="mt-6 text-lead text-ink-soft">{intro}</div>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
