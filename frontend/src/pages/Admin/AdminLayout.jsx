import { NavLink, Link, Outlet } from 'react-router-dom';
import '../../styles/pages/_admin.scss';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-layout__header">
        <div>
          <h1>ADMIN DASHBOARD</h1>
          <p>
            Store Management & Inventory Control
          </p>
        </div>
        <Link to="/">← Back to Store</Link>
      </div>

      <nav className="admin-layout__nav">
        <NavLink to="/admin" end>
          Overview
        </NavLink>
        <NavLink to="/admin/products">
          Products & Inventory
        </NavLink>
        <NavLink to="/admin/categories">
          Categories
        </NavLink>
        <NavLink to="/admin/orders">
          Customer Orders
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}

export default AdminLayout;

