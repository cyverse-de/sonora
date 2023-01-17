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

import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";

import { StreamLanguage } from "@codemirror/language";
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile";
import { perl } from "@codemirror/legacy-modes/mode/perl";
import { r } from "@codemirror/legacy-modes/mode/r";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";
import viewerConstants, { CODE_MIRROR_MODES } from "./constants";

import Skeleton from "@material-ui/lab/Skeleton";

export default function Editor(props) {
    const {
        baseId,
        mode = "",
        showLineNumbers,
        editable,
        wrapText,
        initialValue,
        setEditorValue,
    } = props;

    const [wrapTextConfig] = useState(new Compartment());
    const [lineNumbersConfig] = useState(new Compartment());
    const [readOnlyConfig] = useState(new Compartment());
    const [languageConfig] = useState(new Compartment());
    const [editorView, setEditorView] = useState();

    const editor = useRef(null);

    useEffect(() => {
        const extensions = [
            minimalSetup,
            wrapTextConfig.of([]),
            lineNumbersConfig.of([]),
            readOnlyConfig.of([]),
            languageConfig.of([]),
            EditorView.baseTheme({
                "&": { height: viewerConstants.DEFAULT_VIEWER_HEIGHT },
            }),
            EditorView.updateListener.of(
                setEditorValue
                    ? (viewUpdate) => {
                          if (viewUpdate.docChanged) {
                              setEditorValue(viewUpdate.state.doc.toString());
                          }
                      }
                    : []
            ),
        ];

        const state = EditorState.create({
            doc: initialValue,
            extensions,
        });
        const view = new EditorView({
            state,
            parent: editor.current,
        });

        setEditorView(view);

        return () => view.destroy();
    }, [
        editor,
        initialValue,
        setEditorValue,
        wrapTextConfig,
        lineNumbersConfig,
        readOnlyConfig,
        languageConfig,
    ]);

    useEffect(() => {
        if (editorView) {
            editorView.dispatch(
                editorView.state.update({
                    changes: {
                        insert: initialValue,
                        from: 0,
                        to: editorView.state.doc.length,
                    },
                    selection: editorView.state.selection,
                })
            );
        }
    }, [editorView, initialValue]);

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

    useEffect(() => {
        if (editorView) {
            let lang;
            switch (mode) {
                case CODE_MIRROR_MODES.DOCKERFILE:
                    lang = StreamLanguage.define(dockerFile);
                    break;
                case CODE_MIRROR_MODES.GITHUB_FLAVORED_MARKDOWN:
                    lang = markdown();
                    break;
                case CODE_MIRROR_MODES.PERL:
                    lang = StreamLanguage.define(perl);
                    break;
                case CODE_MIRROR_MODES.PYTHON:
                    lang = python();
                    break;
                case CODE_MIRROR_MODES.R:
                    lang = StreamLanguage.define(r);
                    break;
                case CODE_MIRROR_MODES.SHELL:
                    lang = StreamLanguage.define(shell);
                    break;
                case CODE_MIRROR_MODES.YAML:
                    lang = StreamLanguage.define(yaml);
                    break;
                default:
                    lang = [];
                    break;
            }

            editorView.dispatch({
                effects: languageConfig.reconfigure(lang),
            });
        }
    }, [editorView, languageConfig, mode]);

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
