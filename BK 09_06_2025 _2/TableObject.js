class TableObject extends ReportObject {
    constructor(x, y, width = 300, height = 120) {
        super('table', x, y, width, height);
        this.backgroundColor = 'transparent';
        this.padding = 0;
        this.rows = [];
        this.columnWidths = [];
        this.rowHeights = [];
        this.isResizing = null;
        
            this.borderStyle = 'none';
            this.borderSize = 0;
            this.borderSet = 'none';

        this.initializeDefaultTable(2, 3);
    }

    initializeDefaultTable(rowCount, colCount) {
        this.rows = []; this.columnWidths = []; this.rowHeights = [];
        const defaultRowHeight = 40;
        for (let r = 0; r < rowCount; r++) {
            const rowType = (r === 0) ? 'header' : 'data';
            const newRow = { type: rowType, cells: [] };
            for (let c = 0; c < colCount; c++) { newRow.cells.push(this.createDefaultTextbox(rowType, c)); }
            this.rows.push(newRow); this.rowHeights.push(defaultRowHeight);
        }
        for (let c = 0; c < colCount; c++) { this.columnWidths.push(100 / colCount); }
    }

    createDefaultTextbox(rowType, colIndex, text = null) {
        const defaultText = text || ((rowType === 'header') ? `Header ${colIndex + 1}` : `[DataField${colIndex + 1}]`);
        const newTextbox = new TextBox(0, 0, 0, 0, defaultText);
        newTextbox.isNestedInTable = true; newTextbox.borderColor = '#dee2e6';
        newTextbox.borderSet = 'all'; newTextbox.borderSize = 1;
        newTextbox.backgroundColor = (rowType === 'header') ? '#f8f9fa' : 'transparent';
        return newTextbox;
    }

    createElement() {
        const element = super.createElement();
        element.classList.add('table-object-container'); element.style.padding = '0';
        const table = document.createElement('table'); table.className = 'table-object';
        this.contentElement = table;
        const controlsContainer = document.createElement('div'); controlsContainer.className = 'table-controls-container';
        this.controlsElement = controlsContainer;
        const firstHandle = element.querySelector('.resize-handle');
        element.insertBefore(table, firstHandle); element.insertBefore(controlsContainer, firstHandle);
        this.render(); this.addResizeListeners(); return element;
    }

    render() {
     // FIX: Sync the object's height property with the sum of its row heights.
        this.height = this.rowHeights.reduce((a, b) => a + b, 0);

        // Update the main container element's height if it exists.
        if (this.element) {
            this.element.style.height = `${this.height}px`;
        }

        this.renderTableContent();
        requestAnimationFrame(() => this.renderRowAndColumnControls()); 
    }

    renderRowAndColumnControls() {
        if (!this.controlsElement || !this.contentElement || !this.element) return;
        this.controlsElement.innerHTML = '';
        const tableRows = this.contentElement.querySelectorAll('tr');
        if (tableRows.length === 0) return;

        const moveGrip = document.createElement('div');
        moveGrip.className = 'table-move-grip'; moveGrip.title = 'Move Table';
        moveGrip.addEventListener('mousedown', (e) => {
            e.stopPropagation(); reportDesigner.selectObject(this); reportDesigner.startDrag(e, this);
        });
        this.controlsElement.appendChild(moveGrip);

        const firstRowCells = tableRows[0].querySelectorAll('th, td');
        firstRowCells.forEach((cell, index) => {
            const colControl = document.createElement('div');
            colControl.className = 'table-col-control';
            colControl.style.left = `${cell.offsetLeft}px`; colControl.style.width = `${cell.offsetWidth}px`;
            colControl.textContent = String.fromCharCode(65 + index);
            colControl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); this.showContextMenu(e, 'column', index); };
            this.controlsElement.appendChild(colControl);

            // FIX: Always add a resize grip after each column, including the last one.
            const grip = document.createElement('div');
            grip.className = 'table-resize-grip table-resize-grip-col';
            grip.style.left = `${cell.offsetLeft + cell.offsetWidth}px`;
            grip.dataset.index = index;
            this.controlsElement.appendChild(grip);
        });

        tableRows.forEach((tr, index) => {
            const rowControl = document.createElement('div');
            rowControl.className = 'table-row-control';
            rowControl.style.top = `${tr.offsetTop}px`; rowControl.style.height = `${tr.offsetHeight}px`;
            rowControl.textContent = index + 1;
            rowControl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); this.showContextMenu(e, 'row', index); };
            this.controlsElement.appendChild(rowControl);

            // FIX: Always add a resize grip after each row, including the last one.
            const grip = document.createElement('div');
            grip.className = 'table-resize-grip table-resize-grip-row';
            grip.style.top = `${tr.offsetTop + tr.offsetHeight}px`;
            grip.dataset.index = index;
            this.controlsElement.appendChild(grip);
        });
    }

    // renderTableContent() {
    //     if (!this.contentElement) return; const table = this.contentElement; table.innerHTML = '';
    //     table.style.tableLayout = 'fixed';
    //     const colgroup = document.createElement('colgroup');
    //     this.columnWidths.forEach(width => { const col = document.createElement('col'); col.style.width = `${width}%`; colgroup.appendChild(col); });
    //     table.appendChild(colgroup);
    //     const tbody = document.createElement('tbody');
    //     this.rows.forEach((rowModel, rowIndex) => {
    //         const tr = document.createElement('tr'); tr.style.height = `${this.rowHeights[rowIndex] || 40}px`;
    //         const cellElementTag = (rowModel.type === 'header') ? 'th' : 'td';
    //         rowModel.cells.forEach(cellTextboxObject => {
    //             const td = document.createElement(cellElementTag);
    //             const textboxElement = cellTextboxObject.createElement(); td.appendChild(textboxElement);
    //             tr.appendChild(td);
    //         });
    //         tbody.appendChild(tr);
    //     });
    //     table.appendChild(tbody);
    // }
    
        // --- REPLACE this method in TableObject.js ---
    renderTableContent() {
        if (!this.contentElement) return; const table = this.contentElement; table.innerHTML = '';
        table.style.tableLayout = 'fixed';
        const colgroup = document.createElement('colgroup');
        this.columnWidths.forEach(width => { const col = document.createElement('col'); col.style.width = `${width}%`; colgroup.appendChild(col); });
        table.appendChild(colgroup);
        const tbody = document.createElement('tbody');
        this.rows.forEach((rowModel, rowIndex) => {
            const tr = document.createElement('tr'); tr.style.height = `${this.rowHeights[rowIndex] || 40}px`;
            const cellElementTag = (rowModel.type === 'header') ? 'th' : 'td';
            rowModel.cells.forEach(cellTextboxObject => {
                const td = document.createElement(cellElementTag);
                const textboxElement = cellTextboxObject.createElement(); 
                
                // --- START: ADDED LOGIC TO CREATE THE BUTTON ---
                const fieldPickerBtn = document.createElement('div');
                fieldPickerBtn.className = 'cell-field-picker-btn';
                fieldPickerBtn.textContent = 'ƒ'; // Using a script 'f' for function/field
                fieldPickerBtn.title = 'Select a Field';
                fieldPickerBtn.addEventListener('mousedown', (e) => {
                    e.stopPropagation(); // Prevent focus loss from textbox
                    e.preventDefault();
                    this.showFieldPickerMenu(e, cellTextboxObject);
                });
                textboxElement.appendChild(fieldPickerBtn); // Append button to the textbox container
                // --- END: ADDED LOGIC ---
                
                td.appendChild(textboxElement);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }

  // --- REPLACE this method in TableObject.js with the new version below ---
    showFieldPickerMenu(event, textboxObject) {
        const menu = document.getElementById('fieldPickerMenu');
        menu.innerHTML = ''; // Clear previous items

        // 1. Create the search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search fields...';
        searchInput.className = 'field-picker-search';
        // Prevent clicking in the search bar from closing the menu
        searchInput.addEventListener('mousedown', e => e.stopPropagation());
        
        // 2. Create a container for the list items for scrolling
        const listContainer = document.createElement('div');
        listContainer.className = 'field-picker-list';
        
        // 3. Populate the list with fields
        if (reportDesigner.datasets.length === 0) {
            const noDataItem = document.createElement('div');
            noDataItem.className = 'context-item';
            noDataItem.textContent = 'No datasets available';
            noDataItem.style.color = '#999';
            listContainer.appendChild(noDataItem);
        } else {
            reportDesigner.datasets.forEach(dataset => {
                dataset.fields.forEach(field => {
                    const fieldItem = document.createElement('div');
                    fieldItem.className = 'context-item';
                    fieldItem.textContent = field.name;
                    fieldItem.dataset.value = `=Fields!${field.name}.Value`;
                    listContainer.appendChild(fieldItem);
                });
            });
        }

        // 4. Add the search and list to the menu
        menu.appendChild(searchInput);
        menu.appendChild(listContainer);

        // 5. Add the filtering event listener to the search input
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const items = listContainer.querySelectorAll('.context-item');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                // If item text includes the filter text, show it, otherwise hide it
                item.style.display = text.includes(filter) ? 'block' : 'none';
            });
        });

        // --- The rest of the function remains the same ---

        const rect = event.target.getBoundingClientRect();
        menu.style.display = 'block';
        menu.style.left = `${rect.left}px`;
        menu.style.top = `${rect.bottom + 2}px`;

        const generalClickHandler = (e) => {
            const itemClicked = e.target.closest('.context-item');
            if (itemClicked && itemClicked.dataset.value) {
                const newValue = itemClicked.dataset.value;
                textboxObject.text = newValue;
                const plainText = getPlainText(newValue);
                const match = plainText.match(/^=Fields!(\w+)\.Value$/);
                if (match) {
                     textboxObject.contentElement.innerHTML = textboxObject.createFormattedPlaceholder(newValue, `[${match[1]}]`);
                } else {
                     textboxObject.contentElement.innerHTML = newValue;
                }
            }
            menu.style.display = 'none';
            document.removeEventListener('mousedown', generalClickHandler);
        };
        
        const getPlainText = (html) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            return tempDiv.textContent || tempDiv.innerText || "";
        };

        setTimeout(() => {
            document.addEventListener('mousedown', generalClickHandler);
            searchInput.focus(); // Automatically focus the search bar
        }, 0);
    }

    // showContextMenu(e, type, index) {
    //     reportDesigner.hideContextMenu(); const menu = document.getElementById('tableControlContextMenu');
    //     const controlTab = e.target.closest('.table-col-control, .table-row-control');
    //     if (controlTab) controlTab.classList.add('highlight');
    //     const rowOptions = ['insert-above', 'insert-below', 'delete-row'];
    //     const colOptions = ['insert-left', 'insert-right', 'delete-column'];
    //     menu.querySelectorAll('.context-item').forEach(item => { const action = item.dataset.action; item.style.display = (type === 'row' ? rowOptions.includes(action) : colOptions.includes(action)) ? 'block' : 'none'; });
    //     menu.style.display = 'block'; menu.style.left = `${e.pageX}px`; menu.style.top = `${e.pageY}px`;
    //     const generalClickHandler = (event) => {
    //         const itemClicked = event.target.closest('.context-item');
    //         if (itemClicked) { this.handleContextMenuAction(itemClicked.dataset.action, index); }
    //         if (controlTab) controlTab.classList.remove('highlight');
    //         menu.style.display = 'none'; document.removeEventListener('mousedown', generalClickHandler);
    //     };
    //     setTimeout(() => document.addEventListener('mousedown', generalClickHandler), 0);
    // }

        showContextMenu(e, type, index) {
        reportDesigner.hideContextMenu(); 
        document.getElementById('fieldPickerMenu').style.display = 'none'; // Hide field picker if open
        const menu = document.getElementById('tableControlContextMenu');
        const controlTab = e.target.closest('.table-col-control, .table-row-control');
        if (controlTab) controlTab.classList.add('highlight');
        const rowOptions = ['insert-above', 'insert-below', 'delete-row'];
        const colOptions = ['insert-left', 'insert-right', 'delete-column'];
        menu.querySelectorAll('.context-item').forEach(item => { const action = item.dataset.action; item.style.display = (type === 'row' ? rowOptions.includes(action) : colOptions.includes(action)) ? 'block' : 'none'; });
        menu.style.display = 'block'; menu.style.left = `${e.pageX}px`; menu.style.top = `${e.pageY}px`;
        const generalClickHandler = (event) => {
            const itemClicked = event.target.closest('.context-item');
            if (itemClicked) { this.handleContextMenuAction(itemClicked.dataset.action, index); }
            if (controlTab) controlTab.classList.remove('highlight');
            menu.style.display = 'none'; document.removeEventListener('mousedown', generalClickHandler);
        };
        setTimeout(() => document.addEventListener('mousedown', generalClickHandler), 0);
    }

    addResizeListeners() {
        if (!this.controlsElement) return;
        this.controlsElement.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('table-resize-grip')) {
                e.preventDefault(); e.stopPropagation();
                reportDesigner.startTableResize(this, e);
            }
        });
    }
    
    handleInternalResize(e) {
        if (!this.isResizing) return;
        if (this.isResizing.type === 'column') {
            const dx = e.clientX - this.isResizing.startX;
            const dxPercent = (dx / this.isResizing.tableWidth) * 100;
            const index = this.isResizing.index;

            if (index < this.columnWidths.length - 1) { // Internal grip
                let width1 = this.isResizing.initialWidths[index] + dxPercent;
                let width2 = this.isResizing.initialWidths[index + 1] - dxPercent;
                if (width1 < 5 || width2 < 5) return;
                this.columnWidths[index] = width1;
                this.columnWidths[index + 1] = width2;
            } else { // Last grip
                let width1 = this.isResizing.initialWidths[index] + dxPercent;
                if(width1 < 5) return;
                this.columnWidths[index] = width1;
            }
            const totalWidth = this.columnWidths.reduce((a, b) => a + b, 0);
            this.columnWidths = this.columnWidths.map(w => (w / totalWidth) * 100);
        } else { // Row resizing
            const dy = e.clientY - this.isResizing.startY;
            const index = this.isResizing.index;
            let newHeight = this.isResizing.initialHeights[index] + dy;
            if (newHeight < 5) newHeight = 5;
            this.rowHeights[index] = newHeight;
        }
        this.render();
    }

    handleContextMenuAction(action, index) {
        switch (action) {
            case 'insert-above': this.insertRow(index, 'before'); break; case 'insert-below': this.insertRow(index, 'after'); break;
            case 'delete-row': this.deleteRow(index); break; case 'insert-left': this.insertColumn(index, 'before'); break;
            case 'insert-right': this.insertColumn(index, 'after'); break; case 'delete-column': this.deleteColumn(index); break;
        }
   
    }

    insertRow(index, where) {
        const insertAt = (where === 'after') ? index + 1 : index; const colCount = this.columnWidths.length;
        const newRow = { type: 'data', cells: [] };
        for (let c = 0; c < colCount; c++) { newRow.cells.push(this.createDefaultTextbox('data', c, '[NewValue]')); }
        this.rows.splice(insertAt, 0, newRow); this.rowHeights.splice(insertAt, 0, 40);
        this.render();
    }
    
    deleteRow(rowIndex) {
        if (this.rows.length <= 1) return alert("Cannot delete the last row.");
        this.rows.splice(rowIndex, 1); this.rowHeights.splice(rowIndex, 1);
        this.render();
    }
    
    insertColumn(index, where) {
        const insertAt = (where === 'after') ? index + 1 : index;
        this.rows.forEach(row => { const newTextbox = this.createDefaultTextbox(row.type, insertAt); row.cells.splice(insertAt, 0, newTextbox); });
        this.columnWidths.splice(insertAt, 0, 15); const totalWidth = this.columnWidths.reduce((sum, w) => sum + w, 0);
        this.columnWidths = this.columnWidths.map(w => (w / totalWidth) * 100);
        this.render();
    }

    deleteColumn(colIndex) {
        if (this.columnWidths.length <= 1) return alert("Cannot delete the last column.");
        this.rows.forEach(row => row.cells.splice(colIndex, 1)); this.columnWidths.splice(colIndex, 1);
        const totalWidth = this.columnWidths.reduce((sum, w) => sum + w, 0);
        this.columnWidths = this.columnWidths.map(w => (w / totalWidth) * 100);
        this.render();
    }

    // FIX: This new overridden method correctly scales internal row heights.
  updateSize(width, height) {
        const oldTotalHeight = this.rowHeights.reduce((a, b) => a + b, 0);
        const newTotalHeight = height;
        
        if (oldTotalHeight > 0 && newTotalHeight > 0) {
            const scaleFactor = newTotalHeight / oldTotalHeight;
            this.rowHeights = this.rowHeights.map(h => h * scaleFactor);
        }

        super.updateSize(width, height);

        // FIX: Re-render the table's internal content and controls to reflect the new size
        this.render(); 
    }

    setSelected(selected) {
        super.setSelected(selected);
        if (this.controlsElement) {
            // FIX: This now correctly lets the CSS control visibility.
            this.controlsElement.style.display = selected ? 'block' : 'none';
        }
        if (selected) {
            this.render();
        }
    }

    applyStyles(styles) {
        super.applyStyles(styles);
    }
}