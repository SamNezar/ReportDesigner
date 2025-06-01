 // Main Application
        class ReportDesigner {
            constructor() {
                this.toolbarManager = null;
                this.toolboxManager = null;
                this.editorManager = null;
                this.propertiesManager = null;
                
                this.initialize();
            }

            initialize() {
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
                } else {
                    this.initializeComponents();
                }
            }

            initializeComponents() {
                // Initialize all managers
                this.toolbarManager = new ToolbarManager();
                this.toolboxManager = new ToolboxManager();
                this.editorManager = new EditorManager();
                this.propertiesManager = new PropertiesManager();
                
                // Connect managers
                this.connectManagers();
                
                console.log('Report Designer initialized successfully');
            }

            connectManagers() {
                // Connect toolbar to editor
                this.toolbarManager.editorManager = this.editorManager;
                this.editorManager.toolbarManager = this.toolbarManager;
                
                // Connect toolbox to editor
                this.toolboxManager.editorManager = this.editorManager;
                this.editorManager.toolboxManager = this.toolboxManager;
                
                // Connect properties to editor
                this.propertiesManager.editorManager = this.editorManager;
                this.editorManager.propertiesManager = this.propertiesManager;
            }

            // Application methods
            newReport() {}
            openReport() {}
            saveReport() {}
            exportToPDF() {}
            exportToHTML() {}
            showPreview() {}
        }

        // Properties Panel Manager
        class PropertiesManager {
            constructor() {
                this.panel = document.getElementById('propertiesPanel');
                this.content = document.querySelector('.properties-content');
                this.currentObject = null;
                
                this.initializeProperties();
            }

            initializeProperties() {
                document.getElementById('closeProperties').addEventListener('click', () => {
                    this.hidePanel();
                });
            }

            showPanel(object) {
                this.currentObject = object;
                this.updatePropertiesContent();
                this.panel.classList.add('visible');
            }

            hidePanel() {
                this.panel.classList.remove('visible');
                this.currentObject = null;
            }

            updatePropertiesContent() {
                if (!this.currentObject) return;
                
                // Clear existing content
                this.content.innerHTML = '';
                
                // Generate properties based on object type
                this.generatePropertiesForm();
            }

            // Empty methods to be implemented
            generatePropertiesForm() {}
            updateObjectProperty(property, value) {}
        }

        // Utility Functions
        class Utils {
            static getMousePosition(e, element) {
                const rect = element.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }

            static snapToGrid(value, gridSize = 20) {
                return Math.round(value / gridSize) * gridSize;
            }

            static generateId() {
                return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }

            static cloneObject(obj) {
                return JSON.parse(JSON.stringify(obj));
            }

            static debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
        }

        // Data Management
        class DataManager {
            constructor() {
                this.staticFields = [
                    'invoice_type_name',
                    'transaction_qty', 
                    'transaction_name',
                    'invoice_number'
                ];
                
                this.tableColumns = [
                    { name: 'Item Name', field: 'item_name', type: 'text' },
                    { name: 'Item Price', field: 'item_price', type: 'currency' },
                    { name: 'Item Quantity', field: 'item_qty', type: 'number' },
                    { name: 'Item Total', field: 'item_total', type: 'currency' },
                    { name: 'Item Description', field: 'item_desc', type: 'text' }
                ];
            }

            getStaticFields() {
                return this.staticFields;
            }

            getTableColumns() {
                return this.tableColumns;
            }

            addStaticField(fieldName) {
                if (!this.staticFields.includes(fieldName)) {
                    this.staticFields.push(fieldName);
                }
            }

            removeStaticField(fieldName) {
                const index = this.staticFields.indexOf(fieldName);
                if (index > -1) {
                    this.staticFields.splice(index, 1);
                }
            }
        }

        // Initialize the application
        let reportDesigner;
        
        // Start the application
        reportDesigner = new ReportDesigner();