
import { useState, useCallback } from 'react';

type HistoryState<T> = {
    history: T[];
    currentIndex: number;
};

/**
 * A custom hook to manage state with undo/redo functionality.
 * @param initialState The initial state value.
 * @returns A tuple containing:
 *  - The current state.
 *  - A function to update the state and add to history.
 *  - An undo function.
 *  - A redo function.
 *  - A boolean indicating if undo is possible.
 *  - A boolean indicating if redo is possible.
 */
export const useHistoryState = <T>(initialState: T): [
    T,
    (newState: T) => void,
    () => void,
    () => void,
    boolean,
    boolean
] => {
    const [state, setState] = useState<HistoryState<T>>({
        history: [initialState],
        currentIndex: 0,
    });

    const currentState = state.history[state.currentIndex];

    const updateState = useCallback((newState: T) => {
        // Prevent pushing the same state consecutively
        if (JSON.stringify(newState) === JSON.stringify(currentState)) {
            return;
        }

        const newHistory = state.history.slice(0, state.currentIndex + 1);
        newHistory.push(newState);
        
        setState({
            history: newHistory,
            currentIndex: newHistory.length - 1,
        });
    }, [state.currentIndex, state.history, currentState]);
    
    const undo = useCallback(() => {
        if (state.currentIndex > 0) {
            setState(s => ({ ...s, currentIndex: s.currentIndex - 1 }));
        }
    }, [state.currentIndex]);

    const redo = useCallback(() => {
        if (state.currentIndex < state.history.length - 1) {
            setState(s => ({ ...s, currentIndex: s.currentIndex + 1 }));
        }
    }, [state.currentIndex, state.history.length]);
    
    const canUndo = state.currentIndex > 0;
    const canRedo = state.currentIndex < state.history.length - 1;

    return [currentState, updateState, undo, redo, canUndo, canRedo];
};
