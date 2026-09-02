import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
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

  return (
    <div className="app" dir="rtl">
      <Header courses={courseList} onOpenCourse={setSelectedCourse} />
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
