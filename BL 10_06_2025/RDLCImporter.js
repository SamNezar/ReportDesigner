// RDLC Import Module for Report Designer - v5 (Dynamic Namespace Support)
class RDLCImporter {
    constructor(designer) {
        this.designer = designer;
        // FIX: This property will store the detected namespace from the XML file.
        this.reportNamespace = null;
        this.namespaceResolver = ns => {
            if (ns === 'rd') return "http://schemas.microsoft.com/SQLServer/reporting/reportdesigner";
            // FIX: The resolver now uses the dynamically detected namespace.
            return this.reportNamespace;
        };
        this.xmlDoc = null;
    }

    /**
     * Main import function. Parses the XML string and rebuilds the report,
     * including header, body, and footer sections.
     */
    import(xmlString) {
        // 1. Reset the designer canvas and state
        this.designer.toggleHeader(false);
        this.designer.toggleFooter(false);
        while (this.designer.objects.length > 0) {
            this.designer.deleteObject(this.designer.objects[0]);
        }
        this.designer.selectedObject = null;
        this.designer.updateToolbarForSelectedObject();

        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const parseError = this.xmlDoc.querySelector("parsererror");
        if (parseError) {
            console.error("XML Parsing Error:", parseError.textContent);
            alert("Failed to parse the RDLC file. Check the console for details.");
            return;
        }
        
        // FIX: Dynamically detect the namespace from the XML file's root element.
        if (this.xmlDoc.documentElement && this.xmlDoc.documentElement.namespaceURI) {
            this.reportNamespace = this.xmlDoc.documentElement.namespaceURI;
        } else {
            // Fallback for older browsers or if detection fails
            this.reportNamespace = "http://schemas.microsoft.com/sqlserver/reporting/2010/01/reportdefinition";
            console.warn("Could not detect XML namespace, falling back to default.");
        }


        // 2. Import page size and configure sections in the designer
        this.importPageSettings(); // Sets A4/A5 etc. for the designer

        const headerHeightNode = this.getNode('//def:Page/def:PageHeader/def:Height');
        const footerHeightNode = this.getNode('//def:Page/def:PageFooter/def:Height');
        const pageHeightNode = this.getNode('//def:Page/def:PageHeight');

        const headerHeight = headerHeightNode ? this.unitToPx(headerHeightNode.textContent) : 0;
        const footerHeight = footerHeightNode ? this.unitToPx(footerHeightNode.textContent) : 0;
        const pageHeight = pageHeightNode ? this.unitToPx(pageHeightNode.textContent) : this.designer.paper.offsetHeight;

        if (headerHeight > 0) {
            this.designer.headerHeight = headerHeight;
            this.designer.toggleHeader(true);
        }
        if (footerHeight > 0) {
            this.designer.footerHeight = footerHeight;
            this.designer.toggleFooter(true);
        }

        // 3. Define a generic function to process items with a vertical offset
        const processItems = (xpath, yOffset) => {
            const itemNodes = this.xpath_query(xpath);
            itemNodes.forEach(node => {
                let newObject = null;
                switch (node.localName) {
                    case 'Textbox':
                        newObject = this.importTextbox(node);
                        break;
                    case 'Image':
                        newObject = this.importImage(node);
                        break;
                    case 'Tablix':
                        newObject = this.importTablix(node);
                        break;
                    case 'Line':
                        newObject = this.importLine(node);
                        break;
                }
                if (newObject) {
                    // Apply the vertical offset based on the section
                    newObject.y += yOffset;
                    
                    this.designer.addObject(newObject);
                    newObject.applyStyles({ padding: newObject.padding });
                }
            });
        };

        // 4. Process items for each section with the correct calculated offset
        const bodyTopOffset = headerHeight;
        const footerTopOffset = pageHeight - footerHeight;

        processItems('//def:Page/def:PageHeader/def:ReportItems/*', 0);
        processItems('//def:Body/def:ReportItems/*', bodyTopOffset);
        processItems('//def:Page/def:PageFooter/def:ReportItems/*', footerTopOffset);


        // 5. Final step to apply z-index and reset the designer's counter
        let maxZ = 0;
        this.designer.objects.forEach(obj => {
            if (obj.element && obj.zIndex) {
                obj.element.style.zIndex = obj.zIndex;
                if (obj.zIndex > maxZ) {
                    maxZ = obj.zIndex;
                }
            }
        });
        ReportDesigner.zIndexCounter = maxZ + 1;
    }


