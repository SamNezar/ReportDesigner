// Import functionality
class RDLCImporter {
    constructor(reportDesigner) {
        this.designer = reportDesigner;
    }

    // Convert inches to px (96 DPI)
    inchesToPx(inches) {
        const value = parseFloat(inches.replace('in', ''));
        return Math.round(value * 96);
    }

    // Convert pt to px
    ptToPx(pt) {
        const value = parseFloat(pt.replace('pt', ''));
        return Math.round(value * 96 / 72);
    }

    // Parse color
    parseColor(color) {
        const namedColors = {
            'Tomato': '#ff6347',
            'Brown': '#a52a2a',
            'LightGrey': '#d3d3d3'
        };
        return namedColors[color] || color;
    }

    // Parse border style
    parseBorderStyle(style) {
        switch (style) {
            case 'Solid': return 'solid';
            case 'Dashed': return 'dashed';
            case 'Dotted': return 'dotted';
            case 'Double': return 'double';
            case 'None': return 'none';
            default: return 'solid';
        }
    }

    // Parse text runs to HTML
    parseTextRunsToHtml(paragraphs) {
        let html = '';
        
        paragraphs.forEach((paragraph, index) => {
            const textRuns = paragraph.getElementsByTagName('TextRun');
            let paragraphHtml = '';
            
            for (let textRun of textRuns) {
                const value = textRun.querySelector('Value')?.textContent || '';
                const style = textRun.querySelector('Style');
                let runHtml = value;
                
                if (style) {
                    const styles = {};
                    const fontWeight = style.querySelector('FontWeight')?.textContent;
                    const fontStyle = style.querySelector('FontStyle')?.textContent;
                    const textDecoration = style.querySelector('TextDecoration')?.textContent;
                    const fontSize = style.querySelector('FontSize')?.textContent;
                    const fontFamily = style.querySelector('FontFamily')?.textContent;
                    const color = style.querySelector('Color')?.textContent;
                    
                    if (fontWeight === 'Bold') runHtml = `<b>${runHtml}</b>`;
                    if (fontStyle === 'Italic') runHtml = `<i>${runHtml}</i>`;
                    if (textDecoration === 'Underline') runHtml = `<u>${runHtml}</u>`;
                    if (textDecoration === 'LineThrough') runHtml = `<s>${runHtml}</s>`;
                    
                    if (fontSize || fontFamily || color) {
                        const spanStyles = [];
                        if (fontSize) spanStyles.push(`font-size: ${fontSize.replace('pt', 'px')}`);
                        if (fontFamily) spanStyles.push(`font-family: ${fontFamily}`);
                        if (color) spanStyles.push(`color: ${this.parseColor(color)}`);
                        
                        if (spanStyles.length > 0) {
                            runHtml = `<span style="${spanStyles.join('; ')}">${runHtml}</span>`;
                        }
                    }
                }
                
                paragraphHtml += runHtml;
            }
            
            if (index > 0) html += '<br>';
            html += paragraphHtml;
        });
        
        return html || 'Text Box';
    }

    // Import textbox
    importTextbox(textboxEl) {
        const name = textboxEl.getAttribute('Name');
        const top = textboxEl.querySelector('Top')?.textContent;
        const left = textboxEl.querySelector('Left')?.textContent;
        const height = textboxEl.querySelector('Height')?.textContent;
        const width = textboxEl.querySelector('Width')?.textContent;
        
        const x = left ? this.inchesToPx(left) : 0;
        const y = top ? this.inchesToPx(top) : 0;
        const w = width ? this.inchesToPx(width) : 150;
        const h = height ? this.inchesToPx(height) : 40;
        
        // Parse text content
        const paragraphs = textboxEl.querySelectorAll('Paragraph');
        const html = this.parseTextRunsToHtml(paragraphs);
        
        const textbox = new TextBox(x, y, w, h, html);
        
        // Parse style
        const style = textboxEl.querySelector('Style');
        if (style) {
            // Border
            const border = style.querySelector('Border');
            if (border) {
                const borderStyle = border.querySelector('Style')?.textContent;
                textbox.borderStyle = this.parseBorderStyle(borderStyle);
                textbox.borderSet = borderStyle === 'None' ? 'none' : 'all';
                
                const borderColor = border.querySelector('Color')?.textContent;
                if (borderColor) {
                    textbox.borderColor = this.parseColor(borderColor);
                }
            }
            
            // Background color
            const bgColor = style.querySelector('BackgroundColor')?.textContent;
            if (bgColor) {
                textbox.backgroundColor = this.parseColor(bgColor);
            }
            
            // Vertical alignment
            const vAlign = style.querySelector('VerticalAlign')?.textContent;
            if (vAlign) {
                textbox.verticalAlign = vAlign.toLowerCase();
            }
            
            // Padding
            const paddingLeft = style.querySelector('PaddingLeft')?.textContent;
            if (paddingLeft) {
                textbox.padding = this.ptToPx(paddingLeft);
            }
        }
        
        // Text alignment from paragraph style
        const firstParagraph = paragraphs[0];
        if (firstParagraph) {
            const paraStyle = firstParagraph.querySelector('Style');
            if (paraStyle) {
                const textAlign = paraStyle.querySelector('TextAlign')?.textContent;
                if (textAlign) {
                    textbox.textAlign = textAlign.toLowerCase();
                }
                
                const lineHeight = paraStyle.querySelector('LineHeight')?.textContent;
                if (lineHeight) {
                    textbox.lineHeight = parseFloat(lineHeight.replace('pt', ''));
                }
            }
        }
        
        return textbox;
    }

