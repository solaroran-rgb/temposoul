import React from 'react';
import { PushPermissionGate } from '../../components/reminders/PushPermissionGate';

export const RemindersPage: React.FC = () => {
  return (
    <div className="reminders-page">
      <h2 className="reminders-page__title">每日提醒设置</h2>
      <p className="reminders-page__desc">
        管理您的运势与黄历推送偏好。所有设置仅保存在当前设备中。
      </p>
      <PushPermissionGate />
    </div>
  );
};

export default RemindersPage;
