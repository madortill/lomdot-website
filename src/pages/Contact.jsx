import ProcessSteps from "../components/ProcessSteps";
import Footer from "../components/Footer";

const contacts = ["בה״ד 6", "בה״ד 10", "בה״ד 11", "בה״ד 13", "בה״ד 20", "בה״ד חינוך", "מפקדה"];

export default function Contact() {
  return <><section className="contact-page page-shell"><h1>צרו קשר</h1><p>רוצים לפתח איתנו לומדה? מוזמנים לפנות אלינו דרך גופי פיתוח ההדרכה בבה״דים.</p><div className="contact-grid">{contacts.map((name) => <article key={name}><div className="contact-icon">⌕</div><h2>{name}</h2><p>דרגת שם שם</p><a href="tel:0500000000">050-0000000</a></article>)}</div></section><ProcessSteps /><Footer /></>;
}
