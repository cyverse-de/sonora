/**
 * View text files
 *
 * @author sriram
 *
 */
import React, { useState } from "react";

import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import highlightStyle from "react-syntax-highlighter/dist/cjs/styles/hljs/default-style";

import ids from "./ids";
import Toolbar from "./Toolbar";

import PageWrapper from "components/layout/PageWrapper";

import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";

import { CircularProgress, TextField } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

function ModeSelect(props) {
    const { baseId, mode, handleModeSelect, style } = props;
    const languages = SyntaxHighlighter.supportedLanguages;
    const { t } = useTranslation("data");

    return (
        <Autocomplete
            id={baseId}
            value={mode}
            options={languages}
            size="small"
            style={style}
            onChange={handleModeSelect}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t("syntaxHighlighterMode")}
                    variant="outlined"
                />
            )}
        />
    );
}

export default function TextViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        data,
        loading,
        mode,
        handlePathChange,
        handleModeSelect,
        onRefresh,
        fileName,
    } = props;
    const [showLineNumbers, setShowLineNumbers] = useState(true);

    return (
        <PageWrapper
            appBarHeight={120}
            id={build(baseId, ids.VIEWER_PLAIN, fileName)}
        >
            <Toolbar
                baseId={build(baseId, ids.VIEWER_DOC, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={showLineNumbers}
                onShowLineNumbers={(show) => setShowLineNumbers(show)}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                modeSelect={
                    <ModeSelect
                        baseId={build(
                            baseId,
                            ids.VIEWER_PLAIN,
                            ids.SELECT_MODE_INPUT
                        )}
                        style={{ width: 200 }}
                        mode={mode}
                        handleModeSelect={handleModeSelect}
                    />
                }
            />
            {loading && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <SyntaxHighlighter
                customStyle={{
                    overflow: "auto",
                    width: "auto",
                }}
                language={mode}
                style={highlightStyle}
                showLineNumbers={showLineNumbers}
                showInlineLineNumbers={true}
                wrapLines={true}
            >
                {data}
            </SyntaxHighlighter>
        </PageWrapper>
    );
}
