import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

// Get all assignments for a course
export const findAssignmentsForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/assignments`);
    return data;
};

// // Get all assignments
// export const findAllAssignments = async () => {
//     const { data } = await axiosWithCredentials.get(ASSIGNMENTS_API);
//     return data;
// };

// Get assignment by ID
export const findAssignmentById = async (assignmentId: string) => {
    const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${assignmentId}`);
    return data;
};

// Create new assignment for a course
export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/assignments`, assignment);
    return data;
};

// // Create assignment (legacy function - keeping for compatibility)
// export const createAssignment = async (assignment: any) => {
//     if (assignment.course) {
//         return createAssignmentForCourse(assignment.course, assignment);
//     }
//     throw new Error("Course ID is required to create an assignment");
// };

// Delete assignment
export const deleteAssignment = async (assignmentId: string) => {
    const { data } = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    return data;
};

// Update assignment
export const updateAssignment = async (assignment: any) => {
    const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return data;
};
