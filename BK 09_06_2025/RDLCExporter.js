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
        const namedColorMap = { 'black': '#000000', 'white': '#ffffff', 'red': '#ff0000', 'green': '#008000', 'blue': '#0000ff', 'yellow': '#ffff00' };
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
                    if (currentParagraph.textRuns.length > 0 || (node.tagName === 'BR' && paragraphs.length > 0)) {
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


    // NEW INTERNAL FUNCTION: Creates the <DataSources> and <DataSets> elements
    _createDataSourcesAndSetsElements(doc) {
        const fragment = doc.createDocumentFragment();

        if (this.designer.datasets.length > 0) {
            // --- DataSources ---
            const dataSourcesEl = this.createElement('DataSources');
            const dataSourceEl = this.createElement('DataSource');
            // Use a convention for the data source name based on the first dataset
            const dsName = "Report_DataSet";//this.datasets[0].name + "_DS"; 
            dataSourceEl.setAttribute('Name', dsName);

            const connPropsEl = this.createElement('ConnectionProperties');
            connPropsEl.appendChild(this.createElement('DataProvider')).textContent = 'System.Data.DataSet';
            connPropsEl.appendChild(this.createElement('ConnectString')).textContent = '/* Local Connection */';
            dataSourceEl.appendChild(connPropsEl);
            dataSourceEl.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:DataSourceID')).textContent = this.generateGUID();
            dataSourcesEl.appendChild(dataSourceEl);
            fragment.appendChild(dataSourcesEl);

            // --- DataSets ---
            const dataSetsEl = this.createElement('DataSets');
            this.designer.datasets.forEach(ds => {
                const dataSetEl = this.createElement('DataSet');
                dataSetEl.setAttribute('Name', ds.name);

                const queryEl = this.createElement('Query');
                queryEl.appendChild(this.createElement('DataSourceName')).textContent = dsName;
                queryEl.appendChild(this.createElement('CommandText')).textContent = '/* Local Query */';
                dataSetEl.appendChild(queryEl);

                const fieldsEl = this.createElement('Fields');
                ds.fields.forEach(field => {
                    const fieldEl = this.createElement('Field');
                    fieldEl.setAttribute('Name', field.name);
                    fieldEl.appendChild(this.createElement('DataField')).textContent = field.name;
                    fieldEl.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:TypeName')).textContent = field.type || 'System.String';
                    fieldsEl.appendChild(fieldEl);
                });
                dataSetEl.appendChild(fieldsEl);
                dataSetsEl.appendChild(dataSetEl);
            });
            fragment.appendChild(dataSetsEl);
        }
        return fragment;
    }

    // NEW INTERNAL FUNCTION: Creates the <ReportParameters> element
    _createParametersElement() {

        if (this.designer.parameters.length === 0) return null;

        const reportParametersEl = this.createElement('ReportParameters');
        this.designer.parameters.forEach(param => {
            const paramEl = this.createElement('ReportParameter');
            paramEl.setAttribute('Name', param.name);

            paramEl.appendChild(this.createElement('DataType')).textContent = param.type || 'String';
            if (param.nullable) paramEl.appendChild(this.createElement('Nullable')).textContent = 'true';
            if (param.allowBlank) paramEl.appendChild(this.createElement('AllowBlank')).textContent = 'true';
            if (param.prompt) paramEl.appendChild(this.createElement('Prompt')).textContent = param.prompt;

            reportParametersEl.appendChild(paramEl);
        });
        return reportParametersEl;
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

                if (styleAdded || Object.keys(run.style).length > 0) { // Check if style object is not empty
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

        if (textbox.zIndex > 0) {
            const zIndexEl = this.createElement('ZIndex');
            zIndexEl.textContent = textbox.zIndex;
            textboxEl.appendChild(zIndexEl);
        }

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


        if (textbox.verticalAlign && textbox.verticalAlign !== 'top') {
            const vAlignEl = this.createElement('VerticalAlign');
            vAlignEl.textContent = textbox.verticalAlign.charAt(0).toUpperCase() + textbox.verticalAlign.slice(1);
            styleEl.appendChild(vAlignEl);
        }
        if (textbox.textDirection) {
            const directionEl = this.createElement('Direction');
            directionEl.textContent = textbox.textDirection.toUpperCase();
            styleEl.appendChild(directionEl);
        }

        // const padding = (textbox.padding || 2) + 'pt';
        // ['PaddingLeft', 'PaddingRight', 'PaddingTop', 'PaddingBottom'].forEach(side => {
        //     const paddingEl = this.createElement(side);
        //     paddingEl.textContent = padding;
        //     styleEl.appendChild(paddingEl);
        // });

        const paddingInPx = textbox.padding !== undefined ? textbox.padding : 2;
        // Convert the pixel value to points (1px = 0.75pt)
        const paddingInPt = paddingInPx * 0.75;
        // Format as a string with "pt" unit for the RDLC file
        const paddingString = paddingInPt.toFixed(2) + 'pt';
        ['PaddingLeft', 'PaddingRight', 'PaddingTop', 'PaddingBottom'].forEach(side => {
            const paddingEl = this.createElement(side);
            paddingEl.textContent = paddingString;
            styleEl.appendChild(paddingEl);
        });


        textboxEl.appendChild(styleEl);
        return textboxEl;
    }

    // Export image object
    exportImage(image, index, image_index) {
        const imageEl = this.createElement('Image');
        imageEl.setAttribute('Name', `Image${index + 1}`);

        const sourceEl = this.createElement('Source');
        sourceEl.textContent = image.src ? 'Embedded' : 'External';
        imageEl.appendChild(sourceEl);

        //if (image.src) {
        const valueEl = this.createElement('Value');
        valueEl.textContent = image.src ? `EmbeddedImage${image_index + 1}` : ``;
        imageEl.appendChild(valueEl);
        //}

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

        // MODIFIED: Add ZIndex for Image
        if (image.zIndex > 0) {
            const zIndexEl = this.createElement('ZIndex');
            zIndexEl.textContent = image.zIndex;
            imageEl.appendChild(zIndexEl);
        }


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
    // =================================================================
    // ========= UPDATED TABLE EXPORT FUNCTION =========================
    // =================================================================
    exportTable(table, index) {
        const tablixEl = this.createElement('Tablix');
        tablixEl.setAttribute('Name', `Table${index + 1}`);
        let textboxCounter = 0;

        // --- TablixBody ---
        const tablixBodyEl = this.createElement('TablixBody');

        // --- TablixColumns ---
        const tablixColumnsEl = this.createElement('TablixColumns');
        if (table.columnWidths && table.columnWidths.length > 0) {
            table.columnWidths.forEach(colWidthPercent => {
                const tablixColumnEl = this.createElement('TablixColumn');
                const widthEl = this.createElement('Width');
                // Calculate actual column width from percentage and convert to inches
                const actualColWidth = (table.width * colWidthPercent) / 100;
                widthEl.textContent = this.pxToInches(actualColWidth);
                tablixColumnEl.appendChild(widthEl);
                tablixColumnsEl.appendChild(tablixColumnEl);
            });
        }
        tablixBodyEl.appendChild(tablixColumnsEl);

        // --- TablixRows ---
        const tablixRowsEl = this.createElement('TablixRows');
        if (table.rows && table.rows.length > 0) {
            table.rows.forEach((rowModel, rowIndex) => {
                const tablixRowEl = this.createElement('TablixRow');

                // Set Row Height
                const heightEl = this.createElement('Height');
                const rowHeight = table.rowHeights[rowIndex] || 40; // Fallback height
                heightEl.textContent = this.pxToInches(rowHeight);
                tablixRowEl.appendChild(heightEl);

                // Set Row Cells
                const tablixCellsEl = this.createElement('TablixCells');
                rowModel.cells.forEach(cellTextbox => {
                    const tablixCellEl = this.createElement('TablixCell');
                    const cellContentsEl = this.createElement('CellContents');

                    // Create Textbox for the cell
                    const textboxEl = this.createElement('Textbox');
                    textboxEl.setAttribute('Name', `Textbox_Table${index}_${textboxCounter++}`);

                    textboxEl.appendChild(this.createElement('CanGrow')).textContent = 'true';
                    textboxEl.appendChild(this.createElement('KeepTogether')).textContent = 'true';

                    // --- Paragraphs and TextRuns from cell's textbox object ---
                    const baseStyle = {
                        fontFamily: cellTextbox.fontFamily,
                        fontSize: cellTextbox.fontSize + 'pt',
                        color: this.formatColor(cellTextbox.foreColor)
                    };
                    const paragraphsEl = this.createElement('Paragraphs');
                    const paragraphs = this.parseHtmlToTextRuns(cellTextbox.text, baseStyle);



                    if (paragraphs.length === 0) {
                        // If there's no text, create a default empty paragraph structure to make the RDLC valid.
                        const paragraphEl = this.createElement('Paragraph');
                        const textRunsEl = this.createElement('TextRuns');
                        const textRunEl = this.createElement('TextRun');

                        // An empty Value tag is required
                        const valueEl = this.createElement('Value');
                        valueEl.textContent = '';
                        textRunEl.appendChild(valueEl);

                        // An empty Style tag is also good practice
                        textRunEl.appendChild(this.createElement('Style'));

                        textRunsEl.appendChild(textRunEl);
                        paragraphEl.appendChild(textRunsEl);

                        // Add paragraph-level style, even if empty
                        const paraStyleEl = this.createElement('Style');
                        if (cellTextbox.textAlign) paraStyleEl.appendChild(this.createElement('TextAlign')).textContent = cellTextbox.textAlign.charAt(0).toUpperCase() + cellTextbox.textAlign.slice(1);
                        paragraphEl.appendChild(paraStyleEl);

                        paragraphsEl.appendChild(paragraphEl);
                    } else {


                        paragraphs.forEach(para => {
                            const paragraphEl = this.createElement('Paragraph');
                            const textRunsEl = this.createElement('TextRuns');
                            para.textRuns.forEach(run => {
                                if (!run.value) return;
                                const textRunEl = this.createElement('TextRun');
                                textRunEl.appendChild(this.createElement('Value')).textContent = run.value;
                                const styleEl = this.createElement('Style');
                                if (run.style.fontWeight) styleEl.appendChild(this.createElement('FontWeight')).textContent = run.style.fontWeight;
                                if (run.style.fontStyle) styleEl.appendChild(this.createElement('FontStyle')).textContent = run.style.fontStyle;
                                if (run.style.textDecoration) styleEl.appendChild(this.createElement('TextDecoration')).textContent = run.style.textDecoration;
                                if (run.style.fontSize) styleEl.appendChild(this.createElement('FontSize')).textContent = run.style.fontSize;
                                if (run.style.fontFamily) styleEl.appendChild(this.createElement('FontFamily')).textContent = run.style.fontFamily;
                                if (run.style.color && run.style.color !== baseStyle.color) styleEl.appendChild(this.createElement('Color')).textContent = run.style.color;
                                textRunEl.appendChild(styleEl);
                                textRunsEl.appendChild(textRunEl);
                            });
                            paragraphEl.appendChild(textRunsEl);

                            // Paragraph-level styling
                            const paraStyleEl = this.createElement('Style');
                            if (cellTextbox.textAlign) paraStyleEl.appendChild(this.createElement('TextAlign')).textContent = cellTextbox.textAlign.charAt(0).toUpperCase() + cellTextbox.textAlign.slice(1);
                            paragraphEl.appendChild(paraStyleEl);

                            paragraphsEl.appendChild(paragraphEl);
                        });
                    }
                    textboxEl.appendChild(paragraphsEl);

                    // --- Textbox Style (Border, Padding, etc.) ---
                    const textboxStyleEl = this.createElement('Style');
                    const borderEl = this.createElement('Border');
                    borderEl.appendChild(this.createElement('Color')).textContent = this.formatColor(cellTextbox.borderColor || 'LightGrey');
                    borderEl.appendChild(this.createElement('Style')).textContent = this.getBorderStyle(cellTextbox.borderStyle || 'Solid');
                    textboxStyleEl.appendChild(borderEl);

                    if (cellTextbox.backgroundColor && cellTextbox.backgroundColor !== 'transparent') {
                        textboxStyleEl.appendChild(this.createElement('BackgroundColor')).textContent = this.formatColor(cellTextbox.backgroundColor);
                    }
                    if (cellTextbox.verticalAlign) {
                        textboxStyleEl.appendChild(this.createElement('VerticalAlign')).textContent = cellTextbox.verticalAlign.charAt(0).toUpperCase() + cellTextbox.verticalAlign.slice(1);
                    }

                    ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
                        const paddingEl = this.createElement(`Padding${side}`);
                        paddingEl.textContent = (cellTextbox.padding || 2) + 'pt';
                        textboxStyleEl.appendChild(paddingEl);
                    });

                    textboxEl.appendChild(textboxStyleEl);

                    // Append textbox to cell
                    cellContentsEl.appendChild(textboxEl);
                    tablixCellEl.appendChild(cellContentsEl);
                    tablixCellsEl.appendChild(tablixCellEl);
                });

                tablixRowEl.appendChild(tablixCellsEl);
                tablixRowsEl.appendChild(tablixRowEl);
            });
        }
        tablixBodyEl.appendChild(tablixRowsEl);
        tablixEl.appendChild(tablixBodyEl);

        // --- TablixColumnHierarchy ---
        const tablixColumnHierarchyEl = this.createElement('TablixColumnHierarchy');
        const colMembersEl = this.createElement('TablixMembers');
        if (table.columnWidths && table.columnWidths.length > 0) {
            table.columnWidths.forEach(() => {
                colMembersEl.appendChild(this.createElement('TablixMember'));
            });
        }
        tablixColumnHierarchyEl.appendChild(colMembersEl);
        tablixEl.appendChild(tablixColumnHierarchyEl);

        // --- TablixRowHierarchy ---
        const tablixRowHierarchyEl = this.createElement('TablixRowHierarchy');
        const rowMembersEl = this.createElement('TablixMembers');
        if (table.rows && table.rows.length > 0) {
            table.rows.forEach(rowModel => {
                const tablixMemberEl = this.createElement('TablixMember');
                if (rowModel.type === 'header') {
                    tablixMemberEl.appendChild(this.createElement('KeepWithGroup')).textContent = 'After';
                    tablixMemberEl.appendChild(this.createElement('RepeatOnNewPage')).textContent = 'true';
                } else {
                    // For simplicity, we create a detail group for the first data row
                    // and simple members for subsequent ones, though RDLC would often group all data rows.
                    if (!rowMembersEl.querySelector('Group')) {
                        const groupEl = this.createElement('Group');
                        groupEl.setAttribute('Name', 'Details');
                        tablixMemberEl.appendChild(groupEl);
                    }
                }
                rowMembersEl.appendChild(tablixMemberEl);
            });
        }
        tablixRowHierarchyEl.appendChild(rowMembersEl);
        tablixEl.appendChild(tablixRowHierarchyEl);

        // --- Position and size of the entire table ---
        tablixEl.appendChild(this.createElement('Top')).textContent = this.pxToInches(table.y);
        tablixEl.appendChild(this.createElement('Left')).textContent = this.pxToInches(table.x);
        tablixEl.appendChild(this.createElement('Height')).textContent = this.pxToInches(table.height);
        tablixEl.appendChild(this.createElement('Width')).textContent = this.pxToInches(table.width);

        //  tablixEl.appendChild(this.createElement('ZIndex')).textContent = index + 1;

        // MODIFIED: Use the stored zIndex property for the table
        if (table.zIndex > 0) {
            const zIndexEl = this.createElement('ZIndex');
            zIndexEl.textContent = table.zIndex;
            tablixEl.appendChild(zIndexEl);
        }

        // --- Overall Tablix Style ---
        const styleEl = this.createElement('Style');

        // **FIX STARTS HERE**: Read border properties from the table object
        const borderSet = table.borderSet || 'all';
        const borderStyleVal = this.getBorderStyle(table.borderStyle || 'solid');
        const borderColor = this.formatColor(table.borderColor || '#000000');
        const borderSize = (table.borderSize || 1) + 'pt';

        if (borderSet === 'none' || borderStyleVal === 'None') {
            const borderEl = this.createElement('Border');
            borderEl.appendChild(this.createElement('Style')).textContent = 'None';
            styleEl.appendChild(borderEl);
        } else { // Handles 'all' and individual sides if ever needed for the main tablix
            const borderEl = this.createElement('Border');
            borderEl.appendChild(this.createElement('Color')).textContent = borderColor;
            borderEl.appendChild(this.createElement('Style')).textContent = borderStyleVal;
            borderEl.appendChild(this.createElement('Width')).textContent = borderSize;
            styleEl.appendChild(borderEl);
        }
        // **FIX ENDS HERE**

        tablixEl.appendChild(styleEl);

        return tablixEl;
    }

    // Export line object
    // FIX 1: Correctly export straight lines
    exportLine(line, index) {
        const lineEl = this.createElement('Line');
        lineEl.setAttribute('Name', `Line${index}`);

        lineEl.appendChild(this.createElement('Top')).textContent = this.pxToInches(line.y);
        lineEl.appendChild(this.createElement('Left')).textContent = this.pxToInches(line.x);

        const heightEl = this.createElement('Height');
        const widthEl = this.createElement('Width');

        // MODIFIED: Use the stored zIndex property for the line
        // if (line.zIndex > 0) {
        //     const zIndexEl = this.createElement('ZIndex');
        //     zIndexEl.textContent = line.zIndex;
        //     lineEl.appendChild(zIndexEl);
        // }

        // Ensure lines are perfectly horizontal or vertical by setting one dimension to zero
        if (line.width > line.height) { // Assumed horizontal line
            heightEl.textContent = '0in';
            widthEl.textContent = this.pxToInches(line.width);
        } else { // Assumed vertical line
            heightEl.textContent = this.pxToInches(line.height);
            widthEl.textContent = '0in';
        }
        lineEl.appendChild(heightEl);
        lineEl.appendChild(widthEl);

        lineEl.appendChild(this.createElement('ZIndex')).textContent = index;

        const styleEl = this.createElement('Style');
        const borderEl = this.createElement('Border');

        borderEl.appendChild(this.createElement('Color')).textContent = this.formatColor(line.borderColor || '#000000');
        borderEl.appendChild(this.createElement('Style')).textContent = this.getBorderStyle(line.borderStyle || 'solid');

        // The line's thickness is its border width
        borderEl.appendChild(this.createElement('Width')).textContent = (line.borderSize || 1) + 'pt';

        styleEl.appendChild(borderEl);
        lineEl.appendChild(styleEl);

        return lineEl;
    }

    // Main export function - CORRECTED
    export() {
        const doc = document.implementation.createDocument(this.namespaceURI, 'Report', null);
        const root = doc.documentElement;

        root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:rd', this.rdNamespaceURI);
        root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:cl', 'http://schemas.microsoft.com/sqlserver/reporting/2010/01/componentdefinition');

        root.appendChild(this.createElement('AutoRefresh')).textContent = '0';

        const dataElements = this._createDataSourcesAndSetsElements(doc);
        if (dataElements) root.appendChild(dataElements);

        const reportSectionsEl = this.createElement('ReportSections');
        const reportSectionEl = this.createElement('ReportSection');
        const bodyEl = this.createElement('Body');

        // --- FIX IS HERE ---
        if (this.designer.objects.length > 0) {
            const reportItemsEl = this.createElement('ReportItems');
            const embeddedImages = [];
            let objectIndex = 0;

            this.designer.objects.forEach((obj) => {
                // UNCOMMENTED AND CORRECTED a switch to handle all object types
                switch (obj.type) {
                    case 'textbox':
                        reportItemsEl.appendChild(this.exportTextbox(obj, objectIndex++));
                        break;
                    case 'image':
                        const { imageElement, imageData } = this.exportImage(obj, objectIndex++, embeddedImages.length);
                        reportItemsEl.appendChild(imageElement);
                        if (imageData) {
                            const imageName = `EmbeddedImage${embeddedImages.length + 1}`;
                            // Update the image element's value to match the generated name
                            const valueNode = imageElement.querySelector('Value');
                            if (valueNode) valueNode.textContent = imageName;

                            embeddedImages.push({ name: imageName, data: imageData });
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

            if (embeddedImages.length > 0) {
                const embeddedImagesEl = this.createElement('EmbeddedImages');
                embeddedImages.forEach(img => {
                    const embeddedImageEl = this.createElement('EmbeddedImage');
                    embeddedImageEl.setAttribute('Name', img.name);
                    const mime = img.data.substring(img.data.indexOf(':') + 1, img.data.indexOf(';'));
                    embeddedImageEl.appendChild(this.createElement('MIMEType')).textContent = mime;
                    embeddedImageEl.appendChild(this.createElement('ImageData')).textContent = img.data.split(',')[1];
                    embeddedImagesEl.appendChild(embeddedImageEl);
                });
                root.appendChild(embeddedImagesEl);
            }
        }

        const pageHeightPx = this.designer.paper.offsetHeight;
        const pageWidthPx = this.designer.paper.offsetWidth;
        bodyEl.appendChild(this.createElement('Height')).textContent = this.pxToInches(pageHeightPx);
        bodyEl.appendChild(this.createElement('Style'));
        reportSectionEl.appendChild(bodyEl);
        reportSectionEl.appendChild(this.createElement('Width')).textContent = this.pxToInches(pageWidthPx);

        const pageEl = this.createElement('Page');
        pageEl.appendChild(this.createElement('PageHeight')).textContent = this.pxToInches(pageHeightPx);
        pageEl.appendChild(this.createElement('PageWidth')).textContent = this.pxToInches(pageWidthPx);
        ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
            pageEl.appendChild(this.createElement(`${side}Margin`)).textContent = '0.5in';
        });
        pageEl.appendChild(this.createElement('Style'));
        reportSectionEl.appendChild(pageEl);
        reportSectionsEl.appendChild(reportSectionEl);
        root.appendChild(reportSectionsEl);

        const parametersEl = this._createParametersElement();
        if (parametersEl) root.appendChild(parametersEl);

        root.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:ReportUnitType')).textContent = 'Inch';
        root.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:ReportID')).textContent = this.generateGUID();

        const serializer = new XMLSerializer();
        let xmlString = serializer.serializeToString(doc);
        return this.formatXml(xmlString);
    }

    // Main export function - MODIFIED
    // export() {
    //     const doc = document.implementation.createDocument(this.namespaceURI, 'Report', null);
    //     const root = doc.documentElement;

    //     root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:rd', this.rdNamespaceURI);
    //     root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:cl', 'http://schemas.microsoft.com/sqlserver/reporting/2010/01/componentdefinition');

    //     root.appendChild(this.createElement('AutoRefresh')).textContent = '0';

    //     // MODIFIED: Call helper to create DataSources and DataSets
    //     const dataElements = this._createDataSourcesAndSetsElements(doc);
    //     if (dataElements) {
    //         root.appendChild(dataElements);
    //     }

    //     // --- ReportSections (Body, Page, etc.) ---
    //     const reportSectionsEl = this.createElement('ReportSections');
    //     const reportSectionEl = this.createElement('ReportSection');
    //     const bodyEl = this.createElement('Body');
    //     const reportItemsEl = this.createElement('ReportItems');

    //     const embeddedImages = [];
    //     let objectIndex = 0;
    //     this.designer.objects.forEach((obj, index) => {
    //         switch (obj.type) {
    //             case 'textbox':
    //                 reportItemsEl.appendChild(this.exportTextbox(obj, objectIndex++));
    //                 break;
    //             case 'image':
    //                 const { imageElement, imageData } = this.exportImage(obj, objectIndex++, embeddedImages.length);
    //                  reportItemsEl.appendChild(imageElement);
    //                 if (imageData) embeddedImages.push({ name: `EmbeddedImage${embeddedImages.length + 1}`, data: imageData });
    //                 break;
    //             case 'table':
    //                 reportItemsEl.appendChild(this.exportTable(obj, objectIndex++));
    //                 break;
    //             case 'line':
    //                reportItemsEl.appendChild(this.exportLine(obj, objectIndex++));
    //                 break;
    //         }
    //     });
    //     bodyEl.appendChild(reportItemsEl);
    //     const pageHeightPx = this.designer.paper.offsetHeight;
    //     const pageWidthPx = this.designer.paper.offsetWidth;
    //     bodyEl.appendChild(this.createElement('Height')).textContent = this.pxToInches(pageHeightPx);
    //     bodyEl.appendChild(this.createElement('Style'));
    //     reportSectionEl.appendChild(bodyEl);
    //     reportSectionEl.appendChild(this.createElement('Width')).textContent = this.pxToInches(pageWidthPx);
    //     const pageEl = this.createElement('Page');
    //     pageEl.appendChild(this.createElement('PageHeight')).textContent = this.pxToInches(pageHeightPx);
    //     pageEl.appendChild(this.createElement('PageWidth')).textContent = this.pxToInches(pageWidthPx);
    //     ['Left', 'Right', 'Top', 'Bottom'].forEach(side => {
    //         pageEl.appendChild(this.createElement(`${side}Margin`)).textContent = '0.5in';
    //     });
    //     pageEl.appendChild(this.createElement('Style'));
    //     reportSectionEl.appendChild(pageEl);
    //     reportSectionsEl.appendChild(reportSectionEl);
    //     root.appendChild(reportSectionsEl);

    //     // MODIFIED: Call helper to create ReportParameters
    //     const parametersEl = this._createParametersElement();
    //     if (parametersEl) {
    //         root.appendChild(parametersEl);
    //     }

    //     // --- EmbeddedImages and final properties ---
    //     if (embeddedImages.length > 0) {
    //         const embeddedImagesEl = this.createElement('EmbeddedImages');
    //         // ... image processing logic ...
    //         root.appendChild(embeddedImagesEl);
    //     }
    //     root.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:ReportUnitType')).textContent = 'Inch';
    //     root.appendChild(doc.createElementNS(this.rdNamespaceURI, 'rd:ReportID')).textContent = this.generateGUID();

    //     const serializer = new XMLSerializer();
    //     let xmlString = serializer.serializeToString(doc);
    //     return this.formatXml(xmlString);
    // }


    // Generate GUID
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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

        if (window.chrome.webview) {
            window.chrome.webview.postMessage(xmlString);
            return;
        }
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

      // New function to be called from C#
        window.importReportFromCSharp = function(reportContent) {
           
           
            if (typeof reportDesigner === 'undefined') {
                alert('Report Designer not initialized');
                return;
            }

            try {
                const importer = new RDLCImporter(reportDesigner);
                // Directly use the content string passed from C#
                importer.import(reportContent);
            } catch (error) {
                alert('Error importing report: ' + error.message);
                console.error('Import error:', error);
            }
        };
