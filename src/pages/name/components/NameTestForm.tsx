/**
 * 姓名测试输入表单（契约 v3.2 §6：输入类沿用表单模式；本表单字段与 PersonForm 不同，
 * 采用 React 19 受控状态 + zod 校验，出生日期为可选且默认不落库）
 */
import React, { useState } from 'react';
import { z } from 'zod';
import { SegmentedControl } from '../../../components/SegmentedControl';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';
import type { NameInput, NameType, ScriptSystem } from '@temposoul/core/onomastics';
type Dialect = NameInput['dialect'];

const HAN_RE = /^[㐀-䶿一-鿿]+$/;
const LATIN_RE = /^[A-Za-zÀ-ÿĀ-ž\s'.-]+$/;

const NameInputSchema = z.object({
  surname: z.string().min(1),
  given: z.string().min(1),
  type: z.enum(['person', 'company', 'pet']),
  script: z.enum(['han', 'latin']),
  gender: z.enum(['male', 'female']).optional(),
  dialect: z.enum(['mandarin', 'cantonese', 'wu', 'minnan']).optional(),
  birthDate: z.string().optional(),
});

export interface NameTestFormProps {
  onSubmit: (input: NameInput) => void;
  loading?: boolean;
}

export function NameTestForm({ onSubmit, loading }: NameTestFormProps): React.ReactElement {
  const { t } = useNameI18n();
  const [surname, setSurname] = useState('');
  const [given, setGiven] = useState('');
  const [type, setType] = useState<NameType>('person');
  const [script, setScript] = useState<ScriptSystem>('han');
  const [dialect, setDialect] = useState<Dialect>('mandarin');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = {
      surname: surname.trim(),
      given: given.trim(),
      type,
      script,
      dialect,
      birthDate: birthDate || undefined,
    };
    const parsed = NameInputSchema.safeParse(value);
    if (!parsed.success) {
      setError(t('form.error.required'));
      return;
    }
    const re = script === 'han' ? HAN_RE : LATIN_RE;
    if (!re.test(value.surname) || !re.test(value.given)) {
      setError(script === 'han' ? t('form.error.hanOnly') : t('form.error.latinOnly'));
      return;
    }
    if (`${value.surname}${value.given}`.length > 20) {
      setError(t('form.error.tooLong'));
      return;
    }
    setError(null);
    onSubmit({ ...parsed.data, birthDate: value.birthDate || undefined });
  };

  return (
    <form className="name-test-form" onSubmit={submit} noValidate>
      <div className="name-test-form__row">
        <label className="name-test-form__label" htmlFor="surname">
          {t('form.surname')}
        </label>
        <input
          id="surname"
          className="name-test-form__input"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          maxLength={12}
          autoComplete="off"
          placeholder={t('form.surnamePlaceholder')}
        />
      </div>
      <div className="name-test-form__row">
        <label className="name-test-form__label" htmlFor="given">
          {t('form.given')}
        </label>
        <input
          id="given"
          className="name-test-form__input"
          value={given}
          onChange={(e) => setGiven(e.target.value)}
          maxLength={16}
          autoComplete="off"
          placeholder={t('form.givenPlaceholder')}
        />
      </div>
      <div className="name-test-form__row">
        <span className="name-test-form__label">{t('form.type')}</span>
        <SegmentedControl
          value={type}
          onChange={(v: string) => setType(v as NameType)}
          options={[
            { value: 'person', label: t('form.type.person') },
            { value: 'company', label: t('form.type.company') },
            { value: 'pet', label: t('form.type.pet') },
          ]}
        />
      </div>
      <div className="name-test-form__row">
        <span className="name-test-form__label">{t('form.script')}</span>
        <SegmentedControl
          value={script}
          onChange={(v: string) => setScript(v as ScriptSystem)}
          options={[
            { value: 'han', label: t('form.script.han') },
            { value: 'latin', label: t('form.script.latin') },
          ]}
        />
      </div>
      {script === 'han' && (
        <div className="name-test-form__row">
          <label className="name-test-form__label" htmlFor="dialect">
            {t('form.dialect')}
          </label>
          <select
            id="dialect"
            className="name-test-form__input"
            value={dialect}
            onChange={(e) => setDialect(e.target.value as Dialect)}
          >
            <option value="mandarin">{t('dialect.mandarin')}</option>
            <option value="cantonese">{t('dialect.cantonese')}</option>
            <option value="wu">{t('dialect.wu')}</option>
            <option value="minnan">{t('dialect.minnan')}</option>
          </select>
        </div>
      )}
      <div className="name-test-form__row">
        <label className="name-test-form__label" htmlFor="birthDate">
          {t('form.birthDate')}
          <span className="name-test-form__hint">{t('form.birthDateHint')}</span>
        </label>
        <input
          id="birthDate"
          type="date"
          className="name-test-form__input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      {error && (
        <p className="name-test-form__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="name-test-form__submit" disabled={loading}>
        {loading ? t('form.submitting') : t('form.submit')}
      </button>
    </form>
  );
}

export default NameTestForm;
