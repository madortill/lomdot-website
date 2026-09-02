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

export default function ProcessSteps({ compact = false }) {
  const visibleSteps = compact ? processSteps.slice(0, 4) : processSteps;
  return <section className="process-section"><h2>איך נולדת לומדה?</h2><div className="process-grid">{visibleSteps.map(([title, text], index) => <article className={`process-step ${index >= 4 ? "process-step--production" : "process-step--planning"}`} key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
