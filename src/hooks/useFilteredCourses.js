import { useMemo, useState } from "react";

function getCompletionTimestamp(course) {
  const completionTimestamp = Date.parse(course.completionDate);

  if (!Number.isNaN(completionTimestamp)) {
    return completionTimestamp;
  }

  return Date.parse(`${course.year}-01-01`);
}

export default function useFilteredCourses(courses, fixedBase = "") {
  const [query, setQuery] = useState("");
  const [base, setBase] = useState(fixedBase);
  const [year, setYear] = useState("");
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState("newest");
  const years = [...new Set(courses.map((course) => course.year))].sort((a, b) => b - a);
  const filtered = useMemo(
    () => courses
      .filter((course) => (!query.trim() || course.title.includes(query.trim()))
        && (!base || course.baseId === base)
        && (!year || course.year === Number(year))
        && (!platform || course.platforms.includes(platform)))
      .sort((a, b) => sort === "oldest"
        ? getCompletionTimestamp(a) - getCompletionTimestamp(b)
        : sort === "az"
          ? a.title.localeCompare(b.title, "he")
          : getCompletionTimestamp(b) - getCompletionTimestamp(a)),
    [courses, query, base, year, platform, sort],
  );

  return { query, setQuery, base, setBase, year, setYear, platform, setPlatform, sort, setSort, years, filtered };
}
