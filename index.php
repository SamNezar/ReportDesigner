<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Designer</title>
    <link rel="stylesheet" href="css/toolbar.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/toolbox.css">
    <link rel="stylesheet" href="css/editor.css">
</head>
<body>
    <!-- Top Toolbar 1: Border Properties -->
    <div class="toolbar toolbar-border">
        <div class="toolbar-group">
            <label>Border Style:</label>
            <select id="borderStyle" class="toolbar-select">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
            </select>
        </div>
        
        <div class="toolbar-group">
            <label>Size:</label>
            <select id="borderSize" class="toolbar-select">
                <option value="1">1pt</option>
                <option value="2">2pt</option>
                <option value="3">3pt</option>
                <option value="4">4pt</option>
                <option value="5">5pt</option>
            </select>
        </div>
        
        <div class="toolbar-group">
            <label>Color:</label>
            <input type="color" id="borderColor" class="color-picker" value="#000000">
        </div>
        
        <div class="toolbar-group">
            <label>Border Set:</label>
            <div class="border-buttons">
                <button id="borderAll" class="border-btn active" title="All Borders">⬜</button>
                <button id="borderNone" class="border-btn" title="No Border">◯</button>
                <button id="borderTop" class="border-btn" title="Top Border">⬆</button>
                <button id="borderBottom" class="border-btn" title="Bottom Border">⬇</button>
                <button id="borderLeft" class="border-btn" title="Left Border">⬅</button>
                <button id="borderRight" class="border-btn" title="Right Border">➡</button>
            </div>
        </div>
        
        <div class="toolbar-group">
            <label>Page Size:</label>
            <select id="pageSize" class="toolbar-select">
                <option value="a4-portrait" selected>A4 Portrait</option>
                <option value="a4-landscape">A4 Landscape</option>
                <option value="a5-portrait">A5 Portrait</option>
                <option value="a5-landscape">A5 Landscape</option>
            </select>
        </div>
        
        <div class="toolbar-group">
            <button id="toggleGrid" class="toggle-btn" title="Toggle Grid">Grid</button>
        </div>
    </div>

    <!-- Top Toolbar 2: Text Properties -->
    <div class="toolbar toolbar-text">
        <div class="toolbar-group">
            <label>Font:</label>
            <select id="fontFamily" class="toolbar-select">
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
            </select>
        </div>
        
        <div class="toolbar-group">
            <label>Size:</label>
            <select id="fontSize" class="toolbar-select">
                <option value="8">8pt</option>
                <option value="10">10pt</option>
                <option value="12">12pt</option>
                <option value="14" selected>14pt</option>
                <option value="16">16pt</option>
                <option value="18">18pt</option>
                <option value="20">20pt</option>
                <option value="24">24pt</option>
            </select>
        </div>
        
        <div class="toolbar-group format-buttons">
            <button id="boldBtn" class="format-btn" title="Bold"><strong>B</strong></button>
            <button id="italicBtn" class="format-btn" title="Italic"><em>I</em></button>
            <button id="underlineBtn" class="format-btn" title="Underline"><u>U</u></button>
            <button id="strikethroughBtn" class="format-btn" title="Strikethrough"><s>S</s></button>
        </div>
        
        <div class="toolbar-group">
            <label>Text Color:</label>
            <input type="color" id="textColor" class="color-picker" value="#000000">
        </div>
        
        <div class="toolbar-group">
            <label>Background:</label>
            <input type="color" id="backgroundColor" class="color-picker" value="#ffffff">
        </div>
        
        <div class="toolbar-group align-buttons">
            <button id="alignLeft" class="align-btn active" title="Align Left">⬅</button>
            <button id="alignCenter" class="align-btn" title="Align Center">⬄</button>
            <button id="alignRight" class="align-btn" title="Align Right">➡</button>
        </div>
        
        <div class="toolbar-group">
            <label>Direction:</label>
            <select id="textDirection" class="toolbar-select">
                <option value="ltr" selected>LTR</option>
                <option value="rtl">RTL</option>
            </select>
        </div>
        
        <div class="toolbar-group">
            <label>Line Height:</label>
            <select id="lineHeight" class="toolbar-select">
                <option value="1">1</option>
                <option value="1.2">1.2</option>
                <option value="1.5" selected>1.5</option>
                <option value="2">2</option>
                <option value="2.5">2.5</option>
            </select>
        </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Left Toolbox Panel -->
        <div class="toolbox-panel">
            <div class="toolbox-header">
                <h3>Toolbox</h3>
                <input type="text" id="toolboxSearch" placeholder="Search Toolbox" class="search-input">
            </div>
            
            <div class="toolbox-section">
                <h4>Report Items</h4>
                <div class="toolbox-items">
                    <div class="toolbox-item active" data-tool="pointer" title="Pointer">
                        <span class="tool-icon">👆</span>
                        <span class="tool-name">Pointer</span>
                    </div>
                    <div class="toolbox-item" data-tool="textbox" title="Text Box">
                        <span class="tool-icon">📝</span>
                        <span class="tool-name">Text Box</span>
                    </div>
                    <div class="toolbox-item" data-tool="image" title="Image">
                        <span class="tool-icon">🖼️</span>
                        <span class="tool-name">Image</span>
                    </div>
                    <div class="toolbox-item" data-tool="table" title="Table">
                        <span class="tool-icon">📊</span>
                        <span class="tool-name">Table</span>
                    </div>
                    <div class="toolbox-item" data-tool="line" title="Line">
                        <span class="tool-icon">📏</span>
                        <span class="tool-name">Line</span>
                    </div>
                </div>
            </div>
            
            <div class="toolbox-section">
                <h4>Static Field Values</h4>
                <div class="static-fields">
                    <div class="static-field" data-field="invoice_type_name">
                        [invoice_type_name]
                    </div>
                    <div class="static-field" data-field="transaction_qty">
                        [transaction_qty]
                    </div>
                    <div class="static-field" data-field="transaction_name">
                        [transaction_name]
                    </div>
                    <div class="static-field" data-field="invoice_number">
                        [invoice_number]
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Editor Panel -->
        <div class="editor-panel">
            <div class="editor-header">
                <span>Page Design Area</span>
                <div class="zoom-controls">
                    <button id="zoomOut">-</button>
                    <span id="zoomLevel">100%</span>
                    <button id="zoomIn">+</button>
                </div>
            </div>
            
            <div class="editor-container">
                <div id="designSurface" class="design-surface">
                    <div id="paper" class="paper a4-portrait">
                        <div class="grid-overlay" id="gridOverlay"></div>
                        <!-- Report objects will be added here dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Context Menu -->
    <div id="contextMenu" class="context-menu">
        <div class="context-item" data-action="copy">Copy</div>
        <div class="context-item" data-action="paste">Paste</div>
        <div class="context-item" data-action="delete">Delete</div>
        <div class="context-item" data-action="bring-front">Bring to Front</div>
        <div class="context-item" data-action="send-back">Send to Back</div>
    </div>

    <!-- Properties Panel (Hidden by default, shows when object is selected) -->
    <div id="propertiesPanel" class="properties-panel">
        <div class="properties-header">
            <h4>Properties</h4>
            <button id="closeProperties">×</button>
        </div>
        <div class="properties-content">
            <!-- Properties will be populated dynamically based on selected object -->
        </div>
    </div>

  


    <script src="js/classes.js"></script>
    <script src="js/toolbar.js"></script>
    <script src="js/toolbox.js"></script>
    <script src="js/editor.js"></script>
    <script src="js/main.js"></script>

 
</body>
</html>