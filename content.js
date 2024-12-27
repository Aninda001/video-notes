function createShadowElement() {
    const hostElement = document.createElement("div");
    hostElement.id = "notes-host";

    const shadowRoot = hostElement.attachShadow({ mode: "open" });

    const container = document.createElement("div");

    const bootstrapCssURL = chrome.runtime.getURL("styles/bootstrap.min.css");
    const summernoteCssURL = chrome.runtime.getURL(
        "styles/summernote-bs5.min.css",
    );

    const fontStyle = document.createElement("style");
    fontStyle.textContent = `
        @font-face {
        font-display: auto;
        font-family: summernote;
        font-style: normal;
        font-weight: 400;
        src: url("${chrome.runtime.getURL("styles/font/summernote.eot")}?#iefix") format("embedded-opentype"),
            url("${chrome.runtime.getURL("styles/font/summernote.woff2")}") format("woff2"),
            url("${chrome.runtime.getURL("styles/font/summernote.woff")}") format("woff"),
            url("${chrome.runtime.getURL("styles/font/summernote.ttf")}") format("truetype");
        }
    `;
    document.head.appendChild(fontStyle);

    container.innerHTML = `
        <link href="${bootstrapCssURL}" rel="stylesheet" />
        <link href="${summernoteCssURL}" rel="stylesheet" />

        <style>
            /* Disable resize handle */
            .note-resizebar {
                display: none !important;
            }

            /* Fix table dimension picker */
            .note-dimension-picker {
                font - size: 18px;
                margin: 5px 0;
            }

            .note-dimension-picker .note-dimension-picker-mousecatcher {
                position: absolute !important;
                z - index: 3;
                width: 10em;
                height: 10em;
                cursor: pointer;
            }

            .note-dimension-picker .note-dimension-picker-unhighlighted {
                position: relative !important;
                z - index: 1;
                width: 5em;
                height: 5em;
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASAgMAAAAroGbEAAAACVBMVEUAAIj4+Pjp6ekKlAqjAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfYAR0BKhmnaJzPAAAAG0lEQVQI12NgAAOtVatWMTCohoaGUY+EmIkEAEruEzK2J7tvAAAAAElFTkSuQmCC") repeat;
            }

            .note-dimension-picker .note-dimension-picker-highlighted {
                position: absolute !important;
                z - index: 2;
                width: 1em;
                height: 1em;
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASAgMAAAAroGbEAAAACVBMVEUAAIjd6vvD2f9LKLW+AAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfYAR0BKwNDEVT0AAAAG0lEQVQI12NgAAOtVatWMTCohoaGUY+EmIkEAEruEzK2J7tvAAAAAElFTkSuQmCC") repeat;
            }

            .m-5 {
                background - color: #f1f1f1;
                padding: 0.3em;
                border - radius: 0.3em;
                margin: 0.5em;
            }    /* Force height for first editor */
    #editor1 .note-editable {
        height: 50px !important;
        min-height: 50px !important;
        max-height: 50px !important;
        overflow-y: auto;
    }   .custom-resizer {
            height: 10px;
            background: #f5f5f5;
            cursor: ns-resize;
            border-top: 1px solid #ddd;
            margin-top: -1px;
        }
        .custom-resizer::after {
            content: '';
            display: block;
            width: 20px;
            height: 1px;
            background: #ddd;
            margin: 4px auto;
        }     </style>
        <div class="m-5">
            <div id="toolbar"></div>

            <!-- first div -->
            <div class="summernote" id="editor1"></div>

            <!-- second div -->
            <div class="summernote" id="editor2"></div>
        </div>
        `;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            shadowRoot.appendChild(script);
        });
    }

    // Load scripts in sequence
    loadScript(chrome.runtime.getURL("scripts/jquery-3.6.0.min.js"))
        .then(() =>
            loadScript(
                chrome.runtime.getURL("scripts/bootstrap.bundle.min.js"),
            ),
        )
        .then(() =>
            loadScript(chrome.runtime.getURL("scripts/summernote-bs5.min.js")),
        )
        .then(() => {
            // Append the container to shadow root
            shadowRoot.appendChild(container);

            loadScript(chrome.runtime.getURL("scripts/initsummernote.js"));
        })
        .catch((error) => {
            console.error("Error loading scripts:", error);
        });

    document.body.appendChild(hostElement);
}

createShadowElement();
