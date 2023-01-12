/**
 *
 * Code mirror based Editor
 *
 * @author sriram, psarando
 *
 */
import React, { useEffect, useRef, useState } from "react";

import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { minimalSetup } from "codemirror";

import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";
import viewerConstants from "./constants";

import Skeleton from "@material-ui/lab/Skeleton";

export default function Editor(props) {
    const {
        baseId,
        // mode = "",
        // showLineNumbers,
        // editable,
        // wrapText,
        editorValue,
        setEditorValue,
        setDirty,
    } = props;

    const [editorView, setEditorView] = useState();
    const [editorState] = useState(
        EditorState.create({
            doc: editorValue,
            extensions: [
                minimalSetup,
                EditorView.baseTheme({
                    "&": { height: viewerConstants.DEFAULT_VIEWER_HEIGHT },
                }),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        setEditorValue(v.state.doc.toString());
                    }
                    setDirty(v.docChanged);
                }),
            ],
        })
    );

    const editor = useRef(null);

    useEffect(() => {
        const view = new EditorView({
            state: editorState,
            parent: editor.current,
        });

        setEditorView(view);

        return () => view.destroy();
    }, [editor, editorState]);

    return (
        <>
            <div ref={editor} />
            {!editorView && (
                <Skeleton
                    id={buildID(baseId, ids.EDITOR_SKELETON)}
                    animation="wave"
                    width="100%"
                    height={viewerConstants.DEFAULT_VIEWER_HEIGHT}
                />
            )}
        </>
    );
}
