export default function CourseFilters({ query, setQuery, base, setBase, year, setYear, platform, setPlatform, sort, setSort, showBase = true, bases, years }) {
  return <div className="course-filters">
    <label className="filter-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי שם לומדה" /></label>
    <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="מיון"><option value="newest">מהחדש לישן</option><option value="oldest">מהישן לחדש</option><option value="az">לפי א׳–ת׳</option></select>
    {showBase && <select value={base} onChange={(event) => setBase(event.target.value)} aria-label="סינון לפי בהד"><option value="">כל הבה״דים</option>{bases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>}
    <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="סינון לפי שנה"><option value="">כל השנים</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
    <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="סינון לפי פלטפורמה"><option value="">כל הפלטפורמות</option><option value="desktop">מחשב</option><option value="mobile">טלפון</option></select>
  </div>;
}
