import { useId, useState } from 'react';
import { FLAG_KEYS, useFeatureFlags } from '../../context/FeatureFlagsProvider';
import { RatePricingBlock } from '../shared/RatePricingBlock';
import './legacy-shipment.css';

const senderLines = {
  name: 'NRG Media',
  co: 'NRG Media, LLC',
  street: '1234 Shipping Way, Suite 200',
  city: 'San Francisco, CA 94105',
};

export function LegacyShipmentView() {
  const { flags } = useFeatureFlags();
  const senderSelectId = useId();
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const showInsights = flags[FLAG_KEYS.pricingInsights] ?? true;

  return (
    <div className="legacy-app">
      <div className="legacy-menubar" role="banner">
        NRGship for UPS
      </div>
      <div className="legacy-toolbar" role="navigation" aria-label="Main actions">
        <div className="legacy-tb-item">
          <div className="legacy-tb-ico" aria-hidden>
            📦
          </div>
          New Shipment
        </div>
        <div className="legacy-tb-item">
          <div className="legacy-tb-ico" aria-hidden>
            🔍
          </div>
          History
        </div>
        <div className="legacy-tb-item">
          <div className="legacy-tb-ico" aria-hidden>
            ⚙
          </div>
          Preferences
        </div>
        <div className="legacy-tb-item">
          <div className="legacy-tb-ico address-book" aria-hidden>
            📇
          </div>
          Address Book
        </div>
      </div>

      <div className="legacy-form-wrap">
        <div className="legacy-block">
          <div className="legacy-block-label">Sender</div>
          <div className="legacy-block-content">
            <div className="legacy-label-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span id={senderSelectId} style={{ minWidth: 60 }}>
                Address
              </span>
              <select
                className="legacy-sel"
                id={senderSelectId}
                defaultValue="nrg"
                aria-label="Sender address"
              >
                <option value="nrg">NRG Account Address</option>
                <option value="other">Custom…</option>
              </select>
            </div>
            <div className="legacy-sender-detail">
              {senderLines.name}
              <br />
              {senderLines.co}
              <br />
              {senderLines.street}
              <br />
              {senderLines.city}
            </div>
          </div>
        </div>

        <div className="legacy-block">
          <div className="legacy-block-label">Recipient</div>
          <div className="legacy-block-content">
            <div className="legacy-addr-grid">
              <div>
                <label className="visually-hidden" htmlFor="legacy-recip">
                  Recipient address
                </label>
                <textarea
                  className="legacy-inset"
                  id="legacy-recip"
                  rows={4}
                  readOnly
                  defaultValue="Bob Newman&#10;Menger Hotel&#10;204 Alamo Plz, San Antonio, TX, 78205"
                />
                <div className="legacy-row">
                  <span className="legacy-label-sm">Phone</span>
                  <input className="legacy-inset" style={{ minHeight: 0, minWidth: 120 }} readOnly value="(210) 555-0182" />
                  <span className="legacy-label-sm">E-mail</span>
                  <input className="legacy-inset" style={{ minHeight: 0, flex: 1, minWidth: 140 }} readOnly value="bob@example.com" />
                </div>
                <div className="legacy-row legacy-cb">
                  <input type="checkbox" defaultChecked id="qvn" readOnly />
                  <label htmlFor="qvn">Send QuantumView&trade; Notifications</label>
                </div>
              </div>
              <div>
                <div className="legacy-pill" style={{ marginTop: 4 }}>
                  <span className="legacy-label-sm">Classification</span>
                  <span
                    className="legacy-inset"
                    style={{ minHeight: 22, display: 'inline-block', minWidth: 80 }}
                  >
                    Unknown
                  </span>
                </div>
                <div className="legacy-zip-row" style={{ marginTop: 8 }}>
                  <button type="button" className="legacy-btn" aria-label="Check ZIP">
                    Check ZIP
                  </button>
                  <span className="legacy-green" aria-label="ZIP valid">
                    Valid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="legacy-block">
          <div className="legacy-block-label">Billing</div>
          <div className="legacy-block-content">
            <div className="legacy-billing-row">
              <span className="legacy-label-sm">Bill to</span>
              <select className="legacy-sel" defaultValue="shipper" aria-label="Bill to">
                <option value="shipper">Shipper</option>
                <option value="receiver">Receiver</option>
                <option value="third">Third party</option>
              </select>
            </div>
          </div>
        </div>

        <div className="legacy-block last">
          <div className="legacy-block-label">Package</div>
          <div className="legacy-block-content">
            <div className="legacy-pkg-svc">
              <div className="legacy-label-sm">Service</div>
              <select className="legacy-sel" defaultValue="ground" style={{ minWidth: 200 }} aria-label="UPS service">
                <option value="ground">UPS Ground</option>
                <option value="red">UPS Next Day Air&reg;</option>
              </select>
              <div className="legacy-svc-hint">(3 business days, by end of day)</div>
            </div>
            <div className="legacy-pkg-bottom">
              <span className="legacy-label-sm">Package type</span>
              <select className="legacy-sel" defaultValue="pkg" style={{ minWidth: 120 }} aria-label="Package type">
                <option value="pkg">Package</option>
                <option value="letter">Letter</option>
              </select>
            </div>
            <div className="legacy-dims">
              <span className="legacy-label-sm">Weight</span>
              <input defaultValue="5.0" aria-label="Weight" readOnly />
              <button type="button" className="legacy-btn" aria-label="Weigh on scale">
                Weigh
              </button>
              <span className="legacy-label-sm">L</span>
              <input defaultValue="12" readOnly />
              <span className="legacy-label-sm">W</span>
              <input defaultValue="12" readOnly />
              <span className="legacy-label-sm">H</span>
              <input defaultValue="8" readOnly />
            </div>
            <div className="legacy-billing-row" style={{ marginTop: 6 }}>
              <span className="legacy-label-sm">Insured value</span>
              <input className="legacy-inset" style={{ minHeight: 22, maxWidth: 100 }} readOnly value="$0.00" />
            </div>
            <button type="button" className="legacy-wide-btn" aria-label="Additional service options">
              Additional Service Options&hellip;
            </button>
          </div>
        </div>

        <div className="legacy-rates">
          {showInsights && bubbleOpen && (
            <div className="legacy-bubble" role="region" aria-label="Rate details">
              <div className="legacy-z-badge" aria-hidden>
                2
              </div>
              <h4>Price details</h4>
              <div className="legacy-bubble-row">
                <span>Transportation</span>
                <span>$7.75</span>
              </div>
              <div className="legacy-bubble-row">
                <span>Service options</span>
                <span>$2.00</span>
              </div>
              <div className="legacy-bubble-total">
                <span>Total price</span>
                <span>$9.75</span>
              </div>
              <div className="legacy-bubble-x">
                <button
                  type="button"
                  className="legacy-btn"
                  onClick={() => setBubbleOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <div className="legacy-rate-box">
            <RatePricingBlock
              variant="legacy"
              showInsights={showInsights}
              compact
              onAfterGetRate={showInsights ? () => setBubbleOpen(true) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
