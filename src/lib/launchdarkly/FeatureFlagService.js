import { basicLogger, initialize } from 'launchdarkly-js-client-sdk';

/**
 * Centralizes the LaunchDarkly client and maps our demo context (user + location)
 * onto an LD user context. The UI should consume flags through {@link useFeatureFlags}.
 */
export const FLAG_KEYS = {
  /** When true, render the modern shipment UI; when false, legacy “NRGship” style. */
  modernShipmentUi: 'release-modern-shipment-ui',
  /**
   * When true, show the rate / pricing insights block (breakdown, delivery callout).
   * When false, that surface is removed.
   */
  pricingInsights: 'show-shipment-pricing-insights',
};

export const FLAG_DEFAULTS = {
  [FLAG_KEYS.modernShipmentUi]: false,
  [FLAG_KEYS.pricingInsights]: true,
};

const logger = basicLogger({ level: 'info' });

/**
 * @param {import('./demoContextTypes').DemoContext} demo
 */
function buildLDContext(demo) {
  return {
    kind: 'user',
    key: demo.userKey,
    name: demo.name,
    role: demo.role,
    hubId: demo.hubId,
    region: demo.region,
    market: demo.market,
  };
}

export class FeatureFlagService {
  /**
   * @param {string | undefined} clientSideId
   * @param {import('./demoContextTypes').DemoContext} [initialDemo]
   */
  constructor(clientSideId, initialDemo) {
    this._clientSideId = clientSideId;
    this._demo = initialDemo
      ? { ...defaultDemoContext(), ...initialDemo }
      : defaultDemoContext();
    this._client = null;
  }

  getClient() {
    return this._client;
  }

  getDemoContext() {
    return { ...this._demo };
  }

  isConfigured() {
    return Boolean(this._clientSideId);
  }

  /**
   * @returns {Promise<void>}
   */
  async connect() {
    if (!this._clientSideId) {
      this._client = null;
      return;
    }
    this._client = initialize(
      this._clientSideId,
      buildLDContext(this._demo),
      { logger },
    );
    await this._waitForReady();
  }

  _waitForReady() {
    if (!this._client) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this._client.on('failed', () => resolve());
      this._client.on('ready', () => resolve());
    });
  }

  /**
   * @param {import('./demoContextTypes').DemoContext} next
   */
  async setDemoContext(next) {
    this._demo = { ...this._demo, ...next };
    if (!this._client) {
      return;
    }
    return this._client.identify(buildLDContext(this._demo));
  }

  /**
   * @param {string} key
   * @param {boolean} defaultValue
   */
  getBoolean(key, defaultValue) {
    if (!this._client) {
      return defaultValue;
    }
    return this._client.variation(key, defaultValue);
  }

  getFlagsSnapshot() {
    return {
      [FLAG_KEYS.modernShipmentUi]: this.getBoolean(
        FLAG_KEYS.modernShipmentUi,
        FLAG_DEFAULTS[FLAG_KEYS.modernShipmentUi],
      ),
      [FLAG_KEYS.pricingInsights]: this.getBoolean(
        FLAG_KEYS.pricingInsights,
        FLAG_DEFAULTS[FLAG_KEYS.pricingInsights],
      ),
    };
  }

  on(event, fn) {
    this._client?.on(event, fn);
  }

  off(event, fn) {
    this._client?.off(event, fn);
  }

  close() {
    this._client?.close();
    this._client = null;
  }
}

export function defaultDemoContext() {
  return {
    userKey: 'ups-demo-sat',
    name: 'Demo operator',
    role: 'hub-clerk',
    hubId: 'hub-sat',
    region: 'US-SOUTH',
    market: 'small-business',
  };
}
