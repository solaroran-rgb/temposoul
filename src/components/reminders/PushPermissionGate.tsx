import React from 'react';
import { usePushSettings } from '../../hooks/usePushSettings';

export const PushPermissionGate: React.FC = () => {
  const { pushState, prefs, requestPermission, updatePref } = usePushSettings();

  if (pushState === 'unsupported') {
    return (
      <div className="push-gate">
        <div className="push-gate__hint">
          💡您的浏览器当前不支持WebPush。请将本站<b>添加到主屏幕</b>，以获取完整的每日运势提醒体验。
        </div>
        <div className="push-gate__fallback">
          <label className="push-gate__toggle-label">
            <input
              type="checkbox"
              checked={prefs.dailyRedDot}
              onChange={(e) => updatePref('dailyRedDot', e.target.checked)}
            />
            <span>开启应用内每日签到红点提醒</span>
          </label>
        </div>
      </div>
    );
  }

  if (pushState === 'denied') {
    return (
      <div className="push-gate">
        <p className="push-gate__text">您已拒绝通知权限。请在系统设置中允许本站发送通知。</p>
      </div>
    );
  }

  if (pushState === 'granted') {
    return (
      <div className="push-gate">
        <div className="push-gate__option">
          <label className="push-gate__toggle-label">
            <input
              type="checkbox"
              checked={prefs.almanac}
              onChange={(e) => updatePref('almanac', e.target.checked)}
            />
            <span>每日黄历提醒</span>
          </label>
        </div>
        <div className="push-gate__option">
          <label className="push-gate__toggle-label">
            <input
              type="checkbox"
              checked={prefs.astrology}
              onChange={(e) => updatePref('astrology', e.target.checked)}
            />
            <span>每日星座运势提醒</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="push-gate">
      <button className="push-gate__btn" onClick={requestPermission}>
        开启浏览器通知权限
      </button>
    </div>
  );
};

export default PushPermissionGate;
