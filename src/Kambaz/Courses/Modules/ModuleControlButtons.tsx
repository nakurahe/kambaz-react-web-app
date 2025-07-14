import { FiPlus } from "react-icons/fi";
import GreenCheckmark from "./GreenCheckmark";
export default function ModulesControlButtons() {
    return (
        <div className="float-end">
            <GreenCheckmark />
            <FiPlus className="fs-4" />
        </div>
    );
}