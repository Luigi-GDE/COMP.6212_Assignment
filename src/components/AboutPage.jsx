import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #fffbe6 0%, #ffe9b3 100%)";
    return () => {
      document.body.style.background = "#f7fafc"; // Reset to default on unmount
    };
  }, []);

  const handleDeleteItem = async (id) => {
    await supabase.from("Items").delete().eq("item_id", id);
    fetchAll();
  };

  return (
    <section className="about-page">
      <h1>
        <span role="img" aria-label="surfboard">🏄‍♂️</span> About SurfRentals
      </h1>
      <p>
        At SurfRentals, we’re passionate about helping you make the most of your time on the water. Whether you’re a seasoned surfer or a first-time adventurer, we offer a wide range of high-quality equipment to suit your needs.
      </p>
      <ul>
        <li>
          <strong>Surfboards & Wetsuits:</strong> Choose from shortboards, longboards, and everything in between. Our wetsuits keep you comfortable in any conditions.
        </li>
        <li>
          <strong>Diving Gear:</strong> Explore beneath the waves with our selection of masks, fins, snorkels, and full diving kits.
        </li>
        <li>
          <strong>Boating Equipment:</strong> Rent kayaks, paddleboards, and safety gear for a fun and safe day on the water.
        </li>
      </ul>
      <p>
        Our friendly team is always here to offer advice and ensure you have the best experience possible. Come visit us and get ready for your next adventure!
      </p>
    </section>
  );
}