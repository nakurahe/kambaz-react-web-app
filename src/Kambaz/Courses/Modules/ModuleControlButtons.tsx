import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";

export default function ModulesControlButtons(
    {
        moduleId,
        deleteModule,
        editModule
    }: {
        moduleId: string;
        deleteModule: (moduleId: string) => void;
        editModule: (moduleId: string) => void
    }) {
    const navigate = useNavigate();
    const { cid } = useParams();

    const handleAddLesson = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/Kambaz/Courses/${cid}/Modules/${moduleId}/Lessons/new`);
    };

    return (
        <div className="float-end">
            <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
            <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)} />
            <GreenCheckmark />
            <BsPlus 
                className="fs-1" 
                style={{ cursor: "pointer" }}
                onClick={handleAddLesson}
                title="Add Lesson"
            />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
