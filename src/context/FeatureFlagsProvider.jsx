import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultDemoContext,
  FeatureFlagService,
  FLAG_DEFAULTS,
  FLAG_KEYS,
} from '../lib/launchdarkly/FeatureFlagService';

const FeatureFlagsContext = createContext(null);

/**
 * Wires the {@link FeatureFlagService} to React: one client, identify on demo context
 * changes, and re-read flag values on `ready` and `change`.
 */
export function FeatureFlagsProvider({ clientSideId, children }) {
  const effectiveId = clientSideId || import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID;
  const service = useMemo(
    () => new FeatureFlagService(effectiveId, defaultDemoContext()),
    [effectiveId],
  );

  const [ready, setReady] = useState(false);
  const [flags, setFlags] = useState(() => {
    if (!service.isConfigured()) {
      return { ...FLAG_DEFAULTS };
    }
    return { ...FLAG_DEFAULTS, ...service.getFlagsSnapshot() };
  });

  const refresh = useCallback(() => {
    if (!service.isConfigured() || !service.getClient()) {
      setFlags({ ...FLAG_DEFAULTS });
      return;
    }
    setFlags(service.getFlagsSnapshot());
  }, [service]);

  useEffect(() => {
    return () => {
      service.close();
    };
  }, [service]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReady(false);
      await service.connect();
      if (cancelled) {
        return;
      }
      refresh();
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [service, refresh]);

  useEffect(() => {
    const onChange = () => refresh();
    service.on('change', onChange);
    return () => {
      service.off('change', onChange);
    };
  }, [service, refresh]);

  const setDemoContext = useCallback(
    (patch) => {
      return (async () => {
        await service.setDemoContext(patch);
        refresh();
      })();
    },
    [service, refresh],
  );

  const value = useMemo(
    () => ({
      service,
      ready,
      flags: {
        [FLAG_KEYS.modernShipmentUi]:
          flags[FLAG_KEYS.modernShipmentUi] ?? FLAG_DEFAULTS[FLAG_KEYS.modernShipmentUi],
        [FLAG_KEYS.pricingInsights]:
          flags[FLAG_KEYS.pricingInsights] ?? FLAG_DEFAULTS[FLAG_KEYS.pricingInsights],
      },
      setDemoContext,
      ldConfigured: service.isConfigured(),
    }),
    [flags, ready, service, setDemoContext],
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
}

/**
 * @returns {{
 *   service: import('../lib/launchdarkly/FeatureFlagService').FeatureFlagService
 *   ready: boolean
 *   flags: Record<string, boolean>
 *   setDemoContext: (patch: import('../lib/launchdarkly/demoContextTypes').DemoContext) => Promise<void>
 *   ldConfigured: boolean
 * }}
 */
export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error('useFeatureFlags must be used under FeatureFlagsProvider');
  }
  return ctx;
}

export { FLAG_KEYS };
