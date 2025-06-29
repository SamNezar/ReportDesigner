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
                const {
                    backgroundColor,
                    ...otherStylesToApply
                } = styles;
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