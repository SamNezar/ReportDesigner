// RDLC Export/Import Module for Report Designer

// Export functionality
class RDLCExporter {
    constructor(reportDesigner) {
        this.designer = reportDesigner;
        this.namespaceURI = "http://schemas.microsoft.com/sqlserver/reporting/2010/01/reportdefinition";
        this.rdNamespaceURI = "http://schemas.microsoft.com/SQLServer/reporting/reportdesigner";
    }

    // Convert px to inches (96 DPI)
    pxToInches(px) {
        return (px / 96).toFixed(5) + 'in';
    }

    // [FIX 1] Convert color to hex format, handling rgb() and named colors
    formatColor(color) {
        if (!color || typeof color !== 'string') return '#000000';
        let c = color.trim().toLowerCase();

        // Already hex
        if (c.startsWith('#')) return c;

        // Handle rgb(r,g,b)
        const rgbParts = c.match(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)$/);
        if (rgbParts) {
            const r = parseInt(rgbParts[1]).toString(16).padStart(2, '0');
            const g = parseInt(rgbParts[2]).toString(16).padStart(2, '0');
            const b = parseInt(rgbParts[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        }
        
        // Handle common named colors
        const namedColorMap = {'black':'#000000','white':'#ffffff','red':'#ff0000','green':'#008000','blue':'#0000ff','yellow':'#ffff00'};
        if (namedColorMap[c]) return namedColorMap[c];

        // Fallback for unknown formats
        return color;
    }

    // Convert border style
    getBorderStyle(borderStyle) {
        switch (borderStyle) {
            case 'solid': return 'Solid';
            case 'dashed': return 'Dashed';
            case 'dotted': return 'Dotted';
            case 'double': return 'Double';
            case 'none': return 'None';
            default: return 'Solid';
        }
    }

    // [FIX 2, 3, 4] Parse HTML content to extract text runs with formatting
    parseHtmlToTextRuns(html, baseStyle = {}) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const paragraphs = [];
        let currentParagraph = { textRuns: [] };

        const processNode = (node, parentStyle = {}) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text) {
                    currentParagraph.textRuns.push({
                        value: text,
                        style: { ...parentStyle }
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const style = { ...parentStyle };
                const nodeStyle = node.style;

                if (node.tagName === 'B' || node.tagName === 'STRONG' || nodeStyle.fontWeight === 'bold' || nodeStyle.fontWeight === '700') {
                    style.fontWeight = 'Bold';
                }
                if (node.tagName === 'I' || node.tagName === 'EM' || nodeStyle.fontStyle === 'italic') {
                    style.fontStyle = 'Italic';
                }

                const textDecor = nodeStyle.textDecorationLine || nodeStyle.textDecoration;
                if (node.tagName === 'U' || (textDecor && textDecor.includes('underline'))) {
                    style.textDecoration = 'Underline';
                }
                if (node.tagName === 'S' || node.tagName === 'STRIKE' || (textDecor && textDecor.includes('line-through'))) {
                    style.textDecoration = 'LineThrough'; // Correctly map to LineThrough
                }
                
                if (nodeStyle.fontFamily) {
                    style.fontFamily = nodeStyle.fontFamily.replace(/['"]/g, ''); // Remove quotes
                }
                if (nodeStyle.fontSize) {
                    style.fontSize = parseInt(nodeStyle.fontSize) + 'pt';
                }
                
                const colorAttr = node.getAttribute('color');
                if (nodeStyle.color) {
                    style.color = this.formatColor(nodeStyle.color);
                } else if (colorAttr) {
                    style.color = this.formatColor(colorAttr);
                }

                if (node.tagName === 'BR' || node.tagName === 'DIV' || node.tagName === 'P') {
                     if (currentParagraph.textRuns.length > 0 || (node.tagName ==='BR' && paragraphs.length > 0) ) {
                        paragraphs.push(currentParagraph);
                        currentParagraph = { textRuns: [] };
                    }
                }

                for (const child of node.childNodes) {
                    processNode(child, style);
                }

                 if ((node.tagName === 'DIV' || node.tagName === 'P') && currentParagraph.textRuns.length > 0) {
                    paragraphs.push(currentParagraph);
                    currentParagraph = { textRuns: [] };
                }
            }
        };
        
        processNode(tempDiv, baseStyle);

        if (currentParagraph.textRuns.length > 0) {
            paragraphs.push(currentParagraph);
        }

        if (paragraphs.length === 0 && tempDiv.textContent) {
             paragraphs.push({ textRuns: [{ value: tempDiv.textContent, style: baseStyle }] });
        }
        
        return paragraphs.filter(p => p.textRuns.length > 0 && p.textRuns.some(tr => tr.value));
    }

    // Create XML element with namespace
    createElement(tagName) {
        return document.createElementNS(this.namespaceURI, tagName);
    }
    
    // Export textbox object
    exportTextbox(textbox, index) {
        const textboxEl = this.createElement('Textbox');
        textboxEl.setAttribute('Name', `Textbox${index + 1}`);

        const canGrow = this.createElement('CanGrow');
        canGrow.textContent = 'true';
        textboxEl.appendChild(canGrow);

        const keepTogether = this.createElement('KeepTogether');
        keepTogether.textContent = 'true';
        textboxEl.appendChild(keepTogether);
        
        // [FIX 4] Define base style from the textbox object itself
        const baseStyle = {
            fontFamily: textbox.fontFamily ? textbox.fontFamily.replace(/['"]/g, '') : null,
            fontSize: textbox.fontSize ? textbox.fontSize + 'pt' : null,
            color: this.formatColor(textbox.foreColor)
        };
        
        const paragraphsEl = this.createElement('Paragraphs');
        const paragraphs = this.parseHtmlToTextRuns(textbox.text, baseStyle);

        paragraphs.forEach(para => {
            const paragraphEl = this.createElement('Paragraph');
            const textRunsEl = this.createElement('TextRuns');

            para.textRuns.forEach(run => {
                if (!run.value) return;

                const textRunEl = this.createElement('TextRun');
                const valueEl = this.createElement('Value');
                valueEl.textContent = run.value;
                textRunEl.appendChild(valueEl);

                const styleEl = this.createElement('Style');
                let styleAdded = false;

                if (run.style.fontWeight) {
                    const fontWeightEl = this.createElement('FontWeight');
                    fontWeightEl.textContent = run.style.fontWeight;
                    styleEl.appendChild(fontWeightEl);
                    styleAdded = true;
                }
                if (run.style.fontStyle) {
                    const fontStyleEl = this.createElement('FontStyle');
                    fontStyleEl.textContent = run.style.fontStyle;
                    styleEl.appendChild(fontStyleEl);
                    styleAdded = true;
                }
                if (run.style.textDecoration) {
                    const textDecorationEl = this.createElement('TextDecoration');
                    textDecorationEl.textContent = run.style.textDecoration;
                    styleEl.appendChild(textDecorationEl);
                    styleAdded = true;
                }
                if (run.style.fontSize) {
                    const fontSizeEl = this.createElement('FontSize');
                    fontSizeEl.textContent = run.style.fontSize;
                    styleEl.appendChild(fontSizeEl);
                    styleAdded = true;
                }
                if (run.style.fontFamily) {
                    const fontFamilyEl = this.createElement('FontFamily');
                    fontFamilyEl.textContent = run.style.fontFamily;
                    styleEl.appendChild(fontFamilyEl);
                    styleAdded = true;
                }
                if (run.style.color && run.style.color !== baseStyle.color) {
                    const colorEl = this.createElement('Color');
                    colorEl.textContent = run.style.color;
                    styleEl.appendChild(colorEl);
                    styleAdded = true;
                }

                if(styleAdded || Object.keys(run.style).length > 0){ // Check if style object is not empty
                  textRunEl.appendChild(styleEl);
                } else {
                  textRunEl.appendChild(this.createElement('Style'));
                }
                
                textRunsEl.appendChild(textRunEl);
            });

            paragraphEl.appendChild(textRunsEl);

            const paraStyleEl = this.createElement('Style');
            if (textbox.lineHeight) {
                const lineHeightEl = this.createElement('LineHeight');
                lineHeightEl.textContent = isNaN(textbox.lineHeight) ? textbox.lineHeight : textbox.lineHeight + 'pt';
                paraStyleEl.appendChild(lineHeightEl);
            }
            if (textbox.textAlign && textbox.textAlign !== 'left') {
                const textAlignEl = this.createElement('TextAlign');
                textAlignEl.textContent = textbox.textAlign.charAt(0).toUpperCase() + textbox.textAlign.slice(1);
                paraStyleEl.appendChild(textAlignEl);
            }
            paragraphEl.appendChild(paraStyleEl);
            paragraphsEl.appendChild(paragraphEl);
        });

        textboxEl.appendChild(paragraphsEl);
        
        const topEl = this.createElement('Top');
        topEl.textContent = this.pxToInches(textbox.y);
        textboxEl.appendChild(topEl);

        const leftEl = this.createElement('Left');
        leftEl.textContent = this.pxToInches(textbox.x);
        textboxEl.appendChild(leftEl);

        const heightEl = this.createElement('Height');
        heightEl.textContent = this.pxToInches(textbox.height);
        textboxEl.appendChild(heightEl);

        const widthEl = this.createElement('Width');
        widthEl.textContent = this.pxToInches(textbox.width);
        textboxEl.appendChild(widthEl);

        const zIndexEl = this.createElement('ZIndex');
        zIndexEl.textContent = index;
        textboxEl.appendChild(zIndexEl);

        const styleEl = this.createElement('Style');
        
        const borderSet = textbox.borderSet || 'all';
        const borderStyleVal = this.getBorderStyle(textbox.borderStyle || 'solid');
        const borderColor = this.formatColor(textbox.borderColor || '#000000');
        const borderSize = (textbox.borderSize || 1) + 'pt';

        if (borderSet === 'none' || borderStyleVal === 'None') {
            const borderEl = this.createElement('Border');
            const styleNode = this.createElement('Style');
            styleNode.textContent = 'None';
            borderEl.appendChild(styleNode);
            styleEl.appendChild(borderEl);
        } else if (borderSet === 'all') {
            const borderEl = this.createElement('Border');
            const colorNode = this.createElement('Color');
            colorNode.textContent = borderColor;
            borderEl.appendChild(colorNode);
            const styleNode = this.createElement('Style');
            styleNode.textContent = borderStyleVal;
            borderEl.appendChild(styleNode);
            const widthNode = this.createElement('Width');
            widthNode.textContent = borderSize;
            borderEl.appendChild(widthNode);
            styleEl.appendChild(borderEl);
        } else { 
            const defaultBorderEl = this.createElement('Border');
            const defaultBorderStyleEl = this.createElement('Style');
            defaultBorderStyleEl.textContent = 'None';
            defaultBorderEl.appendChild(defaultBorderStyleEl);
            styleEl.appendChild(defaultBorderEl);

            const specificBorderName = borderSet.charAt(0).toUpperCase() + borderSet.slice(1) + 'Border';
            const specificBorderEl = this.createElement(specificBorderName);
            const colorNode = this.createElement('Color');
            colorNode.textContent = borderColor;
            specificBorderEl.appendChild(colorNode);
            const styleNode = this.createElement('Style');
            styleNode.textContent = borderStyleVal;
            specificBorderEl.appendChild(styleNode);
            const widthNode = this.createElement('Width');
            widthNode.textContent = borderSize;
            specificBorderEl.appendChild(widthNode);
            styleEl.appendChild(specificBorderEl);
        }
        
        if (textbox.backgroundColor && textbox.backgroundColor !== 'transparent' && textbox.backgroundColor !== '#ffffff') {
            const bgColorEl = this.createElement('BackgroundColor');
            bgColorEl.textContent = this.formatColor(textbox.backgroundColor);
            styleEl.appendChild(bgColorEl);
        }

        const padding = (textbox.padding || 2) + 'pt';
        ['PaddingLeft', 'PaddingRight', 'PaddingTop', 'PaddingBottom'].forEach(side => {
            const paddingEl = this.createElement(side);
            paddingEl.textContent = padding;
            styleEl.appendChild(paddingEl);
        });

        textboxEl.appendChild(styleEl);
        return textboxEl;
    }

    // Export image object
    exportImage(image, index) {
        const imageEl = this.createElement('Image');
        imageEl.setAttribute('Name', `Image${index + 1}`);

        const sourceEl = this.createElement('Source');
        sourceEl.textContent = image.src ? 'Embedded' : 'External';
        imageEl.appendChild(sourceEl);

        if (image.src) {
            const valueEl = this.createElement('Value');
            valueEl.textContent = `EmbeddedImage${index + 1}`;
            imageEl.appendChild(valueEl);
        }

        const sizingEl = this.createElement('Sizing');
        sizingEl.textContent = 'FitProportional';
        imageEl.appendChild(sizingEl);

        // Position and size
        const topEl = this.createElement('Top');
        topEl.textContent = this.pxToInches(image.y);
        imageEl.appendChild(topEl);

        const leftEl = this.createElement('Left');
        leftEl.textContent = this.pxToInches(image.x);
        imageEl.appendChild(leftEl);

        const heightEl = this.createElement('Height');
        heightEl.textContent = this.pxToInches(image.height);
        imageEl.appendChild(heightEl);

        const widthEl = this.createElement('Width');
        widthEl.textContent = this.pxToInches(image.width);
        imageEl.appendChild(widthEl);

        // Style
        const styleEl = this.createElement('Style');
        const borderEl = this.createElement('Border');
        const borderStyleEl = this.createElement('Style');
        borderStyleEl.textContent = this.getBorderStyle(image.borderStyle, image.borderSet);
        borderEl.appendChild(borderStyleEl);
        styleEl.appendChild(borderEl);
        imageEl.appendChild(styleEl);

        return { imageElement: imageEl, imageData: image.src };
    }

    // Export table object
    exportTable(table, index) {
        const tablixEl = this.createElement('Tablix');
        tablixEl.setAttribute('Name', `Table${index + 1}`);

        // TablixBody
        const tablixBodyEl = this.createElement('TablixBody');
        
        // TablixColumns
        const tablixColumnsEl = this.createElement('TablixColumns');
        const columnWidth = table.width / table.columns.length;
        
        table.columns.forEach(() => {
            const tablixColumnEl = this.createElement('TablixColumn');
            const widthEl = this.createElement('Width');
            widthEl.textContent = this.pxToInches(columnWidth);
            tablixColumnEl.appendChild(widthEl);
            tablixColumnsEl.appendChild(tablixColumnEl);
        });
        tablixBodyEl.appendChild(tablixColumnsEl);

        // TablixRows
        const tablixRowsEl = this.createElement('TablixRows');
        const rowHeight = table.height / 2; // Header + 1 data row

        // Header row
        const headerRowEl = this.createElement('TablixRow');
        const headerHeightEl = this.createElement('Height');
        headerHeightEl.textContent = this.pxToInches(rowHeight);
        headerRowEl.appendChild(headerHeightEl);

        const headerCellsEl = this.createElement('TablixCells');
        table.columns.forEach((col, colIndex) => {
            const cellEl = this.createElement('TablixCell');
            const cellContentsEl = this.createElement('CellContents');
            
            const textboxEl = this.createElement('Textbox');
            textboxEl.setAttribute('Name', `Textbox_Table${index}_Header${colIndex}`);
            
            const canGrowEl = this.createElement('CanGrow');
            canGrowEl.textContent = 'true';
            textboxEl.appendChild(canGrowEl);

            const paragraphsEl = this.createElement('Paragraphs');
            const paragraphEl = this.createElement('Paragraph');
            const textRunsEl = this.createElement('TextRuns');
            const textRunEl = this.createElement('TextRun');
            const valueEl = this.createElement('Value');
            valueEl.textContent = col.header;
            textRunEl.appendChild(valueEl);
            
            const styleEl = this.createElement('Style');
            textRunEl.appendChild(styleEl);
            
            textRunsEl.appendChild(textRunEl);
            paragraphEl.appendChild(textRunsEl);
            
            const paraStyleEl = this.createElement('Style');
            paragraphEl.appendChild(paraStyleEl);
            
            paragraphsEl.appendChild(paragraphEl);
            textboxEl.appendChild(paragraphsEl);

            // Textbox style
            const textboxStyleEl = this.createElement('Style');
            const borderEl = this.createElement('Border');
            const borderColorEl = this.createElement('Color');
            borderColorEl.textContent = 'LightGrey';
            borderEl.appendChild(borderColorEl);
            const borderStyleEl = this.createElement('Style');
            borderStyleEl.textContent = 'Solid';
            borderEl.appendChild(borderStyleEl);
            textboxStyleEl.appendChild(borderEl);

            // Padding
            ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
                const paddingEl = this.createElement(`Padding${side}`);
                paddingEl.textContent = '2pt';
                textboxStyleEl.appendChild(paddingEl);
            });

            textboxEl.appendChild(textboxStyleEl);
            cellContentsEl.appendChild(textboxEl);
            cellEl.appendChild(cellContentsEl);
            headerCellsEl.appendChild(cellEl);
        });
        headerRowEl.appendChild(headerCellsEl);
        tablixRowsEl.appendChild(headerRowEl);

        // Data row
        const dataRowEl = this.createElement('TablixRow');
        const dataHeightEl = this.createElement('Height');
        dataHeightEl.textContent = this.pxToInches(rowHeight);
        dataRowEl.appendChild(dataHeightEl);

        const dataCellsEl = this.createElement('TablixCells');
        table.columns.forEach((col, colIndex) => {
            const cellEl = this.createElement('TablixCell');
            const cellContentsEl = this.createElement('CellContents');
            
            const textboxEl = this.createElement('Textbox');
            textboxEl.setAttribute('Name', `Textbox_Table${index}_Data${colIndex}`);
            
            const canGrowEl = this.createElement('CanGrow');
            canGrowEl.textContent = 'true';
            textboxEl.appendChild(canGrowEl);

            const paragraphsEl = this.createElement('Paragraphs');
            const paragraphEl = this.createElement('Paragraph');
            const textRunsEl = this.createElement('TextRuns');
            const textRunEl = this.createElement('TextRun');
            const valueEl = this.createElement('Value');
            valueEl.textContent = `[${col.dataField}]`;
            textRunEl.appendChild(valueEl);
            
            const styleEl = this.createElement('Style');
            textRunEl.appendChild(styleEl);
            
            textRunsEl.appendChild(textRunEl);
            paragraphEl.appendChild(textRunsEl);
            
            const paraStyleEl = this.createElement('Style');
            paragraphEl.appendChild(paraStyleEl);
            
            paragraphsEl.appendChild(paragraphEl);
            textboxEl.appendChild(paragraphsEl);

            // Textbox style
            const textboxStyleEl = this.createElement('Style');
            const borderEl = this.createElement('Border');
            const borderColorEl = this.createElement('Color');
            borderColorEl.textContent = 'LightGrey';
            borderEl.appendChild(borderColorEl);
            const borderStyleEl = this.createElement('Style');
            borderStyleEl.textContent = 'Solid';
            borderEl.appendChild(borderStyleEl);
            textboxStyleEl.appendChild(borderEl);

            // Padding
            ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
                const paddingEl = this.createElement(`Padding${side}`);
                paddingEl.textContent = '2pt';
                textboxStyleEl.appendChild(paddingEl);
            });

            textboxEl.appendChild(textboxStyleEl);
            cellContentsEl.appendChild(textboxEl);
            cellEl.appendChild(cellContentsEl);
            dataCellsEl.appendChild(cellEl);
        });
        dataRowEl.appendChild(dataCellsEl);
        tablixRowsEl.appendChild(dataRowEl);

        tablixBodyEl.appendChild(tablixRowsEl);
        tablixEl.appendChild(tablixBodyEl);

        // TablixColumnHierarchy
        const tablixColumnHierarchyEl = this.createElement('TablixColumnHierarchy');
        const tablixMembersEl = this.createElement('TablixMembers');
        table.columns.forEach(() => {
            const tablixMemberEl = this.createElement('TablixMember');
            tablixMembersEl.appendChild(tablixMemberEl);
        });
        tablixColumnHierarchyEl.appendChild(tablixMembersEl);
        tablixEl.appendChild(tablixColumnHierarchyEl);

        // TablixRowHierarchy
        const tablixRowHierarchyEl = this.createElement('TablixRowHierarchy');
        const tablixRowMembersEl = this.createElement('TablixMembers');
        
        // Header member
        const headerMemberEl = this.createElement('TablixMember');
        const keepWithGroupEl = this.createElement('KeepWithGroup');
        keepWithGroupEl.textContent = 'After';
        headerMemberEl.appendChild(keepWithGroupEl);
        tablixRowMembersEl.appendChild(headerMemberEl);

        // Data member
        const dataMemberEl = this.createElement('TablixMember');
        const groupEl = this.createElement('Group');
        groupEl.setAttribute('Name', 'Details');
        dataMemberEl.appendChild(groupEl);
        tablixRowMembersEl.appendChild(dataMemberEl);

        tablixRowHierarchyEl.appendChild(tablixRowMembersEl);
        tablixEl.appendChild(tablixRowHierarchyEl);

        // Position and size
        const topEl = this.createElement('Top');
        topEl.textContent = this.pxToInches(table.y);
        tablixEl.appendChild(topEl);

        const leftEl = this.createElement('Left');
        leftEl.textContent = this.pxToInches(table.x);
        tablixEl.appendChild(leftEl);

        const heightEl = this.createElement('Height');
        heightEl.textContent = this.pxToInches(table.height);
        tablixEl.appendChild(heightEl);

        const widthEl = this.createElement('Width');
        widthEl.textContent = this.pxToInches(table.width);
        tablixEl.appendChild(widthEl);

        const zIndexEl = this.createElement('ZIndex');
        zIndexEl.textContent = index + 1;
        tablixEl.appendChild(zIndexEl);

        // Style
        const styleEl = this.createElement('Style');
        const borderEl = this.createElement('Border');
        const borderStyleEl = this.createElement('Style');
        borderStyleEl.textContent = 'None';
        borderEl.appendChild(borderStyleEl);
        styleEl.appendChild(borderEl);
        tablixEl.appendChild(styleEl);

        return tablixEl;
    }

