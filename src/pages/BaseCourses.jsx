import { useParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import bases from "../data/bases.json";
import useFilteredCourses from "../hooks/useFilteredCourses";

export default function BaseCourses({ courses, onOpenCourse }) {
  const { baseId } = useParams();
  const currentBase = bases.find((base) => base.id === baseId);
  const baseCourses = courses.filter((course) => course.baseId === baseId);
  const filters = useFilteredCourses(baseCourses, baseId);
  if (!currentBase) return <section className="catalog-page page-shell"><h1>הבה״ד לא נמצא</h1></section>;
  return <section className="catalog-page base-page page-shell"><img className="base-logo" src={currentBase.logo} alt="" /><h1>{currentBase.name}</h1><CourseFilters {...filters} bases={bases} showBase={false} /><p className="result-count">{filters.filtered.length} לומדות נמצאו</p><div className="courses-grid">{filters.filtered.map((course) => <CourseCard key={course.id} course={course} onOpenCourse={onOpenCourse} />)}</div>{filters.filtered.length === 0 && <p className="empty-state">עדיין אין לומדות מתאימות להצגה.</p>}</section>;
}
