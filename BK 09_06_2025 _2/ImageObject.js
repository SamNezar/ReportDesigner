 class ImageObject extends ReportObject {
            constructor(x, y, width = 150, height = 100) {
                super('image', x, y, width, height);
                this.src = null; // Data URL of the image
                this.borderStyle = 'none'; // Default for new images, can be changed
                this.borderSize = 0;
                this.backgroundColor = '#ffffff'; // Images might have a white background for placeholder visual
                this.padding = 0; // Images typically don't have internal padding affecting the img tag
            }
            createElement() {
                const element = super.createElement(); // Sets up .report-object
                element.classList.remove(`${this.type}-object-container`); // super adds this
                element.classList.add(`image-object`); // Use specific class for styling (e.g. display:flex for placeholder)
                element.style.cursor = 'move'; // Frame is draggable
                element.style.padding = '0'; // Override padding from super for image container

                const img = document.createElement('img');
                // img.style.display = 'block'; // Handled by flex container now
                // img.style.width = '100%';
                // img.style.height = '100%';
                // img.style.objectFit = 'contain'; // Or 'cover', 'fill' etc.
             //  img.style.cursor = 'default'; // Image content itself is not draggable

                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-text';
                placeholder.textContent = 'Double-click to select';
                placeholder.style.cursor = 'default'; // Placeholder also not draggable

                this.contentElement = img; // The <img> tag
                this._placeholderElement = placeholder; // The placeholder div

                this.updateImageDisplay(); // initial display logic based on this.src

                element.addEventListener('dblclick', () => this.selectImage());
                return element;
            }
            selectImage() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        this.src = ev.target.result;
                        this.updateImageDisplay();
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            }
            updateImageDisplay() {
                if (!this.element) return;
                // Clear previous content (img or placeholder) but keep resize handles
                Array.from(this.element.childNodes).forEach(child => {
                    // Remove if it's not a resize handle AND it's either the placeholder or the image
                    if (!child.classList.contains('resize-handle') && (child === this._placeholderElement || child === this.contentElement)) {
                        this.element.removeChild(child);
                    }
                });


                if (this.src) {
                    // if (this._placeholderElement.parentNode === this.element) this.element.removeChild(this._placeholderElement); // Already handled
                    this.contentElement.src = this.src;
                    // Insert image before any resize handles if they exist
                    if (this.contentElement.parentNode !== this.element) {
                        const firstHandle = this.element.querySelector('.resize-handle');
                        if (firstHandle) this.element.insertBefore(this.contentElement, firstHandle);
                        else this.element.appendChild(this.contentElement);
                    }
                    this.updateBorder(); // Apply object's border settings
                } else { // No src, show placeholder
                    // if (this.contentElement.parentNode === this.element) this.element.removeChild(this.contentElement); // Already handled
                    // Insert placeholder before any resize handles if they exist
                    if (this._placeholderElement.parentNode !== this.element) {
                        const firstHandle = this.element.querySelector('.resize-handle');
                        if (firstHandle) this.element.insertBefore(this._placeholderElement, firstHandle);
                        else this.element.appendChild(this._placeholderElement);
                    }
                    // If no "real" border is set, show a dashed placeholder border for visual cue
                 //   if (this.borderSet === 'none' || this.borderSize === 0) {
                   //     this.element.style.border = '1px dashed #ced4da'; // Placeholder visual
                   // } else {
                        this.updateBorder(); // Apply actual border settings if they exist
                   // }
                }
            }
        }