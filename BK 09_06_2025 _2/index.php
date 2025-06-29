    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="TableStyles.css">
        <title>Report Designer</title>
        <!-- Styles are embedded for a single file solution -->

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
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <label>Border Set:</label>
                    <select id="borderSet">
                        <option value="all">Outside</option>
                        <option value="none">None</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <label>Border Size:</label>
                    <select id="borderSize">
                        <option value="0.25">¼pt</option>
                        <option value="0.5">½pt</option>
                        <option value="0.75">¾1pt</option>
                        <option value="1">1pt</option>
                        <option value="2">2pt</option>
                        <option value="3">3pt</option>
                        <option value="4">4pt</option>
                        <option value="5">5pt</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <label>Border Color:</label> <input type="color" id="borderColor" value="#000000">
                </div> 
            </div>
            <div class="toolbar toolbar-text">
                <div class="toolbar-group">
                    <label>Font:</label>
                    <select id="fontFamily">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Segoe UI">Segoe UI</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <label>Size:</label>
                    <select id="fontSizeSelect">
                        <option value="8">8pt</option>
                        <option value="9">9pt</option>
                        <option value="10" selected>10pt</option>
                        <option value="11">11pt</option>
                        <option value="12">12pt</option>
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
                        <option value="ltr">LTR</option>
                        <option value="rtl">RTL</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <label>Line Height:</label>
                    <select id="lineHeight">
                        <option value="1">1</option>
                        <option value="1.2">1.2</option>
                        <option value="1.5" selected>1.5</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div class="toolbar-group">
                        <label>Padding:</label> <input type="number" id="padding" min="0" max="20" value="2" step="0.1">px
                </div>
                <div style="display: block;" class="toolbar-group">
                    <input type="file" id="importFile" accept=".xml,.rdlc" style="display: none;">
                    <button id="importXmlBtn">Import XML</button>
                    <button id="exportXmlBtn">Export XML</button>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="main-content">
                <div class="toolbox-panel">
                    <h3>Toolbox</h3>


                    <div class="toolbox-section">
                        <div class="tool-item active" data-tool="pointer"><span class="tool-icon">🖱️</span><span>Pointer</span></div>
                        <div class="tool-item" data-tool="textbox"><span class="tool-icon">📝</span><span>Text Box</span></div>
                        <div class="tool-item" data-tool="image"><span class="tool-icon">🖼️</span><span>Image</span></div>
                        <div class="tool-item" data-tool="table"><span class="tool-icon">📊</span><span>Table</span></div>
                        <div class="tool-item" data-tool="line"><span class="tool-icon">📏</span><span>Line</span></div>
                    </div>

                    <h3>Parameters</h3>
                    <div id="parameters-section" class="toolbox-section">
                    </div>

                    <div id="datasets-section" class="toolbox-section">
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


        <div id="tableControlContextMenu" class="context-menu">
            <div class="context-item" data-action="insert-above">Insert Row Above</div>
            <div class="context-item" data-action="insert-below">Insert Row Below</div>
            <div class="context-item" data-action="delete-row">Delete Row</div>
            <hr class="context-divider" style="margin: 4px 0; border: none; border-top: 1px solid #eee;">
            <div class="context-item" data-action="insert-left">Insert Column Left</div>
            <div class="context-item" data-action="insert-right">Insert Column Right</div>
            <div class="context-item" data-action="delete-column">Delete Column</div>
        </div>

        <div id="fieldPickerMenu" class="context-menu">
        </div>
        

        <!-- Table Column Dialog -->
        <div id="tableColumnDialog" class="dialog">
            <div class="dialog-content">
                <h3>Add Table Column</h3>
                <label for="columnHeader">Column Header:</label>
                <input type="text" id="columnHeader" placeholder="Enter column header">
                <label for="columnDataField">Data Field:</label>
                <select id="columnDataField">
                    <option value="item_name">Item Name</option>
                    <option value="item_price">Item Price</option>
                    <option value="item_total">Item Total</option>
                    <option value="item_quantity">Item Quantity</option>
                    <option value="item_description">Item Description</option>
                </select>
                <div class="dialog-buttons">
                    <button onclick="addTableColumn()">Add</button>
                    <button onclick="closeDialog()">Cancel</button>
                </div>
            </div>
        </div>


    
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
                    this.zIndex = 0; // <-- ADD THIS LINE
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

                // updateBorder() {
                //     if (!this.element) return;
                //     const style = this.element.style;
                //     // Reset all borders first
                //     style.border = 'none';
                //     style.borderTop = 'none';
                //     style.borderRight = 'none';
                //     style.borderBottom = 'none';
                //     style.borderLeft = 'none';

                //     if (this.borderSet !== 'none' && this.borderSize > 0) {
                //         const borderValue = `${this.borderSize}px ${this.borderStyle} ${this.borderColor}`;
                //         if (this.borderSet === 'all') {
                //             style.border = borderValue;
                //         } else {
                //             // Apply to specific side e.g., borderTop, borderLeft
                //             style[`border${this.borderSet.charAt(0).toUpperCase() + this.borderSet.slice(1)}`] = borderValue;
                //         }
                //     }
                // }

            updateBorder() {
                if (!this.element) return;
                const style = this.element.style;
                const placeholderStyle = '1px dashed #ced4da';

                // First, handle the special case for an empty image placeholder.
                // If it's an image with no source, all sides should be the dashed placeholder.
                if (this.type === 'image' && !this.src) {
                    style.border = placeholderStyle;
                    return; // Exit early
                }
                
                // If we get here, we process each of the four sides individually.
                const sides = ['Top', 'Right', 'Bottom', 'Left'];

                sides.forEach(side => {
                    // Check if THIS SPECIFIC SIDE should have a "real" border.
                    // This is true if the borderSet is 'all' or matches the specific side.
                    const hasRealBorderOnThisSide =
                        (this.borderSet.toLowerCase() === 'all' || this.borderSet.toLowerCase() === side.toLowerCase()) &&
                        this.borderStyle !== 'none' &&
                        this.borderSize > 0;

                    if (hasRealBorderOnThisSide) {
                        // If yes, apply the user-defined border style to this side.
                        const borderValue = `${this.borderSize}px ${this.borderStyle} ${this.borderColor}`;
                        style[`border${side}`] = borderValue;
                    } else {
                        // If no, apply the dashed placeholder style to this side.
                        style[`border${side}`] = placeholderStyle;
                    }
                });
            }
            

                addEventListeners() {
                    if (!this.element) return;
                    this.element.addEventListener('mousedown', (e) => {
                        const isContentClick = this.contentElement && this.contentElement.contains(e.target);
                        const isImageContent = this.type === 'image' && isContentClick; // Image content itself isn't draggable by frame
                        const isLineContent = this.type === 'line' && isContentClick; // Line content IS draggable

                        // Start drag if click is on the frame (not a resize handle) AND not on image content, OR if it's on line content
                    //   if (e.target === this.element && !e.target.classList.contains('resize-handle') && !isImageContent || isLineContent) {
                            if ((e.target === this.element || isImageContent || isLineContent) && !e.target.classList.contains('resize-handle')) {
                    if (e.button === 0) { // Left click
                            
                        if (isImageContent) {
                                e.preventDefault();
                            }

                        this.select();

                                if (this.type === 'table') {
                                    return;
                                }
                                if (this.type === 'textbox' && this.isNestedInTable) {
                                    return;

                                }
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

                select() {
                    reportDesigner.selectObject(this);
                } // Delegate to designer for global selection management
                updatePosition(x, y) {
                    this.x = x;
                    this.y = y;
                    if (this.element) {
                        this.element.style.left = x + 'px';
                        this.element.style.top = y + 'px';
                    }
                }
                updateSize(width, height) {
                    // Minimum dimensions, considering padding for most objects, or borderSize for lines
                    const minContentDim = (this.type === 'line') ? (this.borderSize || 1) : 20; // Min content area size
                    const totalPadding = (this.type === 'line' || this.type === 'image') ? 0 : parseFloat(this.padding) * 2; // Lines/Images don't use this.padding for content box

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
                    if (this.isNestedInTable) return;
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
                        handle.addEventListener('mousedown', (e) => {
                            e.stopPropagation();
                            reportDesigner.startResize(e, this, type);
                        });
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

                this.borderStyle = 'none';
                this.borderSize = 0;
                this.borderSet = 'none';

                    this.fontFamily = 'Arial';
                    this.fontSize = 10; // Base font size in px
                    this.textAlign = 'left';
                    this.textDirection = 'ltr';
                    this.lineHeight = 1.5;
                    this.foreColor = '#000000';
                    this.isNestedInTable = false;
                    // verticalAlign is inherited from ReportObject, default 'top'
                }

                createElement() {
                    const element = super.createElement(); // Sets up .report-object, padding, initial bg
                    element.classList.remove(`${this.type}-object-container`); // super adds this, we want a more specific one
                    element.classList.add(`textbox-object`); // Use specific class for styling (e.g., display: flex)

                    // When a textbox is nested in a table, it should fill the cell
                    // and not be positioned absolutely on the page.
                    if (this.isNestedInTable) {
                        element.style.position = 'relative';
                        element.style.left = 'auto';
                        element.style.top = 'auto';
                        element.style.width = '100%';
                        element.style.height = '100%';
                        element.style.cursor = 'default';
                    }


                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'textbox-content';
                    contentDiv.contentEditable = true;
                    contentDiv.spellcheck = false; // Optional: disable browser spellcheck
                    //  contentDiv.innerHTML = this.text; // Set initial text

                    // Check if the stored text is an expression
                    // const isExpression = this.text && this.text.trim().startsWith('=');
                    // Conditionally set the initial display text
                    // contentDiv.innerHTML = isExpression ? '«Expr»' : this.text;

                    const getPlainText = (html) => {
                        const tempDiv = document.createElement("div");
                        tempDiv.innerHTML = html;
                        return tempDiv.textContent || tempDiv.innerText || "";
                    };

                    const plainText = getPlainText(this.text);
                    // const isExpression = plainText.trim().startsWith('=');

                    // contentDiv.innerHTML = isExpression ? '«Expr»' : this.text;

                    // --- MODIFICATION: Use the new classification logic ---
                    const textType = this.classifyText(plainText);

                
                    // --- START: MODIFIED LOGIC ---
                    if (textType === 'expression') {
                        contentDiv.innerHTML = this.createFormattedPlaceholder(this.text, '«Expr»');
                    
                    } else if (textType === 'field' || textType === 'parameter') {
                        // This block now handles both fields and parameters.
                        const simpleValueRegex = /^=(Fields|Parameters)!(\w+)\.Value$/;
                        const match = plainText.match(simpleValueRegex);

                        if (match) {
                            const name = match[2]; // Extracts the name, e.g., "invoice_number"
                            let placeholder = '';

                            if (textType === 'field') {
                                // Format for fields: [invoice_store]
                                placeholder = `[${name}]`;
                            } else { // textType === 'parameter'
                                // Format for parameters: [@invoice_number]
                                placeholder = `[@${name}]`;
                            }
                            
                            // Use the existing method to apply the new placeholder while keeping the old formatting.
                            contentDiv.innerHTML = this.createFormattedPlaceholder(this.text, placeholder);
                        } else {
                            // Fallback in case of an unexpected mismatch
                            contentDiv.innerHTML = this.text;
                        }

                    } else { // This handles the 'literal' case
                        contentDiv.innerHTML = this.text;
                    }
                    // --- END: MODIFIED LOGIC ---

                    // Apply initial text styling to the content div itself
                    contentDiv.style.fontFamily = this.fontFamily;
                    contentDiv.style.fontSize = this.fontSize + 'pt';
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
                    contentDiv.addEventListener('input', () => {
                        if (contentDiv.innerHTML !== '«Expr»') {
                            this.text = contentDiv.innerHTML;
                        }
                    });


                    contentDiv.addEventListener('mousedown', (e) => {
                        if (!this.selected) this.select(); // Select the parent object if content is clicked
                        e.stopPropagation(); // Prevent parent's mousedown if needed, but usually not for textboxes
                    });


                    // contentDiv.addEventListener('focus', () => {
                    //     this.select(); // Ensure parent object is selected when content gets focus
                    //     reportDesigner.activeTextElement = contentDiv;
                    //     setTimeout(() => reportDesigner.updateToolbarStates(), 0); // Update toolbar for text context
                    // });

                    // NEW: Add a 'focus' listener to show the real expression for editing
                    contentDiv.addEventListener('focus', () => {
                        const currentPlainText = getPlainText(this.text);
                        if (currentPlainText.trim().startsWith('=')) {
                            contentDiv.innerHTML = this.text;
                        }
                        this.select();
                        reportDesigner.activeTextElement = contentDiv;
                        setTimeout(() => reportDesigner.updateToolbarStates(), 0);
                    });

                    // NEW: Add a 'blur' listener to revert to the placeholder after editing
            
                    contentDiv.addEventListener('blur', () => {
                        const currentPlainText = getPlainText(this.text);
                        const textType = this.classifyText(currentPlainText);

                        // Re-apply the placeholder logic on blur
                        if (textType === 'expression') {
                            contentDiv.innerHTML = this.createFormattedPlaceholder(this.text, '«Expr»');
                        } else if (textType === 'field' || textType === 'parameter') {
                            const simpleValueRegex = /^=(Fields|Parameters)!(\w+)\.Value$/;
                            const match = currentPlainText.match(simpleValueRegex);
                            if(match) {
                                const name = match[2];
                                const placeholder = (textType === 'field') ? `[${name}]` : `[@${name}]`;
                                contentDiv.innerHTML = this.createFormattedPlaceholder(this.text, placeholder);
                            }
                        }
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


                /**
                 * Analyzes the text content to classify it.
                 * @param {string} text - The plain text content to analyze.
                 * @returns {'literal' | 'field' | 'parameter' | 'expression'}
                 */
                classifyText(text) {
                    const trimmedText = text.trim();

                    // 1. If it doesn't start with '=', it's just plain text.
                    if (!trimmedText.startsWith('=')) {
                        return 'literal';
                    }

                    // 2. Regex to match a simple "=Fields!name.Value" or "=Parameters!name.Value" pattern.
                    const simpleValueRegex = /^=(Fields|Parameters)!(\w+)\.Value$/;
                    const match = trimmedText.match(simpleValueRegex);

                    if (match) {
                        // 3. If it matches the simple pattern, check the captured group.
                        // match[1] will be either "Fields" or "Parameters".
                        if (match[1] === 'Fields') {
                            return 'field'; // e.g., "=Fields!invoice_store.Value"
                        } else {
                            return 'parameter'; // e.g., "=Parameters!invoice_number.Value"
                        }
                    } else {
                        // 4. If it starts with "=" but is not a simple field/parameter, it's an expression.
                        return 'expression'; // e.g., "=SUM(Fields!Total.Value)" or "=1+1"
                    }
                }


                // Add this new method inside the "TextBox" class definition

                /**
                 * Creates a placeholder string (e.g., «Expr») that retains the HTML formatting
                 * of the original content. It replaces the first text found and clears the rest.
                 * @param {string} html - The original HTML content of the textbox.
                 * @param {string} placeholder - The placeholder text to insert, e.g., '«Expr»'.
                 * @returns {string} The new HTML with the formatted placeholder.
                 */
                createFormattedPlaceholder(html, placeholder) {
                    // Create a temporary, in-memory element to safely parse and manipulate the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;

                    let placeholderSet = false;

                    // A recursive function to walk through all nodes of the HTML
                    function traverseAndReplace(node) {
                        // If it's a text node with actual visible content...
                        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                            if (!placeholderSet) {
                                // Replace the first one we find with the placeholder.
                                node.nodeValue = placeholder;
                                placeholderSet = true;
                            } else {
                                // Clear any subsequent text nodes to avoid duplicate text.
                                node.nodeValue = '';
                            }
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            // If it's an element, we need to check its children.
                            // We iterate using a standard loop as childNodes can be a live collection.
                            for (let i = 0; i < node.childNodes.length; i++) {
                                traverseAndReplace(node.childNodes[i]);
                            }
                        }
                    }

                    traverseAndReplace(tempDiv);

                    // If for some reason no text was found, just return the plain placeholder.
                    if (!placeholderSet) {
                        return placeholder;
                    }

                    return tempDiv.innerHTML;
                }

                
                updateVerticalAlignmentStyling() {
                    if (!this.element) return; // this.element is the .textbox-object (flex container)
                    // .textbox-object CSS already has display: flex;
                    // this.element.style.display = 'flex'; // This would be redundant but harmless

                    // Align .textbox-content (the flex item) within .textbox-object (the flex container)
                    switch (this.verticalAlign) {
                        case 'top':
                            this.element.style.alignItems = 'flex-start';
                            break;
                        case 'middle':
                            this.element.style.alignItems = 'center';
                            break;
                        case 'bottom':
                            this.element.style.alignItems = 'flex-end';
                            break;
                        default:
                            this.element.style.alignItems = 'flex-start'; // Default to top
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
                            this.contentElement.style.fontSize = this.fontSize + 'pt';
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
                    this.dragOffset = {
                        x: 0,
                        y: 0
                    };
                    this.resizeHandleType = null;
                    this.initialMousePos = {
                        x: 0,
                        y: 0
                    };
                    this.initialSize = {
                        width: 0,
                        height: 0
                    };
                    this.initialPos = {
                        x: 0,
                        y: 0
                    };
                    this.clipboard = null; // For copy-paste
                    this.currentTable = null; // For table column dialog context
                    this.activeTextElement = null; // Currently focused contentEditable element
                    this.storedSelectionRange = null; // To preserve selection across focus changes
                    this.fieldTemplate = null; // For adding predefined field textboxes

                    // --- Data properties ---
                    this.datasets = [];
                    this.parameters = [];

                    // ADD THESE LINES
                    this.isTableResizing = false;
                    this.resizingTable = null;

                    this.init();
                }

                init() {
                    this.setupEventListeners();
                    this.setupToolbar();
                    this.setupToolbox();

                    // Attempt to use CSS for styling execCommand output (e.g., bold, italic)
                    try {
                        document.execCommand('styleWithCSS', false, true);
                    } catch (e) {
                        /* console.warn("styleWithCSS failed", e); */
                    }
                }

                // --- Method to add a DataSet ---
                addDataSet(name, fields) {
                    if (!name || !Array.isArray(fields)) {
                        console.error("Invalid arguments for addDataSet. Requires name (string) and fields (array).");
                        return;
                    }
                    // Fix the 'visible' property assignment
                    const correctedFields = fields.map(f => ({
                        ...f,
                        visible: f.visible !== false
                    }));
                    this.datasets.push({
                        name,
                        fields: correctedFields
                    });
                }

                // --- Method to add parameters ---
                addParameters(parameters) {
                    if (!Array.isArray(parameters)) {
                        console.error("Invalid arguments for addParameters. Requires an array of parameters.");
                        return;
                    }
                    // Fix the 'visible' property assignment
                    this.parameters = parameters.map(p => ({
                        ...p,
                        visible: p.visible !== false
                    }));
                }



                setupEventListeners() {
                    // Clicking on the paper itself
                    this.paper.addEventListener('mousedown', (e) => {
                        if (e.target === this.paper || e.target === this.gridOverlay) { // Click on paper or grid
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
                        if (this.isTableResizing) this.resizingTable.handleInternalResize(e); // ADD THIS LINE
                    });

                    // Global mouse up to stop dragging/resizing
                    document.addEventListener('mouseup', () => {
                        if (this.isDragging) {
                            document.body.classList.remove('dragging-active');
                        }
                        if (this.isResizing) {
                            document.body.classList.remove('dragging-active'); // Also remove for resize
                        }

                        // ADD THIS BLOCK
                        if (this.isTableResizing) {
                            if (this.resizingTable) {
                                this.resizingTable.isResizing = null;
                                // FIX: Force a redraw of the main resize handles
                                this.resizingTable.removeResizeHandles();
                                this.resizingTable.addResizeHandles();
                            }
                            this.isTableResizing = false;
                            this.resizingTable = null;
                            document.body.classList.remove('dragging-active');
                        }

                        this.isDragging = false;
                        this.isResizing = false;

                        // Reset cursor on the selected object's element after drag/resize
                        if (this.selectedObject && this.selectedObject.element) {
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
                             //   e.preventDefault(); // Prevent browser back navigation on backspace
                               // this.deleteObject(this.selectedObject);
                            } else if (e.ctrlKey || e.metaKey) { // Ctrl/Cmd key for copy/paste
                                // if (e.key === 'c') {
                                //     e.preventDefault();
                                //     this.copyObject();
                                // }
                                // if (e.key === 'v') {
                                //     e.preventDefault();
                                //     this.pasteObject();
                                // }
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
                   //     const eventType = (el.type === 'color' || (el.type === 'number' && id === 'padding')) ? 'input' : 'change';
                   const eventType = (el.type === 'color') ? 'input' : 'change';  
                   el.addEventListener(eventType, () => this.applySelectedObjectStylesFromToolbar());
                        if (el.type === 'color') { // Ensure 'change' event also triggers for color pickers for final value confirmation
                            el.addEventListener('change', () => this.applySelectedObjectStylesFromToolbar());
                        }
                    });


                    const formattingControls = document.querySelectorAll('.format-btn'); //, .align-btn, .valign-btn, #fontFamily, #fontSizeSelect, #foreColor, #backColor

                    formattingControls.forEach(control => {
                        control.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                        });
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
                    fontSizeSelect.addEventListener('change', (e) => this.applyCharacterFormat('fontSize', e.target.value + 'pt')); // Append 'px' for CSS


                    // Text color input
                    const foreColorInput = document.getElementById('foreColor');
                    foreColorInput.addEventListener('focus', () => this.captureSelectionState());
                    foreColorInput.addEventListener('input', (e) => this.applyCharacterFormat('foreColor', e.target.value, true)); // true for isInputEvent
                    foreColorInput.addEventListener('change', (e) => this.applyCharacterFormat('foreColor', e.target.value)); // Final change


                    // Text alignment buttons (Left, Center, Right)
                    document.querySelectorAll('.align-btn').forEach(btn => btn.addEventListener('click', () => {
                        this.applyTextAlignment(btn.dataset.align);
                    }));

                    // Vertical alignment buttons (Top, Middle, Bottom)
                    document.querySelectorAll('.valign-btn').forEach(btn => btn.addEventListener('click', () => {
                        this.applyVerticalAlignment(btn.dataset.valign);
                    }));
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
                        borderSize: parseFloat(document.getElementById('borderSize').value),
                        borderColor: document.getElementById('borderColor').value,
                        borderSet: document.getElementById('borderSet').value,
                        backgroundColor: document.getElementById('backColor').value, // This will be ignored by LineObject's applyStyles
                        padding: parseFloat(document.getElementById('padding').value),
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

                    const toolboxPanel = document.querySelector('.toolbox-panel');

                    // Add ONE click listener to the entire toolbox panel
                    toolboxPanel.addEventListener('click', (event) => {

                        // Check if the clicked element (or its parent) is a .tool-item
                        const item = event.target.closest('.tool-item');

                        // If we didn't click on a tool-item, do nothing.
                        if (!item) {
                            return;
                        }

                        // --- This is your original code. It will now run for ANY tool item, old or new. ---
                        document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active')); // Deactivate others
                        item.classList.add('active'); // Activate clicked item
                        const tool = item.dataset.tool;
                        this.currentTool = (tool === 'field') ? 'textbox' : tool; // 'field' creates a 'textbox'
                        this.fieldTemplate = (tool === 'field') ? item.dataset.field : null; // Store field name if it's a field tool
                        // Change paper cursor based on selected tool
                        this.paper.style.cursor = (this.currentTool !== 'pointer' && this.currentTool !== 'field') ? 'crosshair' : 'default';
                        // --- End of your original code ---
                    });

                    // document.querySelectorAll('.tool-item').forEach(item => {
                    //     item.addEventListener('click', () => {
                    //         alert("x");
                    //         document.querySelectorAll('.tool-item').forEach(t => t.classList.remove('active')); // Deactivate others
                    //         item.classList.add('active'); // Activate clicked item
                    //         const tool = item.dataset.tool;
                    //         this.currentTool = (tool === 'field') ? 'textbox' : tool; // 'field' creates a 'textbox'
                    //         this.fieldTemplate = (tool === 'field') ? item.dataset.field : null; // Store field name if it's a field tool
                    //         // Change paper cursor based on selected tool
                    //         this.paper.style.cursor = (this.currentTool !== 'pointer' && this.currentTool !== 'field') ? 'crosshair' : 'default';
                    //     });
                    // });


                }

                // MODIFIED AND FINAL: This function now correctly handles adding objects
                // either by type (from the toolbox) or by instance (from the importer).
                // MODIFIED: This function now accepts a type string or a pre-configured object
                addObject(newObjectOrType, x, y) {
                    let obj;

                    if (typeof newObjectOrType === 'string') {
                        // Original functionality: creating a new object from a type string (e.g., from the toolbox)
                        const type = newObjectOrType;
                        const defaultWidth = 150,
                            defaultLineHeight = 2,
                            defaultTextboxHeight = 40,
                            defaultImageHeight = 100,
                            defaultTableWidth = 300,
                            defaultTableHeight = 80;

                        if (this.gridVisible) {
                            const gridSize = 20;
                            x = Math.round(x / gridSize) * gridSize;
                            y = Math.round(y / gridSize) * gridSize;
                        }

                        switch (type) {
                            case 'textbox':
                                //  obj = new TextBox(x, y, defaultWidth, defaultTextboxHeight, this.fieldTemplate ? `[${this.fieldTemplate}]` : 'Text Box');
                                obj = new TextBox(x, y, defaultWidth, defaultTextboxHeight, this.fieldTemplate ? `${this.fieldTemplate}` : 'Text Box');
                                break;
                            case 'image':
                                obj = new ImageObject(x, y, defaultWidth, defaultImageHeight);
                                break;
                            case 'table':
                                obj = new TableObject(x, y, defaultTableWidth, defaultTableHeight);
                                break;
                            case 'line':
                                obj = new LineObject(x, y, defaultWidth, defaultLineHeight);
                                break;
                            default:
                                console.warn("Attempted to add unknown object type:", type);
                                return;
                        }
                        // Revert to pointer tool after adding an object
                        this.fieldTemplate = null;
                        this.currentTool = 'pointer';
                        document.querySelector('.tool-item[data-tool="pointer"]').classList.add('active');
                        document.querySelectorAll('.tool-item:not([data-tool="pointer"])').forEach(t => t.classList.remove('active'));
                        this.paper.style.cursor = 'default';

                    } else if (typeof newObjectOrType === 'object' && newObjectOrType instanceof ReportObject) {
                        // New functionality: accepting a pre-configured object from the importer
                        obj = newObjectOrType;
                    } else {
                        console.error("Invalid argument passed to addObject. Must be a type string or a ReportObject instance.");
                        return;
                    }

                    // Common logic for both paths to add the object to the canvas
                    const element = obj.createElement();

                    // If the object is a table, it needs to be rendered after its element is created
                    if (obj.type === 'table') {
                        obj.render();
                    }

                    //   element.style.zIndex = ReportDesigner.zIndexCounter++;
                    obj.zIndex = element.style.zIndex = ReportDesigner.zIndexCounter++;
                    this.paper.appendChild(element);
                    this.objects.push(obj);
                    this.selectObject(obj);
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
                    this.dragOffset = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
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
                    this.initialMousePos = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    this.initialSize = {
                        width: obj.width,
                        height: obj.height
                    };
                    this.initialPos = {
                        x: obj.x,
                        y: obj.y
                    };
                    e.stopPropagation(); // Prevent drag from starting if mousedown was on a handle
                    document.body.classList.add('dragging-active'); // Use same visual cue as dragging
                }
                startTableResize(tableObject, e) {
                    this.isTableResizing = true;
                    this.resizingTable = tableObject;

                    const grip = e.target;
                    const index = parseInt(grip.dataset.index);
                    const isColumn = grip.classList.contains('table-resize-grip-col');

                    // Set the resizing state on the table object itself.
                    // This state is used by the table's handleInternalResize method.
                    tableObject.isResizing = {
                        type: isColumn ? 'column' : 'row',
                        index: index,
                        startX: e.clientX,
                        startY: e.clientY,
                        tableWidth: tableObject.element.offsetWidth,
                        initialWidths: [...tableObject.columnWidths],
                        initialHeights: [...tableObject.rowHeights]
                    };

                    document.body.classList.add('dragging-active'); // To show grabbing cursor
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
                            if (this.resizeHandleType.includes('w')) {
                                newWidth = this.initialSize.width - dx;
                                newX = this.initialPos.x + dx;
                            }
                            // Height (thickness) for horizontal lines is obj.height which is obj.borderSize. Not changed by these handles.
                        } else { // Vertical line logic (left/right border)
                            if (this.resizeHandleType.includes('s')) newHeight = this.initialSize.height + dy; // Adjusts object's height (length of vertical line)
                            if (this.resizeHandleType.includes('n')) {
                                newHeight = this.initialSize.height - dy;
                                newY = this.initialPos.y + dy;
                            }
                            // Width (thickness) for vertical lines is obj.width which is obj.borderSize. Not changed by these handles.
                            // This part of the model needs refinement if vertical lines are to have their thickness set by borderSize and length by N/S handles.
                            // Current: N/S changes obj.height. If obj.height is also its thickness, this is problematic.
                            // For now, assume vertical line's "length" is its object height, and "thickness" is its object width (set by borderSize).
                        }
                    } else { // Default resizing for other objects (textbox, image, table)
                        if (this.resizeHandleType.includes('e')) newWidth = this.initialSize.width + dx;
                        if (this.resizeHandleType.includes('w')) {
                            newWidth = this.initialSize.width - dx;
                            newX = this.initialPos.x + dx;
                        }
                        if (this.resizeHandleType.includes('s')) newHeight = this.initialSize.height + dy;
                        if (this.resizeHandleType.includes('n')) {
                            newHeight = this.initialSize.height - dy;
                            newY = this.initialPos.y + dy;
                        }
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
                    const propsToCopy = {
                        ...this.selectedObject
                    };
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

                    this.clipboard = {
                        type: this.selectedObject.type,
                        properties: JSON.parse(JSON.stringify(propsToCopy))
                    };
                }
                pasteObject() {
                    if (!this.clipboard) return;
                    // Offset the pasted object slightly from the original or a default position
                    const x = (this.selectedObject ? this.selectedObject.x : 0) + 20;
                    const y = (this.selectedObject ? this.selectedObject.y : 0) + 20;
                    let newObj;

                    // Create a new instance of the object based on clipboard type
                    switch (this.clipboard.type) {
                        case 'textbox':
                            newObj = new TextBox(x, y);
                            break;
                        case 'image':
                            newObj = new ImageObject(x, y);
                            break;
                        case 'table':
                            newObj = new TableObject(x, y);
                            break;
                        case 'line':
                            newObj = new LineObject(x, y);
                            break;
                        default:
                            console.warn("Unknown object type in clipboard:", this.clipboard.type);
                            return;
                    }

                    // Apply all copied properties to the new object instance
                    const pastedProps = {
                        ...this.clipboard.properties
                    };
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


                changePageSize(size) {
                    this.paper.className = `paper ${size}`;
                }
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
                        targetElement.focus({
                            preventScroll: true
                        }); // preventScroll helps if element is off-screen
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
                                    this.selectedObject.applyStyles({
                                        fontSize: parseInt(value)
                                    });
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
                        this.selectedObject.applyStyles({
                            textAlign: align
                        }); // Update object property
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
                        this.selectedObject.applyStyles({
                            verticalAlign: valign
                        }); // This will call updateVerticalAlignmentStyling
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
                                } catch (e) {
                                    /* Mute errors, e.g. if element not focused or command unsupported */
                                }
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
                    let baseObjectFontFamily = 'Arial',
                        baseObjectFontSize = 12,
                        baseObjectForeColor = '#000000';
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
                                ffSelect.value = opt.value;
                                return true;
                            }
                            return false;
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

                // updateFontControlsFromSelection() { // Updates font family, size, color dropdowns/inputs from text context
                //     const computedStyle = this.getStyleAtCursorOrSelection();
                //     const ffSelect = document.getElementById('fontFamily');
                //     const fsSelect = document.getElementById('fontSizeSelect'); // This is the <select> for font size
                //     const fcInput = document.getElementById('foreColor');

                //     // Determine base styles from the selected object if it's text-editable
                //     let baseObjectFontFamily = 'Arial',
                //         baseObjectFontSize = 12,
                //         baseObjectForeColor = '#000000';
                //     if (this.selectedObject && (this.selectedObject.type === 'textbox' || this.selectedObject.type === 'table')) {
                //         baseObjectFontFamily = this.selectedObject.fontFamily || 'Arial';
                //         baseObjectFontSize = this.selectedObject.fontSize || 12; // This is the object's base font size
                //         baseObjectForeColor = this.selectedObject.foreColor || '#000000';
                //     }


                //     if (computedStyle) {
                //         // Font Family: Try to match computed font with select options
                //         const currentFont = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
                //         let foundFontInSelect = Array.from(ffSelect.options).some(opt => {
                //             if (opt.value.toLowerCase() === currentFont.toLowerCase()) {
                //                 ffSelect.value = opt.value;
                //                 return true;
                //             }
                //             return false;
                //         });
                //         if (!foundFontInSelect) ffSelect.value = baseObjectFontFamily; // Fallback if not in select

                //         // Font Size: Try to match computed size (in px) with select options (which are pt but treated as px values here)
                //         const currentSizePx = Math.round(parseFloat(computedStyle.fontSize)); // Get size in px and round
                //         let foundSizeInSelect = Array.from(fsSelect.options).some(opt => parseInt(opt.value) === currentSizePx);
                //         if (foundSizeInSelect) {
                //             fsSelect.value = currentSizePx; // Set select to the matched value
                //         } else {
                //             // If current computed size isn't in options, use object's base font size
                //             fsSelect.value = baseObjectFontSize;
                //         }

                //         // Font Color: Convert RGB from computedStyle to Hex for color input
                //         fcInput.value = this.rgbToHex(computedStyle.color);
                //     } else { // No computed style (e.g., no active text element, or style source couldn't be determined)
                //         // Fallback to the selected object's base styles or application defaults
                //         ffSelect.value = baseObjectFontFamily;
                //         fsSelect.value = baseObjectFontSize;
                //         fcInput.value = baseObjectForeColor;
                //     }
                // }


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
                hideContextMenu() {
                    document.getElementById('contextMenu').style.display = 'none';
                }
                handleContextAction(action, obj) { // Handles actions from context menu
                    // Ensure 'obj' refers to the right-clicked object, or the selected one for global actions
                    if (!obj && (action === 'delete' || action === 'copy' || action === 'bring-front' || action === 'send-back')) {
                        obj = this.selectedObject; // Use globally selected if no specific obj passed (e.g. from a global paste action)
                    }
                    if (!obj && action !== 'paste') { // Most actions require an object context
                        console.warn("Context action called without a target object:", action);
                        return;
                    }


                    switch (action) {
                        case 'delete':
                            if (obj) this.deleteObject(obj);
                            break;
                        case 'copy':
                            if (obj) {
                                this.selectObject(obj);
                                this.copyObject();
                            }
                            break; // Select then copy
                        case 'paste':
                            this.pasteObject();
                            break; // Paste uses clipboard, not specific obj context for action trigger
                        case 'bring-front':
                            //  if (obj && obj.element) obj.element.style.zIndex = ReportDesigner.zIndexCounter++;
                            if (obj && obj.element) obj.zIndex = obj.element.style.zIndex = ReportDesigner.zIndexCounter++;
                            break;
                        case 'send-back':
                            if (obj && obj.element) obj.zIndex = obj.element.style.zIndex = 0;
                            // if (obj && obj.element) obj.element.style.zIndex = 0;
                            break; // Or a base z-index like 1
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


        <script src="RDLCExporter.js"></script>

        <script src="RDLCImporter.js"></script>
        <script src="TableObject.js"></script>
        <script src="LineObject.js"></script>
        <script src="DataSet.js"></script>
        <script src="ImageObject.js"></script>


    </body>

    </html>