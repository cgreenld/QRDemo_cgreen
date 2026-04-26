import './rate-pricing-block.css';

const TOTAL = '$9.75';

/**
 * @param {object} props
 * @param {'legacy' | 'modern'} props.variant
 * @param {boolean} [props.compact] legacy layout: tighter
 * @param {boolean} props.showInsights when false, “Get rate” only updates the simple total; no breakdown / analytics surface
 * @param {() => void} [props.onAfterGetRate] legacy: open the skeuomorphic bubble
 */
export function RatePricingBlock({ variant, compact, showInsights, onAfterGetRate }) {
  if (variant === 'modern') {
    return (
      <div className={`rpb-modern ${compact ? 'rpb-compact' : ''}`}>
        <div className="rpb-line">
          <span className="rpb-total" aria-label="Current rate">
            {TOTAL}
          </span>
          <span className="rpb-eyebrow" role="status">
            {showInsights ? 'Updated just now' : 'Tap Get rate to refresh'}
          </span>
        </div>
        <button
          type="button"
          className="rpb-btn-modern"
          onClick={onAfterGetRate}
        >
          Get rate
        </button>
      </div>
    );
  }

  return (
    <div className={`rpb-legacy ${compact ? 'rpb-compact' : ''}`}>
      <div className="legacy-rate-display" role="status">
        <span className="legacy-mag" title={showInsights ? 'Rate details available' : 'Simplified view'}>
          {showInsights ? '🔍' : '⏺'}
        </span>
        <span className="legacy-rate-total" aria-label="Current rate">
          {TOTAL}
        </span>
      </div>
      <button
        type="button"
        className="legacy-get-rate"
        onClick={onAfterGetRate}
        aria-label="Get shipping rate"
      >
        Get Rate
      </button>
    </div>
  );
}
