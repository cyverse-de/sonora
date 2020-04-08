import React, { useState } from "react";

import Drawer from "../../src/components/data/SelectionDrawer";
import { fileTypesResp, pagedDirectoryResp, dataRootsResp } from "./DataMocks";
import ResourceTypes from "../../src/components/models/ResourceTypes";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import { mockAxios } from "../axiosMock";

import { Button, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";

export const SelectionDrawer = () => {
    mockAxios
        .onGet(/\/api\/filesystem\/paged-directory.*/)
        .reply(200, pagedDirectoryResp);
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);

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
                        component={FormResourceSelector}
                    />
                    <Field
                        name="foldersOnly"
                        label="Folders Only"
                        acceptedType={ResourceTypes.FOLDER}
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
