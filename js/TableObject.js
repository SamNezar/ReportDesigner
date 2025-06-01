// Table Object - extends BaseObject
class TableObject extends BaseObject {
    constructor(x = 0, y = 0) {
        super('table', x, y);
        this.initialize();
    }
    
    initialize() {
        this.width = 300;
        this.height = 100;
        this.rows = 2; // Always 2 rows (header + data)
        this.columns = 3;
        this.cellPadding = 5;
        this.cellSpacing = 0;
        this.headerData = ['Column 1', 'Column 2', 'Column 3'];
        this.dataFields = ['item_name', 'item_price', 'item_total']; // Predefined data fields
        this.columnWidths = [100, 100, 100];
        
        // Each cell is essentially a textbox with character-level formatting
        this.cells = [];
        this.initializeCells();
    }
    
    initializeCells() {
        for(let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for(let col = 0; col < this.columns; col++) {
                this.cells[row][col] = {
                    content: row === 0 ? this.headerData[col] : this.dataFields[col],
                    richText: [], // Character-level formatting for this cell
                    cellProperties: {
                        backgroundColor: row === 0 ? '#f0f0f0' : '#ffffff',
                        padding: 5,
                        textAlignment: 'left',
                        lineHeight: 1.2
                    }
                };
                // Initialize rich text for this cell
                this.initializeCellRichText(row, col);
            }
        }
    }
    
    // Initialize rich text formatting for table cell
    initializeCellRichText(row, col) {
        const cell = this.cells[row][col];
        cell.richText = [];
        for (let i = 0; i < cell.content.length; i++) {
            cell.richText.push({
                char: cell.content[i],
                fontFamily: 'Arial',
                fontSize: 12,
                bold: row === 0, // Header cells are bold by default
                italic: false,
                underline: false,
                strikeout: false,
                color: '#000000'
            });
        }
    }
    
