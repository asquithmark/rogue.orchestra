import type { CreditSegment } from "../data/tracks";

type CreditTextProps = {
  onLinkClick?: (segment: CreditSegment) => boolean;
  segments: CreditSegment[];
};

export function CreditText({ onLinkClick, segments }: CreditTextProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.href ? (
          <a
            key={`${segment.href}-${index}`}
            href={segment.href}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (onLinkClick?.(segment)) {
                event.preventDefault();
              }
            }}
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}
