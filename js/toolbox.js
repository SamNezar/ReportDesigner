 // Toolbox Management
        class ToolboxManager {
            constructor() {
                this.currentTool = 'pointer';
                this.initializeToolbox();
            }

            initializeToolbox() {
                // Tool selection
                document.querySelectorAll('.toolbox-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        this.selectTool(e.currentTarget.dataset.tool);
                    });
                });

                // Static fields
                document.querySelectorAll('.static-field').forEach(field => {
                    field.addEventListener('click', (e) => {
                        this.selectStaticField(e.currentTarget.dataset.field);
                    });

                    // Make draggable
                    field.draggable = true;
                    field.addEventListener('dragstart', (e) => {
                        this.handleStaticFieldDragStart(e);
                    });
                });

                // Search functionality
                document.getElementById('toolboxSearch').addEventListener('input', (e) => {
                    this.searchToolbox(e.target.value);
                });
            }

            selectTool(toolType) {
                // Remove active class from all tools
                document.querySelectorAll('.toolbox-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Add active class to selected tool
                document.querySelector(`[data-tool="${toolType}"]`).classList.add('active');
                
                this.currentTool = toolType;
                this.updateCursor();
            }

            selectStaticField(fieldName) {
                this.currentTool = 'static-field';
                this.currentField = fieldName;
                this.updateCursor();
            }

            // Empty methods to be implemented
            handleStaticFieldDragStart(e) {}
            searchToolbox(query) {}
            updateCursor() {}
        }