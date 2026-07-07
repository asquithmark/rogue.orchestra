import type { CreditSegment } from "../data/tracks";

type CreditTextProps = {
  segments: CreditSegment[];
};

export function CreditText({ segments }: CreditTextProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.href ? (
          <a key={`${segment.href}-${index}`} href={segment.href} target="_blank" rel="noreferrer">
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}
