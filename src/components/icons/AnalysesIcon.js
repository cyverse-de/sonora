// npx @svgr/cli --icon --replace-attr-values "#fff=currentColor" analyses.svg  > AnalysesIcon.js
import * as React from "react";

function SvgAnalyses(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <g fill="currentColor">
                <path d="M14.556 9.708h2.583V20.03h-2.583zM10.647 11.232h2.434v9.727h-2.434zM6.971 14.154h2.193v5.336H6.97z" />
            </g>
            <g fill="none" stroke="currentColor" strokeWidth={3}>
                <path
                    d="M22 12a10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2a10 10 0 0110 10z"
                    stroke="none"
                />
                <path
                    d="M20.929 12A8.929 8.929 0 0112 20.929 8.929 8.929 0 013.071 12 8.929 8.929 0 0112 3.071 8.929 8.929 0 0120.929 12z"
                    strokeWidth={2.14287}
                />
            </g>
        </svg>
    );
}

export default SvgAnalyses;
