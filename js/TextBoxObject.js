// TextBox Object - extends BaseObject
class TextBoxObject extends BaseObject {
    constructor(x = 0, y = 0) {
        super('textbox', x, y);
        this.initialize();
    }
    
    initialize() {
        this.width = 150;
        this.height = 30;
        this.content = 'Text Box';
        
        // Character-level formatting array
        // Each character has its own formatting properties
        this.richText = [];
        
        // TextBox-level properties (whole textbox)
        this.textBoxProperties = {
            backgroundColor: '#ffffff',
            padding: 5,
            textAlignment: 'left', // left, center, right (affects whole textbox)
            lineHeight: 1.2
        };
        
        this.initializeRichText();
    }
    
    // Initialize rich text formatting for textbox content
    initializeRichText() {
        this.richText = [];
        for (let i = 0; i < this.content.length; i++) {
            this.richText.push({
                char: this.content[i],
                fontFamily: 'Arial',
                fontSize: 12,
                bold: false,
                italic: false,
                underline: false,
                strikeout: false,
                color: '#000000'
            });
        }
    }
    
    // Apply formatting to selected characters (character-level)
    applyCharacterFormatting(startIndex, endIndex, property, value) {
        for (let i = startIndex; i <= endIndex && i < this.richText.length; i++) {
            if (this.richText[i]) {
                this.richText[i][property] = value;
            }
        }
    }
    
    // Apply formatting to specific character range
    formatSelectedText(startIndex, endIndex, formatting) {
        for (let i = startIndex; i <= endIndex && i < this.richText.length; i++) {
            if (this.richText[i]) {
                Object.assign(this.richText[i], formatting);
            }
        }
    }
    
    // Set textbox-level properties (background, alignment, etc.)
    setTextBoxProperty(property, value) {
        if (this.textBoxProperties.hasOwnProperty(property)) {
            this.textBoxProperties[property] = value;
        }
    }
    
    // Update content and sync with rich text
    setContent(content) {
        this.content = content;
        this.initializeRichText();
    }
    
    // Insert text at specific position
    insertText(position, text) {
        // Update content string
        this.content = this.content.slice(0, position) + text + this.content.slice(position);
        
        // Insert characters in richText array
        const newChars = [];
        for (let i = 0; i < text.length; i++) {
            newChars.push({
                char: text[i],
                fontFamily: position > 0 ? this.richText[position - 1].fontFamily : 'Arial',
                fontSize: position > 0 ? this.richText[position - 1].fontSize : 12,
                bold: position > 0 ? this.richText[position - 1].bold : false,
                italic: position > 0 ? this.richText[position - 1].italic : false,
                underline: position > 0 ? this.richText[position - 1].underline : false,
                strikeout: position > 0 ? this.richText[position - 1].strikeout : false,
                color: position > 0 ? this.richText[position - 1].color : '#000000'
            });
        }
        
        this.richText.splice(position, 0, ...newChars);
    }
    
    // Delete text range
    deleteText(startIndex, endIndex) {
        this.content = this.content.slice(0, startIndex) + this.content.slice(endIndex + 1);
        this.richText.splice(startIndex, endIndex - startIndex + 1);
    }
    
    // Get HTML representation of formatted text
    getFormattedTextHTML() {
        let html = '';
        let currentStyle = null;
        
        for (let i = 0; i < this.richText.length; i++) {
            const char = this.richText[i];
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
    
    // Get CSS for textbox container (whole textbox properties)
    getTextBoxCSS() {
        return `
            background-color: ${this.textBoxProperties.backgroundColor};
            text-align: ${this.textBoxProperties.textAlignment};
            line-height: ${this.textBoxProperties.lineHeight};
            padding: ${this.textBoxProperties.padding}px;
            overflow: hidden;
            word-wrap: break-word;
        `;
    }
    
    // Helper method to escape HTML characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Get character at specific position
    getCharacterAt(index) {
        return this.richText[index] || null;
    }
    
    // Get formatting of character range
    getSelectionFormatting(startIndex, endIndex) {
        if (startIndex >= this.richText.length) return null;
        
        const firstChar = this.richText[startIndex];
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
        for (let i = startIndex + 1; i <= endIndex && i < this.richText.length; i++) {
            const char = this.richText[i];
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
    
    // Export textbox-specific data
    toJSON() {
        const baseData = super.toJSON();
        return {
            ...baseData,
            richText: this.richText,
            textBoxProperties: { ...this.textBoxProperties }
        };
    }
}