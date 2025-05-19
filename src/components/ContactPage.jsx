import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)";
    return () => {
      document.body.style.background = "#f7fafc"; // Reset to default on unmount
    };
  }, []);

  return (
    <section className="contact-page">
      <h1>
        <span role="img" aria-label="contact">📞</span> Contact Us
      </h1>
      <p>
        Have questions or want to make a booking? Reach out to us!
      </p>
      <ul>
        <li><strong>Email:</strong> info@surfrentals.test</li>
        <li><strong>Phone:</strong> (123) 456-7890</li>
        <li><strong>Address:</strong> 123 Beachside Ave, Surf City</li>
      </ul>
      <p>
        Our team is available 7 days a week from 8am to 6pm. We look forward to hearing from you!
      </p>
    </section>
  );
}