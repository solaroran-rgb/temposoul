import { useState, useEffect } from 'react';
import { safeStorage } from '@/lib/safe-storage';
import './PwaInstallBanner.css';

export interface PwaInstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
  isStandalone: boolean;
}

export function PwaInstallBanner({ onInstall, onDismiss, isStandalone }: PwaInstallBannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone) return;
    const dismissed = safeStorage.getJSON<boolean>('temposoul:pwa:install:dismissed', false);
    if (dismissed) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isStandalone]);

  if (!show) return null;

  const handleDismiss = () => {
    safeStorage.setJSON('temposoul:pwa:install:dismissed', true);
    setShow(false);
    onDismiss();
  };

  return (
    <div className="pwa-banner">
      <span>安装应用</span>
      <button onClick={onInstall}>安装</button>
      <button onClick={handleDismiss}>关闭</button>
    </div>
  );
}