    // Export line object
    exportLine(line, index) {
        const lineEl = this.createElement('Line');
        lineEl.setAttribute('Name', `Line${index + 1}`);

        // Position and size
        const topEl = this.createElement('Top');
        topEl.textContent = this.pxToInches(line.y);
        lineEl.appendChild(topEl);

        const leftEl = this.createElement('Left');
        leftEl.textContent = this.pxToInches(line.x);
        lineEl.appendChild(leftEl);

        const heightEl = this.createElement('Height');
        heightEl.textContent = this.pxToInches(line.height);
        lineEl.appendChild(heightEl);

        const widthEl = this.createElement('Width');
        widthEl.textContent = this.pxToInches(line.width);
        lineEl.appendChild(widthEl);

        const zIndexEl = this.createElement('ZIndex');
        zIndexEl.textContent = index + 1;
        lineEl.appendChild(zIndexEl);

        // Style
        const styleEl = this.createElement('Style');
        const borderEl = this.createElement('Border');
        
        const borderColorEl = this.createElement('Color');
        borderColorEl.textContent = this.formatColor(line.borderColor);
        borderEl.appendChild(borderColorEl);

        const borderStyleEl = this.createElement('Style');
        borderStyleEl.textContent = this.getBorderStyle(line.borderStyle, line.borderSet);
        borderEl.appendChild(borderStyleEl);

        const borderWidthEl = this.createElement('Width');
        borderWidthEl.textContent = line.borderSize + 'pt';
        borderEl.appendChild(borderWidthEl);

        styleEl.appendChild(borderEl);
        lineEl.appendChild(styleEl);

        return lineEl;
    }

