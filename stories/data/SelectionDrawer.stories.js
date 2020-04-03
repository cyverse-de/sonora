import React, { useState } from "react";

import Drawer from "../../src/components/data/SelectionDrawer";
import { fileTypesResp, pagedDirectoryResp, dataRootsResp } from "./DataMocks";
import EntityTypes from "../../src/components/models/EntityTypes";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

import { Button, TextField } from "@material-ui/core";
import fetchMock from "fetch-mock";
import { Field, Form, Formik } from "formik";

export const SelectionDrawer = () => {
    fetchMock
        .get(/\/api\/filesystem\/paged-directory.*/, pagedDirectoryResp)
        .get(/\/api\/filesystem\/root.*/, dataRootsResp)
        .get(/\/api\/filetypes\/type-list/, fileTypesResp);

    function BrowseButton(props) {
        const {
            startingPath,
            acceptedType,
            multiSelect,
            name,
            setFieldValue,
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
                            setOpen(false);
                            setFieldValue(name, selections);
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
            form: { setFieldValue },
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
                    onChange={(value) => setFieldValue(field.name, value)}
                    {...field}
                    {...custom}
                />
                <BrowseButton
                    startingPath={startingPath}
                    acceptedType={acceptedType}
                    multiSelect={multiSelect}
                    name={field.name}
                    setFieldValue={setFieldValue}
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
                filesOnly: ["iplant/home/shared/txt.txt"],
                foldersOnly: ["iplant/home/shared"],
            }}
            render={() => (
                <Form>
                    <Field
                        name="anySingleResource"
                        label="Any Single Resource"
                        acceptedType={EntityTypes.ANY}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="singleFileOnly"
                        label="Single File Only"
                        acceptedType={EntityTypes.FILE}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="singleFolderOnly"
                        label="Single Folder Only"
                        acceptedType={EntityTypes.FOLDER}
                        multiSelect={false}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="filesOnly"
                        label="Files Only"
                        acceptedType={EntityTypes.FILE}
                        multiSelect={true}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
                    />
                    <Field
                        name="foldersOnly"
                        label="Folders Only"
                        acceptedType={EntityTypes.FOLDER}
                        multiSelect={true}
                        startingPath="/iplant/home/ipcdev"
                        component={FormResourceSelector}
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
    title: "Data",
};
