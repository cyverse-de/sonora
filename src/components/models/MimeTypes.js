import { CODE_MIRROR_MODES } from "components/data/viewers/Editor";
const mimeTypes = {
    // Images
    PNG: "png",
    GIF: "gif",
    JPEG: "jpeg",

    // Video
    MP4: "mp4",
    OGG: "ogg",
    WEBM: "webm",

    // DocumentViewer types
    PDF: "pdf",
    PLAIN: "plain",
    HTML: "html",
    XHTML_XML: "xhtml+xml",
    PREVIEW: "preview",

    // More common scientific languages
    X_AWK: "x-awk",
    X_SH: "x-sh",
    X_PERL: "x-perl",
    X_RSRC: "x-rsrc", // R
    X_PYTHON: "x-python",
    X_CSRC: "x-csrc", // C
    X_CPPSRC: "x-c++src", // C++
    X_FORTRAN: "x-fortran",
    MATHEMATICA: "mathematica",
    X_MATLAB: "x-matlab",
    X_RUBY: "x-ruby",
    X_SAS: "x-sas",
    VIZ: "viz", // not sure what this is

    // Markup & web languages
    X_WEB_MARKDOWN: "x-web-markdown",
    X_ASCIIDOC: "x-asciidoc",
    CSS: "css",
    X_HAML: "x-haml",
    JAVASCRIPT: "javascript",
    JSON: "json",
    X_LATEX: "x-latex",
    X_TEX: "x-tex",
    XML: "xml",
    X_YAML: "x-yaml",

    // long-tail languages
    X_ACTIONSCRIPT: "x-actionscript",
    X_ADA: "x-ada",
    X_APPLESCRIPT: "x-applescript",
    X_ASPECTJ: "x-aspectj",
    X_BASIC: "x-basic",
    X_CLOJURE: "x-clojure",
    X_COFFEESCRIPT: "x-coffeescript",
    X_CSHARP: "x-csharp",
    X_D: "x-d",
    DIFF: "x-diff",
    BATCH: "x-bat", // windows/dos batch file
    X_ERLANG: "x-erlang",
    X_GO: "x-go",
    X_GROOVY: "x-groovy",
    X_HASKELL: "x-haskell",
    X_HAXE: "x-haxe",
    X_INI: "x-ini", // also TOML, but we can't detect that right now
    X_JAVA_SOURCE: "x-java-source",
    X_JAVA_PROPERTIES: "x-java-properties",
    X_COMMON_LISP: "x-common-lisp",
    X_LUA: "x-lua",
    X_MAKEFILE: "x-makefile",
    X_OBJCSRC: "x-objcsrc", // Objective-C
    X_OCAML: "x-ocaml",
    X_PHP: "x-php",
    X_PROLOG: "x-prolog",
    X_SCALA: "x-scala",
    X_SCHEME: "x-scheme",
    X_STSRC: "x-stsrc", // Smalltalk
    X_SQL: "x-sql",
    X_TCL: "x-tcl",
    X_VBDOTNET: "x-vbdotnet",
    X_VERILOG: "x-verilog",
    X_VHDL: "x-vhdl",
    XQUERY: "xquery",
};
const getViewerMode = (mimeType) => {
    let mode = null;
    if (mimeType) {
        switch (mimeType) {
            case mimeTypes.X_RSRC:
                mode = CODE_MIRROR_MODES.R;
                break;
            case mimeTypes.X_PYTHON:
                mode = CODE_MIRROR_MODES.PYTHON;
                break;
            case mimeTypes.X_YAML:
                mode = CODE_MIRROR_MODES.YAML;
                break;
            case mimeTypes.X_WEB_MARKDOWN:
                mode = CODE_MIRROR_MODES.GITHUB_FLAVOR_MARKDOWN;
                break;
            case mimeType.X_SH:
                mode = CODE_MIRROR_MODES.SHELL;
                break;
            case mimeType.X_PERL:
                mode = CODE_MIRROR_MODES.PERL;
                break;
            default:
                mode = "";
        }
    }

    return mode;
};

const getMimeTypeFromString = (typeString) => {
    if (!typeString) {
        return null;
    }
    const tokens = typeString.split("/");
    if (tokens?.length > 1) {
        const type = getKeyByValue(mimeTypes, tokens[1]);
        return mimeTypes[type];
    } else {
        const type = getKeyByValue(mimeTypes, tokens[0]);
        return mimeTypes[type];
    }
};

const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
};

export { mimeTypes, getMimeTypeFromString, getViewerMode };