    /**
     * Imports the page size settings.
     */
    importPageSettings() {
        const pageWidthNode = this.getNode('//def:Page/def:PageWidth');
        const pageHeightNode = this.getNode('//def:Page/def:PageHeight');

        if (pageWidthNode && pageHeightNode) {
            const width = this.unitToPx(pageWidthNode.textContent);
            const height = this.unitToPx(pageHeightNode.textContent);

            let sizeClass = 'a4'; // Default
            if (width > height) {
                sizeClass = (width > 1000 && height > 700) ? 'a4-landscape' : 'a5-landscape';
            } else {
                sizeClass = (height > 1000 && width > 700) ? 'a4' : 'a5';
            }
            this.designer.changePageSize(sizeClass);
        }
    }

    /**
     * Imports a <Textbox> element and returns a TextBox object.
     * @returns {TextBox}
     */
    importTextbox(node) {
        const top = this.unitToPx(this.getNodeValue(node, 'def:Top', '0in'));
        const left = this.unitToPx(this.getNodeValue(node, 'def:Left', '0in'));
        const width = this.unitToPx(this.getNodeValue(node, 'def:Width', '1in'));
        const height = this.unitToPx(this.getNodeValue(node, 'def:Height', '0.25in'));

        const textbox = new TextBox(left, top, width, height);
        
         textbox.zIndex = parseInt(this.getNodeValue(node, 'def:ZIndex', '0'));


        const styleNode = this.getNode('def:Style', node);
        if (styleNode) this.parseStyleNode(styleNode, textbox);

        const paragraphsNode = this.getNode('def:Paragraphs', node);
        if (paragraphsNode) {
            textbox.text = this.parseParagraphsToHtml(paragraphsNode);
            const paraStyle = this.getNode('def:Paragraph/def:Style', paragraphsNode);
            if (paraStyle) {
                const textAlign = this.getNodeValue(paraStyle, 'def:TextAlign');
                if (textAlign) textbox.textAlign = textAlign.toLowerCase();
            }
        }
        return textbox;
    }

    /**
     * Imports an <Image> element and returns an ImageObject.
     * @returns {ImageObject}
     */
    importImage(node) {
        const top = this.unitToPx(this.getNodeValue(node, 'def:Top', '0in'));
        const left = this.unitToPx(this.getNodeValue(node, 'def:Left', '0in'));
        const width = this.unitToPx(this.getNodeValue(node, 'def:Width', '1in'));
        const height = this.unitToPx(this.getNodeValue(node, 'def:Height', '1in'));
        
        const image = new ImageObject(left, top, width, height);
   image.zIndex = parseInt(this.getNodeValue(node, 'def:ZIndex', '0'));


        const source = this.getNodeValue(node, 'def:Source');
        const value = this.getNodeValue(node, 'def:Value');
        
        if (source === 'Embedded' && value) {
            const embeddedImageNode = this.getNode(`//def:EmbeddedImage[@Name='${value}']`);
            if (embeddedImageNode) {
                const mime = this.getNodeValue(embeddedImageNode, 'def:MIMEType');
                const data = this.getNodeValue(embeddedImageNode, 'def:ImageData');
                image.src = `data:${mime};base64,${data}`;
            }
        } else if (source === 'External') {
             image.src =  value; // Cannot resolve expressions //value.startsWith('=') ? null :
        }

        const styleNode = this.getNode('def:Style', node);
        if (styleNode) this.parseStyleNode(styleNode, image);

        return image;
    }

    /**
     * Imports a <Line> element and returns a LineObject.
     * @returns {LineObject}
     */
    importLine(node) {
        const top = this.unitToPx(this.getNodeValue(node, 'def:Top', '0in'));
        const left = this.unitToPx(this.getNodeValue(node, 'def:Left', '0in'));
        const width = this.unitToPx(this.getNodeValue(node, 'def:Width', '1in'));
        const height = this.unitToPx(this.getNodeValue(node, 'def:Height', '0in'));
        
        const line = new LineObject(left, top, width || 1, height || 1);
        
          line.zIndex = parseInt(this.getNodeValue(node, 'def:ZIndex', '0'));


        const styleNode = this.getNode('def:Style', node);
        if (styleNode) {
            const borderNode = this.getNode('def:Border', styleNode);
            if (borderNode) {
                line.borderColor = this.getNodeValue(borderNode, 'def:Color', '#000000');
                line.borderStyle = this.getNodeValue(borderNode, 'def:Style', 'solid').toLowerCase();
                const borderSize = Math.max(1, this.unitToPx(this.getNodeValue(borderNode, 'def:Width', '1pt')));
                line.borderSize = borderSize;

                if (height < 1) { // Horizontal line
                    line.height = borderSize;
                } else { // Vertical line
                    line.width = borderSize;
                }
            }
        }
        return line;
    }
    
