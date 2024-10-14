import { create } from "@mui/material/styles/createTransitions";
import { createSlice } from "@reduxjs/toolkit";

export const drawingSlice = createSlice({
    name: 'drawing',
    initialState: {
        drawingItem: null,
        level: null,
        draw: null
    },
    reducers: {
        drawingItem: (state, drawingItem) => {
            return { ...state, drawingItem };
        },
        level: (state, level) => {
            return { ...state, level };
        },
        draw: (state, draw) => {
            return { ...state, draw }
        }
    }
})