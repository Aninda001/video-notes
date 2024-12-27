$(document).ready(function () {
    const shadow = document.querySelector("#notes-host").shadowRoot;

    // First editor - small, no toolbar, no resize
    $(shadow.querySelector("#editor1")).summernote({
        height: 50,
        disableResizeEditor: true, // disable resize for first editor
        toolbar: false,
        disableDragAndDrop: true,
    });

    // Second editor - with toolbar and resize enabled
    $(shadow.querySelector("#editor2")).summernote({
        height: 200,
        disableDragAndDrop: true,
        disableResizeEditor: false, // enable resize for second editor
        toolbarContainer: shadow.querySelector("#toolbar"),
        toolbar: [
            ["style", ["style"]],
            [
                "font",
                [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "superscript",
                    "subscript",
                    "clear",
                ],
            ],
            ["fontname", ["fontname"]],
            ["fontsize", ["fontsize"]],
            ["para", ["ul", "ol", "paragraph", "height"]],
            ["insert", ["link", "picture", "video", "hr"]],
            ["view", ["fullscreen", "codeview", "help"]],
        ],
    }); // Add custom resize functionality
    const resizer = document.createElement("div");
    resizer.className = "custom-resizer";
    const editorElement = shadow.querySelector("#editor2").nextElementSibling;
    editorElement.appendChild(resizer);

    let startY;
    let startHeight;

    resizer.addEventListener("mousedown", initResize, false);

    function initResize(e) {
        startY = e.clientY;
        startHeight =
            editorElement.querySelector(".note-editable").offsetHeight;
        shadow.addEventListener("mousemove", resize, false);
        shadow.addEventListener("mouseup", stopResize, false);
    }

    function resize(e) {
        const newHeight = startHeight + (e.clientY - startY);
        editorElement.querySelector(".note-editable").style.height =
            newHeight + "px";
    }

    function stopResize() {
        shadow.removeEventListener("mousemove", resize, false);
        shadow.removeEventListener("mouseup", stopResize, false);
    }
    // Dropdown handling code
    const toolbar = shadow.querySelector(".note-toolbar");
    toolbar.addEventListener("click", function (e) {
        const dropdownToggle = e.target.closest(".dropdown-toggle");
        if (dropdownToggle) {
            e.stopPropagation();
            const dropdownMenu = dropdownToggle.nextElementSibling;
            if (dropdownMenu) {
                const isVisible = dropdownMenu.style.display === "block";
                dropdownMenu.style.display = isVisible ? "none" : "block";
            }
        }
    });

    // Close dropdown when selecting an item
    toolbar.addEventListener("click", function (e) {
        const dropdownItem = e.target.closest(".note-dropdown-item");
        if (dropdownItem) {
            const dropdownMenu = dropdownItem.closest(".note-dropdown-menu");
            if (dropdownMenu) {
                dropdownMenu.style.display = "none";
            }
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (e) {
        if (!shadow.contains(e.target)) {
            const dropdowns = shadow.querySelectorAll(".note-dropdown-menu");
            dropdowns.forEach((dropdown) => {
                dropdown.style.display = "none";
            });
        }
    });
});
