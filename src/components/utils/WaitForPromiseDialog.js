import React, { useEffect, useState } from "react";
import DEDialog from "components/utils/DEDialog";

const WaitForPromiseDialog = ({
    errorComponent,
    loadingComponent,
    promise,
    ...dialogProps
}) => {
    const [hasErrored, setHasErrored] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [promiseData, setPromiseData] = useState(null);

    useEffect(() => {
        const cb = async () => {
            return await promise()
                .then((data) => {
                    setIsDone(true);
                    setPromiseData(data);
                })
                .catch((error) => {
                    setHasErrored(true);
                    setPromiseData(error);
                });
        };
        cb();
    }, [promise]);

    return (
        <DEDialog {...dialogProps}>
            {hasErrored
                ? React.isValidElement(errorComponent)
                    ? React.cloneElement(errorComponent, {
                          ...errorComponent.props,
                          data: promiseData,
                      })
                    : errorComponent
                : isDone
                ? React.Children.map((child) => {
                      if (React.isValidElement(child)) {
                          return React.cloneElement(child, {
                              ...child.props,
                              data: promiseData,
                          });
                      }
                      return child;
                  })
                : { loadingComponent }}
        </DEDialog>
    );
};

export default WaitForPromiseDialog;