    // Apply formatting to selected characters in table cell
    applyCellCharacterFormatting(row, col, startIndex, endIndex, property, value) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        const cell = this.cells[row][col];
        for (let i = startIndex; i <= endIndex && i < cell.richText.length; i++) {
            if (cell.richText[i]) {
                cell.richText[i][property] = value;
            }
        }
    }
    
    // Format selected text in cell
    formatCellSelectedText(row, col, startIndex, endIndex, formatting) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        const cell = this.cells[row][col];
        for (let i = startIndex; i <= endIndex && i < cell.richText.length; i++) {
            if (cell.richText[i]) {
                Object.assign(cell.richText[i], formatting);
            }
        }
    }
    
    // Set cell-level properties (background, alignment, etc.)
    setCellProperty(row, col, property, value) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        if (this.cells[row][col].cellProperties.hasOwnProperty(property)) {
            this.cells[row][col].cellProperties[property] = value;
        }
    }
    
    // Update cell content and sync with rich text
    setCellContent(row, col, content) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        this.cells[row][col].content = content;
        this.initializeCellRichText(row, col);
    }
    
    // Insert text in cell at specific position
    insertCellText(row, col, position, text) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        const cell = this.cells[row][col];
        
        // Update content string
        cell.content = cell.content.slice(0, position) + text + cell.content.slice(position);
        
        // Insert characters in richText array
        const newChars = [];
        for (let i = 0; i < text.length; i++) {
            newChars.push({
                char: text[i],
                fontFamily: position > 0 ? cell.richText[position - 1].fontFamily : 'Arial',
                fontSize: position > 0 ? cell.richText[position - 1].fontSize : 12,
                bold: position > 0 ? cell.richText[position - 1].bold : (row === 0),
                italic: position > 0 ? cell.richText[position - 1].italic : false,
                underline: position > 0 ? cell.richText[position - 1].underline : false,
                strikeout: position > 0 ? cell.richText[position - 1].strikeout : false,
                color: position > 0 ? cell.richText[position - 1].color : '#000000'
            });
        }
        
        cell.richText.splice(position, 0, ...newChars);
    }
    
    // Delete text range in cell
    deleteCellText(row, col, startIndex, endIndex) {
        if (!this.cells[row] || !this.cells[row][col]) return;
        
        const cell = this.cells[row][col];
        cell.content = cell.content.slice(0, startIndex) + cell.content.slice(endIndex + 1);
        cell.richText.splice(startIndex, endIndex - startIndex + 1);
    }
    
    // Get HTML representation of formatted text for table cell
    getCellFormattedHTML(row, col) {
        if (!this.cells[row] || !this.cells[row][col]) return '';
        
        const cell = this.cells[row][col];
        let html = '';
        let currentStyle = null;
        
        for (let i = 0; i < cell.richText.length; i++) {
            const char = cell.richText[i];
            const style = this.getCharacterStyle(char);
            
            if (style !== currentStyle) {
                if (currentStyle !== null) html += '</span>';
                html += `<span style="${style}">`;
                currentStyle = style;
            }
            
            html += char.char === ' ' ? '&nbsp;' : this.escapeHtml(char.char);
        }
        
        if (currentStyle !== null) html += '</span>';
        return html;
    }
    
    // Generate CSS style for individual character
    getCharacterStyle(charObj) {
        let style = `font-family: ${charObj.fontFamily}; font-size: ${charObj.fontSize}px; color: ${charObj.color};`;
        
        if (charObj.bold) style += ' font-weight: bold;';
        if (charObj.italic) style += ' font-style: italic;';
        
        let textDecoration = [];
        if (charObj.underline) textDecoration.push('underline');
        if (charObj.strikeout) textDecoration.push('line-through');
        if (textDecoration.length > 0) {
            style += ` text-decoration: ${textDecoration.join(' ')};`;
        }
        
        return style;
    }
    
    // Get CSS for specific cell
    getCellCSS(row, col) {
        if (!this.cells[row] || !this.cells[row][col]) return '';
        
        const cell = this.cells[row][col];
        return `
            background-color: ${cell.cellProperties.backgroundColor};
            text-align: ${cell.cellProperties.textAlignment};
            line-height: ${cell.cellProperties.lineHeight};
            padding: ${cell.cellProperties.padding}px;
            width: ${this.columnWidths[col]}px;
            overflow: hidden;
            word-wrap: break-word;
        `;
    }
    
    // Add column
    addColumn(dataField = 'new_field') {
        this.columns++;
        this.columnWidths.push(100);
        this.headerData.push(`Column ${this.columns}`);
        this.dataFields.push(dataField);
        
        // Add new cells for existing rows
        for (let row = 0; row < this.rows; row++) {
            const newCell = {
                content: row === 0 ? `Column ${this.columns}` : dataField,
                richText: [],
                cellProperties: {
                    backgroundColor: row === 0 ? '#f0f0f0' : '#ffffff',
                    padding: 5,
                    textAlignment: 'left',
                    lineHeight: 1.2
                }
            };
            this.cells[row].push(newCell);
            this.initializeCellRichText(row, this.columns - 1);
        }
        
        this.width += 100; // Increase table width
    }
    
    // Delete column
    deleteColumn(colIndex) {
        if (this.columns <= 1 || colIndex >= this.columns) return;
        
        this.columns--;
        this.columnWidths.splice(colIndex, 1);
        this.headerData.splice(colIndex, 1);
        this.dataFields.splice(colIndex, 1);
        
        // Remove cells from all rows
        for (let row = 0; row < this.rows; row++) {
            this.cells[row].splice(colIndex, 1);
        }
        
        this.width -= this.columnWidths[colIndex] || 100;
    }
    
    // Resize column
    resizeColumn(colIndex, newWidth) {
        if (colIndex >= this.columns) return;
        
        const oldWidth = this.columnWidths[colIndex];
        this.columnWidths[colIndex] = Math.max(50, newWidth); // Minimum width of 50px
        this.width += (this.columnWidths[colIndex] - oldWidth);
    }
    
    // Get available data fields for dropdown
    getAvailableDataFields() {
        return [
            'item_name', 'item_price', 'item_total', 'item_quantity',
            'customer_name', 'customer_address', 'customer_phone',
            'order_date', 'order_number', 'invoice_number',
            'subtotal', 'tax', 'discount', 'grand_total'
        ];
    }
    
    // Helper method to escape HTML characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Get cell character at specific position
    getCellCharacterAt(row, col, index) {
        if (!this.cells[row] || !this.cells[row][col]) return null;
        return this.cells[row][col].richText[index] || null;
    }
    
    // Get formatting of character range in cell
    getCellSelectionFormatting(row, col, startIndex, endIndex) {
        if (!this.cells[row] || !this.cells[row][col]) return null;
        
        const cell = this.cells[row][col];
        if (startIndex >= cell.richText.length) return null;
        
        const firstChar = cell.richText[startIndex];
        let formatting = {
            fontFamily: firstChar.fontFamily,
            fontSize: firstChar.fontSize,
            bold: firstChar.bold,
            italic: firstChar.italic,
            underline: firstChar.underline,
            strikeout: firstChar.strikeout,
            color: firstChar.color,
            mixed: false
        };
        
        // Check if formatting is consistent across selection
        for (let i = startIndex + 1; i <= endIndex && i < cell.richText.length; i++) {
            const char = cell.richText[i];
            if (char.fontFamily !== formatting.fontFamily ||
                char.fontSize !== formatting.fontSize ||
                char.bold !== formatting.bold ||
                char.italic !== formatting.italic ||
                char.underline !== formatting.underline ||
                char.strikeout !== formatting.strikeout ||
                char.color !== formatting.color) {
                formatting.mixed = true;
                break;
            }
        }
        
        return formatting;
    }
    
    // Export table-specific data
    toJSON() {
        const baseData = super.toJSON();
        return {
            ...baseData,
            rows: this.rows,
            columns: this.columns,
            cellPadding: this.cellPadding,
            cellSpacing: this.cellSpacing,
            headerData: [...this.headerData],
            dataFields: [...this.dataFields],
            columnWidths: [...this.columnWidths],
            cells: this.cells.map(row => 
                row.map(cell => ({
                    content: cell.content,
                    richText: [...cell.richText],
                    cellProperties: { ...cell.cellProperties }
                }))
            )
        };
    }
}