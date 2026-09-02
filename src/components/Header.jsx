import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import bases from "../data/bases.json";

export default function Header({ courses, onOpenCourse }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [basesOpen, setBasesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const results = query.trim()
    ? courses.filter((course) => course.title.includes(query.trim())).slice(0, 6)
    : [];

  useEffect(() => {
    const close = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setQuery("");
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const closeMobile = () => {
    setMenuOpen(false);
    setBasesOpen(false);
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="עמוד הבית">
        <img src="assets/branding/til-logo.svg" alt="מדור טי״ל" />
      </Link>

      <nav className="desktop-nav" aria-label="ניווט ראשי">
        <NavLink to="/courses">מאגר הלומדות</NavLink>
        <div className="bases-menu" onMouseEnter={() => setBasesOpen(true)} onMouseLeave={() => setBasesOpen(false)}>
          <button type="button" aria-expanded={basesOpen} onClick={() => setBasesOpen((value) => !value)}>בה״דים</button>
          {basesOpen && <div className="bases-dropdown">{bases.map((base) => <NavLink key={base.id} to={`/bases/${base.id}`}>{base.name}</NavLink>)}</div>}
        </div>
        <NavLink to="/contact">צרו קשר</NavLink>
      </nav>

      <div className="global-search" ref={dropdownRef}>
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לומדה" aria-label="חיפוש לומדה" />
        {results.length > 0 && <div className="search-results">{results.map((course) => <button key={course.id} onClick={() => { onOpenCourse(course); setQuery(""); }}>{course.title}<small>{course.baseName} · {course.year}</small></button>)}</div>}
      </div>

      <button className="hamburger" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="פתיחת תפריט" aria-expanded={menuOpen}><span /><span /><span /></button>
      {menuOpen && <div className="mobile-drawer">
        <NavLink to="/courses" onClick={closeMobile}>מאגר הלומדות</NavLink>
        <button type="button" onClick={() => setBasesOpen((value) => !value)}>בה״דים</button>
        {basesOpen && <div className="mobile-bases">{bases.map((base) => <NavLink key={base.id} to={`/bases/${base.id}`} onClick={closeMobile}>{base.name}</NavLink>)}</div>}
        <NavLink to="/contact" onClick={closeMobile}>צרו קשר</NavLink>
      </div>}
    </header>
  );
}
