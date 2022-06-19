import "./home.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { Button, Link } from '@material-ui/core';

export default function Courses() {
  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="productList">
          <div className="productTitleContainer">
            <h2 className="productTitle">Dashboard Section</h2>
            <Link href="/newcourse">
              <Button variant="contained" color="primary" hidden component="label" >Create New</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}