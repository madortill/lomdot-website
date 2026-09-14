import { useEffect } from "react";

const platformText = (platforms) => {
  if (!platforms?.length) return "";
  if (platforms.length === 2) return "מותאמת למחשב ולטלפון";
  return platforms[0] === "mobile" ? "מותאמת לטלפון" : "מותאמת למחשב";
};

export default function CourseModal({ course, onClose }) {
  useEffect(() => {
    if (!course) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", closeOnEscape); };
  }, [course, onClose]);

  if (!course) return null;
  const tags = [course.year, course.baseName, platformText(course.platforms)].filter(Boolean);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="course-modal" role="dialog" aria-modal="true" aria-labelledby="course-title">
      <button className="modal-close" type="button" onClick={onClose} aria-label="סגירה">×</button>
      {course.cover
        ? <img className="modal-cover" src={course.cover} alt={`תמונת השער של ${course.title}`} />
        : <div className="modal-cover course-cover-placeholder" aria-hidden="true">טי״ל</div>}
      <div className="modal-content">
        <h2 id="course-title">{course.title}</h2>
        {tags.length > 0 && <div className="course-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
        {course.description && <p>{course.description}</p>}
        {course.developer && <p className="developer-name">פיתוח: {course.developer}</p>}
        <a className="primary-button" href={course.url} target="_blank" rel="noreferrer">מעבר ללומדה</a>
      </div>
    </section>
  </div>;
}
