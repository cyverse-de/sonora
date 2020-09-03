const mimeTypes = {
    PNG: "png",
    GIF: "gif",
    JPEG: "jpeg",
    MP4: "mp4",
    OGG: "ogg",
    WEBM: "webm",
    PDF: "pdf",
    PLAIN: "plain",
    HTML: "html",
    XHTML_XML: "xhtml+xml",
    PREVIEW: "preview",
    X_SH: "x-sh",
    VIZ: "viz",
    X_PERL: "x-perl",
    X_RSRC: "x-rsrc",
    X_PYTHON: "x-python",
    X_WEB_MARKDOWN: "x-web-markdown",
};
const getViewerMode = (mimeType) => {
    let mode = null;
    switch (mimeType) {
        case mimeTypes.X_SH:
            mode = "shell";
            break;
        case mimeTypes.X_PYTHON:
            mode = "python";
            break;
        case mimeTypes.X_PERL:
            mode = "perl";
            break;
        case mimeTypes.X_RSRC:
            mode = "r";
            break;
        case mimeTypes.X_WEB_MARKDOWN:
            mode = "markdown";
            break;
        default:
            break  
    }
    return mode;
};

export { mimeTypes, getViewerMode };
