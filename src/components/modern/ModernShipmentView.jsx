import { FLAG_KEYS, useFeatureFlags } from '../../context/FeatureFlagsProvider';
import { RatePricingBlock } from '../shared/RatePricingBlock';
import './modern-shipment.css';

const ORIGIN = {
  name: 'NRG Media, LLC',
  line2: '1234 Shipping Way, Suite 200',
  city: 'San Francisco, CA 94105',
};

const DEST = {
  name: 'Bob Newman',
  line2: 'Menger Hotel — 204 Alamo Plz',
  city: 'San Antonio, TX 78205',
};

export function ModernShipmentView() {
  const { flags, setDemoContext, service } = useFeatureFlags();
  const showInsights = flags[FLAG_KEYS.pricingInsights] ?? true;
  const demo = service.getDemoContext();

  return (
    <div className="modern-app" role="application" aria-label="UPS shipment (demo)">
      <a className="modern-skip" href="#shipment-content">
        Skip to main content
      </a>
      <div className="modern-top" role="banner">
        <span>UPS&reg; Shipment (demo)</span>
        <span className="modern-badge">
          <span className="modern-badge-dot" aria-hidden />
          <span>Live</span>
        </span>
      </div>
      <div className="modern-hero" id="shipment-content" tabIndex={-1}>
        <h1>Route a package in one pass</h1>
        <p>Origin and destination, service, and rate in a single, touch-friendly view.</p>
        <p className="modern-addr--muted" style={{ marginTop: 8, fontSize: 12 }}>
          Hub <code style={{ color: 'inherit' }}>{demo.hubId}</code>
          {', '}
          <code style={{ color: 'inherit' }}>{demo.region}</code>
          <button
            type="button"
            className="rpb-btn-modern"
            style={{ marginLeft: 8, fontSize: 11, padding: '0.15rem 0.5rem' }}
            onClick={() => {
              const next =
                demo.hubId === 'hub-sat'
                  ? { hubId: 'hub-iah', region: 'US-CENTRAL' }
                  : { hubId: 'hub-sat', region: 'US-SOUTH' };
              return setDemoContext(next);
            }}
          >
            Switch hub
          </button>
        </p>
      </div>

      <div className="modern-lane" aria-label="Route">
        <span className="modern-pill" title="Origin">
          <span className="modern-pulse" />
          SFO
        </span>
        <span className="arrow" aria-hidden>
          →
        </span>
        <span className="modern-pill" title="Destination">
          SAT
        </span>
        <span className="modern-addr--muted" style={{ marginLeft: 4, fontSize: 12 }}>
          UPS Ground, est. 3 business days
        </span>
      </div>

      {showInsights && (
        <section className="modern-insights" aria-label="Package status">
          <div className="modern-card modern-card--insights">
            <h2>Package status (new)</h2>
            <p className="modern-addr--muted" style={{ margin: 0 }}>
              Shipment 1Z999AA1 tracking-style widget — <strong>only visible with pricing insights on.</strong>
            </p>
            <ul className="modern-timeline" aria-label="Stops and milestones">
              <li>
                <span>Picked up — San Francisco</span>
                <span className="when">Tue, 2:10 PM</span>
              </li>
              <li>
                <span>Departed DFW</span>
                <span className="when">Wed, 4:20 AM</span>
              </li>
              <li>
                <span>Out for delivery — San Antonio</span>
                <span className="when">Fri, by 6:00 PM (est.)</span>
              </li>
            </ul>
            <div className="modern-ledger" aria-label="Rate components">
              <div className="row">
                <span>Transportation</span>
                <span>$7.75</span>
              </div>
              <div className="row">
                <span>Service options</span>
                <span>$2.00</span>
              </div>
              <div className="row row--total">
                <span>Total (matches rate)</span>
                <span>$9.75</span>
              </div>
            </div>
            <p className="ok" style={{ margin: '0.3rem 0 0' }}>
              Shown when the pricing-insights flag is on.
            </p>
          </div>
        </section>
      )}

      <div className="modern-content" role="region" aria-label="Shipment details">
        <article className="modern-card" aria-label="From / To">
          <h2>Addresses</h2>
          <div className="modern-addr">
            <div>
              <em style={{ color: '#7a5f4f', fontSize: 11, fontStyle: 'normal' }}>From</em>
            </div>
            <div>{ORIGIN.name}</div>
            <div className="modern-addr--muted">{ORIGIN.line2}</div>
            <div className="modern-addr--muted">{ORIGIN.city}</div>
            <div style={{ marginTop: 10 }}>
              <em style={{ color: '#7a5f4f', fontSize: 11, fontStyle: 'normal' }}>To</em>
            </div>
            <div>{DEST.name}</div>
            <div className="modern-addr--muted">{DEST.line2}</div>
            <div className="modern-addr--muted">{DEST.city}</div>
          </div>
        </article>
        <article className="modern-card" aria-label="Service and package">
          <h2>Service &amp; package</h2>
          <div className="modern-svc">
            <span>UPS Ground</span>
            <em>Delivery by end of day, 3 business days</em>
          </div>
          <div className="modern-dims">
            <span>Weight: <span className="kbd">5.0</span> lb</span>
            <span>Dims: <span className="kbd">L12</span> <span className="kbd">W12</span> <span className="kbd">H8</span> in</span>
            <span>Declared: <span className="kbd">$0.00</span></span>
          </div>
        </article>
      </div>
      <div className="modern-rates modern-rates--card">
        <RatePricingBlock variant="modern" showInsights={showInsights} compact />
      </div>
    </div>
  );
}
