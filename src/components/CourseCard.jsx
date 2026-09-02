export default function CourseCard({ course, onOpenCourse, featured = false }) {
  return <button className={`course-card ${featured ? "featured-card" : ""}`} type="button" onClick={() => onOpenCourse(course)}>
    <img src={course.cover} alt="" />
    <span className="course-card-title">{course.title}</span>
    <small>{course.baseName} · {course.year}</small>
  </button>;
}
