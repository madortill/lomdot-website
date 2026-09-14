# אתר הלומדות של מדור טי״ל

אתר React/Vite סטטי המציג את הלומדות והתוצרים של המדור. כל התוכן נשמר בקובצי JSON מקומיים, כדי שאפשר יהיה לפרוס את אותו build גם ב-GitHub Pages וגם ברשת סגורה.

## הרצה מקומית

```bash
npm install
npm run dev
```

## סנכרון אוטומטי מהגיט המדורי

האתר סורק את המאגרים הציבוריים של `madortill` שפורסמו ב-GitHub Pages. הוא מעדיף
את פרטי ה-About גם כשהם נמצאים בתוך `App.jsx` או `App.vue`, ומשלים כותרת ותאריך
משם המאגר ומתאריך יצירתו כאשר המידע אינו קיים.

```bash
GITHUB_TOKEN=your_token npm run sync:courses
```

ב-Windows PowerShell:

```powershell
$env:GITHUB_TOKEN="your_token"
npm run sync:courses
```

הסקריפט ממלא רק שדות ריקים ואינו דורס מידע שהוזן ידנית. תאריך שמגיע מגרסה
הכתובה כחודש ושנה נשמר כיום הראשון בחודש לצורכי מיון בלבד. בהרצה בלי token
מגבלת GitHub נמוכה ולכן מומלץ להשתמש ב-token בעל הרשאת קריאה בלבד.

כדי למנוע ממאגר מסוים לחזור בסנכרון, מוסיפים את שמו אל `excludeRepositories`
בקובץ `scripts/course-sync.config.json`. תיקונים קבועים למאגר מסוים אפשר להוסיף
אל `overrides` באותו קובץ, לדוגמה:

```json
{
  "overrides": {
    "repository-name": {
      "title": "שם הלומדה",
      "baseId": "bhd13",
      "baseName": "בה״ד 13",
      "platforms": ["desktop"]
    }
  }
}
```

ה-Action מריץ את הסנכרון לפני כל פריסה וגם פעם ביום, כך שלומדות חדשות יופיעו
באתר אוטומטית. שדות שלא נמצאו נשארים ריקים ומוצגים באתר בלי תמונה שבורה או
טקסט שגוי.

## הוספה ועריכה ידנית

1. מוסיפים את תמונת השער אל `public/assets/course-covers`.
2. מוסיפים אובייקט חדש אל `src/data/courses.json`.
3. אם הלומדה צריכה להופיע בדף הבית, מעדכנים את `featuredCourseIds` בתוך `src/data/siteSettings.json`. הרשימה צריכה להכיל בדיוק ארבעה מזהים.

לכל לומדה שנוספת ידנית יש להזין גם `completionDate` בפורמט `YYYY-MM-DD`. זהו נתון פנימי שמשמש למיון מדויק מהחדש לישן או מהישן לחדש, והוא אינו מוצג באתר.

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
