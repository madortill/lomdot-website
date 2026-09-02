# אתר הלומדות של מדור טי״ל

אתר React/Vite סטטי המציג את הלומדות והתוצרים של המדור. כל התוכן נשמר בקובצי JSON מקומיים, כדי שאפשר יהיה לפרוס את אותו build גם ב-GitHub Pages וגם ברשת סגורה.

## הרצה מקומית

```bash
npm install
npm run dev
```

## הוספת לומדה

1. מוסיפים את תמונת השער אל `public/assets/course-covers`.
2. מוסיפים אובייקט חדש אל `src/data/courses.json`.
3. אם הלומדה צריכה להופיע בדף הבית, מעדכנים את `featuredCourseIds` בתוך `src/data/siteSettings.json`. הרשימה צריכה להכיל בדיוק ארבעה מזהים.

לכל לומדה יש להזין גם `completionDate` בפורמט `YYYY-MM-DD`. זהו נתון פנימי שמשמש למיון מדויק מהחדש לישן או מהישן לחדש, והוא אינו מוצג באתר.

## בנייה ובדיקות

```bash
npm run lint
npm run build
npm run preview
```

תוצרי הבנייה נוצרים בתיקיית `dist`. הנתיבים יחסיים והניווט מבוסס `HashRouter`, ולכן אפשר להגיש את התיקייה גם מתוך נתיב משנה או שרת פנימי.

## GitHub Pages

ה-Action שבתיקיית `.github/workflows` בונה ומפרסם את האתר אוטומטית בכל push לענף `main` או `master`. לאחר העלאת ה-repository יש לבחור ב-GitHub:

`Settings → Pages → Source → GitHub Actions`
