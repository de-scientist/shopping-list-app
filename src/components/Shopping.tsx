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
      //check If no editingId, we create a new Item with a unique timestamp ID and append it to the list using the spread operator ...
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
//reset everything- After adding or editing- all input fields are cleared
    setName("");
    setQuantity(0);
    setPrice(0);
  };

  //Set editingId so the app knows it’s in “edit mode” next time you click “Add Item”.
  const handleEdit = (id: number) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setQuantity(itemToEdit.quantity);
      setPrice(itemToEdit.price);
      setEditingId(id);
    }
  };

  //Filter out the deleted item by its ID
  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  //use reduce() which goes through every item’s total and sums them up.-grandTotal is displayed dynamically — if you edit or delete an item, it updates instantly.
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  //return (JSX Layout)-which returns statements that define the structure and UI
  return (
    <div className="shopping-container">
      <h2 className="title">Shopping List</h2>

{/* 
  Each input field is tied to a state variable (name, quantity, price) using the value and onChange attributes- When you type, React updates the state, and vice versa.
*/}
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

{/* 
  Display each added item dynamically.
  Using .map() to render a <tr> for each Item.
  key={item.id} ensures React can track updates properly.
  If there are no items, a fallback message appears.
*/}


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

{/* grandTotal updates automatically as items are added, edited, or removed*/}
      <h3 className="grand-total">Grand Total: {grandTotal}</h3>
    </div>
  );
};

export default ShoppingApp;