    /**
     * Imports a <Tablix> element and returns a TableObject.
     * @returns {TableObject}
     */
    importTablix(node) {
        const top = this.unitToPx(this.getNodeValue(node, 'def:Top', '0in'));
        const left = this.unitToPx(this.getNodeValue(node, 'def:Left', '0in'));
        const width = this.unitToPx(this.getNodeValue(node, 'def:Width', '3in'));
        const height = this.unitToPx(this.getNodeValue(node, 'def:Height', '1in'));

        const table = new TableObject(left, top, width, height);
          table.zIndex = parseInt(this.getNodeValue(node, 'def:ZIndex', '0'));


        table.rows = []; table.rowHeights = []; table.columnWidths = [];

        const styleNode = this.getNode('def:Style', node);
        if (styleNode) this.parseStyleNode(styleNode, table);

        const columnNodes = this.xpath_query('def:TablixBody/def:TablixColumns/def:TablixColumn', node);
        const totalWidthPx = columnNodes.reduce((sum, col) => sum + this.unitToPx(this.getNodeValue(col, 'def:Width')), 0);
        if(totalWidthPx > 0) {
            columnNodes.forEach(col => {
                const colWidthPx = this.unitToPx(this.getNodeValue(col, 'def:Width'));
                table.columnWidths.push((colWidthPx / totalWidthPx) * 100);
            });
        }
        
        const rowNodes = this.xpath_query('def:TablixBody/def:TablixRows/def:TablixRow', node);
        rowNodes.forEach((rowNode, rowIndex) => {
            table.rowHeights.push(this.unitToPx(this.getNodeValue(rowNode, 'def:Height')));
            const cellNodes = this.xpath_query('def:TablixCells/def:TablixCell', rowNode);
            
            // Basic check for header row
            const isHeader = rowIndex === 0 && this.getNode('def:TablixRowHierarchy/def:TablixMembers/def:TablixMember/def:KeepWithGroup', node);

            const row = { type: isHeader ? 'header' : 'data', cells: [] };
            
            cellNodes.forEach(cellNode => {
                const textboxNode = this.getNode('def:CellContents/def:Textbox', cellNode);
                if (textboxNode) {
                    const cellTextbox = this.importTextbox(textboxNode);
                    if (cellTextbox) {
                         cellTextbox.isNestedInTable = true;
                         row.cells.push(cellTextbox);
                    }
                } else {
                    // Handle cells with other content like Images if necessary
                    const imageNode = this.getNode('def:CellContents/def:Image', cellNode);
                    if(imageNode) {
                        // Create a placeholder textbox for images in cells for simplicity
                        const placeholder = new TextBox(0,0,0,0, '[Image]');
                        placeholder.isNestedInTable = true;
                        row.cells.push(placeholder);
                    }
                }
            });
            table.rows.push(row);
        });
        return table;
    }
    
