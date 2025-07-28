import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import { ListGroup } from "react-bootstrap";
import ModulesControlButtons from "./ModuleControlButtons";
import { useParams } from "react-router";
import * as db from "../../Database";
import { useState } from "react";

export default function Modules() {
    const { cid } = useParams();
    const [modules, setModules] = useState<any[]>(db.modules);
    const [moduleName, setModuleName] = useState("");
    const addModule = () => {
        setModules([...modules, { _id: uuidv4(), name: moduleName, course: cid, lessons: [] }]);
        setModuleName("");
    };

    return (
        <div className="wd-modules">
            <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={addModule} /><br /><br /><br /><br />
            <ListGroup className="rounded-0" id="wd-modules">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                    <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-2 bg-secondary">
                            <BsGripVertical className="me-2 fs-3" /> {module.name} <ModulesControlButtons />
                    </div>
                    {module.lessons && (
                        <ListGroup className="wd-lessons rounded-0">
                            {module.lessons.map((lesson: any) => (
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <BsGripVertical className="me-2 fs-3" /> {lesson.name} <ModulesControlButtons />
                                </ListGroup.Item>
                            ))}
                    </ListGroup>)}
                </ListGroup.Item>))}
            </ListGroup>
        </div>
    );
}

function uuidv4() {
    throw new Error("Function not implemented.");
}
