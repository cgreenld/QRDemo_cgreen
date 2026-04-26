import { FLAG_KEYS, FeatureFlagsProvider, useFeatureFlags } from './context/FeatureFlagsProvider';
import { LegacyShipmentView } from './components/legacy/LegacyShipmentView';
import { ModernShipmentView } from './components/modern/ModernShipmentView';
import './app.css';

const clientId = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID;

function ShipmentApp() {
  const { flags, ready, ldConfigured } = useFeatureFlags();
  const useModern = flags[FLAG_KEYS.modernShipmentUi] ?? false;
  const showLoading = ldConfigured && !ready;

  if (showLoading) {
    return (
      <div className="app-loading" aria-live="polite" aria-busy="true">
        Loading demo&hellip;
      </div>
    );
  }

  return (
    <>
      {useModern ? <ModernShipmentView /> : <LegacyShipmentView />}
      {!ldConfigured && (
        <p className="app-ld-hint" role="status">
          Add <code style={{ color: 'inherit' }}>VITE_LAUNCHDARKLY_CLIENT_ID</code> to <code style={{ color: 'inherit' }}>.env</code> for live
          flags. Until then: legacy layout + pricing insights on.
        </p>
      )}
    </>
  );
}

export default function App() {
  return (
    <FeatureFlagsProvider clientSideId={clientId}>
      <ShipmentApp />
    </FeatureFlagsProvider>
  );
}
