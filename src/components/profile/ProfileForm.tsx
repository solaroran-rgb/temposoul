// D9-3
// src/components/profile/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/profile';

interface Props {
  initial?: UserProfile;
  onSave: (p: Omit<UserProfile, 'id'> | UserProfile) => void;
  onCancel: () => void;
}

export const ProfileForm: React.FC<Props> = ({ initial, onSave, onCancel }) => {
  const [city, setCity] = useState(initial?.location?.cityName ?? '');

  const [form, setForm] = useState<Omit<UserProfile, 'id'>>({
    name: initial?.name || '',
    relation: initial?.relation || 'self',
    isDefault: initial?.isDefault || false,
    gender: initial?.gender || '',
    dateType: initial?.dateType || 'solar',
    year: initial?.year || 1990,
    month: initial?.month || 1,
    day: initial?.day || 1,
    timeIndex: initial?.timeIndex || 0,
    location: initial?.location,
  });

  const location = form.location;


  // 当 useBirthPlace 解析出真实经纬度时，自动同步到表单
  useEffect(() => {
    if (location && city) {
      setForm((prev) => ({
        ...prev,
        location: {
          cityName: city,
          latitude: location.latitude,
          longitude: location.longitude,
          timeZoneId: location.timeZoneId || 'Asia/Shanghai',
        },
      }));
    } else if (!city) {
      setForm((prev) => ({ ...prev, location: undefined }));
    }
  }, [location, city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      onSave({ ...form, id: initial.id } as UserProfile);
    } else {
      onSave(form);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">档案名称</label>
        <input
          className="form-input"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">关系</label>
        <select
          className="form-select"
          value={form.relation}
          onChange={(e) =>
            setForm({ ...form, relation: e.target.value as UserProfile['relation'] })
          }
        >
          <option value="self">自己</option>
          <option value="family">家人</option>
          <option value="friend">朋友</option>
          <option value="child">孩子</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">性别</label>
        <select
          className="form-select"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value as UserProfile['gender'] })}
        >
          <option value="">未知/不填</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">历法</label>
        <select
          className="form-select"
          value={form.dateType}
          onChange={(e) =>
            setForm({ ...form, dateType: e.target.value as UserProfile['dateType'] })
          }
        >
          <option value="solar">公历</option>
          <option value="lunar">农历</option>
        </select>
      </div>
      <div className="form-row">
        <input
          type="number"
          className="form-input"
          placeholder="年"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: +e.target.value })}
        />
        <input
          type="number"
          className="form-input"
          placeholder="月"
          min={1}
          max={12}
          value={form.month}
          onChange={(e) => setForm({ ...form, month: +e.target.value })}
        />
        <input
          type="number"
          className="form-input"
          placeholder="日"
          min={1}
          max={31}
          value={form.day}
          onChange={(e) => setForm({ ...form, day: +e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">时辰 (0-12)</label>
        <input
          type="number"
          className="form-input"
          min={0}
          max={12}
          value={form.timeIndex}
          onChange={(e) => setForm({ ...form, timeIndex: +e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">出生城市 (用于真太阳时校正)</label>
        <input
          className="form-input"
          placeholder="如：北京市"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {location && (
          <p className="form-hint">
            已定位: {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
          </p>
        )}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn btn-primary">
          保存
        </button>
      </div>
    </form>
  );
};
