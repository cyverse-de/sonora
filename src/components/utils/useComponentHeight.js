/**
 * @author aramsey
 *
 * A hook that will provide the height of a component.
 * The component must create a ref and call `setRef` in order for this to work.
 *
 * Inspired by https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
 * and https://github.com/Swizec/useDimensions, though neither of these methods
 * completely worked during testing.
 */

import { useEffect, useState } from "react";

function getHeight(ref) {
    if (ref && ref.current) {
        return ref.current.getBoundingClientRect().height;
    } else {
        return 0; // 0 in the case the nav bar is hidden e.g. on mobile
    }
}

function useComponentHeight() {
    const [height, setHeight] = useState(null);
    const [ref, setRef] = useState(null);

    useEffect(() => {
        if (ref) {
            window.addEventListener("resize", () => {
                setHeight(getHeight(ref));
            });
            setHeight(getHeight(ref));
        }
    }, [ref, setHeight]);

    return [height, setRef];
}

export default useComponentHeight;
