interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className = ""
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className={`section-title ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      {description ? <p className="section-subtitle">{description}</p> : null}
    </div>
  );
}
