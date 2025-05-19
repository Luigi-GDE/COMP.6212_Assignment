import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const ITEMS = [
	{
		name: "Surfboard",
		price: 50,
		id: 1,
		image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80", // Surfboard on sand
	},
	{
		name: "Swimsuit",
		price: 25,
		id: 2,
		image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", // Swimsuit flat lay
	},
	{
		name: "Snorkles",
		price: 10,
		id: 3,
		image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", // Snorkel gear
	},
	{
		name: "Kayak",
		price: 60,
		id: 4,
		image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80", // Kayak on water
	},
];

export default function Rentals() {
	useEffect(() => {
		document.body.style.minHeight = "100vh";
		document.body.style.background =
			"linear-gradient(135deg, #155e75 0%, #0ea5e9 100%) fixed";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundAttachment = "fixed";
		return () => {
			document.body.style.background = "#f7fafc";
			document.body.style.backgroundRepeat = "";
			document.body.style.backgroundAttachment = "";
			document.body.style.minHeight = "";
		};
	}, []);

	const [form, setForm] = useState({
		item_id: ITEMS[0].id,
		hours: 1,
		name: "",
		surname: "",
		mobile: "",
		email: "",
		date: new Date().toISOString().slice(0, 10),
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const selectedItem = ITEMS.find((i) => i.id === Number(form.item_id));
	const cost = selectedItem.price * form.hours;

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleItemSelect = (id) => {
		setForm({ ...form, item_id: id });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// 1. Insert or get customer
			let { data: customer, error: customerError } = await supabase
				.from("Customers")
				.select("cust_id")
				.eq("email", form.email)
				.single();

			console.log("Customer query result:", customer, customerError);

			let cust_id;
			if (customer) {
				// Customer already exists
				cust_id = customer.cust_id;
			} else {
				// Insert new customer
				const { data: newCust, error: newCustErr } = await supabase
					.from("Customers")
					.insert([
						{
							name: form.name,
							surname: form.surname,
							mobile: form.mobile,
							email: form.email,
						},
					])
					.select()
					.single();

				if (newCustErr) {
					console.error("Customer insertion error:", newCustErr);
					throw new Error("Error adding customer: " + newCustErr.message);
				}
				cust_id = newCust.cust_id;
			}

			// 2. Insert rental
			const { error: rentalErr } = await supabase
				.from("Rentals")
				.insert([
					{
						date: form.date,
						hours: form.hours,
						cost,
						cust_id,
						item_id: form.item_id,
					},
				]);

			if (rentalErr) {
				console.error("Rental insertion error:", rentalErr);
				throw new Error("Error placing rental: " + rentalErr.message);
			}

			setSuccess("Rental placed successfully!");
			setForm({
				...form,
				hours: 1,
				name: "",
				surname: "",
				mobile: "",
				email: "",
			});
		} catch (err) {
			console.error("Error in handleSubmit:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="rentals-page">
			<h1>Place a Rental Order</h1>
			<form className="rental-form" onSubmit={handleSubmit}>
				<div className="item-select-grid">
					{ITEMS.map((item) => (
						<div
							key={item.id}
							className={`item-select-card${
								form.item_id === item.id ? " selected" : ""
							}`}
							onClick={() => handleItemSelect(item.id)}
							tabIndex={0}
							role="button"
							aria-pressed={form.item_id === item.id}
						>
							<img src={item.image} alt={item.name} />
							<div className="item-title">{item.name}</div>
							<div className="item-price">${item.price}/h</div>
						</div>
					))}
				</div>
				<label>
					Hours:
					<input
						type="number"
						name="hours"
						min="1"
						value={form.hours}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Name:
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Surname:
					<input
						type="text"
						name="surname"
						value={form.surname}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Mobile:
					<input
						type="text"
						name="mobile"
						value={form.mobile}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					Email:
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={handleChange}
						required
					/>
				</label>
				<div className="rental-summary">
					<img
						src={selectedItem.image}
						alt={selectedItem.name}
						style={{
							width: 80,
							borderRadius: 8,
							marginRight: 16,
						}}
					/>
					<span>
						<strong>{selectedItem.name}</strong> for{" "}
						<strong>{form.hours}</strong> hour(s):{" "}
						<strong>${cost}</strong>
					</span>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? "Placing Order..." : "Place Order"}
				</button>
				{error && <div className="error">{error}</div>}
				{success && <div className="success">{success}</div>}
			</form>
		</section>
	);
}