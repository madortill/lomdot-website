import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import bases from "../data/bases.json";
import useFilteredCourses from "../hooks/useFilteredCourses";

export default function Courses({ courses, onOpenCourse }) {
  const filters = useFilteredCourses(courses);
  return <section className="catalog-page page-shell"><p className="eyebrow">מאגר הלומדות</p><h1>כל הלומדות</h1><CourseFilters {...filters} bases={bases} /><p className="result-count">{filters.filtered.length} לומדות נמצאו</p><div className="courses-grid">{filters.filtered.map((course) => <CourseCard key={course.id} course={course} onOpenCourse={onOpenCourse} />)}</div>{filters.filtered.length === 0 && <p className="empty-state">לא נמצאו לומדות שמתאימות לחיפוש ולסינון שבחרתם.</p>}</section>;
}
