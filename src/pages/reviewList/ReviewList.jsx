import "./reviewList.css";
import { DataGrid } from "@material-ui/data-grid";
import { reviews } from "../../dummyData";
import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Rating from '@mui/material/Rating';

export default function ReviewList() {
  const [data, setData] = useState(reviews);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: "id", type: "number", headerName: "ID", width: 80 },
    { field: "date", type: "date", headerName: "Date", width: 140 },
    {
      field: "customer", headerName: "Customer", width: 250,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.imgUrl} alt="" />
            {params.row.customer}
          </div>
        );
      },
    },
    { field: "product", headerName: "Product", width: 180 },
    {
      field: "rating", headerName: "Rating",
      width: 200,
      renderCell: (params) => {
        return (
          <Rating
            name="read-only"
            value={params.value}
            readOnly
          />
        );
      },

    },
    { field: "comment", headerName: "Comments", width: 600 },


  ];

  return (
    <div>
      <Topbar />
      <div className="container">
        <Sidebar />
        <div className="orderList">
          <DataGrid
            rows={data}
            loading={data.length === 0}
            disableSelectionOnClick
            columns={columns}
            rowHeight={40}
            pageSize={15}
            checkboxSelection
            style={{ height: '800px' }}
          />
        </div>
      </div>
    </div>

  );
}