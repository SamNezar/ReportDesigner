<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Designer</title>
    <!-- Styles are embedded for a single file solution -->
    <style>
    /* Main CSS */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: Arial, sans-serif;
        background: #f0f0f0;
        overflow: hidden;
        height: 100vh; /* Ensure body takes full viewport height */
    }
    body.dragging-active, body.dragging-active * { /* Prevent text selection during drag */
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        cursor: grabbing !important; /* Show grabbing cursor everywhere during drag */
    }


    .app-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Toolbar CSS */
    .toolbar {
        background: #e9ecef;
        padding: 8px 12px;
        border-bottom: 1px solid #dee2e6;
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap; /* Allow toolbar items to wrap on smaller screens */
        flex-shrink: 0; /* Prevent toolbars from shrinking */
    }

    .toolbar-group {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .toolbar-group label {
        font-size: 12px;
        color: #495057;
        white-space: nowrap;
    }

    .toolbar-group select,
    .toolbar-group input[type="number"] { /* Keep for padding, but fontSize will be select */
        padding: 4px 8px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        font-size: 12px;
    }
    #fontSizeSelect { /* Specific styling for the new font size select */
         padding: 4px 8px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        font-size: 12px;
        min-width: 60px; /* Give it some base width */
    }


    .toolbar-group input[type="color"] {
        width: 30px;
        height: 25px;
        border: 1px solid #ced4da;
        border-radius: 3px;
        cursor: pointer;
        padding: 2px; /* Ensure color picker looks consistent */
    }

    .toolbar-separator {
        width: 1px;
        height: 20px;
        background: #ced4da;
        margin: 0 5px;
    }

    .toggle-btn,
    .format-btn,
    .align-btn,
    .valign-btn {
        padding: 5px 10px;
        border: 1px solid #ced4da;
        background: #fff;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }

    .toggle-btn.active,
    .format-btn.active,
    .align-btn.active,
    .valign-btn.active {
        background: #007bff;
        color: white;
        border-color: #0056b3;
    }

    .format-btn,
    .align-btn,
    .valign-btn {
        width: 30px; /* Fixed width for consistency */
        height: 25px; /* Fixed height for consistency */
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .main-content {
        flex: 1; /* Allow main content to fill remaining space */
        display: flex;
        overflow: hidden; /* Prevent overflow issues with fixed height toolbars */
    }

    /* Toolbox CSS */
    .toolbox-panel {
        width: 250px;
        background: #f8f9fa;
        border-right: 1px solid #dee2e6;
        padding: 15px;
        overflow-y: auto;
        flex-shrink: 0; /* Prevent toolbox from shrinking */
    }

    .toolbox-panel h3 {
        font-size: 16px;
        color: #495057;
        margin-bottom: 15px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 5px;
    }

    .toolbox-section {
        margin-bottom: 20px;
    }

    .toolbox-section h4 {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 10px;
        font-weight: 600;
    }

    .tool-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 3px;
    }

    .tool-item:hover {
        background: #e9ecef;
        border-color: #ced4da;
    }

    .tool-item.active {
        background: #007bff;
        color: white;
        border-color: #0056b3;
    }

    .tool-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }

    /* Editor CSS */
    .editor-panel {
        flex: 1; /* Editor panel takes remaining width */
        background: #bdc3c7; /* Slightly darker background for contrast */
        display: flex;
        justify-content: center; /* Center the paper */
        align-items: flex-start; /* Align paper to the top */
        padding: 20px;
        overflow: auto; /* Allow scrolling if paper is larger than panel */
    }

    .paper-container {
        position: relative; /* For grid overlay positioning */
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin: 20px; /* Add some margin around the paper */
    }

    .paper {
        background: white;
        position: relative; /* For absolute positioning of report objects */
        border: 1px solid #ccc;
    }

    .paper.a4 { width: 794px; height: 1123px; }
    .paper.a4-landscape { width: 1123px; height: 794px; }
    .paper.a5 { width: 559px; height: 794px; }
    .paper.a5-landscape { width: 794px; height: 559px; }

    .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        background-image:
            linear-gradient(to right, #e0e0e0 1px, transparent 1px),
            linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .grid-overlay.visible {
        opacity: 1;
    }

    /* Report Objects */
    .report-object { /* This is the main draggable, resizable container */
        position: absolute;
        border: 1px solid transparent;
        box-sizing: border-box;
        overflow: hidden; /* Ensures resize handles stay with the visual boundary */
    }
    .report-object.selected {
        border: 1px dashed #007bff !important;
        z-index: 10000 !important;
    }

    .report-object .resize-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #007bff;
        border: 1px solid white;
        box-shadow: 0 0 2px rgba(0,0,0,0.3);
        z-index: 10001; /* Above the object's border */
    }

    .resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
    .resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
    .resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
    .resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
    .resize-handle.n { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .resize-handle.s { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .resize-handle.w { left: -4px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
    .resize-handle.e { right: -4px; top: 50%; transform: translateY(-50%); cursor: e-resize; }

    .textbox-object {
        display: flex; /* For vertical alignment OF ITS CONTENT (.textbox-content) */
        cursor: default; /* Default cursor for the object frame */
    }

    .textbox-content {
        width: 100%;
        /* height: 100%; */ /* MODIFICATION 1: Removed for vertical alignment via parent flex */
        min-height: 1em; /* Ensures some height even if empty */
        border: none;
        outline: none;
        background: transparent;
        resize: none;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        overflow-y: auto; /* Allows scrolling if content bigger than aligned block */
        word-wrap: break-word; /* Ensure long words wrap */
        padding: 0; /* Padding is on the .textbox-object (parent) */
        cursor: text; /* Text cursor for the content area */
    }
    .textbox-content span { /* Ensure spans behave as inline for text flow */
        display: inline !important; /* Override any potential browser defaults */
    }

    .image-object {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: default; /* Default for the container, move cursor handled by JS on frame */
    }
    .image-object img { /* The actual <img> tag */
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain; /* Or 'cover', 'fill', 'scale-down' as needed */
        cursor: default; /* No move cursor on the image itself */
    }
    .image-object .placeholder-text {
        padding: 5px;
        color: #6c757d;
        font-size: 12px;
    }

    .table-object-container { cursor: default; }
    .table-object { /* The <table> element itself */
        width: 100%; height: 100%; border-collapse: collapse;
        font-family: Arial; font-size: 12px; background: white; /* Default cell background */
    }
    .table-object th, .table-object td {
        border: 1px solid #dee2e6; padding: 0; text-align: left; /* Padding is on cell-content */
        position: relative; vertical-align: top; /* Default cell vertical alignment */
    }
    .table-object th { background: #f8f9fa; font-weight: bold; }
    .table-cell-content { /* Div inside each cell for editing and padding */
        width: 100%; height: 100%; border: none; outline: none; background: transparent;
        font-family: inherit; font-size: inherit; color: inherit;
        padding: 4px; min-height: 20px; /* Ensure cell has some clickable height */
        cursor: text;
        /* For potential future use if table cells need flex alignment:
        display: flex;
        align-items: flex-start; // Default
        */
    }

    .line-object-container { /* The main draggable, resizable div for a line */
        cursor: default; /* Default for frame, JS will handle move cursor */
        min-height: 8px; /* Minimum clickable area, actual height driven by borderSize */
        min-width: 8px;
        /* Background is transparent by default from ReportObject, and forced in LineObject JS */
    }
    .line-object { /* This is an inner div, the container .line-object-container gets the border */
        width: 100%;
        height: 100%;
        background: transparent; /* Inner div is always transparent */
        /* The line itself is visually created by the border of its parent `.line-object-container` */
        cursor: move; /* Make the line itself indicate it's draggable */
    }


    /* Context Menu */
    .context-menu {
        position: fixed; background: white; border: 1px solid #ccc; border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 20000; display: none; padding: 5px 0;
    }
    .context-item { padding: 8px 15px; cursor: pointer; font-size: 13px; white-space: nowrap; }
    .context-item:hover { background: #f0f0f0; }

    /* Dialog */
    .dialog {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);
        display: none; align-items: center; justify-content: center; z-index: 21000;
    }
    .dialog-content {
        background: white; padding: 20px; border-radius: 8px; width: 400px;
        max-width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    .dialog-content h3 { margin-top: 0; margin-bottom: 15px; color: #333; }
    .dialog-content label { display: block; margin: 10px 0 5px; font-weight: 600; color: #555; font-size: 13px; }
    .dialog-content input[type="text"], .dialog-content select {
        width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px;
        margin-bottom: 10px; font-size: 13px;
    }
    .dialog-buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
    .dialog-buttons button { padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .dialog-buttons button:first-child { background: #007bff; color: white; }
    .dialog-buttons button:first-child:hover { background: #0056b3; }
    .dialog-buttons button:last-child { background: #6c757d; color: white; }
    .dialog-buttons button:last-child:hover { background: #545b62; }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Toolbars -->
        <div class="toolbar toolbar-page">
            <div class="toolbar-group">
                <label>Page Size:</label>
                <select id="pageSize">
                    <option value="a4">A4</option>
                    <option value="a4-landscape">A4 Landscape</option>
                    <option value="a5">A5</option>
                    <option value="a5-landscape">A5 Landscape</option>
                </select>
            </div>
            <div class="toolbar-group">
                <button id="toggleGrid" class="toggle-btn"><span>Grid</span></button>
            </div>
            <div class="toolbar-separator"></div>
            <div class="toolbar-group">
                <label>Border Style:</label>
                <select id="borderStyle">
                    <option value="solid">Solid</option> <option value="dashed">Dashed</option> <option value="dotted">Dotted</option> <option value="double">Double</option> <option value="none">None</option>
                </select>
            </div>
            <div class="toolbar-group">
                <label>Border Size:</label>
                <select id="borderSize">
                    <option value="0.25">¼pt</option>
                    <option value="0.5">½pt</option>
                    <option value="0.75">¾1pt</option>
                    <option value="1">1pt</option> <option value="2">2pt</option> <option value="3">3pt</option> <option value="4">4pt</option> <option value="5">5pt</option>
                </select>
            </div>
            <div class="toolbar-group">
                <label>Border Color:</label> <input type="color" id="borderColor" value="#000000">
            </div>
            <div class="toolbar-group">
                <label>Border Set:</label>
                <select id="borderSet">
                    <option value="all">Outside</option> <option value="none">None</option> <option value="top">Top</option> <option value="bottom">Bottom</option> <option value="left">Left</option> <option value="right">Right</option>
                </select>
            </div>
        </div>
        <div class="toolbar toolbar-text">
            <div class="toolbar-group">
                <label>Font:</label>
                <select id="fontFamily">
                    <option value="Arial">Arial</option> <option value="Times New Roman">Times New Roman</option> <option value="Courier New">Courier New</option> <option value="Helvetica">Helvetica</option> <option value="Georgia">Georgia</option>
                </select>
            </div>
            <div class="toolbar-group">
                <label>Size:</label>
                <select id="fontSizeSelect">
                    <option value="8">8pt</option>
                    <option value="9">9pt</option>
                    <option value="10">10pt</option>
                    <option value="11">11pt</option>
                    <option value="12" selected>12pt</option>
                    <option value="14">14pt</option>
                    <option value="16">16pt</option>
                    <option value="18">18pt</option>
                    <option value="20">20pt</option>
                    <option value="22">22pt</option>
                    <option value="24">24pt</option>
                    <option value="28">28pt</option>
                    <option value="32">32pt</option>
                    <option value="36">36pt</option>
                    <option value="48">48pt</option>
                    <option value="72">72pt</option>
                </select>
            </div>
            <div class="toolbar-group">
                <button id="boldBtn" class="format-btn" data-format="bold"><b>B</b></button>
                <button id="italicBtn" class="format-btn" data-format="italic"><i>I</i></button>
                <button id="underlineBtn" class="format-btn" data-format="underline"><u>U</u></button>
                <button id="strikeoutBtn" class="format-btn" data-format="strikethrough"><s>S</s></button>
            </div>
            <div class="toolbar-group">
                <label>Text Color:</label> <input type="color" id="foreColor" value="#000000">
            </div>
            <div class="toolbar-group">
                <label>Back Color:</label> <input type="color" id="backColor" value="#ffffff">
            </div>
            <div class="toolbar-group">
                <button id="alignLeft" class="align-btn" data-align="left">⇤</button>
                <button id="alignCenter" class="align-btn" data-align="center">⇔</button>
                <button id="alignRight" class="align-btn" data-align="right">⇥</button>
            </div>
            <div class="toolbar-group">
                <button id="alignTop" class="valign-btn" data-valign="top">⤴</button>
                <button id="alignMiddle" class="valign-btn" data-valign="middle">⬌</button>
                <button id="alignBottom" class="valign-btn" data-valign="bottom">⤵</button>
            </div>
            <div class="toolbar-group">
                <label>Direction:</label>
                <select id="textDirection">
                    <option value="ltr">LTR</option> <option value="rtl">RTL</option>
                </select>
            </div>
            <div class="toolbar-group">
                <label>Line Height:</label>
                <select id="lineHeight">
                    <option value="1">1</option> <option value="1.2">1.2</option> <option value="1.5" selected>1.5</option> <option value="2">2</option>
                </select>
            </div>
            <div class="toolbar-group">
                <label>Padding:</label> <input type="number" id="padding" min="0" max="20" value="2">px
            </div>
            <div class="toolbar-group">
                <input type="file" id="importFile" accept=".xml,.rdlc" style="display: none;">
                <button id="importXmlBtn">Import XML</button>
                <button id="exportXmlBtn">Export XML</button>
              <button id="loghtml" onclick="log_html_()">Log HTML</button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <div class="toolbox-panel">
                <h3>Toolbox</h3>
                <div class="toolbox-section">
                    <h4>Report Items</h4>
                    <div class="tool-item active" data-tool="pointer"><span class="tool-icon">🖱️</span><span>Pointer</span></div>
                    <div class="tool-item" data-tool="textbox"><span class="tool-icon">📝</span><span>Text Box</span></div>
                    <div class="tool-item" data-tool="image"><span class="tool-icon">🖼️</span><span>Image</span></div>
                    <div class="tool-item" data-tool="table"><span class="tool-icon">📊</span><span>Table</span></div>
                    <div class="tool-item" data-tool="line"><span class="tool-icon">📏</span><span>Line</span></div>
                </div>
                <div class="toolbox-section">
                    <h4>Static Field Values</h4>
                    <div class="tool-item" data-tool="field" data-field="invoice_type_name"><span class="tool-icon">🏷️</span><span>[invoice_type_name]</span></div>
                    <div class="tool-item" data-tool="field" data-field="transaction_qty"><span class="tool-icon">🔢</span><span>[transaction_qty]</span></div>
                    <div class="tool-item" data-tool="field" data-field="transaction_name"><span class="tool-icon">📋</span><span>[transaction_name]</span></div>
                    <div class="tool-item" data-tool="field" data-field="invoice_number"><span class="tool-icon">🔢</span><span>[invoice_number]</span></div>
                </div>
            </div>
            <div class="editor-panel">
                <div class="paper-container">
                    <div id="paper" class="paper a4">
                        <div class="grid-overlay" id="gridOverlay"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Context Menu -->
    <div id="contextMenu" class="context-menu">
        <div class="context-item" data-action="delete">Delete</div>
        <div class="context-item" data-action="copy">Copy</div>
        <div class="context-item" data-action="paste">Paste</div>
        <div class="context-item" data-action="bring-front">Bring to Front</div>
        <div class="context-item" data-action="send-back">Send to Back</div>
    </div>

    <!-- Table Column Dialog -->
    <div id="tableColumnDialog" class="dialog">
        <div class="dialog-content">
            <h3>Add Table Column</h3>
            <label for="columnHeader">Column Header:</label>
            <input type="text" id="columnHeader" placeholder="Enter column header">
            <label for="columnDataField">Data Field:</label>
            <select id="columnDataField">
                <option value="item_name">Item Name</option> <option value="item_price">Item Price</option> <option value="item_total">Item Total</option> <option value="item_quantity">Item Quantity</option> <option value="item_description">Item Description</option>
            </select>
            <div class="dialog-buttons">
                <button onclick="addTableColumn()">Add</button>
                <button onclick="closeDialog()">Cancel</button>
            </div>
        </div>
    </div>

    
<script src="RDLCExporter.js"></script>

<script src="RDLCImporter.js"></script>


<script>

function log_html_(){
    if (typeof reportDesigner === 'undefined') {
        console.log('Report Designer not initialized');
        return;
    }
    
    console.log('=== TEXTBOX HTML DEBUG ===');
    reportDesigner.objects.forEach((obj, index) => {
        if (obj.type === 'textbox') {
            console.log(`\nTextbox ${index + 1}:`);
            console.log('Raw HTML:', obj.text);
            console.log('Properties:', {
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height,
                borderStyle: obj.borderStyle,
                borderSet: obj.borderSet,
                borderSize: obj.borderSize,
                borderColor: obj.borderColor,
                fontSize: obj.fontSize,
                fontFamily: obj.fontFamily,
                foreColor: obj.foreColor
            });
            
            if (obj.contentElement) {
                console.log('ContentElement innerHTML:', obj.contentElement.innerHTML);
                console.log('ContentElement outerHTML:', obj.contentElement.outerHTML);
            }
        }
    });
    
    console.log('\n=== END DEBUG ===');
};

    </script>
    <script>

        
    // Base ReportObject Class
    class ReportObject {
        constructor(type, x = 0, y = 0, width = 100, height = 30) {
            this.id = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.type = type;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.selected = false;
            this.element = null;
            this.contentElement = null; // The actual content (e.g., textarea, img, table)
            this.borderStyle = 'solid';
            this.borderSize = 1;
            this.borderColor = '#000000';
            this.borderSet = 'all'; // 'all', 'top', 'bottom', 'left', 'right', 'none'
            this.backgroundColor = (type === 'image' ? '#ffffff' : '#ffffff'); // Default white, line will override
            this.padding = 2; // Default padding for objects like textbox
            this.verticalAlign = 'top'; // Default vertical align for content within the object
        }

        createElement() {
            const element = document.createElement('div');
            // Basic class for all report objects, plus a type-specific class for its container
            element.className = `report-object ${this.type}-object-container`;
            element.id = this.id;
            element.style.left = this.x + 'px';
            element.style.top = this.y + 'px';
            element.style.width = this.width + 'px';
            element.style.height = this.height + 'px';
            element.style.padding = this.padding + 'px';
            element.style.backgroundColor = this.backgroundColor;
            element.style.cursor = 'move'; // Default cursor for the frame

            this.element = element; // This is the outer draggable/resizable div
            this.updateBorder();
            this.addEventListeners();
            return element;
        }

        updateBorder() {
            if (!this.element) return;
            const style = this.element.style;
            // Reset all borders first
            style.border = 'none';
            style.borderTop = 'none'; style.borderRight = 'none';
            style.borderBottom = 'none'; style.borderLeft = 'none';

            if (this.borderSet !== 'none' && this.borderSize > 0) {
                const borderValue = `${this.borderSize}px ${this.borderStyle} ${this.borderColor}`;
                if (this.borderSet === 'all') {
                    style.border = borderValue;
                } else {
                    // Apply to specific side e.g., borderTop, borderLeft
                    style[`border${this.borderSet.charAt(0).toUpperCase() + this.borderSet.slice(1)}`] = borderValue;
                }
            }
        }

        addEventListeners() {
            if (!this.element) return;
            this.element.addEventListener('mousedown', (e) => {
                const isContentClick = this.contentElement && this.contentElement.contains(e.target);
                const isImageContent = this.type === 'image' && isContentClick; // Image content itself isn't draggable by frame
                const isLineContent = this.type === 'line' && isContentClick; // Line content IS draggable

                // Start drag if click is on the frame (not a resize handle) AND not on image content, OR if it's on line content
                if (e.target === this.element && !e.target.classList.contains('resize-handle') && !isImageContent || isLineContent) {
                    if (e.button === 0) { // Left click
                        this.select();
                        reportDesigner.startDrag(e, this);
                    }
                } else if (!this.selected && this.element.contains(e.target) && !e.target.classList.contains('resize-handle')) {
                    // If click is inside an unselected object (but not on its content if content handles its own mousedown for selection)
                    // and not on a resize handle, select the object.
                    // Textbox content handles its own selection via focus.
                    if (this.type !== 'textbox' || !isContentClick) {
                         this.select();
                    }
                }
                // For image content, allow selection by clicking on it, but don't let frame drag start.
                // Dragging the image object is done by its frame.
                // if (isImageContent && e.button === 0) {
                    // e.stopPropagation(); // This might be too aggressive, let's test without
                // }
            });
            this.element.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.select();
                reportDesigner.showContextMenu(e, this);
            });
        }

        select() { reportDesigner.selectObject(this); } // Delegate to designer for global selection management
        updatePosition(x, y) {
            this.x = x; this.y = y;
            if (this.element) { this.element.style.left = x + 'px'; this.element.style.top = y + 'px'; }
        }
        updateSize(width, height) {
            // Minimum dimensions, considering padding for most objects, or borderSize for lines
            const minContentDim = (this.type === 'line') ? (this.borderSize || 1) : 20; // Min content area size
            const totalPadding = (this.type === 'line' || this.type === 'image') ? 0 : parseInt(this.padding) * 2; // Lines/Images don't use this.padding for content box

            this.width = Math.max(width, totalPadding + minContentDim);
            this.height = Math.max(height, totalPadding + minContentDim);

            if (this.element) {
                this.element.style.width = this.width + 'px';
                this.element.style.height = this.height + 'px';
            }
            // If object has vertical alignment, re-apply it as size change might affect it
             if (typeof this.updateVerticalAlignmentStyling === 'function') {
                this.updateVerticalAlignmentStyling();
            }
        }
        addResizeHandles() {
            if (!this.element) return;
            this.removeResizeHandles(); // Clear existing handles
            let handlesToShow = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e']; // Default handles

            if (this.type === 'line') {
                // For lines, handles depend on orientation (borderSet)
                // 'top' or 'bottom' border means a horizontal line, resize W/E for length.
                // 'left' or 'right' border means a vertical line, resize N/S for length.
                // Thickness is controlled by borderSize property via toolbar.
                if (this.borderSet === 'top' || this.borderSet === 'bottom') {
                    handlesToShow = ['w', 'e']; // Adjust length
                } else if (this.borderSet === 'left' || this.borderSet === 'right') {
                    handlesToShow = ['n', 's']; // Adjust length (which is height of the object)
                } else { // 'all' or 'none' border for line (less common, treated as horizontal)
                    handlesToShow = ['w', 'e'];
                }
            }


            handlesToShow.forEach(type => {
                const handle = document.createElement('div');
                handle.className = `resize-handle ${type}`;
                handle.addEventListener('mousedown', (e) => { e.stopPropagation(); reportDesigner.startResize(e, this, type); });
                this.element.appendChild(handle);
            });
        }
        removeResizeHandles() {
            if (!this.element) return;
            this.element.querySelectorAll('.resize-handle').forEach(h => h.remove());
        }
        setSelected(selected) {
            this.selected = selected;
            if (this.element) {
                this.element.classList.toggle('selected', selected);
                selected ? this.addResizeHandles() : this.removeResizeHandles();
            }
        }
        remove() {
            if (this.element && this.element.parentNode) this.element.parentNode.removeChild(this.element);
        }
        applyStyles(styles) {
            // Apply properties from styles object to this object's properties
            for (const prop in styles) {
                if (styles.hasOwnProperty(prop) && this.hasOwnProperty(prop)) {
                     // Special handling for backgroundColor for LineObject (done in its override)
                    if (prop === 'backgroundColor' && this.type === 'line') {
                        continue; // LineObject forces its own background to transparent
                    }
                    this[prop] = styles[prop];
                }
            }
            // Update visual aspects based on new properties
            if (styles.borderStyle !== undefined || styles.borderSize !== undefined || styles.borderColor !== undefined || styles.borderSet !== undefined) {
                this.updateBorder();
            }

            if (this.element && styles.backgroundColor !== undefined && this.type !== 'line') { // Line handles its own BG
                this.element.style.backgroundColor = this.backgroundColor;
            }

            if (styles.padding !== undefined && this.element) {
                this.element.style.padding = this.padding + 'px';
                // Recalculate size because padding affects content area and thus overall dimensions
                this.updateSize(this.width, this.height); // This might be redundant if updateSize is called after applyStyles
            }
            if (styles.verticalAlign !== undefined && typeof this.updateVerticalAlignmentStyling === 'function') {
                this.updateVerticalAlignmentStyling();
            }
        }
    }

    // TextBox Class
    class TextBox extends ReportObject {
        constructor(x, y, width = 150, height = 40, text = 'Text Box') {
            super('textbox', x, y, width, height);
            this.text = text; // Stores the HTML content
            this.fontFamily = 'Arial';
            this.fontSize = 12; // Base font size in px
            this.textAlign = 'left';
            this.textDirection = 'ltr';
            this.lineHeight = 1.5;
            this.foreColor = '#000000';
            // verticalAlign is inherited from ReportObject, default 'top'
        }

        createElement() {
            const element = super.createElement(); // Sets up .report-object, padding, initial bg
            element.classList.remove(`${this.type}-object-container`); // super adds this, we want a more specific one
            element.classList.add(`textbox-object`); // Use specific class for styling (e.g., display: flex)

            const contentDiv = document.createElement('div');
            contentDiv.className = 'textbox-content';
            contentDiv.contentEditable = true;
            contentDiv.spellcheck = false; // Optional: disable browser spellcheck
            contentDiv.innerHTML = this.text; // Set initial text

            // Apply initial text styling to the content div itself
            contentDiv.style.fontFamily = this.fontFamily;
            contentDiv.style.fontSize = this.fontSize + 'px';
            contentDiv.style.color = this.foreColor;
            contentDiv.style.textAlign = this.textAlign;
            contentDiv.style.direction = this.textDirection;
            contentDiv.style.lineHeight = this.lineHeight;
            // contentDiv.style.padding is 0 from CSS, padding is on the parent 'element'

            this.contentElement = contentDiv; // This is the editable div
            element.appendChild(this.contentElement);

            // Initial vertical alignment based on this.verticalAlign
            this.updateVerticalAlignmentStyling();

            // Event listeners for the content div
            contentDiv.addEventListener('input', () => { this.text = contentDiv.innerHTML; /* reportDesigner.updateToolbarStates(); */ });
            contentDiv.addEventListener('mousedown', (e) => {
                if (!this.selected) this.select(); // Select the parent object if content is clicked
                // e.stopPropagation(); // Prevent parent's mousedown if needed, but usually not for textboxes
            });
            contentDiv.addEventListener('focus', () => {
                this.select(); // Ensure parent object is selected when content gets focus
                reportDesigner.activeTextElement = contentDiv;
                setTimeout(() => reportDesigner.updateToolbarStates(), 0); // Update toolbar for text context
            });
            contentDiv.addEventListener('keyup', () => setTimeout(() => reportDesigner.updateToolbarStates(), 0)); // For cursor position changes
            contentDiv.addEventListener('mouseup', () => setTimeout(() => reportDesigner.updateToolbarStates(), 0)); // For selection changes
            contentDiv.addEventListener('paste', (e) => { // Handle plain text paste
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });
            return element;
        }

        updateVerticalAlignmentStyling() {
            if (!this.element) return; // this.element is the .textbox-object (flex container)
            // .textbox-object CSS already has display: flex;
            // this.element.style.display = 'flex'; // This would be redundant but harmless

            // Align .textbox-content (the flex item) within .textbox-object (the flex container)
            switch (this.verticalAlign) {
                case 'top':    this.element.style.alignItems = 'flex-start'; break;
                case 'middle': this.element.style.alignItems = 'center';    break;
                case 'bottom': this.element.style.alignItems = 'flex-end';  break;
                default:       this.element.style.alignItems = 'flex-start'; // Default to top
            }
        }


        applyStyles(styles) {
            const oldFontSize = this.fontSize;
            const oldVerticalAlign = this.verticalAlign; // Store to see if it changed

            super.applyStyles(styles); // Applies general styles, and calls this.updateVerticalAlignmentStyling if verticalAlign changes

            if (this.contentElement) {
                if (styles.fontFamily !== undefined) this.contentElement.style.fontFamily = this.fontFamily;
                if (styles.fontSize !== undefined && styles.fontSize !== oldFontSize) {
                     // This sets the base font size for the entire contentEditable div.
                     // Spans inside will override this for their specific text.
                     this.contentElement.style.fontSize = this.fontSize + 'px';
                }
                if (styles.foreColor !== undefined) this.contentElement.style.color = this.foreColor;
                if (styles.textAlign !== undefined) this.contentElement.style.textAlign = this.textAlign;
                if (styles.textDirection !== undefined) this.contentElement.style.direction = this.textDirection;
                if (styles.lineHeight !== undefined) this.contentElement.style.lineHeight = this.lineHeight;
            }
             // If verticalAlign changed through super.applyStyles, updateVerticalAlignmentStyling was already called.
            // If it was directly set on this object and super didn't catch it (e.g. not in ReportObject's props)
            // ensure it's called. But it is in ReportObject's props, so super should handle it.
        }
    }

    class ImageObject extends ReportObject {
        constructor(x, y, width = 150, height = 100) {
            super('image', x, y, width, height);
            this.src = null; // Data URL of the image
            this.borderStyle = 'none'; // Default for new images, can be changed
            this.borderSize = 0;
            this.backgroundColor = '#ffffff'; // Images might have a white background for placeholder visual
            this.padding = 0; // Images typically don't have internal padding affecting the img tag
        }
        createElement() {
            const element = super.createElement(); // Sets up .report-object
            element.classList.remove(`${this.type}-object-container`); // super adds this
            element.classList.add(`image-object`); // Use specific class for styling (e.g. display:flex for placeholder)
            element.style.cursor = 'move'; // Frame is draggable
            element.style.padding = '0'; // Override padding from super for image container

            const img = document.createElement('img');
            // img.style.display = 'block'; // Handled by flex container now
            // img.style.width = '100%';
            // img.style.height = '100%';
            // img.style.objectFit = 'contain'; // Or 'cover', 'fill' etc.
            img.style.cursor = 'default'; // Image content itself is not draggable

            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-text';
            placeholder.textContent = 'Double-click to add image';
            placeholder.style.cursor = 'default'; // Placeholder also not draggable

            this.contentElement = img; // The <img> tag
            this._placeholderElement = placeholder; // The placeholder div

            this.updateImageDisplay(); // initial display logic based on this.src

            element.addEventListener('dblclick', () => this.selectImage());
            return element;
        }
        selectImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    this.src = ev.target.result;
                    this.updateImageDisplay();
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
        updateImageDisplay() {
            if (!this.element) return;
            // Clear previous content (img or placeholder) but keep resize handles
            Array.from(this.element.childNodes).forEach(child => {
                // Remove if it's not a resize handle AND it's either the placeholder or the image
                if (!child.classList.contains('resize-handle') && (child === this._placeholderElement || child === this.contentElement)) {
                    this.element.removeChild(child);
                }
            });


            if (this.src) {
                // if (this._placeholderElement.parentNode === this.element) this.element.removeChild(this._placeholderElement); // Already handled
                this.contentElement.src = this.src;
                // Insert image before any resize handles if they exist
                if (this.contentElement.parentNode !== this.element) {
                    const firstHandle = this.element.querySelector('.resize-handle');
                    if (firstHandle) this.element.insertBefore(this.contentElement, firstHandle);
                    else this.element.appendChild(this.contentElement);
                }
                this.updateBorder(); // Apply object's border settings
            } else { // No src, show placeholder
                // if (this.contentElement.parentNode === this.element) this.element.removeChild(this.contentElement); // Already handled
                 // Insert placeholder before any resize handles if they exist
                if (this._placeholderElement.parentNode !== this.element) {
                    const firstHandle = this.element.querySelector('.resize-handle');
                    if (firstHandle) this.element.insertBefore(this._placeholderElement, firstHandle);
                    else this.element.appendChild(this._placeholderElement);
                }
                // If no "real" border is set, show a dashed placeholder border for visual cue
                if (this.borderSet === 'none' || this.borderSize === 0) {
                    this.element.style.border = '2px dashed #ced4da'; // Placeholder visual
                } else {
                    this.updateBorder(); // Apply actual border settings if they exist
                }
            }
        }
    }

    class TableObject extends ReportObject {
        constructor(x, y, width = 300, height = 80) {
            super('table', x, y, width, height);
            this.columns = [{ header: 'Column 1', dataField: 'item_name' }, { header: 'Column 2', dataField: 'item_price' }];
            this.fontFamily = 'Arial'; this.fontSize = 12; this.foreColor = '#000000';
            this.backgroundColor = 'transparent'; // Table container itself, cells have their own.
            this.padding = 0; // Padding is handled by cells
        }
        createElement() {
            const element = super.createElement(); // Sets up .report-object
            element.classList.remove(`${this.type}-object-container`); // super adds this
            element.classList.add(`table-object-container`); // Use specific class
            element.style.padding = '0'; // Table container has no padding

            const table = document.createElement('table');
            table.className = 'table-object'; // For styling the <table>
            table.style.fontFamily = this.fontFamily;
            table.style.fontSize = this.fontSize + 'px';
            table.style.color = this.foreColor;
            // table.style.backgroundColor is controlled by CSS '.table-object'

            this.contentElement = table; // The <table> element
            this.renderTableContent(); // Populate with headers and example data row

            // Clear any children from super.createElement() that are not resize handles
            while (element.firstChild && !element.firstChild.classList?.contains('resize-handle')) {
                element.removeChild(element.firstChild);
            }
            // Insert table before any resize handles or append if none
            const firstHandle = element.querySelector('.resize-handle');
            if (firstHandle) {
                element.insertBefore(table, firstHandle);
            } else {
                element.appendChild(table);
            }
            return element;
        }
        renderTableContent() {
            if (!this.contentElement) return; // contentElement is the <table>
            const table = this.contentElement;
            table.innerHTML = ''; // Clear existing rows

            const headerRow = table.insertRow();
            this.columns.forEach((col, index) => {
                const th = document.createElement('th');
                const div = this.createCellContentDiv(col.header, true, index); // Editable div for header
                th.appendChild(div);
                this.addColumnControls(th, index); // Add +/- buttons to header cell
                headerRow.appendChild(th);
            });

            // Example data row (you might want more complex data binding later)
            const dataRow = table.insertRow();
            this.columns.forEach(col => {
                const td = dataRow.insertCell();
                td.appendChild(this.createCellContentDiv(`[${col.dataField}]`, false)); // Editable div for data cell
            });
        }
        createCellContentDiv(html, isHeader, colIndex = -1) {
            const div = document.createElement('div');
            div.className = 'table-cell-content'; // For padding and styling
            div.contentEditable = true;
            div.innerHTML = html;
            div.spellcheck = false;

            div.addEventListener('input', () => {
                if (isHeader && colIndex !== -1) {
                    this.columns[colIndex].header = div.innerHTML;
                }
                // Data cell changes are not persisted back to a model here, only visual
            });
            div.addEventListener('focus', () => {
                this.select(); // Select the table object
                reportDesigner.activeTextElement = div; // Set for toolbar context
                setTimeout(() => reportDesigner.updateToolbarStates(), 0);
            });
            div.addEventListener('keyup', () => setTimeout(() => reportDesigner.updateToolbarStates(), 0));
            div.addEventListener('mouseup', () => setTimeout(() => reportDesigner.updateToolbarStates(), 0));
            div.addEventListener('paste', (e) => {
                e.preventDefault();
                document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
            });
            div.addEventListener('mousedown', (e) => {
                if (!this.selected) this.select();
                // e.stopPropagation(); // Usually not needed for cell content
            });
            return div;
        }
        addColumnControls(th, colIndex) { // Adds +/- buttons to table header cells
            const controls = document.createElement('div');
            Object.assign(controls.style, { position: 'absolute', top: '1px', right: '1px', display: 'none', gap: '2px'});

            const delBtn = document.createElement('button');
            delBtn.innerHTML = '&times;'; delBtn.title = "Delete Column";
            Object.assign(delBtn.style, { width:'16px', height:'16px', border:'none', background:'#dc3545', color:'white', fontSize:'12px', cursor:'pointer', lineHeight:'16px', padding:'0', borderRadius:'3px'});
            delBtn.onclick = (e) => { e.stopPropagation(); this.deleteColumn(colIndex); };

            const addBtn = document.createElement('button');
            addBtn.textContent = '+'; addBtn.title = "Add Column After";
            Object.assign(addBtn.style, { width:'16px', height:'16px', border:'none', background:'#28a745', color:'white', fontSize:'12px', cursor:'pointer', lineHeight:'16px', padding:'0', borderRadius:'3px'});
            addBtn.onclick = (e) => { e.stopPropagation(); this.showAddColumnDialog(); }; // Simplification: always adds to end via dialog

            controls.appendChild(addBtn); // Add button first
            controls.appendChild(delBtn);
            th.appendChild(controls);

            th.addEventListener('mouseenter', () => controls.style.display = 'flex');
            th.addEventListener('mouseleave', () => controls.style.display = 'none');
        }
        deleteColumn(index) {
            if (this.columns.length > 1) { // Keep at least one column
                this.columns.splice(index, 1);
                this.renderTableContent();
            }
        }
        addColumn(header, dataField) { // Adds a new column definition and re-renders
            this.columns.push({ header, dataField });
            this.renderTableContent();
        }
        showAddColumnDialog() {
            reportDesigner.currentTable = this; // Store ref for dialog
            document.getElementById('tableColumnDialog').style.display = 'flex';
        }

        applyStyles(styles) {
            super.applyStyles(styles); // Handles borders, padding (for frame, though table uses 0), etc.
            if (this.contentElement) { // contentElement is the <table>
                if (styles.fontFamily !== undefined) this.contentElement.style.fontFamily = this.fontFamily;
                if (styles.fontSize !== undefined) this.contentElement.style.fontSize = this.fontSize + 'px';
                if (styles.foreColor !== undefined) this.contentElement.style.color = this.foreColor;
                // Background color for table is complex: object frame vs cell backgrounds.
                // super.applyStyles handles this.backgroundColor for the frame.
                // Individual cell backgrounds would need more specific handling if desired.
            }
        }
    }

    class LineObject extends ReportObject {
        // MODIFICATION 3: Updated constructor for LineObject
        constructor(x, y, width = 100, height = 2) { // height parameter is intended as thickness
            // Call super with the line's thickness as the object's height
            super('line', x, y, width, Math.max(1, parseInt(height)));
            this.borderStyle = 'solid';
            this.borderSize = Math.max(1, parseInt(height)); // This is the line's thickness
            this.borderColor = '#000000';
            this.borderSet = 'top'; // Default to a top border, making it a horizontal line
            this.backgroundColor = 'transparent'; // Lines are always transparent
            this.padding = 0; // Lines don't have padding

            // The ReportObject's height property will store the line's thickness
            this.height = this.borderSize;
        }

        // MODIFICATION 3: Updated createElement for LineObject
        createElement() {
            // super.createElement() sets up the .report-object div (this.element)
            // with initial dimensions, padding, and background color.
            const element = super.createElement();
            element.classList.remove(`${this.type}-object-container`); // Remove generic class if super added it
            element.classList.add(`line-object-container`); // Add specific class

            // Override styles set by super.createElement() that are not applicable to lines
            element.style.height = this.borderSize + 'px'; // Element's height IS the line's thickness
            // minHeight ensures handles are visible even for very thin lines when object is selected
            element.style.minHeight = Math.max(this.borderSize, 8) + 'px';
            element.style.padding = '0'; // Ensure no padding from parent affects line display
            element.style.backgroundColor = 'transparent'; // Force transparent background

            // The 'contentElement' for a line is just a conceptual inner div.
            // The visual line is created by the border of 'this.element'.
            this.contentElement = document.createElement('div');
            this.contentElement.className = 'line-object'; // For styling the clickable area if any
            this.contentElement.style.height = '100%'; // Fills the parent container's height (which is borderSize)
            this.contentElement.style.width = '100%';
            element.appendChild(this.contentElement);

            this.updateBorder(); // Applies the actual border (e.g., border-top) to 'this.element'
            return element;
        }

        updateSize(width, height) {
            // For lines, 'width' is its length.
            // 'height' (passed to this method) is usually the object's overall height,
            // but for lines, the visual thickness is controlled by 'this.borderSize'.
            // The object's 'this.height' property IS its thickness.
            const newWidth = Math.max(width, 8); // Min width for a line to show handles
            this.width = newWidth;
            // this.height (thickness) is managed by borderSize changes via applyStyles.
            // We don't directly use the 'height' parameter from resize handles for thickness here.

            if (this.element) {
                this.element.style.width = this.width + 'px';
                // Element's height is tied to borderSize (thickness)
                this.element.style.height = this.height + 'px'; // this.height is already borderSize
                this.element.style.minHeight = Math.max(this.borderSize, 8) + 'px';
            }
        }

        // MODIFICATION 3: Updated applyStyles for LineObject
        applyStyles(styles) {
            const originalBorderSet = this.borderSet; // Store to check for changes for handle updates

            // Handle borderSize specifically as it affects line's height (thickness)
            if (styles.borderSize !== undefined) {
                this.borderSize = Math.max(1, parseInt(styles.borderSize));
                // The line object's height property IS its thickness
                this.height = this.borderSize;
                if (this.element) {
                    this.element.style.height = this.height + 'px';
                    this.element.style.minHeight = Math.max(this.borderSize, 8) + 'px';
                }
            }

            // Destructure to remove backgroundColor from styles passed to super,
            // as lines should always be transparent.
            const { backgroundColor, ...otherStylesToApply } = styles;
            super.applyStyles(otherStylesToApply); // Applies other styles like borderColor, borderStyle, borderSet
                                                 // This will call this.updateBorder() if border props were present.

            // Force line's own backgroundColor property and element style to transparent
            this.backgroundColor = 'transparent';
            if (this.element) {
                this.element.style.backgroundColor = 'transparent';
            }

            // If borderSet was in styles and changed (e.g. from top to left), resize handles might need updating
            // super.applyStyles would have updated this.borderSet from otherStylesToApply
            if (this.selected && otherStylesToApply.borderSet !== undefined && this.borderSet !== originalBorderSet) {
                 this.addResizeHandles(); // Refresh handles if orientation effectively changed
            }
        }
    }


    // Main Report Designer Class
    class ReportDesigner {
        static zIndexCounter = 10; // Simple z-index management
        constructor() {
            this.objects = [];
            this.selectedObject = null;
            this.currentTool = 'pointer';
            this.paper = document.getElementById('paper');
            this.gridOverlay = document.getElementById('gridOverlay');
            this.gridVisible = false;
            this.isDragging = false;
            this.isResizing = false;
            this.dragOffset = { x: 0, y: 0 };
            this.resizeHandleType = null;
            this.initialMousePos = { x: 0, y: 0 };
            this.initialSize = { width: 0, height: 0 };
            this.initialPos = { x: 0, y: 0 };
            this.clipboard = null; // For copy-paste
            this.currentTable = null; // For table column dialog context
            this.activeTextElement = null; // Currently focused contentEditable element
            this.storedSelectionRange = null; // To preserve selection across focus changes
            this.fieldTemplate = null; // For adding predefined field textboxes
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.setupToolbar();
            this.setupToolbox();

            // Attempt to use CSS for styling execCommand output (e.g., bold, italic)
            try { document.execCommand('styleWithCSS', false, true); }
            catch (e) { /* console.warn("styleWithCSS failed", e); */ }
        }

        

        setupEventListeners() {
            // Clicking on the paper itself
            this.paper.addEventListener('mousedown', (e) => {
                if (e.target === this.paper || e.target === this.gridOverlay ) { // Click on paper or grid
                    if (this.currentTool !== 'pointer' && this.currentTool !== 'field') { // If a drawing tool is active
                        const rect = this.paper.getBoundingClientRect();
                        this.addObject(this.currentTool, e.clientX - rect.left, e.clientY - rect.top);
                    } else { // Pointer tool active, clicking on paper deselects all
                        this.deselectAll();
                    }
                }
            });

            // Global mouse move for dragging and resizing
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) this.handleDrag(e);
                if (this.isResizing) this.handleResize(e);
            });

            // Global mouse up to stop dragging/resizing
            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    document.body.classList.remove('dragging-active');
                }
                if (this.isResizing) {
                     document.body.classList.remove('dragging-active'); // Also remove for resize
                }
                this.isDragging = false;
                this.isResizing = false;

                // Reset cursor on the selected object's element after drag/resize
                if(this.selectedObject && this.selectedObject.element) {
                    this.selectedObject.element.style.cursor = 'move'; // Default for frame
                    if (this.selectedObject.type === 'image' && this.selectedObject.contentElement) {
                        this.selectedObject.contentElement.style.cursor = 'default';
                    } else if (this.selectedObject.type === 'line' && this.selectedObject.contentElement) {
                        this.selectedObject.contentElement.style.cursor = 'move'; // Line content is also draggable
                    }
                }
            });

            // Clicking outside context menu hides it
            document.addEventListener('click', (e) => {
                const contextMenu = document.getElementById('contextMenu');
                if (!contextMenu.contains(e.target)) {
                    this.hideContextMenu();
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Allow delete/backspace in contentEditable elements without triggering object deletion
                if (document.activeElement && document.activeElement.isContentEditable) {
                    if (e.key === 'Delete' || e.key === 'Backspace') return; // Don't interfere
                }

                if (this.selectedObject) { // If an object is selected
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        e.preventDefault(); // Prevent browser back navigation on backspace
                        this.deleteObject(this.selectedObject);
                    } else if (e.ctrlKey || e.metaKey) { // Ctrl/Cmd key for copy/paste
                        if (e.key === 'c') {e.preventDefault(); this.copyObject();}
                        if (e.key === 'v') {e.preventDefault(); this.pasteObject();}
                    }
                }
            });

            // Track text selection changes
            document.addEventListener('selectionchange', () => {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0 && this.activeTextElement) {
                    const range = selection.getRangeAt(0);
                    // Store range only if it's within the currently active text element
                    if (this.activeTextElement.contains(range.commonAncestorContainer)) {
                        this.storedSelectionRange = range.cloneRange();
                    } else {
                        // Selection is outside the active element, invalidate stored range
                        this.storedSelectionRange = null;
                    }
                } else {
                    this.storedSelectionRange = null;
                }
                this.updateToolbarStates(); // Update toolbar based on current selection or cursor state
            });

            // Handle focus entering a contentEditable element
            document.addEventListener('focusin', (e) => {
                if (e.target && e.target.isContentEditable) {
                    this.activeTextElement = e.target;
                    const parentObjElement = e.target.closest('.report-object');
                    if (parentObjElement) {
                        const obj = this.objects.find(o => o.id === parentObjElement.id);
                        if (obj && obj !== this.selectedObject) {
                            this.selectObject(obj); // Auto-select parent object if its content gets focus
                        }
                    }
                    this.updateToolbarStates(); // Update toolbar based on focused text element
                }
            });

             // Handle focus leaving a contentEditable element (optional, can be complex)
             document.addEventListener('focusout', (e) => {
                // if (e.target && e.target.isContentEditable) {
                    // Check if focus is truly leaving the editor to something non-editable
                    // or another part of the UI, not just moving between editable elements.
                    // A simple check: if the relatedTarget (where focus is going) is not contentEditable
                    // if (!e.relatedTarget || !e.relatedTarget.isContentEditable) {
                    //    this.activeTextElement = null; // Clear active text element
                    //    this.updateToolbarStates();
                    // }
                // }
            });
        }

        setupToolbar() {
            document.getElementById('pageSize').addEventListener('change', (e) => this.changePageSize(e.target.value));
            document.getElementById('toggleGrid').addEventListener('click', () => this.toggleGrid());

            // Generic handler for most toolbar controls that apply to the selected object's properties
            ['borderStyle', 'borderSize', 'borderColor', 'borderSet', 'backColor', 'padding', 'textDirection', 'lineHeight'].forEach(id => {
                const el = document.getElementById(id);
                // Use 'input' for color pickers and number inputs for immediate feedback, 'change' for selects
                const eventType = (el.type === 'color' || (el.type === 'number' && id === 'padding')) ? 'input' : 'change';
                el.addEventListener(eventType, () => this.applySelectedObjectStylesFromToolbar());
                if (el.type === 'color') { // Ensure 'change' event also triggers for color pickers for final value confirmation
                     el.addEventListener('change', () => this.applySelectedObjectStylesFromToolbar());
                }
            });

            // Text formatting buttons (Bold, Italic, etc.)
            document.querySelectorAll('.format-btn').forEach(btn => btn.addEventListener('click', () => {
                this.applyCharacterFormat(btn.dataset.format); // Pass command like 'bold'
            }));

            // Font family dropdown
            document.getElementById('fontFamily').addEventListener('change', (e) => this.applyCharacterFormat('fontName', e.target.value));

            // Font size dropdown
            const fontSizeSelect = document.getElementById('fontSizeSelect');
            // Capture selection before dropdown interaction might cause focus loss
            fontSizeSelect.addEventListener('focus', () => this.captureSelectionState());
            fontSizeSelect.addEventListener('change', (e) => this.applyCharacterFormat('fontSize', e.target.value + 'px')); // Append 'px' for CSS


            // Text color input
            const foreColorInput = document.getElementById('foreColor');
            foreColorInput.addEventListener('focus', () => this.captureSelectionState());
            foreColorInput.addEventListener('input', (e) => this.applyCharacterFormat('foreColor', e.target.value, true)); // true for isInputEvent
            foreColorInput.addEventListener('change', (e) => this.applyCharacterFormat('foreColor', e.target.value)); // Final change


            // Text alignment buttons (Left, Center, Right)
            document.querySelectorAll('.align-btn').forEach(btn => btn.addEventListener('click', () => { this.applyTextAlignment(btn.dataset.align); }));

            // Vertical alignment buttons (Top, Middle, Bottom)
            document.querySelectorAll('.valign-btn').forEach(btn => btn.addEventListener('click', () => { this.applyVerticalAlignment(btn.dataset.valign); }));
        }

        captureSelectionState() { // Helper to store selection before toolbar interaction might change focus
            if (this.activeTextElement && window.getSelection().rangeCount > 0) {
                const currentSelection = window.getSelection().getRangeAt(0);
                // Ensure the selection is within the active text element
                if (this.activeTextElement.contains(currentSelection.commonAncestorContainer)) {
                     this.storedSelectionRange = currentSelection.cloneRange();
                }
            }
        }


        applySelectedObjectStylesFromToolbar() {
            if (!this.selectedObject) return;
            const styles = {
                borderStyle: document.getElementById('borderStyle').value,
                borderSize: parseInt(document.getElementById('borderSize').value),
                borderColor: document.getElementById('borderColor').value,
                borderSet: document.getElementById('borderSet').value,
                backgroundColor: document.getElementById('backColor').value, // This will be ignored by LineObject's applyStyles
                padding: parseInt(document.getElementById('padding').value),
            };
            // Text-specific properties for objects that support them (textbox, table)
            if (this.selectedObject.type === 'textbox' || this.selectedObject.type === 'table') {
                styles.textDirection = document.getElementById('textDirection').value;
                styles.lineHeight = parseFloat(document.getElementById('lineHeight').value);
                // Font family, size, color for textbox/table base styles are handled by applyCharacterFormat
                // or directly in updateToolbarForSelectedObject when an object is selected.
                // This function primarily applies structural/box-model styles from the toolbar.
            }
            this.selectedObject.applyStyles(styles);
            this.updateToolbarForSelectedObject(); // Refresh toolbar to reflect changes accurately
        }

        setupToolbox() {
            document.querySelectorAll('.tool-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active')); // Deactivate others
                    item.classList.add('active'); // Activate clicked item
                    const tool = item.dataset.tool;
                    this.currentTool = (tool === 'field') ? 'textbox' : tool; // 'field' creates a 'textbox'
                    this.fieldTemplate = (tool === 'field') ? item.dataset.field : null; // Store field name if it's a field tool
                    // Change paper cursor based on selected tool
                    this.paper.style.cursor = (this.currentTool !== 'pointer' && this.currentTool !== 'field') ? 'crosshair' : 'default';
                });
            });
        }

        addObject(type, x, y) {
            let obj;
            const defaultWidth = 150, defaultLineHeight = 2, defaultTextboxHeight = 40,
                  defaultImageHeight = 100, defaultTableWidth = 300, defaultTableHeight = 80;

            // Snap to grid if visible when placing new object
            if (this.gridVisible) {
                const gridSize = 20;
                x = Math.round(x / gridSize) * gridSize;
                y = Math.round(y / gridSize) * gridSize;
            }

            switch(type) {
                case 'textbox':
                    obj = new TextBox(x, y, defaultWidth, defaultTextboxHeight, this.fieldTemplate ? `[${this.fieldTemplate}]` : 'Text Box');
                    break;
                case 'image':
                    obj = new ImageObject(x, y, defaultWidth, defaultImageHeight);
                    break;
                case 'table':
                    obj = new TableObject(x, y, defaultTableWidth, defaultTableHeight);
                    break;
                case 'line':
                    obj = new LineObject(x, y, defaultWidth, defaultLineHeight); // defaultLineHeight is thickness
                    break;
                default:
                    console.warn("Attempted to add unknown object type:", type);
                    return;
            }
            const element = obj.createElement(); // Create the DOM element for the object
            element.style.zIndex = ReportDesigner.zIndexCounter++; // Manage stacking order
            this.paper.appendChild(element);
            this.objects.push(obj);
            this.selectObject(obj); // Select the newly added object

            this.fieldTemplate = null; // Reset field template after use
            // Revert to pointer tool after adding an object
            this.currentTool = 'pointer';
            document.querySelector('.tool-item[data-tool="pointer"]').classList.add('active');
            document.querySelectorAll('.tool-item:not([data-tool="pointer"])').forEach(t => t.classList.remove('active'));
            this.paper.style.cursor = 'default'; // Reset paper cursor
        }

        selectObject(obj) {
            if (this.selectedObject === obj) {
                 // If already selected, and it's a text-editable object, ensure focus for text editing
                if (obj.contentElement && obj.contentElement.isContentEditable && document.activeElement !== obj.contentElement) {
                    // obj.contentElement.focus(); // Focusing here can be disruptive if user is just clicking to select. Let focusin handle it.
                }
                this.updateToolbarStates(); // Still update toolbar in case of internal state changes (e.g. text selection)
                return; // Already selected
            }

            this.deselectAll(); // Deselect any previously selected object

            this.selectedObject = obj;
            obj.setSelected(true); // Visual selection (handles, border)
            this.updateToolbarForSelectedObject(); // Update toolbar based on the new object's properties

            // If the object's content is editable (e.g., textbox content), set it as the active text element.
            // Actual focus will be handled by user interaction or the 'focusin' event.
            if (obj.contentElement && obj.contentElement.isContentEditable) {
                this.activeTextElement = obj.contentElement;
            } else {
                this.activeTextElement = null; // Not a text-editable content or no content element
            }
            this.updateToolbarStates(); // Update text format buttons, font styles, etc.
        }


        deselectAll() {
            if (this.selectedObject) {
                // If the selected object was a textbox and its contentElement had focus,
                // blurring it here might be too aggressive if focus is moving to another control.
                // if (this.selectedObject.contentElement && this.selectedObject.contentElement.isContentEditable && document.activeElement === this.selectedObject.contentElement) {
                //    this.selectedObject.contentElement.blur();
                // }
                this.selectedObject.setSelected(false); // Visual deselection
            }
            this.selectedObject = null;

            // If nothing is selected, then no text element should be considered 'active' for the toolbar.
            // This is slightly different from focusout, which might be temporary.
            if (!this.objects.some(o => o.selected)) { // If truly no object is selected globally
                 this.activeTextElement = null;
                 this.storedSelectionRange = null; // Clear stored range when all deselected
            }

            this.updateToolbarForSelectedObject(); // Reset toolbar to default/disabled states
            this.updateToolbarStates(); // Further update specific text format buttons
        }


        startDrag(e, obj) {
            this.isDragging = true;
            const rect = obj.element.getBoundingClientRect();
            this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            obj.element.style.cursor = 'grabbing';
            document.body.classList.add('dragging-active'); // Global cursor/style for dragging
        }
        handleDrag(e) {
            if (!this.isDragging || !this.selectedObject) return;
            const paperRect = this.paper.getBoundingClientRect();
            let x = e.clientX - paperRect.left - this.dragOffset.x;
            let y = e.clientY - paperRect.top - this.dragOffset.y;

            // Snap to grid if visible
            if (this.gridVisible) {
                const gridSize = 20;
                x = Math.round(x / gridSize) * gridSize;
                y = Math.round(y / gridSize) * gridSize;
            }

            // Constrain within paper boundaries
            x = Math.max(0, Math.min(x, this.paper.offsetWidth - this.selectedObject.width));
            y = Math.max(0, Math.min(y, this.paper.offsetHeight - this.selectedObject.height));

            this.selectedObject.updatePosition(x, y);
        }

        startResize(e, obj, handleType) {
            this.isResizing = true;
            this.resizeHandleType = handleType;
            this.initialMousePos = { x: e.clientX, y: e.clientY };
            this.initialSize = { width: obj.width, height: obj.height };
            this.initialPos = { x: obj.x, y: obj.y };
            e.stopPropagation(); // Prevent drag from starting if mousedown was on a handle
            document.body.classList.add('dragging-active'); // Use same visual cue as dragging
        }

        handleResize(e) {
            if (!this.isResizing || !this.selectedObject) return;
            const dx = e.clientX - this.initialMousePos.x; // Change in X
            const dy = e.clientY - this.initialMousePos.y; // Change in Y
            let newWidth = this.initialSize.width;
            let newHeight = this.initialSize.height;
            let newX = this.initialPos.x;
            let newY = this.initialPos.y;

            const obj = this.selectedObject;

            if (obj.type === 'line') {
                // Line resizing logic:
                // - Horizontal lines (borderSet 'top' or 'bottom'): W/E handles adjust length (width).
                // - Vertical lines (borderSet 'left' or 'right'): N/S handles adjust length (height).
                // Thickness is always controlled by 'borderSize' property via toolbar, not by resize handles.
                if (obj.borderSet === 'top' || obj.borderSet === 'bottom' || obj.borderSet === 'all' || obj.borderSet === 'none') { // Horizontal line logic
                    if (this.resizeHandleType.includes('e')) newWidth = this.initialSize.width + dx;
                    if (this.resizeHandleType.includes('w')) { newWidth = this.initialSize.width - dx; newX = this.initialPos.x + dx; }
                    // Height (thickness) for horizontal lines is obj.height which is obj.borderSize. Not changed by these handles.
                } else { // Vertical line logic (left/right border)
                    if (this.resizeHandleType.includes('s')) newHeight = this.initialSize.height + dy; // Adjusts object's height (length of vertical line)
                    if (this.resizeHandleType.includes('n')) { newHeight = this.initialSize.height - dy; newY = this.initialPos.y + dy; }
                    // Width (thickness) for vertical lines is obj.width which is obj.borderSize. Not changed by these handles.
                    // This part of the model needs refinement if vertical lines are to have their thickness set by borderSize and length by N/S handles.
                    // Current: N/S changes obj.height. If obj.height is also its thickness, this is problematic.
                    // For now, assume vertical line's "length" is its object height, and "thickness" is its object width (set by borderSize).
                }
            } else { // Default resizing for other objects (textbox, image, table)
                if (this.resizeHandleType.includes('e')) newWidth = this.initialSize.width + dx;
                if (this.resizeHandleType.includes('w')) { newWidth = this.initialSize.width - dx; newX = this.initialPos.x + dx; }
                if (this.resizeHandleType.includes('s')) newHeight = this.initialSize.height + dy;
                if (this.resizeHandleType.includes('n')) { newHeight = this.initialSize.height - dy; newY = this.initialPos.y + dy; }
            }

            // Snap to grid during resize, if enabled
            if (this.gridVisible) {
                const gridSize = 20;
                // Adjust size to snap to grid
                newWidth = Math.round(newWidth / gridSize) * gridSize;
                newHeight = Math.round(newHeight / gridSize) * gridSize;
                // Adjust position if dragging N or W handles to keep them aligned with grid
                if (this.resizeHandleType.includes('w')) newX = Math.round(newX / gridSize) * gridSize;
                if (this.resizeHandleType.includes('n')) newY = Math.round(newY / gridSize) * gridSize;
            }

            // Apply new size and position
            if (newWidth !== obj.width || newHeight !== obj.height) {
                obj.updateSize(newWidth, newHeight);
            }
            if (newX !== obj.x || newY !== obj.y) {
                 // Constrain position within paper boundaries after resize from N/W handles
                newX = Math.max(0, Math.min(newX, this.paper.offsetWidth - obj.width));
                newY = Math.max(0, Math.min(newY, this.paper.offsetHeight - obj.height));
                obj.updatePosition(newX, newY);
            }
        }


        deleteObject(objToDelete) {
            if (!objToDelete) return;
            const index = this.objects.indexOf(objToDelete);
            if (index > -1) {
                this.objects.splice(index, 1); // Remove from array
                objToDelete.remove(); // Remove DOM element
                if (this.selectedObject === objToDelete) { // If the deleted object was selected
                    this.selectedObject = null;
                    this.activeTextElement = null; // Clear active text element as its object is gone
                    this.storedSelectionRange = null; // Clear any stored selection
                    this.updateToolbarForSelectedObject(); // Reset toolbar to default state
                    this.updateToolbarStates(); // Update specific button states
                }
            }
        }
        copyObject() {
            if (!this.selectedObject) return;
            // Create a deep copy of relevant properties, excluding DOM elements and selection state
            const propsToCopy = { ...this.selectedObject };
            delete propsToCopy.element;
            delete propsToCopy.contentElement; // Will be recreated
            delete propsToCopy.selected; // New object won't be selected initially (paste will select)
            delete propsToCopy.id; // New object will get a new unique ID
            delete propsToCopy._placeholderElement; // Specific to ImageObject, will be recreated

            // For complex properties like 'columns' in TableObject, ensure they are deep copied
            if (propsToCopy.type === 'table' && propsToCopy.columns) {
                propsToCopy.columns = JSON.parse(JSON.stringify(propsToCopy.columns));
            }
            // Text for textbox is also a property (this.text) and will be copied by spread.

            this.clipboard = { type: this.selectedObject.type, properties: JSON.parse(JSON.stringify(propsToCopy)) };
        }
        pasteObject() {
            if (!this.clipboard) return;
            // Offset the pasted object slightly from the original or a default position
            const x = (this.selectedObject ? this.selectedObject.x : 0) + 20;
            const y = (this.selectedObject ? this.selectedObject.y : 0) + 20;
            let newObj;

            // Create a new instance of the object based on clipboard type
            switch(this.clipboard.type) {
                case 'textbox': newObj = new TextBox(x,y); break;
                case 'image': newObj = new ImageObject(x,y); break;
                case 'table': newObj = new TableObject(x,y); break;
                case 'line': newObj = new LineObject(x,y); break;
                default: console.warn("Unknown object type in clipboard:", this.clipboard.type); return;
            }

            // Apply all copied properties to the new object instance
            const pastedProps = { ...this.clipboard.properties };
            // Update position for the new object
            pastedProps.x = x;
            pastedProps.y = y;

            // Apply general styles and properties from the clipboard
            // This should set things like border, padding, colors, text props, etc.
            newObj.applyStyles(pastedProps);

            // Set specific properties that might not be fully covered by applyStyles or need special handling after creation
            if (pastedProps.width) newObj.width = pastedProps.width;
            if (pastedProps.height) newObj.height = pastedProps.height; // For lines, this is thickness
            if (pastedProps.text && newObj.type === 'textbox') newObj.text = pastedProps.text; // For textbox HTML content
            if (pastedProps.src && newObj.type === 'image') newObj.src = pastedProps.src; // For image data URL
            if (pastedProps.columns && newObj.type === 'table') { // For table column structure
                newObj.columns = JSON.parse(JSON.stringify(pastedProps.columns));
            }


            const element = newObj.createElement(); // Create DOM element with all properties now set
            element.style.zIndex = ReportDesigner.zIndexCounter++;
            this.paper.appendChild(element);
            this.objects.push(newObj);

            // Post-creation updates that might depend on the element being in the DOM or contentElement existing
            if (newObj.type === 'textbox' && newObj.contentElement && pastedProps.text) {
                newObj.contentElement.innerHTML = pastedProps.text; // Ensure innerHTML is set
            }
            if (newObj.type === 'image' && pastedProps.src) {
                newObj.updateImageDisplay(); // This will set the img.src and manage placeholder visibility
            }
            if (newObj.type === 'table' && pastedProps.columns) {
                newObj.renderTableContent(); // Re-render table with copied columns
            }
            // Ensure size is correctly applied to the element after all properties are set
            newObj.updateSize(newObj.width, newObj.height);


            this.selectObject(newObj); // Select the newly pasted object
        }


        changePageSize(size) { this.paper.className = `paper ${size}`; }
        toggleGrid() {
            this.gridVisible = !this.gridVisible;
            this.gridOverlay.classList.toggle('visible', this.gridVisible);
            document.getElementById('toggleGrid').classList.toggle('active', this.gridVisible);
        }

        // MODIFICATION 2: Updated applyCharacterFormat for fontSize and selection handling
        applyCharacterFormat(command, value = null, isInputEvent = false) {
            let targetElement = this.activeTextElement;

            // If no explicitly active text element, but a textbox is selected, target its contentElement
            if (!targetElement && this.selectedObject?.type === 'textbox' && this.selectedObject.contentElement) {
                targetElement = this.selectedObject.contentElement;
            }
            if (!targetElement) return; // No valid target for text formatting

            // Ensure the target element has focus to receive execCommand or selection manipulation
            // This is crucial for execCommand to work correctly.
            if (document.activeElement !== targetElement) {
                 targetElement.focus({ preventScroll: true }); // preventScroll helps if element is off-screen
            }

            let selection = window.getSelection();
            let activeRange = null;

            // Try to use stored selection range if it's valid for the current targetElement
            if (this.storedSelectionRange && targetElement.contains(this.storedSelectionRange.commonAncestorContainer)) {
                activeRange = this.storedSelectionRange.cloneRange();
            } else if (selection.rangeCount > 0) { // Otherwise, try to get the current selection
                const currentRange = selection.getRangeAt(0);
                if (targetElement.contains(currentRange.commonAncestorContainer)) {
                    activeRange = currentRange.cloneRange();
                }
            }

            // If a valid range is determined (either stored or current), ensure it's applied to the selection object
            if (activeRange) {
                selection.removeAllRanges(); // Clear any existing selections
                selection.addRange(activeRange); // Apply the determined range
            }

            // Handle object-level style changes if no text is selected (caret is blinking)
            // for commands that can apply to the whole object (fontSize, fontName, foreColor).
            if ((!activeRange || activeRange.collapsed) &&
                (command === 'fontSize' || command === 'fontName' || command === 'foreColor')) {
                 if (this.selectedObject?.type === 'textbox' && this.selectedObject.contentElement === targetElement) {
                    const stylesToApply = {};
                    if (command === 'fontSize') stylesToApply.fontSize = parseInt(value); // value is "NNpx"
                    else if (command === 'fontName') stylesToApply.fontFamily = value;
                    else if (command === 'foreColor') stylesToApply.foreColor = value;

                    this.selectedObject.applyStyles(stylesToApply); // Apply to the TextBox object's properties
                    this.updateToolbarForSelectedObject(); // Reflect change on toolbar
                    // Also update the contentElement's base style directly if needed
                    if (command === 'fontSize') targetElement.style.fontSize = value;
                    if (command === 'fontName') targetElement.style.fontFamily = value;
                    if (command === 'foreColor') targetElement.style.color = value;
                    return; // Applied to object, no further text selection processing needed
                }
            }


            // Apply formatting to selected text range
            if (command === 'fontSize') { // value is expected as "NNpx"
                if (activeRange && !activeRange.collapsed) { // Only apply if there's a non-collapsed selection
                    const newSpan = document.createElement('span');
                    newSpan.style.fontSize = value; // e.g., "18px"
                    try {
                        // Attempt to update an existing span if selection perfectly matches its content
                        // and it's a simple span (e.g., only has font-size style)
                        let parent = activeRange.commonAncestorContainer;
                        if (parent.nodeType === Node.TEXT_NODE) parent = parent.parentNode;

                        if (parent.nodeName === 'SPAN' &&
                            parent.style.fontSize && // It has a font-size style
                            // Check if it's a "simple" span (only has font-size or very few styles)
                            // This condition Object.keys(parent.styleMap).length === 1 was too restrictive.
                            // A better check might be if it primarily sets font-size and matches content.
                            activeRange.toString().trim() === parent.textContent.trim() &&
                            activeRange.startContainer === parent.firstChild && activeRange.endContainer === parent.lastChild &&
                            activeRange.startOffset === 0 && (parent.lastChild ? activeRange.endOffset === parent.lastChild.length : activeRange.endOffset === 0)
                           ) {
                            // Selection perfectly matches a simple font-size span, so just update it.
                            parent.style.fontSize = value;
                            // Re-select the updated parent span to maintain selection
                            const updatedRange = document.createRange();
                            updatedRange.selectNodeContents(parent);
                            selection.removeAllRanges();
                            selection.addRange(updatedRange);
                            this.storedSelectionRange = updatedRange.cloneRange(); // Store the new selection
                        } else {
                            // Otherwise, surround the contents. This may lead to nesting of spans.
                            // The innermost span's style will typically take precedence.
                            activeRange.surroundContents(newSpan);
                            // Select the new span's content
                            const surroundedRange = document.createRange();
                            surroundedRange.selectNodeContents(newSpan);
                            selection.removeAllRanges();
                            selection.addRange(surroundedRange);
                            this.storedSelectionRange = surroundedRange.cloneRange(); // Store the new selection
                        }
                    } catch (e) {
                        // console.warn("Failed to apply fontSize via span manipulation:", e);
                        // If surroundContents fails (e.g., range spans across block boundaries improperly),
                        // as a last resort for textboxes, apply to the object's base style.
                        if (this.selectedObject?.type === 'textbox' && this.selectedObject.contentElement === targetElement) {
                           this.selectedObject.applyStyles({ fontSize: parseInt(value) });
                           targetElement.style.fontSize = value; // Also directly to contentElement
                        }
                    }
                }
                // If no selection (cursor blinking), it's handled by the object-level style change logic above.
            } else if (command === 'fontName' || command === 'foreColor') {
                // These commands generally work well with execCommand
                document.execCommand(command, false, value);
            } else { // For bold, italic, underline, strikethrough
                document.execCommand(command, false, null);
            }

            // After command, re-capture selection state if focus is still within the element
            // and it's not an 'input' event (which updates too frequently for selection storage)
            if (!isInputEvent && document.activeElement === targetElement) {
                 const updatedSelection = window.getSelection();
                 if (updatedSelection.rangeCount > 0) {
                    this.storedSelectionRange = updatedSelection.getRangeAt(0).cloneRange();
                 } else {
                    this.storedSelectionRange = null; // No selection after command
                 }
            }
            this.updateToolbarStates(); // Reflect changes on toolbar buttons (active states, etc.)
        }


        applyTextAlignment(align) { // Applies to the selected object's content (textbox or table cell)
            if (this.selectedObject?.type === 'textbox') {
                this.selectedObject.applyStyles({ textAlign: align }); // Update object property
                if (this.selectedObject.contentElement) {
                    this.selectedObject.contentElement.style.textAlign = align; // Apply directly to content div
                }
            } else if (this.activeTextElement?.classList.contains('table-cell-content')) {
                // For table cells, apply directly to the cell's content div
                this.activeTextElement.style.textAlign = align;
                // TODO: Persist this to the table object's model if cells have individual styles
            }
            this.updateToolbarStates(); // Update toolbar button active state
        }
        applyVerticalAlignment(valign) { // Applies to the selected ReportObject for its content
            if (this.selectedObject) {
                this.selectedObject.applyStyles({ verticalAlign: valign }); // This will call updateVerticalAlignmentStyling
            }
            // For table cells, vertical-align is more complex (usually CSS on <td> or flex on content div)
            // This currently applies to the ReportObject (e.g. TextBox) for its internal content.
            this.updateToolbarStates(); // Update toolbar button active state
        }


        updateToolbarForSelectedObject() { // Populates toolbar based on selected object's properties
            const isTextEditableSelected = this.selectedObject && (this.selectedObject.type === 'textbox' || this.selectedObject.type === 'table');
            const isLineSelected = this.selectedObject && this.selectedObject.type === 'line';

            if (this.selectedObject) {
                document.getElementById('borderStyle').value = this.selectedObject.borderStyle || 'solid';
                document.getElementById('borderSize').value = this.selectedObject.borderSize || 1;
                document.getElementById('borderColor').value = this.selectedObject.borderColor || '#000000';
                document.getElementById('borderSet').value = this.selectedObject.borderSet || 'all';
                document.getElementById('padding').value = this.selectedObject.padding !== undefined ? this.selectedObject.padding : 2;

                // Background color: Special handling for lines (should be disabled/transparent)
                const backColorEl = document.getElementById('backColor');
                backColorEl.disabled = isLineSelected;
                // For lines, display a default (e.g., white) but it won't apply. For others, use actual BG.
                backColorEl.value = isLineSelected ? '#ffffff' : (this.selectedObject.backgroundColor || '#ffffff');


                if (isTextEditableSelected) {
                    // Populate text-related toolbar items from the object's base styles
                    document.getElementById('fontFamily').value = this.selectedObject.fontFamily || 'Arial';
                    document.getElementById('fontSizeSelect').value = this.selectedObject.fontSize || 12;
                    document.getElementById('foreColor').value = this.selectedObject.foreColor || '#000000';
                    document.getElementById('textDirection').value = this.selectedObject.textDirection || 'ltr';
                    document.getElementById('lineHeight').value = this.selectedObject.lineHeight || 1.5;

                    // Set active state for alignment buttons based on object's properties
                    document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
                    const textAlign = this.selectedObject.textAlign || (this.activeTextElement?.style.textAlign || 'left');
                    document.querySelector(`.align-btn[data-align="${textAlign.replace('start','left').replace('end','right')}"]`)?.classList.add('active');

                    document.querySelectorAll('.valign-btn').forEach(b => b.classList.remove('active'));
                    document.querySelector(`.valign-btn[data-valign="${this.selectedObject.verticalAlign || 'top'}"]`)?.classList.add('active');
                }
            } else { // No object selected, reset toolbar to defaults
                document.getElementById('borderStyle').value = 'solid';
                document.getElementById('borderSize').value = 1;
                document.getElementById('borderColor').value = '#000000';
                document.getElementById('borderSet').value = 'all';
                document.getElementById('backColor').value = '#ffffff';
                document.getElementById('backColor').disabled = false; // Enable backColor if no object (or non-line)
                document.getElementById('padding').value = 2;

                // Reset text-related toolbar items
                document.getElementById('fontFamily').value = 'Arial';
                document.getElementById('fontSizeSelect').value = 12;
                document.getElementById('foreColor').value = '#000000';
                document.getElementById('textDirection').value = 'ltr';
                document.getElementById('lineHeight').value = 1.5;
                document.querySelectorAll('.align-btn, .valign-btn, .format-btn').forEach(b => b.classList.remove('active'));
            }
        }


        updateToolbarStates() { // Updates states of format buttons, font controls based on current selection/caret
            this.updateFormatButtonStates(); // For B, I, U, S buttons
            this.updateFontControlsFromSelection(); // For font family, size, color dropdowns/inputs
            this.updateAlignmentControlsFromSelection(); // Includes text-align (from content or object) and vertical-align (from object)
        }

        updateFormatButtonStates() { // For B, I, U, S buttons (Bold, Italic, Underline, Strikethrough)
            ['bold', 'italic', 'underline', 'strikethrough'].forEach(format => {
                const btnId = format === 'strikethrough' ? 'strikeoutBtn' : `${format}Btn`;
                const btn = document.getElementById(btnId);
                if (btn) {
                    let isActive = false;
                    // Only query command state if an editable text element is active and focused
                    if (this.activeTextElement && document.activeElement === this.activeTextElement &&
                        document.queryCommandSupported(format) && document.queryCommandState) {
                         try {
                            isActive = document.queryCommandState(format);
                         } catch(e){ /* Mute errors, e.g. if element not focused or command unsupported */ }
                    }
                    btn.classList.toggle('active', isActive);
                }
            });
        }

        getStyleAtCursorOrSelection() { // Helper to get computed style of the current text context
            let styleSourceNode = null;
            const selection = window.getSelection();

            // If there's an active text element (contentEditable) and a selection/caret within it
            if (this.activeTextElement && selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // Ensure the selection's common ancestor is within the activeTextElement
                if (this.activeTextElement.contains(range.commonAncestorContainer)) {
                    // For a collapsed selection (caret), use the anchor node (where caret is).
                    // For a non-collapsed selection, use the common ancestor of the selection.
                    styleSourceNode = range.collapsed ? selection.anchorNode : range.commonAncestorContainer;
                    // Traverse up to an ELEMENT_NODE if the source is a TEXT_NODE, as styles apply to elements.
                    while (styleSourceNode && styleSourceNode.nodeType === Node.TEXT_NODE) {
                        styleSourceNode = styleSourceNode.parentNode;
                    }
                     // Final check: ensure the determined styleSourceNode is still within activeTextElement
                    if (styleSourceNode && !this.activeTextElement.contains(styleSourceNode)) {
                        styleSourceNode = this.activeTextElement; // Fallback to activeTextElement itself
                    }
                } else {
                     // Selection is outside the designated activeTextElement, so use activeTextElement itself for style context
                     styleSourceNode = this.activeTextElement;
                }
            } else if (this.activeTextElement) {
                // No selection range, but an active text element (e.g., just focused, caret at start)
                styleSourceNode = this.activeTextElement;
            } else if (this.selectedObject?.contentElement && this.selectedObject.contentElement.isContentEditable) {
                 // Fallback to selected object's content element if no specifically active one, but it's editable
                 styleSourceNode = this.selectedObject.contentElement;
            }


            // Return computed style if we found a valid element node
            return styleSourceNode?.nodeType === Node.ELEMENT_NODE ? window.getComputedStyle(styleSourceNode) : null;
        }


        updateFontControlsFromSelection() { // Updates font family, size, color dropdowns/inputs from text context
            const computedStyle = this.getStyleAtCursorOrSelection();
            const ffSelect = document.getElementById('fontFamily');
            const fsSelect = document.getElementById('fontSizeSelect'); // This is the <select> for font size
            const fcInput = document.getElementById('foreColor');

            // Determine base styles from the selected object if it's text-editable
            let baseObjectFontFamily = 'Arial', baseObjectFontSize = 12, baseObjectForeColor = '#000000';
            if (this.selectedObject && (this.selectedObject.type === 'textbox' || this.selectedObject.type === 'table')) {
                baseObjectFontFamily = this.selectedObject.fontFamily || 'Arial';
                baseObjectFontSize = this.selectedObject.fontSize || 12; // This is the object's base font size
                baseObjectForeColor = this.selectedObject.foreColor || '#000000';
            }


            if (computedStyle) {
                // Font Family: Try to match computed font with select options
                const currentFont = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
                let foundFontInSelect = Array.from(ffSelect.options).some(opt => {
                    if (opt.value.toLowerCase() === currentFont.toLowerCase()) {
                        ffSelect.value = opt.value; return true;
                    } return false;
                });
                if (!foundFontInSelect) ffSelect.value = baseObjectFontFamily; // Fallback if not in select

                // Font Size: Try to match computed size (in px) with select options (which are pt but treated as px values here)
                const currentSizePx = Math.round(parseFloat(computedStyle.fontSize)); // Get size in px and round
                let foundSizeInSelect = Array.from(fsSelect.options).some(opt => parseInt(opt.value) === currentSizePx);
                if (foundSizeInSelect) {
                    fsSelect.value = currentSizePx; // Set select to the matched value
                } else {
                     // If current computed size isn't in options, use object's base font size
                    fsSelect.value = baseObjectFontSize;
                }

                // Font Color: Convert RGB from computedStyle to Hex for color input
                fcInput.value = this.rgbToHex(computedStyle.color);
            } else { // No computed style (e.g., no active text element, or style source couldn't be determined)
                     // Fallback to the selected object's base styles or application defaults
                ffSelect.value = baseObjectFontFamily;
                fsSelect.value = baseObjectFontSize;
                fcInput.value = baseObjectForeColor;
            }
        }


        updateAlignmentControlsFromSelection() { // Updates text-align and vertical-align buttons
            const computedStyle = this.getStyleAtCursorOrSelection(); // For text-align
            let textAlignToSet = 'left'; // Default

            // Determine text-align:
            // 1. From computed style of active text element if available.
            // 2. From selected object's 'textAlign' property if it's a textbox/table.
            // 3. Default to 'left'.
            if (this.activeTextElement && computedStyle) {
                textAlignToSet = computedStyle.textAlign.replace("start", "left").replace("end", "right");
            } else if (this.selectedObject && (this.selectedObject.type === 'textbox' || this.selectedObject.type === 'table')) {
                textAlignToSet = this.selectedObject.textAlign || 'left';
            }

            document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            const alignButton = document.querySelector(`.align-btn[data-align="${textAlignToSet}"]`);
            if (alignButton) alignButton.classList.add('active');

            // Determine vertical-align (this is always from the selected object's property):
            let verticalAlignToSet = 'top'; // Default
            if (this.selectedObject && this.selectedObject.verticalAlign !== undefined) {
                verticalAlignToSet = this.selectedObject.verticalAlign;
            }
            document.querySelectorAll('.valign-btn').forEach(b => b.classList.remove('active'));
            const valignButton = document.querySelector(`.valign-btn[data-valign="${verticalAlignToSet}"]`);
            if (valignButton) valignButton.classList.add('active');
        }


        rgbToHex(rgb) { // Helper to convert rgb(a) string to hex
            if (!rgb || typeof rgb !== 'string') return '#000000'; // Default black if invalid input
            if (rgb.startsWith('#')) return rgb.toUpperCase(); // Already hex

            // Match "rgb(r, g, b)" or "rgba(r, g, b, a)"
            const parts = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
            if (!parts) return '#000000'; // Default black if parsing fails

            // Convert each part to a 2-digit hex string
            const r = parseInt(parts[1]).toString(16).padStart(2, '0');
            const g = parseInt(parts[2]).toString(16).padStart(2, '0');
            const b = parseInt(parts[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`.toUpperCase();
        }


        showContextMenu(e, obj) { // Shows context menu at mouse position
            const menu = document.getElementById('contextMenu');
            menu.style.display = 'block';
            menu.style.left = e.pageX + 'px';
            menu.style.top = e.pageY + 'px';

            // Re-create listeners to ensure 'obj' is correctly scoped for this instance of the menu
            // This is important because 'obj' is the object that was right-clicked.
            const newMenu = menu.cloneNode(true); // Clone to easily remove old listeners by replacing the node
            menu.parentNode.replaceChild(newMenu, menu); // Replace in DOM

            newMenu.querySelectorAll('.context-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.handleContextAction(item.dataset.action, obj); // Pass the specific object
                    this.hideContextMenu();
                });
            });
        }
        hideContextMenu() { document.getElementById('contextMenu').style.display = 'none'; }
        handleContextAction(action, obj) { // Handles actions from context menu
            // Ensure 'obj' refers to the right-clicked object, or the selected one for global actions
            if (!obj && (action === 'delete' || action === 'copy' || action === 'bring-front' || action === 'send-back')) {
                obj = this.selectedObject; // Use globally selected if no specific obj passed (e.g. from a global paste action)
            }
            if (!obj && action !== 'paste') { // Most actions require an object context
                console.warn("Context action called without a target object:", action);
                return;
            }


            switch(action) {
                case 'delete': if (obj) this.deleteObject(obj); break;
                case 'copy': if (obj) { this.selectObject(obj); this.copyObject(); } break; // Select then copy
                case 'paste': this.pasteObject(); break; // Paste uses clipboard, not specific obj context for action trigger
                case 'bring-front': if(obj && obj.element) obj.element.style.zIndex = ReportDesigner.zIndexCounter++; break;
                case 'send-back': if(obj && obj.element) obj.element.style.zIndex = 0; break; // Or a base z-index like 1
            }
        }
    }

    // Functions for Table Column Dialog
    function addTableColumn() {
        const headerText = document.getElementById('columnHeader').value.trim();
        const dataFieldValue = document.getElementById('columnDataField').value; // Value from select

        if (headerText && dataFieldValue && reportDesigner.currentTable) {
            reportDesigner.currentTable.addColumn(headerText, dataFieldValue);
            closeDialog();
        } else {
            // Simple feedback if fields are missing; replace with a nicer modal/message later
            alert("Please enter a column header and select a data field.");
        }
    }
    function closeDialog() {
        document.getElementById('tableColumnDialog').style.display = 'none';
        document.getElementById('columnHeader').value = ''; // Clear for next time
        // document.getElementById('columnDataField').value = 'item_name'; // Optionally reset select to default
        if (reportDesigner) reportDesigner.currentTable = null; // Clear reference in designer
    }

    // Initialize the Report Designer when the DOM is fully loaded
    let reportDesigner;
    document.addEventListener('DOMContentLoaded', () => {
        reportDesigner = new ReportDesigner();
    });
    </script>
</body>
</html> 