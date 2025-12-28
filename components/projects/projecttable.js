/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../table";
import React, { useContext, useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Api } from "@/src/services/service";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";
import ProjectViewModal from "./ProjectViewModal";
import { SlGraph } from "react-icons/sl";


function ProjectTable(props) {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')
    const [client, setClient] = useState({})
    const [user, setUser] = useContext(userContext)
    const [showModal, setShowModal] = useState(false);


    const columns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: indexID,
                // accessor: "indexID",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Period",
                accessor: "period",
            },
            {
                Header: "Closed Date",
                accessor: "createdAt",
            },
            {
                Header: "Action",
                Cell: ActionSection,
            },
        ],
        []
    );

    const admincolumns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: indexID,
                // accessor: "indexID",
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: statusSection
            },
            {
                Header: "Period",
                accessor: "period",
            },
            {
                Header: "Closed Date",
                accessor: "createdAt",
            },
            // {
            //   Header: "Status",
            //   accessor: "status",
            //   Cell: verifyCol,

            // },
            {
                Header: "Action",
                Cell: ActionSection,
            },
        ],
        []
    );
    const Enableadmincolumns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: indexID,
                // accessor: "indexID",
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: statusSection
            },
            {
                Header: "Cuurency",
                accessor: "currency",
            },
            {
                Header: "Unpaid",
                accessor: "unpaidTotal",
            },
            {
                Header: "Period",
                accessor: "period",
            },
            {
                Header: "Closed Date",
                accessor: "createdAt",
            },
            // {
            //   Header: "Status",
            //   accessor: "status",
            //   Cell: verifyCol,

            // },
            {
                Header: "Action",
                Cell: ActionSection,
            },
        ],
        []
    );



    function verifyCol({ value }) {
        return (
            <div className="flex justify-start items-center ">
                <p className={`${value === 'Verified' ? 'text-green-700' : 'text-[var(--customYellow)]'}`}>{value}</p>
            </div>
        );
    };

    function ActionSection({ row }) {
        return (
            <div className="flex ">
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        router.push(`/projects/${row.original._id}`)
                    }}
                >
                    <SlGraph className="text-black h-4 w-4 " />
                </div>}
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        props.setClientID(row.original._id);
                        props.setShowForm(true);
                        props.goToTop();
                    }}
                >
                    <MdModeEditOutline className="text-black h-4 w-4 " />
                </div>}
                {user.type === 'ADMIN' && <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        props.deleteClient(row.original._id);
                    }}
                >
                    <RiDeleteBinFill className="text-black h-4 w-4 " />
                </div>}
                <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        setClient(row.original)
                        setShowModal(true)
                    }}
                >
                    <IoEyeSharp className="text-black h-4 w-4 " />
                </div>
                <div
                    className="h-7 w-9 bg-[var(--customYellow)] rounded-sm ml-2 flex justify-center items-center cursor-pointer"

                >
                    <button className='bg-[#6C55F9] text-white text-base w-20 p-1 rounded' onClick={() => {
                        router.push(`/project-user-tasks?projectId=${row.original._id}`)
                    }}>Tasks</button>
                </div>

            </div>
        );
    }

    function statusSection({ value }) {
        return <div className={`${"text-black"} text-semibold w-60 whitespace-normal break-words`}>{value}</div>;
    }

    return (
        <>
            <Table columns={user?.type === 'ADMIN' ? props.showPendingAmount ? Enableadmincolumns : admincolumns : columns} data={props.data} />
            {showModal && (
                <ProjectViewModal
                    {...props}
                    project={client}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>

    );


}

export default ProjectTable;
