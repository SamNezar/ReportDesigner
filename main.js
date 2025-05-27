// Main Application Controller
class DocumentEditor {
    constructor() {
        this.currentTool = 'pointer';
        this.selectedObject = null;
        this.objects = [];
        this.objectCounter = 0;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeHandle = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDocument();
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Paper click for creating objects
        const paper = document.getElementById('paper');
        paper.addEventListener('click', this.handlePaperClick.bind(this));
        
        // Prevent context menu on paper
        paper.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleMouseDown(e) {
        const target = e.target;
        
        // Check if clicking on resize handle
        if (target.classList.contains('resize-handle')) {
            this.startResize(e, target);
            return;
        }

        // Check if clicking on an object
        const objectElement = target.closest('.editor-object');
        if (objectElement) {
            this.selectObject(objectElement);
            if (this.currentTool === 'pointer') {
                this.startDrag(e, objectElement);
            }
            return;
        }

        // Click outside - deselect
        this.deselectObject();
    }

    handleMouseMove(e) {
        if (this.isDragging && this.selectedObject) {
            this.updateDrag(e);
        } else if (this.isResizing && this.selectedObject) {
            this.updateResize(e);
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.endDrag();
        } else if (this.isResizing) {
            this.endResize();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Delete' && this.selectedObject) {
            this.deleteObject(this.selectedObject);
        } else if (e.key === 'Escape') {
            this.deselectObject();
        }
    }

    handlePaperClick(e) {
        if (this.currentTool !== 'pointer' && !e.target.closest('.editor-object')) {
            this.createObject(this.currentTool, e);
        }
    }

    createObject(type, e) {
        const paper = document.getElementById('paper');
        const rect = paper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const objectData = {
            id: `obj_${++this.objectCounter}`,
            type: type,
            x: x,
            y: y,
            width: type === 'table' ? 200 : 150,
            height: type === 'table' ? 60 : 100,
            properties: this.getDefaultProperties(type)
        };

        const objectElement = this.createObjectElement(objectData);
        paper.appendChild(objectElement);
        this.objects.push(objectData);
        
        this.selectObject(objectElement);
        this.setTool('pointer'); // Switch back to pointer after creating object
    }

    createObjectElement(objectData) {
        const element = document.createElement('div');
        element.className = 'editor-object';
        element.dataset.id = objectData.id;
        element.dataset.type = objectData.type;
        
        element.style.left = objectData.x + 'px';
        element.style.top = objectData.y + 'px';
        element.style.width = objectData.width + 'px';
        element.style.height = objectData.height + 'px';

        // Create object content based on type
        switch (objectData.type) {
            case 'textbox':
            case 'static-field':
                this.createTextboxContent(element, objectData);
                break;
            case 'image':
                this.createImageContent(element, objectData);
                break;
            case 'table':
                this.createTableContent(element, objectData);
                break;
        }

        return element;
    }

    createTextboxContent(element, objectData) {
        const textarea = document.createElement('textarea');
        textarea.className = 'textbox-object';
        textarea.value = objectData.properties.text || '';
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        
        // Apply formatting
        this.applyTextFormatting(textarea, objectData.properties);
        
        textarea.addEventListener('input', () => {
            objectData.properties.text = textarea.value;
        });

        element.appendChild(textarea);
    }

    createImageContent(element, objectData) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-object';
        imageDiv.style.width = '100%';
        imageDiv.style.height = '100%';
        
        if (objectData.properties.src) {
            const img = document.createElement('img');
            img.src = objectData.properties.src;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            imageDiv.appendChild(img);
        } else {
            imageDiv.textContent = 'Click to add image';
            imageDiv.addEventListener('click', () => this.selectImage(objectData));
        }

        element.appendChild(imageDiv);
    }

