import React from "react";

function SvgTerminal(props) {
    return (
        <svg width={30} height={30} viewBox="0 0 30 30" {...props}>
            <defs>
                <clipPath id="a">
                    <path d="M0 0H30V30H0z" />
                </clipPath>
            </defs>
            <g clipPath="url(#a)">
                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path
                        d="M.27 0C.09 0 0 .152 0 .341v23.318A.311.311 0 00.27 24h23.46a.311.311 0 00.27-.341V.341C24 .114 23.88 0 23.73 0H.27z"
                        transform="translate(2.501 3)"
                    />
                    <path
                        d="M2 2v20h20V2H2M.27 0h23.46c.15 0 .27.114.27.341V23.66c0 .19-.12.341-.27.341H.27c-.15 0-.27-.152-.27-.341V.34C0 .151.09 0 .27 0z"
                        fill="#fff"
                        transform="translate(2.501 3)"
                    />
                </g>
                <path
                    d="M6.791 8.842l-5.116 5.117a.632.632 0 01-.893 0l-.6-.6a.632.632 0 010-.892L4.239 8.4.184 4.322a.632.632 0 010-.892l.6-.6a.632.632 0 01.893 0l5.114 5.119a.632.632 0 010 .893zm10.057 4.818v-.842a.632.632 0 00-.632-.632h-8a.632.632 0 00-.632.632v.842a.632.632 0 00.632.632h8a.632.632 0 00.632-.631z"
                    transform="translate(6.077 6.53)"
                    fill="#fff"
                />
            </g>
        </svg>
    );
}

export default SvgTerminal;
