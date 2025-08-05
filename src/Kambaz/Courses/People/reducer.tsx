import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    people: [],
};

const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {
        setPeople: (state, action) => {
            state.people = action.payload;
        },
        addPerson: (state, { payload: person }) => {
            const newPerson: any = {
                _id: person._id || uuidv4(),
                username: person.username,
                firstName: person.firstName,
                lastName: person.lastName,
                email: person.email,
                role: person.role,
                loginId: person.loginId,
                section: person.section,
                lastActivity: person.lastActivity || new Date().toISOString().split('T')[0],
                totalActivity: person.totalActivity || "0:00:00"
            };
            state.people = [...state.people, newPerson] as any;
        },
        deletePerson: (state, { payload: personId }) => {
            state.people = state.people.filter(
                (person: any) => person._id !== personId);
        },
        updatePerson: (state, { payload: person }) => {
            state.people = state.people.map((p: any) =>
                p._id === person._id ? person : p) as any;
        },
    },
});

export const { setPeople, addPerson, deletePerson, updatePerson } =
    peopleSlice.actions;
export default peopleSlice.reducer;
