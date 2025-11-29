import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import { FormControl, ListGroup } from "react-bootstrap";
import ModulesControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { setLessons, deleteLesson as deleteLessonAction } from "../Lessons/reducer";
import { useSelector, useDispatch } from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import * as lessonsClient from "../Lessons/client";
import { FaVideo } from "react-icons/fa";

export default function Modules() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { lessons } = useSelector((state: any) => state.lessonsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const fetchModules = async () => {
        const modules = await coursesClient.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };

    const fetchLessons = async () => {
        const allLessons = await lessonsClient.findLessonsForCourse(cid as string);
        dispatch(setLessons(allLessons));
    };

    useEffect(() => {
        fetchModules();
        fetchLessons();
    }, [cid]);

    const createModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { name: moduleName, course: cid };
        const module = await coursesClient.createModuleForCourse(cid, newModule);
        dispatch(addModule(module));
        setModuleName("");
    };

    const removeModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };

    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    const removeLesson = async (lessonId: string) => {
        await lessonsClient.deleteLesson(lessonId);
        dispatch(deleteLessonAction(lessonId));
    };

    const getLessonsForModule = (moduleId: string) => {
        return lessons.filter((lesson: any) => lesson.module === moduleId);
    };

    const handleLessonClick = (moduleId: string, lessonId: string) => {
        navigate(`/Kambaz/Courses/${cid}/Modules/${moduleId}/Lessons/${lessonId}`);
    };

    return (
        <div className="wd-modules">
            <ModulesControls setModuleName={setModuleName} moduleName={moduleName}
                addModule={createModuleForCourse} /><br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {modules
                    .map((module: any) => (
                        <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 fs-3" />
                                {!module.editing && module.name}
                                {module.editing && (
                                    <FormControl className="w-50 d-inline-block"
                                        onChange={(e) =>
                                            saveModule({ ...module, name: e.target.value })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveModule({ ...module, editing: false });
                                            }
                                        }}
                                        defaultValue={module.name} />
                                )}
                                {currentUser.role === "FACULTY" && <ModulesControlButtons
                                    moduleId={module._id}
                                    deleteModule={(moduleId) => removeModule(moduleId)}
                                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                                />}
                            </div>
                            {/* Render lessons from the lessons reducer */}
                            {getLessonsForModule(module._id).length > 0 && (
                                <ListGroup className="wd-lessons rounded-0">
                                    {getLessonsForModule(module._id).map((lesson: any) => (
                                        <ListGroup.Item 
                                            key={lesson._id} 
                                            className="wd-lesson p-3 ps-1"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleLessonClick(module._id, lesson._id)}
                                        >
                                            <BsGripVertical className="me-2 fs-3" />
                                            <FaVideo className="me-2 text-secondary" />
                                            {lesson.name}
                                            {lesson.quizGenerationStatus === "processing" && (
                                                <span className="ms-2 badge bg-info">Generating quiz...</span>
                                            )}
                                            {lesson.quizId && lesson.quizGenerationStatus !== "processing" && (
                                                <span className="ms-2 badge bg-success">Quiz</span>
                                            )}
                                            {currentUser.role === "FACULTY" && (
                                                <LessonControlButtons
                                                    moduleId={module._id}
                                                    lessonId={lesson._id}
                                                    deleteLesson={() => removeLesson(lesson._id)}
                                                />
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>))}
            </ListGroup>
        </div>
    );
}
