//import useState to create and manage local state variables
import React, { useState } from "react";

//add an Item interface that defines the structure for each item in the list
interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

//Set Up State with useState - Each of these states is reactive — any update triggers an automatic UI re-render
const ShoppingApp: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddOrEditItem = () => {
     //add validation - If the user leaves any field blank or enters zero/negative numbers, the function exits.
    if (!name || quantity <= 0 || price <= 0) 
        return;
    //Calculate total
    const total = quantity * price;

    //check if editingId exists, we update that specific item by mapping over the existing array and replacing it with the new values
    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name, quantity, price, total } : item
        )
      );
      setEditingId(null);
    } else {
      const newItem: Item = {
        id: Date.now(),
        name,
        quantity,
        price,
        total,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setName("");
    setQuantity(0);
    setPrice(0);
  };

  const handleEdit = (id: number) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setQuantity(itemToEdit.quantity);
      setPrice(itemToEdit.price);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="shopping-container">
      <h2 className="title">Shopping List</h2>

      <div className="input-section">
        <div className="input-group">
          <label>Item</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item"
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="0"
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Price/Quantity</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="0"
            className="input"
          />
        </div>

        <button onClick={handleAddOrEditItem} className="btn add-btn">
          {editingId ? "Update" : "Add Item"}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price/Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => handleEdit(item.id)}>
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-items">
                No items added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className="grand-total">Grand Total: {grandTotal}</h3>
    </div>
  );
};

export default ShoppingApp;
