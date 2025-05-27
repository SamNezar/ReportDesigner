// Toolbar Controller
class ToolbarController {
    constructor(editor) {
        this.editor = editor;
        this.init();
    }

    init() {
        this.setupBorderToolbar();
        this.setupFontToolbar();
    }

    setupBorderToolbar() {
        // Border style
        document.getElementById('border-style').addEventListener('change', (e) => {
            this.applyBorderProperty('borderStyle', e.target.value);
        });

        // Border size
        document.getElementById('border-size').addEventListener('input', (e) => {
            this.applyBorderProperty('borderWidth', parseInt(e.target.value));
        });

        // Border color
        document.getElementById('border-color').addEventListener('change', (e) => {
            this.applyBorderProperty('borderColor', e.target.value);
        });

        // Border set buttons
        document.getElementById('border-all').addEventListener('click', () => {
            this.applyBorderSet('all');
        });

        document.getElementById('border-none').addEventListener('click', () => {
            this.applyBorderSet('none');
        });

        document.getElementById('border-top').addEventListener('click', () => {
            this.applyBorderSet('top');
        });

        document.getElementById('border-bottom').addEventListener('click', () => {
            this.applyBorderSet('bottom');
        });

        document.getElementById('border-left').addEventListener('click', () => {
            this.applyBorderSet('left');
        });

        document.getElementById('border-right').addEventListener('click', () => {
            this.applyBorderSet('right');
        });
    }

    setupFontToolbar() {
        // Font family
        document.getElementById('font-family').addEventListener('change', (e) => {
            this.applyTextProperty('fontFamily', e.target.value);
        });

        // Font size
        document.getElementById('font-size').addEventListener('input', (e) => {
            this.applyTextProperty('fontSize', parseInt(e.target.value));
        });

        // Bold
        document.getElementById('bold').addEventListener('click', (e) => {
            const isActive = e.target.classList.contains('active');
            e.target.classList.toggle('active');
            this.applyTextProperty('fontWeight', isActive ? 'normal' : 'bold');
        });

        // Italic
        document.getElementById('italic').addEventListener('click', (e) => {
            const isActive = e.target.classList.contains('active');
            e.target.classList.toggle('active');
            this.applyTextProperty('fontStyle', isActive ? 'normal' : 'italic');
        });

        // Underline
        document.getElementById('underline').addEventListener('click', (e) => {
            const isActive = e.target.classList.contains('active');
            e.target.classList.toggle('active');
            this.toggleTextDecoration('underline', !isActive);
        });

        // Strikethrough
        document.getElementById('strikethrough').addEventListener('click', (e) => {
            const isActive = e.target.classList.contains('active');
            e.target.classList.toggle('active');
            this.toggleTextDecoration('line-through', !isActive);
        });

        // Fore color
        document.getElementById('fore-color').addEventListener('change', (e) => {
            this.applyTextProperty('color', e.target.value);
        });

        // Back color
        document.getElementById('back-color').addEventListener('change', (e) => {
            this.applyTextProperty('backgroundColor', e.target.value);
        });

        // Text alignment
        document.getElementById('align-left').addEventListener('click', (e) => {
            this.setTextAlignment('left');
        });

        document.getElementById('align-center').addEventListener('click', (e) => {
            this.setTextAlignment('center');
        });

        document.getElementById('align-right').addEventListener('click', (e) => {
            this.setTextAlignment('right');
        });

        // Line height
        document.getElementById('line-height').addEventListener('input', (e) => {
            this.applyTextProperty('lineHeight', parseFloat(e.target.value));
        });

        // Page size
        document.getElementById('page-size').addEventListener('change', (e) => {
            this.editor.updatePageSize(e.target.value);
        });
    }

    applyBorderProperty(property, value) {
        if (!this.editor.selectedObject) return;

        const objectData = this.editor.getObjectData(this.editor.selectedObject.dataset.id);
        if (!objectData) return;

        objectData.properties[property] = value;
        this.updateObjectStyles(this.editor.selectedObject, objectData.properties);
    }

    applyBorderSet(type) {
        if (!this.editor.selectedObject) return;

        const objectData = this.editor.getObjectData(this.editor.selectedObject.dataset.id);
        if (!objectData) return;

        const element = this.editor.selectedObject;
        const borderStyle = document.getElementById('border-style').value;
        const borderWidth = document.getElementById('border-size').value + 'px';
        const borderColor = document.getElementById('border-color').value;

        // Reset all borders
        element.style.borderTop = '';
        element.style.borderRight = '';
        element.style.borderBottom = '';
        element.style.borderLeft = '';
        element.style.border = '';

        const borderValue = `${borderWidth} ${borderStyle} ${borderColor}`;

        switch (type) {
            case 'all':
                element.style.border = borderValue;
                break;
            case 'none':
                element.style.border = 'none';
                break;
            case 'top':
                element.style.borderTop = borderValue;
                break;
            case 'bottom':
                element.style.borderBottom = borderValue;
                break;
            case 'left':
                element.style.borderLeft = borderValue;
                break;
            case 'right':
                element.style.borderRight = borderValue;
                break;
        }
    }

    applyTextProperty(property, value) {
        if (!this.editor.selectedObject) return;

        const objectData = this.editor.getObjectData(this.editor.selectedObject.dataset.id);
        if (!objectData) return;

        objectData.properties[property] = value;
        this.updateObjectStyles(this.editor.selectedObject, objectData.properties);
    }

    toggleTextDecoration(decoration, add) {
        if (!this.editor.selectedObject) return;

        const objectData = this.editor.getObjectData(this.editor.selectedObject.dataset.id);
        if (!objectData) return;

        let textDecoration = objectData.properties.textDecoration || 'none';
        
        if (add) {
            if (textDecoration === 'none') {
                textDecoration = decoration;
            } else if (!textDecoration.includes(decoration)) {
                textDecoration += ' ' + decoration;
            }
        } else {
            if (textDecoration.includes(decoration)) {
                textDecoration = textDecoration.replace(decoration, '').trim();
                if (!textDecoration) textDecoration = 'none';
            }
        }

        objectData.properties.textDecoration = textDecoration;
        this.updateObjectStyles(this.editor.selectedObject, objectData.properties);
    }

    setTextAlignment(alignment) {
        // Update UI
        document.querySelectorAll('.alignment-group button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`align-${alignment}`).classList.add('active');

        // Apply to object
        this.applyTextProperty('textAlign', alignment);
    }

    updateObjectStyles(element, properties) {
        const textElement = element.querySelector('.textbox-object, .cell-input');
        if (textElement) {
            this.editor.applyTextFormatting(textElement, properties);
        } else {
            // Apply directly to element for non-text objects
            this.editor.applyTextFormatting(element, properties);
        }

        // For table objects, apply to all inputs
        if (element.dataset.type === 'table') {
            const inputs = element.querySelectorAll('.cell-input');
            inputs.forEach(input => {
                this.editor.applyTextFormatting(input, properties);
            });
        }
    }
}

// Initialize toolbar when editor is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.editor) {
            window.toolbar = new ToolbarController(window.editor);
        }
    }, 100);
});