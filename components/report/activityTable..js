/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Table from "@/components/table"; // new
import React, { useContext, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline, IoEyeSharp } from "react-icons/io5";
import { userContext } from "@/pages/_app";

const ActivityTable = (props) => {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [user, setUser] = useContext(userContext);


  const status = ({ value, row }) => {
    return (
      <div>
        {value === "Resolved" ? (
          <p className="text-green-500 capitalize">{value}</p>
        ) : (!value || value === "pending" || value === "") && (
          <div className="">
            {user.type === 'ADMIN' && <button
              className="bg-green-700 text-white p-2 rounded-sm w-20 "
              onClick={() => {
                props.updateReport(row.original._id);
              }}
            >
              Resolve
            </button>}
            {user.type === 'PROVIDER' && <p className="text-yellow-600 capitalize">{value}</p>}
          </div>
        )}
      </div>
    );
  }
  const columns = useMemo(
    () => [
      {
        Header: "Project",
        accessor: "project.name",
      },
      {
        Header: "User",
        accessor: "posted_by.username",
      },
      {
        Header: "Date & Time",
        accessor: "date",
      },

      {
        Header: "Details",
        accessor: "details",
        Cell: Details
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: status
      },

    ],
    []
  );



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Details({ value }) {
    return (
      <p className=" w-80 text-balance flex-nowrap whitespace-normal text-white">{value}</p>
    );
  }


  return (
    <>
      <Table columns={columns} data={props.data} />
      <Dialog open={open} onClose={handleClose}>
        <div className="p-5 border-2  border-[var(--red-900)] bg-black relative overflow-hidden">
          <IoCloseCircleOutline
            className="text-red-700 h-8 w-8 absolute right-2 top-2"
            onClick={handleClose}
          />

          <div className="flex flex-col  justify-center mt-5">
            <div className="md:w-80 md:h-auto w-60 h-auto relative rounded-lg ">
              <img src={image} className="rounded-sm  w-full object-contain" />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default ActivityTable;
