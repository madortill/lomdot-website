const processSteps = [
  ["מזהים את הצורך", "יש שיעור, תוכן או תהליך שלא עוברים כמו שהייתם רוצים."],
  ["פונים לגפ״ה", "פונים לגוף פיתוח ההדרכה בבה״ד עם הצורך או הרעיון."],
  ["הגפ״ה מחברים", "גוף פיתוח ההדרכה פונה אלינו ומעלה את הפרויקט."],
  ["פגישת אפיון", "קובעים פגישת אפיון, מבינים יחד את הצורך ומתחילים לעבוד."],
  ["בניית תיק מסכים", "אנחנו מתכננות איך הלומדה תיראה ואיך המשתמש יעבור בה."],
  ["אישור עיצוב", "עוברים יחד על העיצוב ומוודאים שהכול מתאים לפני הפיתוח."],
  ["תכנות הלומדה", "אנחנו הופכות את התכנון ללומדה עובדת ואינטראקטיבית."],
  ["פגישת סיום והפצה", "מאשרים יחד את התוצר הסופי ומפיצים את הלומדה לקהל היעד."],
];

export default function ProcessSteps() {
  return (
    <section className="process-section" aria-labelledby="process-title">
      <h2 id="process-title">איך נולדת לומדה?</h2>
      <p className="process-hint">מהרעיון ועד ההפצה — 8 שלבים <span>· גללו שמאלה להמשך התהליך ←</span></p>
      <div className="process-scroll" tabIndex={0} role="region" aria-label="שלבי יצירת לומדה">
        <ol className="process-grid">
          {processSteps.map(([title, text], index) => (
            <li className={`process-step ${index >= 4 ? "process-step--production" : "process-step--planning"}`} key={title}>
              <span className="process-number" aria-hidden="true">{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              {index < processSteps.length - 1 && <span className="process-arrow" aria-hidden="true">←</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
