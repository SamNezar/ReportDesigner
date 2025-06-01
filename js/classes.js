    // Report Object Classes
        class ReportObject {
            constructor(type, x = 0, y = 0, width = 100, height = 50) {
                this.id = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                this.type = type;
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.selected = false;
                this.zIndex = 1;
                
                // Style properties
                this.borderStyle = 'solid';
                this.borderWidth = 1;
                this.borderColor = '#000000';
                this.backgroundColor = '#ffffff';
                this.fontFamily = 'Arial';
                this.fontSize = 14;
                this.fontWeight = 'normal';
                this.fontStyle = 'normal';
                this.textDecoration = 'none';
                this.textColor = '#000000';
                this.textAlign = 'left';
                this.lineHeight = 1.5;
            }

            // Empty methods to be implemented
            createElement() {}
            updateElement() {}
            updateProperties() {}
            toJSON() {}
            fromJSON(data) {}
        }

        class TextBoxObject extends ReportObject {
            constructor(x, y, width = 150, height = 30) {
                super('textbox', x, y, width, height);
                this.text = 'Text Box';
                this.isRichText = true;
            }

            createElement() {
                // Implementation to come
            }

            updateElement() {
                // Implementation to come
            }

            setTextFormatting(start, end, formatting) {
                // Implementation to come - for rich text formatting
            }
        }

        class ImageObject extends ReportObject {
            constructor(x, y, width = 100, height = 100) {
                super('image', x, y, width, height);
                this.src = '';
                this.alt = 'Image';
                this.preserveAspectRatio = true;
            }

            createElement() {
                // Implementation to come
            }

            loadImage(file) {
                // Implementation to come
            }
        }

        class TableObject extends ReportObject {
            constructor(x, y, width = 300, height = 100) {
                super('table', x, y, width, height);
                this.columns = [
                    { name: 'Column 1', field: 'col1', width: 100 },
                    { name: 'Column 2', field: 'col2', width: 100 }
                ];
                this.headerRow = true;
                this.dataRow = true;
            }

            createElement() {
                // Implementation to come
            }

            addColumn(columnData) {
                // Implementation to come
            }

            removeColumn(index) {
                // Implementation to come
            }

            resizeColumn(index, width) {
                // Implementation to come
            }
        }

        class LineObject extends ReportObject {
            constructor(x, y, width = 100, height = 2) {
                super('line', x, y, width, height);
                this.lineStyle = 'solid';
                this.lineWidth = 1;
                this.lineColor = '#000000';
            }

            createElement() {
                // Implementation to come
            }
        }

        class StaticFieldObject extends TextBoxObject {
            constructor(x, y, fieldName, width = 150, height = 30) {
                super(x, y, width, height);
                this.fieldName = fieldName;
                this.text = `[${fieldName}]`;
                this.isStatic = true;
            }

            createElement() {
                // Implementation to come
            }
        }