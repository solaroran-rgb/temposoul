// src/components/RouteFallback.tsx
export function RouteFallback() {
  return (
    <div className="route-fallback" aria-busy="true">
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}