    // Import image
    importImage(imageEl, embeddedImages) {
        const name = imageEl.getAttribute('Name');
        const top = imageEl.querySelector('Top')?.textContent;
        const left = imageEl.querySelector('Left')?.textContent;
        const height = imageEl.querySelector('Height')?.textContent;
        const width = imageEl.querySelector('Width')?.textContent;
        
        const x = left ? this.inchesToPx(left) : 0;
        const y = top ? this.inchesToPx(top) : 0;
        const w = width ? this.inchesToPx(width) : 150;
        const h = height ? this.inchesToPx(height) : 100;
        
        const image = new ImageObject(x, y, w, h);
        
        // Get image data
        const source = imageEl.querySelector('Source')?.textContent;
        const value = imageEl.querySelector('Value')?.textContent;
        
        if (source === 'Embedded' && value && embeddedImages[value]) {
            image.src = embeddedImages[value];
        }
        
        // Parse style
        const style = imageEl.querySelector('Style');
        if (style) {
            const border = style.querySelector('Border');
            if (border) {
                const borderStyle = border.querySelector('Style')?.textContent;
                image.borderStyle = this.parseBorderStyle(borderStyle);
                image.borderSet = borderStyle === 'None' ? 'none' : 'all';
            }
        }
        
        return image;
    }

    // Import table
    importTable(tablixEl) {
        const name = tablixEl.getAttribute('Name');
        const top = tablixEl.querySelector('Top')?.textContent;
        const left = tablixEl.querySelector('Left')?.textContent;
        const height = tablixEl.querySelector('Height')?.textContent;
        const width = tablixEl.querySelector('Width')?.textContent;
        
        const x = left ? this.inchesToPx(left) : 0;
        const y = top ? this.inchesToPx(top) : 0;
        const w = width ? this.inchesToPx(width) : 300;
        const h = height ? this.inchesToPx(height) : 80;
        
        const table = new TableObject(x, y, w, h);
        
        // Parse columns
        const columns = [];
        const tablixColumns = tablixEl.querySelectorAll('TablixColumn');
        const tablixRows = tablixEl.querySelectorAll('TablixRow');
        
        if (tablixRows.length > 0) {
            const headerRow = tablixRows[0];
            const headerCells = headerRow.querySelectorAll('TablixCell');
            
            headerCells.forEach((cell, index) => {
                const textbox = cell.querySelector('Textbox');
                if (textbox) {
                    const value = textbox.querySelector('Value')?.textContent || `Column ${index + 1}`;
                    columns.push({
                        header: value,
                        dataField: `field${index + 1}`
                    });
                }
            });
            
            // Try to get data fields from data row
            if (tablixRows.length > 1) {
                const dataRow = tablixRows[1];
                const dataCells = dataRow.querySelectorAll('TablixCell');
                
                dataCells.forEach((cell, index) => {
                    const textbox = cell.querySelector('Textbox');
                    if (textbox && columns[index]) {
                        const value = textbox.querySelector('Value')?.textContent || '';
                        if (value.match(/\[(.+?)\]/)) {
                            columns[index].dataField = value.replace(/[\[\]]/g, '');
                        }
                    }
                });
            }
        }
        
        if (columns.length > 0) {
            table.columns = columns;
        }
        
        return table;
    }

