import { useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import CourseModal from "./components/CourseModal";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import BaseCourses from "./pages/BaseCourses";
import Contact from "./pages/Contact";
import courses from "./data/courses.json";
import "./css/App.css";

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const courseList = useMemo(() => courses, []);
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="app" dir="rtl">
      <Header courses={courseList} onOpenCourse={setSelectedCourse} />
      {!isHomePage && (
        <Link className="home-return" to="/" aria-label="חזרה לעמוד הבית">
          <svg
            className="home-return__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
          </svg>
          <span>חזרה לעמוד הבית</span>
        </Link>
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home courses={courseList} onOpenCourse={setSelectedCourse} />} />
          <Route path="/courses" element={<Courses courses={courseList} onOpenCourse={setSelectedCourse} />} />
          <Route path="/bases/:baseId" element={<BaseCourses courses={courseList} onOpenCourse={setSelectedCourse} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}

export default App;
