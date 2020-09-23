import React from "react";

const BagStateContext = React.createContext();
const BagDispatchContext = React.createContext();

const BagProvider = ({ children }) => {
    const bagReducer = React.useCallback((state, action) => {
        switch (action.kind) {
            case "add":
                break;
            case "remove":
                break;
            case "removeAll":
                break;
            case "get":
            default:
                break;
        }
    }, []);

    const [state, dispatch] = React.useReducer(bagReducer, {
        items: [],
    });

    return (
        <BagStateContext.Provider value={state}>
            <BagDispatchContext.Provider value={dispatch}>
                {children}
            </BagDispatchContext.Provider>
        </BagStateContext.Provider>
    );
};

const useBagState = () => {
    const context = React.useContext(BagStateContext);
    if (!context) {
        throw new Error("useBagState must be used within a <BagProvider>");
    }
    return context;
};

const useBagDispatch = () => {
    const context = React.useContext(BagDispatchContext);
    if (!context) {
        throw new Error("useBagDispatch must be used within a <BagProvider>");
    }
    return context;
};

const useBag = () => {
    const dispatch = useBagDispatch();

    const addItem = React.useCallback(
        (item) => dispatch(item, { kind: "add" }),
        [dispatch]
    );

    const removeItem = React.useCallback(
        (item) => dispatch(item, { kind: "remove" }),
        [dispatch]
    );

    const removeAllItems = React.useCallback(
        (item) => dispatch(item, { kind: "removeAll" }),
        [dispatch]
    );

    const getItems = React.useCallback(
        (item) => dispatch(item, { kind: "get" }),
        [dispatch]
    );

    return {
        state: useBagState(),
        addItem,
        removeItem,
        removeAllItems,
        getItems,
    };
};

export { BagProvider, useBag };