    // Import line
    importLine(lineEl) {
        const name = lineEl.getAttribute('Name');
        const top = lineEl.querySelector('Top')?.textContent;
        const left = lineEl.querySelector('Left')?.textContent;
        const height = lineEl.querySelector('Height')?.textContent;
        const width = lineEl.querySelector('Width')?.textContent;
        
        const x = left ? this.inchesToPx(left) : 0;
        const y = top ? this.inchesToPx(top) : 0;
        const w = width ? this.inchesToPx(width) : 100;
        const h = height ? this.inchesToPx(height) : 2;
        
        const line = new LineObject(x, y, w, h);
        
        // Parse style
        const style = lineEl.querySelector('Style');
        if (style) {
            const border = style.querySelector('Border');
            if (border) {
                const borderStyle = border.querySelector('Style')?.textContent;
                line.borderStyle = this.parseBorderStyle(borderStyle);
                
                const borderColor = border.querySelector('Color')?.textContent;
                if (borderColor) {
                    line.borderColor = this.parseColor(borderColor);
                }
                
                const borderWidth = border.querySelector('Width')?.textContent;
                if (borderWidth) {
                    line.borderSize = this.ptToPx(borderWidth);
                }
            }
        }
        
        // Determine line orientation
        if (w > h) {
            line.borderSet = 'top'; // Horizontal line
        } else {
            line.borderSet = 'left'; // Vertical line
        }
        
        return line;
    }

    // Main import function
    import(xmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'text/xml');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML: ' + parserError.textContent);
        }
        
        // Clear existing objects
        this.designer.objects.forEach(obj => obj.remove());
        this.designer.objects = [];
        this.designer.selectedObject = null;
        
        // Parse embedded images
        const embeddedImages = {};
        const embeddedImageEls = doc.querySelectorAll('EmbeddedImage');
        embeddedImageEls.forEach(imgEl => {
            const name = imgEl.getAttribute('Name');
            const mimeType = imgEl.querySelector('MIMEType')?.textContent || 'image/jpeg';
            const imageData = imgEl.querySelector('ImageData')?.textContent;
            
            if (name && imageData) {
                embeddedImages[name] = `data:${mimeType};base64,${imageData}`;
            }
        });
        
        // Parse page size
        const page = doc.querySelector('Page');
        if (page) {
            const pageWidth = page.querySelector('PageWidth')?.textContent;
            const pageHeight = page.querySelector('PageHeight')?.textContent;
            
            if (pageWidth && pageHeight) {
                const widthPx = this.inchesToPx(pageWidth);
                const heightPx = this.inchesToPx(pageHeight);
                
                // Determine page size
                if (Math.abs(widthPx - 794) < 10 && Math.abs(heightPx - 1123) < 10) {
                    document.getElementById('pageSize').value = 'a4';
                    this.designer.changePageSize('a4');
                } else if (Math.abs(widthPx - 1123) < 10 && Math.abs(heightPx - 794) < 10) {
                    document.getElementById('pageSize').value = 'a4-landscape';
                    this.designer.changePageSize('a4-landscape');
                } else if (Math.abs(widthPx - 559) < 10 && Math.abs(heightPx - 794) < 10) {
                    document.getElementById('pageSize').value = 'a5';
                    this.designer.changePageSize('a5');
                } else if (Math.abs(widthPx - 794) < 10 && Math.abs(heightPx - 559) < 10) {
                    document.getElementById('pageSize').value = 'a5-landscape';
                    this.designer.changePageSize('a5-landscape');
                }
            }
        }
        
        // Import report items
        const reportItems = doc.querySelector('ReportItems');
        if (reportItems) {
            // Import textboxes
            const textboxes = reportItems.querySelectorAll('Textbox');
            textboxes.forEach(textboxEl => {
                const textbox = this.importTextbox(textboxEl);
                const element = textbox.createElement();
                element.style.zIndex = ReportDesigner.zIndexCounter++;
                this.designer.paper.appendChild(element);
                this.designer.objects.push(textbox);
            });
            
            // Import images
            const images = reportItems.querySelectorAll('Image');
            images.forEach(imageEl => {
                const image = this.importImage(imageEl, embeddedImages);
                const element = image.createElement();
                element.style.zIndex = ReportDesigner.zIndexCounter++;
                this.designer.paper.appendChild(element);
                this.designer.objects.push(image);
                
                if (image.src) {
                    image.updateImageDisplay();
                }
            });
            
            // Import tables
            const tables = reportItems.querySelectorAll('Tablix');
            tables.forEach(tablixEl => {
                const table = this.importTable(tablixEl);
                const element = table.createElement();
                element.style.zIndex = ReportDesigner.zIndexCounter++;
                this.designer.paper.appendChild(element);
                this.designer.objects.push(table);
            });
            
            // Import lines
            const lines = reportItems.querySelectorAll('Line');
            lines.forEach(lineEl => {
                const line = this.importLine(lineEl);
                const element = line.createElement();
                element.style.zIndex = ReportDesigner.zIndexCounter++;
                this.designer.paper.appendChild(element);
                this.designer.objects.push(line);
            });
        }
        
        return true;
    }
}