/**
 *
 * Code mirror based Editor
 *
 * @author sriram, psarando
 *
 */
import React, { useEffect, useRef, useState } from "react";

import { EditorView, lineNumbers } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { minimalSetup } from "codemirror";

import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";
import viewerConstants from "./constants";

import Skeleton from "@material-ui/lab/Skeleton";

export default function Editor(props) {
    const {
        baseId,
        // mode = "",
        showLineNumbers,
        editable,
        wrapText,
        editorValue,
        setEditorValue,
        setDirty,
    } = props;

    const [wrapTextConfig] = useState(new Compartment());
    const [lineNumbersConfig] = useState(new Compartment());
    const [readOnlyConfig] = useState(new Compartment());
    const [editorView, setEditorView] = useState();
    const [editorState] = useState(
        EditorState.create({
            doc: editorValue,
            extensions: [
                minimalSetup,
                wrapTextConfig.of(wrapText ? EditorView.lineWrapping : []),
                lineNumbersConfig.of(showLineNumbers ? lineNumbers() : []),
                readOnlyConfig.of(EditorState.readOnly.of(!editable)),
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

    useEffect(() => {
        if (editorView) {
            editorView.dispatch({
                effects: wrapTextConfig.reconfigure(
                    wrapText ? EditorView.lineWrapping : []
                ),
            });
        }
    }, [editorView, wrapText, wrapTextConfig]);

    useEffect(() => {
        if (editorView) {
            editorView.dispatch({
                effects: lineNumbersConfig.reconfigure(
                    showLineNumbers ? lineNumbers() : []
                ),
            });
        }
    }, [editorView, lineNumbersConfig, showLineNumbers]);

    useEffect(() => {
        if (editorView) {
            editorView.dispatch({
                effects: readOnlyConfig.reconfigure(
                    EditorState.readOnly.of(!editable)
                ),
            });
        }
    }, [editorView, readOnlyConfig, editable]);

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
