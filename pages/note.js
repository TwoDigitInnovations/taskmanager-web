import api from "@/src/services/lib/api";
import { useState, useEffect, useContext } from "react";
import AuthGuard from "./AuthGuard";
import { userContext } from "./_app";
import { useConfirm } from "@/components/confirmationModal";
import moment from "moment";

export default function NotesApp(props) {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [search, setSearch] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useContext(userContext);
    const { confirm } = useConfirm();

    // const projects = ["Website Redesign", "Mobile App", "API Integration", "UI Fixes"];
    // const developers = ["Alice", "Bob", "Charlie", "Diana"];

    // Load notes from localStorage
    useEffect(() => {
        getAllNotes();
        getAllprojects();
    }, []);

    useEffect(() => {
        if (user.id && user.type === 'ADMIN') {
            getAllusers();
        }
        console.log(user)
    }, [user]);

    // Save notes automatically
    // useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes));
    // }, [notes]);

    const getAllNotes = async () => {
        props.loader(true);
        try {
            const res = await api.get('note/getAllNote');
            props.loader(false)
            console.log(res)
            if (res?.status) {
                setNotes(res.data);
                console.log(res)
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    const getAllprojects = async () => {
        props.loader(true);
        try {
            let url = "project/GetAllProjectByORg";
            if (props?.organization?._id) {
                url = `provider/client?org_id=${props?.organization?._id}`;
            }
            const res = await api.get(url);
            props.loader(false)
            console.log(res)
            if (res?.status) {
                setProjects(res.data);
                console.log(res)
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    const getAllusers = async () => {
        props.loader(true);
        try {
            const res = await api.post('user/guardList');
            props.loader(false)
            console.log(res)
            if (res?.status) {
                // setNotes(res.data);
                setDevelopers(res.data)
                console.log(res)
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    const createNote = async () => {
        const newNote = {
            id: Date.now(),
            title: "New Note",
            content: "",
            date: new Date(),
            created_by: user.id
        };
        try {
            const res = await api.post('note/createNote', newNote);
            console.log(res)
            if (res?.status) {
                setNotes([res.data, ...notes]);
                setSelectedNote(res.data);
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }
    };

    const updateNote = async (latestdata) => {
        const updatedNotes = notes.map((note) =>
            note.id === latestdata.id ? { ...latestdata } : note
        );
        if (!latestdata.developer) {
            delete latestdata.developer
        }
        if (!latestdata.project) {
            delete latestdata.project
        }
        try {
            const res = await api.post(`note/update/${latestdata._id}`, latestdata);
            console.log(res)
            if (res?.status) {
                setNotes(updatedNotes);
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    const assignNote = async (latestdata) => {
        const updatedNotes = notes.map((note) =>
            note.id === latestdata.id ? { ...latestdata } : note
        );
        if (!latestdata.developer) {
            delete latestdata.developer
        }
        if (!latestdata.project) {
            delete latestdata.project
        }
        try {
            const res = await api.post(`note/assign/${latestdata._id}`, latestdata);
            console.log(res)
            if (res?.status) {
                setNotes(updatedNotes);
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    const deleteNote = async (id) => {

        try {
            const res = await api.delete(`note/deleteNote/${id}`);
            console.log(res)
            if (res?.status) {
                const filtered = notes.filter((note) => note._id !== id);
                setNotes(filtered);
                if (selectedNote?._id === id) setSelectedNote(null);
            } else {
                props.toaster({ type: "error", message: res?.data?.message });
            }
        } catch (err) {
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.message });
            props.toaster({ type: "error", message: err?.message });
        }

    };

    // Filter notes based on search
    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthGuard allowedRoles={["ADMIN", "PROVIDER"]}>
            <div className="flex flex-col md:flex-row h-screen bg-[#F5F5F7]">
                {/* Sidebar */}
                <div className="md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
                        <button
                            onClick={createNote}
                            className="text-white bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-md text-sm font-medium"
                        >
                            +
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                        />
                    </div>

                    {/* Notes List */}
                    <div className="overflow-y-auto flex-1">
                        {filteredNotes.length === 0 ? (
                            <p className="text-gray-400 text-center mt-8">No notes found</p>
                        ) : (
                            filteredNotes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => {
                                        if (selectedNote?.id) {
                                            updateNote(selectedNote);
                                        }
                                        // note.developer = note?.developer?._id || '';
                                        // note.project = note?.project?._id || ''
                                        setSelectedNote({ ...note })
                                        console.log(note)
                                    }}
                                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-yellow-50 ${selectedNote?.id === note.id ? "bg-yellow-100" : ""
                                        }`}
                                >
                                    <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                                    <p className="text-xs text-gray-500">{moment(new Date(note.date)).format('DD-MM-YYYY, hh:mm A')}</p>

                                    {note.project && (
                                        <p className="text-xs mt-1 text-blue-600">
                                            Project: {projects?.find(f => f._id === note?.project)?.name}
                                        </p>
                                    )}
                                    {note?.developer && user?.type !== 'ADMIN' && (
                                        <p className="text-xs text-green-600">
                                            Assigned by Admin
                                        </p>
                                    )}
                                    {note?.developer && user?.type === 'ADMIN' && (
                                        <p className="text-xs text-green-600">
                                            Dev: {developers.find(f => f._id === note?.developer)?.username}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 bg-[#FFFBEA] flex flex-col">
                    {selectedNote ? (
                        <>
                            {/* Top Bar */}
                            <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-300 gap-3">
                                <input
                                    type="text"
                                    value={selectedNote.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setSelectedNote({ ...selectedNote, title: newTitle });
                                        // updateNote(selectedNote.id, { title: newTitle });
                                    }}
                                    onBlur={() => {
                                        updateNote(selectedNote);
                                    }}
                                    className="text-xl font-semibold bg-transparent outline-none w-full md:w-auto flex-1"
                                />

                                <div className="flex gap-2 items-center">
                                    {/* Project Selector */}
                                    <select
                                        value={selectedNote.project}
                                        onChange={(e) => {
                                            let newdata = { ...selectedNote, project: e.target.value }
                                            setSelectedNote(newdata);
                                            updateNote(newdata);
                                        }}
                                        className="border border-gray-300 rounded-lg text-sm p-2 bg-white focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <option value="">Assign Project</option>
                                        {projects?.map((proj) => (
                                            <option key={proj._id} value={proj._id}>
                                                {proj.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Developer Selector */}
                                    {user?.type === 'ADMIN' && <select
                                        value={selectedNote.developer}
                                        onChange={(e) => {
                                            let newdata = { ...selectedNote, developer: e.target.value }
                                            setSelectedNote(newdata);
                                            assignNote(newdata);
                                        }}
                                        className="border border-gray-300 rounded-lg text-sm p-2 bg-white focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <option value="">Assign Developer</option>
                                        {developers?.map((dev) => (
                                            <option key={dev._id} value={dev._id}>
                                                {dev.username}
                                            </option>
                                        ))}
                                    </select>}

                                    {/* Delete Button */}
                                    {user?.id === selectedNote?.created_by && <button
                                        onClick={async () => {
                                            const result = await confirm("Delete Note", "Are you sure you want to delete this?", { id: selectedNote._id });
                                            if (result.confirm) {
                                                deleteNote(selectedNote._id)
                                            }
                                        }

                                        }
                                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                                    >
                                        Delete
                                    </button>}
                                </div>
                            </div>

                            {/* Text Area */}
                            <textarea
                                value={selectedNote.content}
                                onChange={(e) => {
                                    setSelectedNote({ ...selectedNote, content: e.target.value });
                                }}
                                onBlur={() => {
                                    updateNote(selectedNote);
                                }}
                                placeholder="Start typing your note..."
                                className="flex-1 bg-[#FFFBEA] text-gray-800 p-4 resize-none focus:outline-none text-base"
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-500">
                            Select or create a note
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
