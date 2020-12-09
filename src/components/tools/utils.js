const canShare = (selectedTools) => {
    return (
        selectedTools &&
        selectedTools.length > 0 &&
        !selectedTools.find((tool) => tool.permission !== "own")
    );
};

export { canShare };
