// Toolbar Management
        class ToolbarManager {
            constructor() {
                this.selectedObjects = [];
                this.initializeToolbar();
            }

            initializeToolbar() {
                // Border toolbar
                this.initializeBorderToolbar();
                
                // Text toolbar
                this.initializeTextToolbar();
            }

            initializeBorderToolbar() {
                // Border style
                document.getElementById('borderStyle').addEventListener('change', (e) => {
                    this.applyBorderStyle(e.target.value);
                });

                // Border size
                document.getElementById('borderSize').addEventListener('change', (e) => {
                    this.applyBorderSize(e.target.value);
                });

                // Border color
                document.getElementById('borderColor').addEventListener('change', (e) => {
                    this.applyBorderColor(e.target.value);
                });

                // Border buttons
                document.querySelectorAll('.border-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.handleBorderButton(e.target);
                    });
                });
            }

            initializeTextToolbar() {
                // Font family
                document.getElementById('fontFamily').addEventListener('change', (e) => {
                    this.applyFontFamily(e.target.value);
                });

                // Font size
                document.getElementById('fontSize').addEventListener('change', (e) => {
                    this.applyFontSize(e.target.value);
                });

                // Format buttons
                document.getElementById('boldBtn').addEventListener('click', () => {
                    this.toggleBold();
                });

                document.getElementById('italicBtn').addEventListener('click', () => {
                    this.toggleItalic();
                });

                document.getElementById('underlineBtn').addEventListener('click', () => {
                    this.toggleUnderline();
                });

                document.getElementById('strikethroughBtn').addEventListener('click', () => {
                    this.toggleStrikethrough();
                });

                // Colors
                document.getElementById('textColor').addEventListener('change', (e) => {
                    this.applyTextColor(e.target.value);
                });

                document.getElementById('backgroundColor').addEventListener('change', (e) => {
                    this.applyBackgroundColor(e.target.value);
                });

                // Alignment
                document.querySelectorAll('.align-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.handleAlignmentButton(e.target);
                    });
                });

                // Line height
                document.getElementById('lineHeight').addEventListener('change', (e) => {
                    this.applyLineHeight(e.target.value);
                });

                // Page size (moved to first toolbar)
                document.getElementById('pageSize').addEventListener('change', (e) => {
                    this.changePageSize(e.target.value);
                });

                // Toggle grid (moved to first toolbar)
                document.getElementById('toggleGrid').addEventListener('click', () => {
                    this.toggleGrid();
                });

                // Page size
                document.getElementById('pageSize').addEventListener('change', (e) => {
                    this.changePageSize(e.target.value);
                });

                // Toggle grid
                document.getElementById('toggleGrid').addEventListener('click', () => {
                    this.toggleGrid();
                });
            }

            // Empty methods to be implemented
            applyBorderStyle(style) {}
            applyBorderSize(size) {}
            applyBorderColor(color) {}
            handleBorderButton(button) {}
            applyFontFamily(fontFamily) {}
            applyFontSize(fontSize) {}
            toggleBold() {}
            toggleItalic() {}
            toggleUnderline() {}
            toggleStrikethrough() {}
            applyTextColor(color) {}
            applyBackgroundColor(color) {}
            handleAlignmentButton(button) {}
            applyTextDirection(direction) {}
            applyLineHeight(lineHeight) {}
            changePageSize(size) {}
            toggleGrid() {}
            updateToolbarState() {}
        }