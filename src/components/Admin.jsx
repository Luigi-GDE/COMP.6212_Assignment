import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // For add/update forms
  const [editingRental, setEditingRental] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: rentalsData } = await supabase.from("Rentals").select("*");
      const { data: customersData } = await supabase.from("Customers").select("*");
      const { data: itemsData } = await supabase.from("Items").select("*");
      setRentals(rentalsData || []);
      setCustomers(customersData || []);
      setItems(itemsData || []);
    } catch (err) {
      console.error("Failed to fetch data:", err); // Log the error for debugging
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/login");
      } else {
        setUser(data.user);
        fetchAll();
      }
    });
  }, [navigate]);

  // --- Rentals CRUD ---
  const handleDeleteRental = async (id) => {
    await supabase.from("Rentals").delete().eq("rental_id", id);
    fetchAll();
  };

  const handleAddOrUpdateRental = async (rental) => {
    if (rental.rental_id) {
      await supabase.from("Rentals").update(rental).eq("rental_id", rental.rental_id);
    } else {
      await supabase.from("Rentals").insert([rental]);
    }
    setEditingRental(null);
    fetchAll();
  };

  // --- Customers CRUD ---
  const handleDeleteCustomer = async (id) => {
    await supabase.from("Customers").delete().eq("cust_id", id);
    fetchAll();
  };

  const handleAddOrUpdateCustomer = async (customer) => {
    if (customer.cust_id) {
      await supabase.from("Customers").update(customer).eq("cust_id", customer.cust_id);
    } else {
      await supabase.from("Customers").insert([customer]);
    }
    setEditingCustomer(null);
    fetchAll();
  };

  // --- Items CRUD ---
  const handleAddOrUpdateItem = async (item) => {
    if (item.item_id) {
      await supabase.from("Items").update(item).eq("item_id", item.item_id);
    } else {
      await supabase.from("Items").insert([item]);
    }
    setEditingItem(null);
    fetchAll();
  };

  if (!user) return <div className="admin-loading">Loading...</div>;
  if (loading) return <div className="admin-loading">Loading data...</div>;

  return (
    <section className="admin-page" style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div className="admin-card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>
          <span role="img" aria-label="admin">🌊</span> Admin Dashboard
        </h1>
        <p>Welcome, <strong>{user.email}</strong>!</p>
        {error && <div className="error">{error}</div>}

        {/* Rentals Section */}
        <h2>Rentals</h2>
        <button onClick={() => setEditingRental({})}>Add Rental</button>
        <table style={{ width: "100%", margin: "1rem 0" }}>
          <thead>
            <tr>
              <th>ID</th><th>Date</th><th>Hours</th><th>Cost</th><th>Customer</th><th>Item</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(r => (
              <tr key={r.rental_id}>
                <td>{r.rental_id}</td>
                <td>{r.date}</td>
                <td>{r.hours}</td>
                <td>{r.cost}</td>
                <td>{r.cust_id}</td>
                <td>{r.item_id}</td>
                <td>
                  <button onClick={() => setEditingRental(r)}>Edit</button>
                  <button onClick={() => handleDeleteRental(r.rental_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingRental && (
          <RentalForm
            rental={editingRental}
            customers={customers}
            items={items}
            onSave={handleAddOrUpdateRental}
            onCancel={() => setEditingRental(null)}
          />
        )}

        {/* Customers Section */}
        <h2>Customers</h2>
        <button onClick={() => setEditingCustomer({})}>Add Customer</button>
        <table style={{ width: "100%", margin: "1rem 0" }}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Surname</th><th>Mobile</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.cust_id}>
                <td>{c.cust_id}</td>
                <td>{c.name}</td>
                <td>{c.surname}</td>
                <td>{c.mobile}</td>
                <td>{c.email}</td>
                <td>
                  <button onClick={() => setEditingCustomer(c)}>Edit</button>
                  <button onClick={() => handleDeleteCustomer(c.cust_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingCustomer && (
          <CustomerForm
            customer={editingCustomer}
            onSave={handleAddOrUpdateCustomer}
            onCancel={() => setEditingCustomer(null)}
          />
        )}

        {/* Items Section */}
        <h2>Items</h2>
        <table style={{ width: "100%", margin: "1rem 0" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.item_id}>
                <td>{i.item_id}</td>
                <td>{i.item}</td>
                <td>${i.price}</td>
                <td>
                  <button onClick={() => setEditingItem(i)}>Edit Price</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingItem && (
          <ItemForm
            item={editingItem}
            onSave={handleAddOrUpdateItem}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </section>
  );
}

// --- Rental Form ---
function RentalForm({ rental, customers, items, onSave, onCancel }) {
  const [form, setForm] = useState(rental);

  useEffect(() => {
    setForm(rental);
  }, [rental]);

  return (
    <form
      style={{ margin: "1rem 0", background: "#f0f8ff", padding: 16, borderRadius: 8 }}
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <label>
        Date:
        <input type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
      </label>
      <label>
        Hours:
        <input type="number" value={form.hours || ""} onChange={e => setForm(f => ({ ...f, hours: Number(e.target.value) }))} required />
      </label>
      <label>
        Cost:
        <input type="number" value={form.cost || ""} onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))} required />
      </label>
      <label>
        Customer:
        <select value={form.cust_id || ""} onChange={e => setForm(f => ({ ...f, cust_id: Number(e.target.value) }))} required>
          <option value="">Select</option>
          {customers.map(c => (
            <option key={c.cust_id} value={c.cust_id}>{c.name} {c.surname}</option>
          ))}
        </select>
      </label>
      <label>
        Item:
        <select value={form.item_id || ""} onChange={e => setForm(f => ({ ...f, item_id: Number(e.target.value) }))} required>
          <option value="">Select</option>
          {items.map(i => (
            <option key={i.item_id} value={i.item_id}>{i.item}</option>
          ))}
        </select>
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
}

// RentalForm PropTypes
RentalForm.propTypes = {
  rental: PropTypes.object.isRequired,
  customers: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// --- Customer Form ---
function CustomerForm({ customer, onSave, onCancel }) {
  const [form, setForm] = useState(customer);

  useEffect(() => {
    setForm(customer);
  }, [customer]);

  return (
    <form
      style={{ margin: "1rem 0", background: "#f0f8ff", padding: 16, borderRadius: 8 }}
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <label>
        Name:
        <input type="text" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </label>
      <label>
        Surname:
        <input type="text" value={form.surname || ""} onChange={e => setForm(f => ({ ...f, surname: e.target.value }))} required />
      </label>
      <label>
        Mobile:
        <input type="text" value={form.mobile || ""} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} required />
      </label>
      <label>
        Email:
        <input type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
}

// CustomerForm PropTypes
CustomerForm.propTypes = {
  customer: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// --- Item Form ---
function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({ price: item.price });

  useEffect(() => {
    setForm({ price: item.price });
  }, [item]);

  return (
    <form
      style={{ margin: "1rem 0", background: "#f0f8ff", padding: 16, borderRadius: 8 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...item, price: form.price }); // Only update the price
      }}
    >
      <label>
        Price:
        <input
          type="number"
          value={form.price || ""}
          onChange={(e) => setForm({ price: Number(e.target.value) })}
          required
        />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
        Cancel
      </button>
    </form>
  );
}

// ItemForm PropTypes
ItemForm.propTypes = {
  item: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};