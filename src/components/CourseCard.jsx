export default function CourseCard({ course, onOpenCourse, featured = false }) {
  const metadata = [course.baseName, course.year].filter(Boolean).join(" · ");

  return <button className={`course-card ${featured ? "featured-card" : ""}`} type="button" onClick={() => onOpenCourse(course)}>
    {course.cover
      ? <img src={course.cover} alt="" />
      : <span className="course-cover-placeholder" aria-hidden="true">טי״ל</span>}
    <span className="course-card-title">{course.title}</span>
    {metadata && <small>{metadata}</small>}
  </button>;
}
