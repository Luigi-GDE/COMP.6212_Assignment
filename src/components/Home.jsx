import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home">
      <div className="home-hero">
        <h1>Ride the Waves with SurfRentals</h1>
        <p>
          Your adventure starts here. Rent top-quality surfboards and gear for all skill levels.
        </p>
        <Link to="/rentals" className="home-cta">Rent from our Selection</Link>
      </div>
      <div className="home-features">
        <Link to="/about" className="feature-card" style={{ textDecoration: "none" }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStoFwUIYvB_2aN9inraTjxCA5bTKYlX-Fhqg&s" alt="Affordable Rates" />
          <h2>What we sell</h2>
          <p>Enjoy competitive pricing and flexible rental periods for every budget.</p>
        </Link>
        <Link to="/contact" className="feature-card" style={{ textDecoration: "none" }}>
          <img src="https://blog.udemy.com/wp-content/uploads/2014/06/shutterstock_196749377.jpg" alt="Expert Advice" />
          <h2>Expert Advice</h2>
          <p>Our team is here to help you pick the perfect gear and share local surf tips.</p>
        </Link>
      </div>
    </section>
  );
}