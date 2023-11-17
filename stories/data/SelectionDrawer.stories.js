import React, { useState } from "react";

import Drawer from "../../src/components/data/SelectionDrawer";
import { initMockAxiosFileFolderSelector } from "./DataMocks";
import ResourceTypes from "../../src/components/models/ResourceTypes";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import { Button, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";

export const SelectionDrawer = () => {
    initMockAxiosFileFolderSelector();

    function BrowseButton(props) {
        const {
            startingPath,
            acceptedType,
            multiSelect,
            name,
            setFieldValue,
            values,
        } = props;
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button color={"primary"} onClick={() => setOpen(true)}>
                    Browse
                </Button>
                <UploadTrackingProvider>
                    <Drawer
                        open={open}
                        onClose={() => setOpen(false)}
                        startingPath={startingPath}
                        acceptedType={acceptedType}
                        onConfirm={(selections) => {
                            if (multiSelect) {
                                const currValue = values[name];
                                const updatedSelections = new Set([
                                    ...currValue,
                                    ...selections,
                                ]);
                                const paths = updatedSelections
                                    ?.map((sel) => sel.path)
                                    .join(",");
                                setFieldValue(
                                    name,
                                    currValue?.concat(",", paths)
                                );
                            } else {
                                setFieldValue(name, selections);
                            }
                            setOpen(false);
                        }}
                        baseId="dataSelection"
                        multiSelect={multiSelect}
                    />
                </UploadTrackingProvider>
            </>
        );
    }

    function FormResourceSelector(props) {
        const {
            field,
            form: { values, setFieldValue },
            startingPath,
            acceptedType,
            multiSelect,
            ...custom
        } = props;

        return (
            <div>
                <TextField
                    variant="outlined"
                    margin="dense"
                    readOnly={true}
                    multiline={multiSelect}
                    {...field}
                    {...custom}
                />
                <BrowseButton
                    startingPath={startingPath}
                    acceptedType={acceptedType}
                    multiSelect={multiSelect}
                    name={field.name}
                    setFieldValue={setFieldValue}
                    values={values}
                />
            </div>
        );
    }

    return (
        <Formik
            onSubmit={(values) => console.log(values)}
            initialValues={{
                anySingleResource: "/iplant/home/shared/stuff",
                singleFileOnly: "/iplant/home/shared/file.txt",
                singleFolderOnly: "/iplant/home/shared",
                filesOnly: [{ path: "iplant/home/shared/txt.txt" }],
                foldersOnly: [{ path: "iplant/home/shared" }],
            }}
            render={() => (
                <Form>
                    <Field
                        name="anySingleResource"
                        label="Any Single Resource"
                        acceptedType={ResourceTypes.ANY}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="singleFileOnly"
                        label="Single File Only"
                        acceptedType={ResourceTypes.FILE}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="singleFolderOnly"
                        label="Single Folder Only"
                        acceptedType={ResourceTypes.FOLDER}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="filesOnly"
                        label="Files Only"
                        acceptedType={ResourceTypes.FILE}
                        multiSelect={true}
                        startingPath="/iplant/home/ipcdev"
                        component={MultiInputSelector}
                    />
                    <Field
                        name="foldersOnly"
                        label="Folders Only"
                        acceptedType={ResourceTypes.FOLDER}
                        multiSelect={true}
                        startingPath="/iplant/home/ipcdev"
                        component={MultiInputSelector}
                    />
                    <Button color="primary" type="submit">
                        SAVE
                    </Button>
                </Form>
            )}
        />
    );
};

export default {
    title: "Data / Selection",
};
