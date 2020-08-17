import { useLocalStorage } from "../utils/localStorage";

export const useOpsBag = (name) => {
    const [bagValue, setBagValue] = useLocalStorage(name, []);

    const addToBag = (item) => setBagValue([...bagValue, item]);

    const removeFromBag = (index) =>
        setBagValue([...bagValue].splice(index, 1));

    return [bagValue, addToBag, removeFromBag];
};