    createTableContent(element, objectData) {
        const table = document.createElement('table');
        table.className = 'table-object';
        table.style.width = '100%';
        table.style.height = '100%';

        // Create header row
        const headerRow = document.createElement('tr');
        const dataRow = document.createElement('tr');

        const columns = objectData.properties.columns || 2;
        for (let i = 0; i < columns; i++) {
            // Header cell
            const th = document.createElement('th');
            const headerInput = document.createElement('input');
            headerInput.className = 'cell-input';
            headerInput.value = objectData.properties.headers?.[i] || `Header ${i + 1}`;
            th.appendChild(headerInput);
            headerRow.appendChild(th);

            // Data cell
            const td = document.createElement('td');
            const dataInput = document.createElement('input');
            dataInput.className = 'cell-input';
            dataInput.value = objectData.properties.data?.[i] || '';
            td.appendChild(dataInput);
            dataRow.appendChild(td);
        }

        table.appendChild(headerRow);
        table.appendChild(dataRow);

        // Add table controls
        const controls = document.createElement('div');
        controls.className = 'table-controls';
        
        const addColBtn = document.createElement('button');
        addColBtn.textContent = '+Col';
        addColBtn.addEventListener('click', () => this.addTableColumn(objectData, table));
        
        const removeColBtn = document.createElement('button');
        removeColBtn.textContent = '-Col';
        removeColBtn.addEventListener('click', () => this.removeTableColumn(objectData, table));
        
        controls.appendChild(addColBtn);
        controls.appendChild(removeColBtn);
        
        element.appendChild(controls);
        element.appendChild(table);
    }

    getDefaultProperties(type) {
        const defaults = {
            textbox: {
                text: 'Sample text',
                fontFamily: 'Arial',
                fontSize: 14,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: '#000000',
                backgroundColor: '#ffffff',
                textAlign: 'left',
                lineHeight: 1.2,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#cccccc'
            },
            'static-field': {
                text: '[field_value]',
                fontFamily: 'Arial',
                fontSize: 14,
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: '#000000',
                backgroundColor: '#ffffff',
                textAlign: 'left',
                lineHeight: 1.2,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#cccccc'
            },
            image: {
                src: null,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#cccccc'
            },
            table: {
                columns: 2,
                headers: ['Header 1', 'Header 2'],
                data: ['', ''],
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#cccccc'
            }
        };

        return { ...defaults[type] };
    }

    selectObject(element) {
        // Remove previous selection
        this.deselectObject();

        this.selectedObject = element;
        element.classList.add('selected');
        
        // Add resize handles
        this.addResizeHandles(element);
        
        // Update toolbar values
        this.updateToolbarFromObject(element);
    }

    deselectObject() {
        if (this.selectedObject) {
            this.selectedObject.classList.remove('selected');
            this.removeResizeHandles(this.selectedObject);
            this.selectedObject = null;
        }
    }

