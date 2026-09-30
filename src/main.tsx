import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from '@/i18n';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { registerServiceWorker } from './registerServiceWorker';
import { initErrorTracking } from '@/lib/client/errlog';
import './styles.css';
import './styles/features.css';
import './styles/print.css';

// 全局未捕获错误/未处理 Promise 拒绝埋点（仅生产、采样 10%、不含个人信息）
initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>,
);

registerServiceWorker();