    // Main export function
    export() {
        const doc = document.implementation.createDocument(this.namespaceURI, 'Report', null);
        const root = doc.documentElement;
        
        // Add namespaces
        root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:rd', this.rdNamespaceURI);
        root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:cl', 'http://schemas.microsoft.com/sqlserver/reporting/2010/01/componentdefinition');

        // AutoRefresh
        const autoRefreshEl = this.createElement('AutoRefresh');
        autoRefreshEl.textContent = '0';
        root.appendChild(autoRefreshEl);

        // DataSources (placeholder)
        const dataSourcesEl = this.createElement('DataSources');
        const dataSourceEl = this.createElement('DataSource');
        dataSourceEl.setAttribute('Name', 'DataSource1');
        const connectionPropsEl = this.createElement('ConnectionProperties');
        const dataProviderEl = this.createElement('DataProvider');
        dataProviderEl.textContent = 'SQL';
        connectionPropsEl.appendChild(dataProviderEl);
        const connectStringEl = this.createElement('ConnectString');
        connectStringEl.textContent = '""';
        connectionPropsEl.appendChild(connectStringEl);
        dataSourceEl.appendChild(connectionPropsEl);
        dataSourcesEl.appendChild(dataSourceEl);
        root.appendChild(dataSourcesEl);

        // DataSets (placeholder)
        const dataSetsEl = this.createElement('DataSets');
        const dataSetEl = this.createElement('DataSet');
        dataSetEl.setAttribute('Name', 'DataSet1');
        const queryEl = this.createElement('Query');
        const dsNameEl = this.createElement('DataSourceName');
        dsNameEl.textContent = 'DataSource1';
        queryEl.appendChild(dsNameEl);
        const commandTextEl = this.createElement('CommandText');
        commandTextEl.textContent = 'SELECT 1';
        queryEl.appendChild(commandTextEl);
        dataSetEl.appendChild(queryEl);
        dataSetsEl.appendChild(dataSetEl);
        root.appendChild(dataSetsEl);

        // ReportSections
        const reportSectionsEl = this.createElement('ReportSections');
        const reportSectionEl = this.createElement('ReportSection');
        const bodyEl = this.createElement('Body');
        const reportItemsEl = this.createElement('ReportItems');

        // Export objects
        const embeddedImages = [];
        let objectIndex = 0;

        this.designer.objects.forEach((obj, index) => {
            switch (obj.type) {
                case 'textbox':
                    reportItemsEl.appendChild(this.exportTextbox(obj, objectIndex++));
                    break;
                case 'image':
                    const { imageElement, imageData } = this.exportImage(obj, objectIndex++);
                    reportItemsEl.appendChild(imageElement);
                    if (imageData) {
                        embeddedImages.push({
                            name: `EmbeddedImage${embeddedImages.length + 1}`,
                            data: imageData
                        });
                    }
                    break;
                case 'table':
                    reportItemsEl.appendChild(this.exportTable(obj, objectIndex++));
                    break;
                case 'line':
                    reportItemsEl.appendChild(this.exportLine(obj, objectIndex++));
                    break;
            }
        });

        bodyEl.appendChild(reportItemsEl);

        // Body height
        const bodyHeightEl = this.createElement('Height');
        const pageHeight = this.designer.paper.classList.contains('a4-landscape') || 
                           this.designer.paper.classList.contains('a5-landscape') ? 
                           this.designer.paper.offsetHeight : this.designer.paper.offsetHeight;
        bodyHeightEl.textContent = this.pxToInches(pageHeight);
        bodyEl.appendChild(bodyHeightEl);

        const bodyStyleEl = this.createElement('Style');
        bodyEl.appendChild(bodyStyleEl);

        reportSectionEl.appendChild(bodyEl);

        // Page settings
        const pageWidth = this.designer.paper.offsetWidth;
        //const pageHeight = this.designer.paper.offsetHeight;

        const widthEl = this.createElement('Width');
        widthEl.textContent = this.pxToInches(pageWidth);
        reportSectionEl.appendChild(widthEl);

        const pageEl = this.createElement('Page');
        const pageHeightEl = this.createElement('PageHeight');
        pageHeightEl.textContent = this.pxToInches(pageHeight);
        pageEl.appendChild(pageHeightEl);

        const pageWidthEl = this.createElement('PageWidth');
        pageWidthEl.textContent = this.pxToInches(pageWidth);
        pageEl.appendChild(pageWidthEl);

        // Margins
        ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
            const marginEl = this.createElement(`${side}Margin`);
            marginEl.textContent = '0.5in';
            pageEl.appendChild(marginEl);
        });

        const pageStyleEl = this.createElement('Style');
        pageEl.appendChild(pageStyleEl);

        reportSectionEl.appendChild(pageEl);
        reportSectionsEl.appendChild(reportSectionEl);
        root.appendChild(reportSectionsEl);

        // Embedded images
        if (embeddedImages.length > 0) {
            const embeddedImagesEl = this.createElement('EmbeddedImages');
            embeddedImages.forEach(img => {
                const embeddedImageEl = this.createElement('EmbeddedImage');
                embeddedImageEl.setAttribute('Name', img.name);
                
                const mimeTypeEl = this.createElement('MIMEType');
                mimeTypeEl.textContent = img.data.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
                embeddedImageEl.appendChild(mimeTypeEl);

                const imageDataEl = this.createElement('ImageData');
                imageDataEl.textContent = img.data.split(',')[1]; // Remove data URL prefix
                embeddedImageEl.appendChild(imageDataEl);

                embeddedImagesEl.appendChild(embeddedImageEl);
            });
            root.appendChild(embeddedImagesEl);
        }

        // Report properties
        const rdReportUnitTypeEl = doc.createElementNS(this.rdNamespaceURI, 'rd:ReportUnitType');
        rdReportUnitTypeEl.textContent = 'Inch';
        root.appendChild(rdReportUnitTypeEl);

        const rdReportIDEl = doc.createElementNS(this.rdNamespaceURI, 'rd:ReportID');
        rdReportIDEl.textContent = this.generateGUID();
        root.appendChild(rdReportIDEl);

        // Serialize to string
        const serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(doc);
        
        // Format XML with proper indentation
        xmlString = this.formatXml(xmlString);
        
        return xmlString;
    }

    // Generate GUID
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Format XML with indentation
    formatXml(xml) {
        const PADDING = '  ';
        const reg = /(>)(<)(\/*)/g;
        let formatted = '';
        let pad = 0;

        xml = xml.replace(reg, '$1\r\n$2$3');
        xml.split('\r\n').forEach(node => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            formatted += PADDING.repeat(pad) + node + '\r\n';
            pad += indent;
        });

        return '<?xml version="1.0" encoding="utf-8"?>\r\n' + formatted.trim();
    }
}



// Integration with Report Designer
document.addEventListener('DOMContentLoaded', () => {
    // Export button handler
    document.getElementById('exportXmlBtn').addEventListener('click', () => {
        if (typeof reportDesigner === 'undefined') {
            alert('Report Designer not initialized');
            return;
        }
        
        const exporter = new RDLCExporter(reportDesigner);
        const xmlString = exporter.export();
        
        // Download XML file
        const blob = new Blob([xmlString], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.rdlc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Import button handler
    document.getElementById('importXmlBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    
    // Import file handler
    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (typeof reportDesigner === 'undefined') {
            alert('Report Designer not initialized');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importer = new RDLCImporter(reportDesigner);
                importer.import(event.target.result);
                alert('Report imported successfully!');
            } catch (error) {
                alert('Error importing report: ' + error.message);
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
        
        // Clear file input for next import
        e.target.value = '';
    });
});