const StockManagement = () => {
  const stockItems = [
    { id: 1, name: 'Cotton Fabric 20x20', category: 'Raw Material', quantity: 245, unit: 'meters', lowStock: true },
    { id: 2, name: 'Polyester Thread', category: 'Raw Material', quantity: 1500, unit: 'rolls', lowStock: false },
    { id: 3, name: 'Shirt Medium', category: 'Finished Goods', quantity: 89, unit: 'pieces', lowStock: true }
  ];

  return (
    <>
      <h2>📦 Stock Inventory</h2>
      <div className="stock-actions">
        <button className="add-btn">➕ Add New Item</button>
        <button className="export-btn">📥 Export CSV</button>
      </div>
      <table className="stock-table">
        <thead>
          <tr><th>Item</th><th>Category</th><th>Quantity</th><th>Status</th></tr>
        </thead>
        <tbody>
          {stockItems.map((item) => (
            <tr key={item.id} className={item.lowStock ? 'low-stock' : ''}>
              <td>{item.name}</td>
              <td><span className="category-tag">{item.category}</span></td>
              <td><strong>{item.quantity} {item.unit}</strong></td>
              <td><span className={`stock-status ${item.lowStock ? 'low' : 'good'}`}>
                {item.lowStock ? '⚠️ Low Stock' : '✅ In Stock'}
              </span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default StockManagement;