    addResizeHandles(element) {
        const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
        
        handles.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            handle.dataset.position = position;
            element.appendChild(handle);
        });
    }

    removeResizeHandles(element) {
        const handles = element.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }

    startDrag(e, element) {
        this.isDragging = true;
        const rect = element.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        element.style.zIndex = 1000;
        document.body.style.cursor = 'move';
    }

    updateDrag(e) {
        if (!this.selectedObject) return;

        const paper = document.getElementById('paper');
        const paperRect = paper.getBoundingClientRect();
        
        const x = e.clientX - paperRect.left - this.dragOffset.x;
        const y = e.clientY - paperRect.top - this.dragOffset.y;
        
        // Constrain to paper bounds
        const maxX = paper.offsetWidth - this.selectedObject.offsetWidth;
        const maxY = paper.offsetHeight - this.selectedObject.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        this.selectedObject.style.left = constrainedX + 'px';
        this.selectedObject.style.top = constrainedY + 'px';
        
        // Update object data
        const objectData = this.getObjectData(this.selectedObject.dataset.id);
        if (objectData) {
            objectData.x = constrainedX;
            objectData.y = constrainedY;
        }
    }

    endDrag() {
        if (this.selectedObject) {
            this.selectedObject.style.zIndex = '';
        }
        this.isDragging = false;
        document.body.style.cursor = '';
    }

    startResize(e, handle) {
        this.isResizing = true;
        this.resizeHandle = handle.dataset.position;
        this.resizeStartPos = { x: e.clientX, y: e.clientY };
        this.resizeStartSize = {
            width: this.selectedObject.offsetWidth,
            height: this.selectedObject.offsetHeight,
            left: parseInt(this.selectedObject.style.left),
            top: parseInt(this.selectedObject.style.top)
        };
        
        document.body.style.cursor = handle.style.cursor;
        e.stopPropagation();
    }

    updateResize(e) {
        if (!this.selectedObject || !this.resizeHandle) return;

        const deltaX = e.clientX - this.resizeStartPos.x;
        const deltaY = e.clientY - this.resizeStartPos.y;
        
        let newWidth = this.resizeStartSize.width;
        let newHeight = this.resizeStartSize.height;
        let newLeft = this.resizeStartSize.left;
        let newTop = this.resizeStartSize.top;

        // Handle different resize directions
        switch (this.resizeHandle) {
            case 'se':
                newWidth += deltaX;
                newHeight += deltaY;
                break;
            case 'sw':
                newWidth -= deltaX;
                newHeight += deltaY;
                newLeft += deltaX;
                break;
            case 'ne':
                newWidth += deltaX;
                newHeight -= deltaY;
                newTop += deltaY;
                break;
            case 'nw':
                newWidth -= deltaX;
                newHeight -= deltaY;
                newLeft += deltaX;
                newTop += deltaY;
                break;
            case 'n':
                newHeight -= deltaY;
                newTop += deltaY;
                break;
            case 's':
                newHeight += deltaY;
                break;
            case 'w':
                newWidth -= deltaX;
                newLeft += deltaX;
                break;
            case 'e':
                newWidth += deltaX;
                break;
        }

        // Apply minimum size constraints
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(20, newHeight);

        // Apply to element
        this.selectedObject.style.width = newWidth + 'px';
        this.selectedObject.style.height = newHeight + 'px';
        this.selectedObject.style.left = newLeft + 'px';
        this.selectedObject.style.top = newTop + 'px';

        // Update object data
        const objectData = this.getObjectData(this.selectedObject.dataset.id);
        if (objectData) {
            objectData.width = newWidth;
            objectData.height = newHeight;
            objectData.x = newLeft;
            objectData.y = newTop;
        }
    }

    endResize() {
        this.isResizing = false;
        this.resizeHandle = null;
        document.body.style.cursor = '';
    }

    deleteObject(element) {
        const id = element.dataset.id;
        this.objects = this.objects.filter(obj => obj.id !== id);
        element.remove();
        this.selectedObject = null;
    }

    setTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const toolElement = document.querySelector(`[data-tool="${tool}"]`);
        if (toolElement) {
            toolElement.classList.add('active');
        }
    }

    getObjectData(id) {
        return this.objects.find(obj => obj.id === id);
    }

    updateToolbarFromObject(element) {
        const objectData = this.getObjectData(element.dataset.id);
        if (!objectData) return;

        const props = objectData.properties;
        
        // Update font toolbar
        if (props.fontFamily) document.getElementById('font-family').value = props.fontFamily;
        if (props.fontSize) document.getElementById('font-size').value = props.fontSize;
        if (props.color) document.getElementById('fore-color').value = props.color;
        if (props.backgroundColor) document.getElementById('back-color').value = props.backgroundColor;
        if (props.lineHeight) document.getElementById('line-height').value = props.lineHeight;
        
        // Update border toolbar
        if (props.borderStyle) document.getElementById('border-style').value = props.borderStyle;
        if (props.borderWidth) document.getElementById('border-size').value = props.borderWidth;
        if (props.borderColor) document.getElementById('border-color').value = props.borderColor;
        
        // Update button states
        document.getElementById('bold').classList.toggle('active', props.fontWeight === 'bold');
        document.getElementById('italic').classList.toggle('active', props.fontStyle === 'italic');
        document.getElementById('underline').classList.toggle('active', props.textDecoration?.includes('underline'));
        document.getElementById('strikethrough').classList.toggle('active', props.textDecoration?.includes('line-through'));
        
        // Update alignment
        document.querySelectorAll('.alignment-group button').forEach(btn => btn.classList.remove('active'));
        if (props.textAlign) {
            const alignBtn = document.getElementById(`align-${props.textAlign}`);
            if (alignBtn) alignBtn.classList.add('active');
        }
    }

    applyTextFormatting(element, properties) {
        if (properties.fontFamily) element.style.fontFamily = properties.fontFamily;
        if (properties.fontSize) element.style.fontSize = properties.fontSize + 'px';
        if (properties.fontWeight) element.style.fontWeight = properties.fontWeight;
        if (properties.fontStyle) element.style.fontStyle = properties.fontStyle;
        if (properties.textDecoration) element.style.textDecoration = properties.textDecoration;
        if (properties.color) element.style.color = properties.color;
        if (properties.backgroundColor) element.style.backgroundColor = properties.backgroundColor;
        if (properties.textAlign) element.style.textAlign = properties.textAlign;
        if (properties.lineHeight) element.style.lineHeight = properties.lineHeight;
        if (properties.borderStyle) element.style.borderStyle = properties.borderStyle;
        if (properties.borderWidth) element.style.borderWidth = properties.borderWidth + 'px';
        if (properties.borderColor) element.style.borderColor = properties.borderColor;
    }

    selectImage(objectData) {
        const input = document.getElementById('image-upload');
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // In a real application, you would upload this to the server
                const reader = new FileReader();
                reader.onload = (e) => {
                    objectData.properties.src = e.target.result;
                    this.updateObjectElement(objectData);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    updateObjectElement(objectData) {
        const element = document.querySelector(`[data-id="${objectData.id}"]`);
        if (element) {
            // Remove existing content
            element.innerHTML = '';
            
            // Recreate content
            switch (objectData.type) {
                case 'textbox':
                case 'static-field':
                    this.createTextboxContent(element, objectData);
                    break;
                case 'image':
                    this.createImageContent(element, objectData);
                    break;
                case 'table':
                    this.createTableContent(element, objectData);
                    break;
            }
            
            // Re-add resize handles if selected
            if (element === this.selectedObject) {
                this.addResizeHandles(element);
            }
        }
    }

    addTableColumn(objectData, table) {
        objectData.properties.columns++;
        objectData.properties.headers.push(`Header ${objectData.properties.columns}`);
        objectData.properties.data.push('');
        
        // Add header cell
        const headerRow = table.querySelector('tr:first-child');
        const th = document.createElement('th');
        const headerInput = document.createElement('input');
        headerInput.className = 'cell-input';
        headerInput.value = objectData.properties.headers[objectData.properties.columns - 1];
        th.appendChild(headerInput);
        headerRow.appendChild(th);
        
        // Add data cell
        const dataRow = table.querySelector('tr:last-child');
        const td = document.createElement('td');
        const dataInput = document.createElement('input');
        dataInput.className = 'cell-input';
        dataInput.value = '';
        td.appendChild(dataInput);
        dataRow.appendChild(td);
    }

    removeTableColumn(objectData, table) {
        if (objectData.properties.columns <= 1) return;
        
        objectData.properties.columns--;
        objectData.properties.headers.pop();
        objectData.properties.data.pop();
        
        // Remove last header cell
        const headerRow = table.querySelector('tr:first-child');
        headerRow.removeChild(headerRow.lastElementChild);
        
        // Remove last data cell
        const dataRow = table.querySelector('tr:last-child');
        dataRow.removeChild(dataRow.lastElementChild);
    }

    saveDocument() {
        const documentData = {
            objects: this.objects,
            pageSize: document.getElementById('page-size').value
        };
        
        // Send to server
        fetch('?action=save_document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(documentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Document saved successfully');
            }
        });
    }

    loadDocument() {
        fetch('?action=load_document', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.document) {
                this.objects = data.document.objects || [];
                
                // Recreate objects on paper
                const paper = document.getElementById('paper');
                paper.innerHTML = '';
                
                this.objects.forEach(objectData => {
                    const element = this.createObjectElement(objectData);
                    paper.appendChild(element);
                });
                
                // Set page size
                if (data.document.pageSize) {
                    document.getElementById('page-size').value = data.document.pageSize;
                    this.updatePageSize(data.document.pageSize);
                }
            }
        });
    }

    updatePageSize(size) {
        const paper = document.getElementById('paper');
        paper.className = `paper ${size}`;
    }
}

// Initialize the application
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = new DocumentEditor();
});