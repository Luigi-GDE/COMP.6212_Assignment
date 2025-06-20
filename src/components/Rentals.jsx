import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const ITEMS = [
	{
		name: "Surfboard",
		price: 50,
		id: 1,
		image: "data:image/jpeg;base64,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", // Surfboard on sand
	},
	{
		name: "Swimsuit",
		price: 25,
		id: 2,
		image: "data:image/jpeg;base64,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", // Swimsuit flat lay
	},
	{
		name: "Snorkles",
		price: 10,
		id: 3,
		image: "data:image/jpeg;base64,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", // Snorkel gear
	},
	{
		name: "Kayak",
		price: 60,
		id: 4,
		image: "https://nwscdn.com/media/catalog/product/cache/h900xw900/m/a/main_6.jpg", // Kayak on water
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