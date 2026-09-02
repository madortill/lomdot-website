import ProcessSteps from "../components/ProcessSteps";
import Footer from "../components/Footer";
import contacts from "../data/contacts.json";

function ContactCard({ contact, type }) {
  const phoneHref = contact.phone.replace(/[^\d+]/g, "");

  return (
    <article className={`contact-card contact-card--${type}`}>
      <div className="contact-icon">
        <img src="assets/illustrations/Lace.png" alt="" />
      </div>
      <h2>{contact.title}</h2>
      <p>{contact.rank} {contact.name}</p>
      {type === "base" && <p>{contact.position}</p>}
      <a href={`tel:${phoneHref}`}>{contact.phone}</a>
    </article>
  );
}

export default function Contact() {
  return (
    <>
      <section className="contact-page page-shell">
        <h1>צרו קשר</h1>
        <p>רוצים לפתח איתנו לומדה?<br />מוזמנים לפנות אלינו דרך גופי פיתוח ההדרכה בבה״דים.</p>

        <div className="team-contact-grid">
          {contacts.teamContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="team" />
          ))}
        </div>

        <div className="contact-grid">
          {contacts.baseContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="base" />
          ))}
        </div>
      </section>
      <ProcessSteps />
      <Footer />
    </>
  );
}