    // --- Helper Functions ---
    xpath_query(xpath, contextNode = this.xmlDoc) {
        const result = this.xmlDoc.evaluate(xpath, contextNode, this.namespaceResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        const nodes = [];
        let node;
        while ((node = result.iterateNext())) {
            nodes.push(node);
        }
        return nodes;
    }
    
    getNode(xpath, contextNode = this.xmlDoc) {
        return this.xmlDoc.evaluate(xpath, contextNode, this.namespaceResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    
    getNodeValue(parentNode, xpath, defaultValue = '') {
        const node = this.getNode(xpath, parentNode);
        return node ? node.textContent : defaultValue;
    }
    
    unitToPx(valueStr) {
        if (!valueStr || typeof valueStr !== 'string') return 0;
        const match = valueStr.match(/^(-?\d*\.?\d+)\s*(in|cm|pt|px)?/);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2] || 'in';

        switch (unit) {
            case 'in': return value * 96;
            case 'cm': return value * 37.795;
            case 'pt': return value * (96 / 72);
            case 'px': return value;
            default: return 0;
        }
    }

    parseStyleNode(styleNode, obj) {
        const borderNode = this.getNode('def:Border', styleNode);
        if (borderNode) {
            obj.borderSet = 'all';
            obj.borderColor = this.getNodeValue(borderNode, 'def:Color', obj.borderColor);
            obj.borderStyle = this.getNodeValue(borderNode, 'def:Style', obj.borderStyle).toLowerCase();
            if(obj.borderStyle !== 'none') obj.borderSize = Math.max(1, this.unitToPx(this.getNodeValue(borderNode, 'def:Width', '1pt')));
        } else {
             ['Top', 'Bottom', 'Left', 'Right'].forEach(side => {
                 const sideBorderNode = this.getNode(`def:${side}Border`, styleNode);
                 if(sideBorderNode){
                     obj.borderSet = side.toLowerCase();
                     obj.borderColor = this.getNodeValue(sideBorderNode, 'def:Color', obj.borderColor);
                     obj.borderStyle = this.getNodeValue(sideBorderNode, 'def:Style', obj.borderStyle).toLowerCase();
                     if(obj.borderStyle !== 'none') obj.borderSize = Math.max(1, this.unitToPx(this.getNodeValue(sideBorderNode, 'def:Width', '1pt')));
                 }
             });
        }
        
        obj.backgroundColor = this.getNodeValue(styleNode, 'def:BackgroundColor', obj.backgroundColor);

        const paddingValue = this.getNodeValue(styleNode, 'def:PaddingLeft') || this.getNodeValue(styleNode, 'def:PaddingTop');

        if (paddingValue) {
            // Convert the found value (e.g., "2pt") to pixels and assign it.
            obj.padding = this.unitToPx(paddingValue);
        }

        if ('verticalAlign' in obj) {
            const va = this.getNodeValue(styleNode, 'def:VerticalAlign', obj.verticalAlign).toLowerCase();
            obj.verticalAlign = (va === 'center') ? 'middle' : va;
        }
        if ('textDirection' in obj) {
            const dir = this.getNodeValue(styleNode, 'def:Direction');
            if (dir) obj.textDirection = dir.toLowerCase();
        }
    }

    parseParagraphsToHtml(paragraphsNode) {
        let html = '';
        const paragraphNodes = this.xpath_query('def:Paragraph', paragraphsNode);

        paragraphNodes.forEach(pNode => {
            const paraStyleNode = this.getNode('def:Style', pNode);
            let paraAlign = '';
            if (paraStyleNode) {
                const align = this.getNodeValue(paraStyleNode, 'def:TextAlign', 'left').toLowerCase();
                paraAlign = ` style="text-align: ${align};"`;
            }
            
            let paraHtml = '';
            const textRunNodes = this.xpath_query('def:TextRuns/def:TextRun', pNode);
            textRunNodes.forEach(trNode => {
                
                let value = this.getNodeValue(trNode, 'def:Value', '');

                const styleNode = this.getNode('def:Style', trNode);
                let styles = '';
                if (styleNode) {
                    const ff = this.getNodeValue(styleNode, 'def:FontFamily');
                    if (ff) styles += `font-family: ${ff};`;
                    const fz = this.getNodeValue(styleNode, 'def:FontSize');
                    if (fz) styles += `font-size: ${fz};`;
                    const fw = this.getNodeValue(styleNode, 'def:FontWeight');
                    if (fw && fw.toLowerCase() === 'bold') styles += `font-weight: bold;`;
                    const fs = this.getNodeValue(styleNode, 'def:FontStyle');
                    if (fs && fs.toLowerCase() === 'italic') styles += `font-style: italic;`;
                    const td = this.getNodeValue(styleNode, 'def:TextDecoration');
                     if (td) styles += `text-decoration: ${td.toLowerCase().replace('linethrough', 'line-through')};`;
                    const cl = this.getNodeValue(styleNode, 'def:Color');
                    if (cl) styles += `color: ${cl};`;
                }

                paraHtml += styles ? `<span style="${styles}">${value}</span>` : value;
            });
            
            html += `<div${paraAlign}>${paraHtml.replace(/System\.Environment\.NewLine/g, '<br>')}</div>`;
        });
        return html;
    }
}