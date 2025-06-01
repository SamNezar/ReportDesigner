 // Editor Management
        class EditorManager {
            constructor() {
                this.objects = new Map();
                this.selectedObjects = new Set();
                this.clipboard = null;
                this.isGridVisible = false;
                this.zoom = 1.0;
                this.isDragging = false;
                this.isResizing = false;
                this.dragOffset = { x: 0, y: 0 };
                this.currentTool = 'pointer';
                
                this.initializeEditor();
            }

            initializeEditor() {
                this.paper = document.getElementById('paper');
                this.gridOverlay = document.getElementById('gridOverlay');
                
                // Mouse events
                this.paper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
                this.paper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                this.paper.addEventListener('mouseup', (e) => this.handleMouseUp(e));
                this.paper.addEventListener('click', (e) => this.handleClick(e));
                this.paper.addEventListener('dblclick', (e) => this.handleDoubleClick(e));
                
                // Context menu
                this.paper.addEventListener('contextmenu', (e) => this.showContextMenu(e));
                
                // Drop events for toolbox items
                this.paper.addEventListener('dragover', (e) => this.handleDragOver(e));
                this.paper.addEventListener('drop', (e) => this.handleDrop(e));
                
                // Keyboard events
                document.addEventListener('keydown', (e) => this.handleKeyDown(e));
                
                // Zoom controls
                document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
                document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
                
                // Context menu actions
                document.querySelectorAll('.context-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        this.handleContextAction(e.target.dataset.action);
                    });
                });
                
                // Hide context menu on click outside
                document.addEventListener('click', () => this.hideContextMenu());
            }

            // Empty methods to be implemented
            handleMouseDown(e) {}
            handleMouseMove(e) {}
            handleMouseUp(e) {}
            handleClick(e) {}
            handleDoubleClick(e) {}
            handleDragOver(e) {}
            handleDrop(e) {}
            handleKeyDown(e) {}
            showContextMenu(e) {}
            hideContextMenu() {}
            handleContextAction(action) {}
            
            addObject(objectData) {}
            removeObject(objectId) {}
            selectObject(objectId) {}
            deselectAll() {}
            updateObjectPosition(objectId, x, y) {}
            updateObjectSize(objectId, width, height) {}
            
            zoomIn() {}
            zoomOut() {}
            updateZoom() {}
            
            toggleGrid() {
                this.isGridVisible = !this.isGridVisible;
                this.gridOverlay.classList.toggle('visible', this.isGridVisible);
                document.getElementById('toggleGrid').classList.toggle('active', this.isGridVisible);
            }
            
            changePageSize(size) {}
            
            copyObjects() {}
            pasteObjects() {}
            deleteObjects() {}
            
            exportReport() {}
            importReport(data) {}
        }