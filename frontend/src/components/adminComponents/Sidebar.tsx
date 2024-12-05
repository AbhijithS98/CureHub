import React from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="sidebar-container">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="sidebar-toggle d-md-none"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Nav className="flex-column">
          <Nav.Link href="/admin/dashboard" className="sidebar-link">
            Dashboard
          </Nav.Link>
          <Nav.Link href="/admin/list-unapproved-doctors" className="sidebar-link">
            Doctor Approval
          </Nav.Link>
          <Nav.Link href="/admin/list-users" className="sidebar-link">
            Manage Users
          </Nav.Link>
          <Nav.Link href="/admin/list-doctors" className="sidebar-link">
            Manage Doctors
          </Nav.Link>
          <Nav.Link href="/admin/doctors-appointments" className="sidebar-link">
            Appointments
          </Nav.Link>
          <Dropdown>
            <Dropdown.Toggle as={Nav.Link} className="sidebar-link" id="dropdown-report-management">
              Report Management
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/admin/appointment-report">Appointment Report</Dropdown.Item>
              <Dropdown.Item href="/admin/revenue-report">Revenue Report</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
