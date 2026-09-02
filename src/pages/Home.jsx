import { Link } from "react-router-dom";
import About from "../components/About";
import CourseCard from "../components/CourseCard";
import ProcessSteps from "../components/ProcessSteps";
import Footer from "../components/Footer";
import settings from "../data/siteSettings.json";

export default function Home({ courses, onOpenCourse }) {
  const featured = settings.featuredCourseIds.map((id) => courses.find((course) => course.id === id)).filter(Boolean);

  return <>
    <section className="home-hero page-shell">
      <About />
      <div className="hero-copy"><h1>לומדות במדור טי״ל</h1><p>המקום להכיר את הלומדות שפיתחנו, לחפש תוצרים קיימים, לראות מה כבר נעשה ולקבל השראה למה שאפשר ליצור יחד</p></div>
      <Link className="featured-heading" to="/courses">התוצרים שלנו:</Link>
      <div className="featured-carousel">{featured.map((course) => <CourseCard key={course.id} course={course} onOpenCourse={onOpenCourse} featured />)}</div>
    </section>

    <section className="what-is page-shell">
      <h2>מה זו לומדה?</h2>
      <div className="what-layout">
        <div className="mapalit-copy"><p>מה זה לומדה?</p><img src="assets/illustrations/mapalit.png" alt="מפ״לית מדור טי״ל" /></div>
        <div className="computer-copy"><img src="assets/illustrations/computer.svg" alt="" /><p>לומדה היא חוויית למידה דיגיטלית ואינטראקטיבית שמעבירה תוכן בצורה ברורה ומעניינת, באמצעות שילוב של הסברים, סרטונים, משחקים, תרגולים וסימולציות בהתאם למטרת הלמידה.</p></div>
      </div>
    </section>
    <ProcessSteps compact />
    <Footer />
  </>;
}
