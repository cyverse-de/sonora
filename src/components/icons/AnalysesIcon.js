// npx @svgr/cli --icon --replace-attr-values "#fff=currentColor" analyses.svg  > AnalysesIcon.js
import * as React from "react";

function SvgAnalyses(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 28 28"
            {...props}
        >
            <g fill="currentColor">
                <path d="M17.579 10.791h3.615v14.452h-3.615zM12.106 12.925h3.407v13.618h-3.407zM6.96 17.016h3.069v7.47H6.96z" />
            </g>
            <g fill="none" stroke="currentColor" strokeWidth={3}>
                <circle cx={14} cy={14} r={14} stroke="none" />
                <circle cx={14} cy={14} r={12.5} />
            </g>
        </svg>
    );
}

export default SvgAnalyses;
