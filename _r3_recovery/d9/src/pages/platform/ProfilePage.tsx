// D9-3
// src/pages/platform/ProfilePage.tsx
import React, { useState } from 'react';
import { useProfiles } from '../../contexts/ProfilesContext';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { UserProfile } from '../../types/profile';

export const ProfilePage: React.FC = () => {
  const { profiles, add, update, remove, setCurrent } = useProfiles();
  const [editing, setEditing] = useState<UserProfile | 'new' | null>(null);
  const [error, setError] = useState('');

  const handleSave = (data: Omit<UserProfile, 'id'> | UserProfile) => {
    if ('id' in data) {
      update(data as UserProfile);
    } else {
      const ok = add(data);
      if (!ok) {
        setError('档案数量已达上限 (20条)，请清理后重试。');
        return;
      }
    }
    setEditing(null);
    setError('');
  };

  if (editing) {
    return (
      <div className="profile-page">
        <h2>{editing === 'new' ? '新增档案' : '编辑档案'}</h2>
        {error && <p className="form-error" role="alert">{error}</p>}
        <ProfileForm 
          initial={editing === 'new' ? undefined : editing} 
          onSave={handleSave} 
          onCancel={() => setEditing(null)} 
        />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1>个人档案管理</h1>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>+ 新增档案</button>
      </div>

      <ul className="profile-list">
        {profiles.length === 0 ? (
          <li className="profile-list__empty">暂无档案，请点击上方按钮新增。</li>
        ) : (
          profiles.map(p => (
            <li key={p.id} className="profile-item">
              <div className="profile-item__info">
                <strong>{p.name}</strong> ({p.relation})
                <span className="profile-item__date">{p.dateType === 'solar' ? '公历' : '农历'} {p.year}-{p.month}-{p.day}</span>
              </div>
              <div className="profile-item__actions">
                <button className="btn btn-secondary" onClick={() => setCurrent(p.id)}>使用此档案</button>
                <button className="btn btn-secondary" onClick={() => setEditing(p)}>编辑</button>
                <button className="btn btn-danger" onClick={() => remove(p.id)}>删除</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
