// src/components/names/NameFilterBar.tsx

interface Props {
  gender: 'male' | 'female' | 'all';
  setGender: (g: 'male' | 'female' | 'all') => void;
  keyword: string;
  setKeyword: (k: string) => void;
}

export default function NameFilterBar({ gender, setGender, keyword, setKeyword }: Props) {
  return (
    <div className="name-filter-bar">
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'all')}
        aria-label="性别筛选"
      >
        <option value="all">全部</option>
        <option value="male">男孩</option>
        <option value="female">女孩</option>
      </select>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索名字/寓意/拼音"
        aria-label="关键词搜索"
      />
    </div>
  );
}
