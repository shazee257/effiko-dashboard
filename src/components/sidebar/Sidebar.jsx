import "./sidebar.css";
import {
  Home,
  EmojiFoodBeverage,
  AttachMoney,
  BarChart,
  People,
  Event,
  Fastfood,
  ExitToApp,
  SettingsApplications
} from "@material-ui/icons";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem("profileInfo");
  }

  return (
    <div className="sidebar">
      <div className="sidebarWrapper" style={{ width: '220px' }}>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <li>
              <NavLink exact activeClassName="active" to='/' className="sidebarListItem link">
                <Home className="sidebarIcon" />
                Home
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/courses' className="sidebarListItem link">
                <EmojiFoodBeverage className="sidebarIcon" />
                Courses
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/articles' className="sidebarListItem link">
                <Event className="sidebarIcon" />
                Articles
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/categories' className="sidebarListItem link">
                <Home className="sidebarIcon" />
                Categories
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/books' className="sidebarListItem link">
                <Event className="sidebarIcon" />
                Books
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/advisors' className="sidebarListItem link">
                <People className="sidebarIcon" />
                Career Advisors
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/interviews' className="sidebarListItem link">
                <SettingsApplications className="sidebarIcon" />
                Interviews
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/subscriptions' className="sidebarListItem link">
                <SettingsApplications className="sidebarIcon" />
                News Subscriptions
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/linkedin' className="sidebarListItem link">
                <SettingsApplications className="sidebarIcon" />
                LinkedIn Info
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/locations' className="sidebarListItem link">
                <SettingsApplications className="sidebarIcon" />
                Our Locations
              </NavLink>
            </li>

            <li>
              <NavLink activeClassName="active" to='/messages' className="sidebarListItem link">
                <SettingsApplications className="sidebarIcon" />
                Users Messages
              </NavLink>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}
