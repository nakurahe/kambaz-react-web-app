import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { useNavigate, useParams } from "react-router";

export default function LessonControlButtons({
    moduleId,
    lessonId,
    deleteLesson
}: {
    moduleId: string;
    lessonId: string;
    deleteLesson: () => void;
}) {
    const navigate = useNavigate();
    const { cid } = useParams();

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/Kambaz/Courses/${cid}/Modules/${moduleId}/Lessons/${lessonId}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            deleteLesson();
        }
    };

    return (
        <div className="float-end">
            <FaPencilAlt 
                className="text-primary me-2" 
                style={{ cursor: "pointer" }}
                onClick={handleEdit}
                title="Edit Lesson"
            />
            <FaTrash 
                className="text-danger me-2" 
                style={{ cursor: "pointer" }}
                onClick={handleDelete}
                title="Delete Lesson"
            />
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
