// Toolbox Controller
class ToolboxController {
    constructor(editor) {
        this.editor = editor;
        this.init();
    }

    init() {
        this.setupToolItems();
    }

    setupToolItems() {
        const toolItems = document.querySelectorAll('.tool-item');
        
        toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const tool = item.dataset.tool;
                const field = item.dataset.field;
                
                if (tool === 'static-field') {
                    this.handleStaticField(field, item);
                } else {
                    this.handleTool(tool, item);
                }
            });
        });
    }

    handleTool(tool, item) {
        // Update active state
        document.querySelectorAll('.tool-item').forEach(toolItem => {
            toolItem.classList.remove('active');
        });
        item.classList.add('active');

        // Set editor tool
        this.editor.setTool(tool);
        
        // Update cursor based on tool
        this.updateCursor(tool);
    }

    handleStaticField(field, item) {
        // Static fields work like textbox but with predefined content
        this.handleTool('static-field', item);
        
        // Store the field type for when object is created
        this.editor.currentStaticField = field;
    }

    updateCursor(tool) {
        const editorArea = document.getElementById('editor-area');
        
        switch (tool) {
            case 'pointer':
                editorArea.style.cursor = 'default';
                break;
            case 'textbox':
            case 'static-field':
                editorArea.style.cursor = 'text';
                break;
            case 'image':
                editorArea.style.cursor = 'crosshair';
                break;
            case 'table':
                editorArea.style.cursor = 'cell';
                break;
            default:
                editorArea.style.cursor = 'crosshair';
        }
    }
}

// Extend the main editor to handle static fields
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.editor) {
            window.toolbox = new ToolboxController(window.editor);
            
            // Override createObject to handle static fields
            const originalCreateObject = window.editor.createObject.bind(window.editor);
            
            window.editor.createObject = function(type, e) {
                if (type === 'static-field' && this.currentStaticField) {
                    const paper = document.getElementById('paper');
                    const rect = paper.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const fieldName = window.staticFields[this.currentStaticField] || this.currentStaticField;
                    
                    const objectData = {
                        id: `obj_${++this.objectCounter}`,
                        type: 'static-field',
                        x: x,
                        y: y,
                        width: 150,
                        height: 30,
                        properties: {
                            ...this.getDefaultProperties('static-field'),
                            text: `[${this.currentStaticField}]`,
                            fieldType: this.currentStaticField,
                            fieldName: fieldName
                        }
                    };

                    const objectElement = this.createObjectElement(objectData);
                    paper.appendChild(objectElement);
                    this.objects.push(objectData);
                    
                    this.selectObject(objectElement);
                    this.setTool('pointer');
                    
                    // Reset static field
                    this.currentStaticField = null;
                } else {
                    originalCreateObject(type, e);
                }
            };
        }
    }, 100);
});