
    // --- Instantiate the designer ---
   
    // --- Data Type Icons ---
    const dataTypeIcons = {
        'System.String': '📄',    // String
        'String': '📄',            // String (for parameters)
        'System.Decimal': '💵',    // Decimal
        'System.Boolean': '✅',    // Boolean
        'Boolean': '✅',          // Boolean (for parameters)
        'System.Int32': '#️⃣',      // Integer
        'Int32': '#️⃣'             // Integer (for parameters)
    };

    // --- Populate the Toolbox ---
    function populateToolbox() {
        const parametersContainer = document.getElementById('parameters-section');
        const datasetsContainer = document.getElementById('datasets-section');

 parametersContainer.innerHTML = '';
    datasetsContainer.innerHTML = '';

        // Populate Parameters
        if (reportDesigner.parameters && reportDesigner.parameters.length > 0) {
            reportDesigner.parameters.forEach(param => {
                if (param.visible) {
                    const icon = dataTypeIcons[param.type] || '🏷️';
                    const paramElement = document.createElement('div');
                    paramElement.className = 'tool-item';
                    paramElement.setAttribute('data-tool', 'field');
                    paramElement.setAttribute('data-field', param.displayValue);
                    paramElement.innerHTML = `<span class="tool-icon">${icon}</span><span>${param.displayName}</span>`;
                    parametersContainer.appendChild(paramElement);
                }
            });
        }



        // Populate Datasets
        if (reportDesigner.datasets && reportDesigner.datasets.length > 0) {
            reportDesigner.datasets.forEach(dataset => {
                const datasetSection = document.createElement('div');
                datasetSection.className = 'toolbox-section';
                datasetSection.innerHTML = `<h4>${dataset.name}</h4>`;

                dataset.fields.forEach(field => {
                    if (field.visible) {
                        const icon = dataTypeIcons[field.type] || '🏷️';
                        const fieldElement = document.createElement('div');
                        fieldElement.className = 'tool-item';
                        fieldElement.setAttribute('data-tool', 'field');
                        fieldElement.setAttribute('data-field', field.displayValue);
                        fieldElement.innerHTML = `<span class="tool-icon">${icon}</span><span>${field.displayName}</span>`;
                        datasetSection.appendChild(fieldElement);
                    }
                });
                datasetsContainer.appendChild(datasetSection);
            });
        }
    }

    // --- Toolbox Filtering Function ---
    window.filterToolbox = function() {
        const filterText = document.getElementById('toolboxFilter').value.toLowerCase();
        const toolItems = document.querySelectorAll('#parameters-section .tool-item, #datasets-section .tool-item');

        toolItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            const dataField = item.getAttribute('data-field').toLowerCase();
            if (itemText.includes(filterText) || dataField.includes(filterText)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    };
document.addEventListener('DOMContentLoaded', function () {
    // --- Example Data Loading ---
    // Now call the methods on the reportDesigner instance
    reportDesigner.addDataSet('print_transaction', [
        { name: 'transaction_item_name', type: 'System.String', displayName: 'اسم الصنف', displayValue: '[transaction_item_name]', visible: true },
        { name: 'transaction_qty', type: 'System.Decimal', displayName: 'Item QTY', displayValue: '[transaction_qty]', visible: true },
        { name: 'transaction_unit_price', type: 'System.Decimal', displayName: 'Unit Price', displayValue: '[transaction_unit_price]', visible: false },
    ]);

    reportDesigner.addDataSet('products', [
        { name: 'product_name', type: 'System.String', displayName: 'Product Name', displayValue: '[product_name]', visible: true },
        { name: 'stock_count', type: 'System.Int32', displayName: 'Stock Count', displayValue: '[stock_count]', visible: true },
    ]);

    reportDesigner.addParameters([
        { name: 'show_details', type: 'Boolean', prompt: 'Show Details', displayName: 'Show Details', displayValue: '[show_details]', visible: true },
        { name: 'user_name', type: 'String', prompt: 'User Name', displayName: 'User Name', displayValue: '[user_name]', visible: true },
    ]);

    // --- Initial population of the toolbox ---
    populateToolbox();
});


// // This listener "catches" data sent from your C# code
// window.chrome.webview.addEventListener('message', event => {
//     // The received data is automatically parsed from JSON into a JavaScript object
//     const dataSet = event.data;

//     // Check if the report designer is ready and the data is valid
//     if (reportDesigner && dataSet && dataSet.name && dataSet.fields) {
   
//         // Call the existing addDataSet function with the received data
//         reportDesigner.addDataSet(dataSet.name, dataSet.fields);

//         // IMPORTANT: After adding new data, you must redraw the toolbox
//         // This assumes you have a function to do this, like the one from our previous discussions.
//             populateToolbox();
//     }
// });


// // This listener "catches" data sent from your C# code
// window.chrome.webview.addEventListener('message', event => {
//     const dataSet = event.data;
//     if (reportDesigner && dataSet && dataSet.name && dataSet.fields) {
//         reportDesigner.addDataSet(dataSet.name, dataSet.fields);
//             populateToolbox();
//     }
// });

// This ONE listener handles ALL messages from C#

if(window.chrome.webview){
window.chrome.webview.addEventListener('message', event => {
    const allReportData = event.data;

    if (!reportDesigner || !allReportData) return;

    // --- Clear old data for a clean preview ---
    reportDesigner.datasets = [];
    reportDesigner.parameters = [];

    // --- Process the incoming data ---
    if (allReportData.datasets && Array.isArray(allReportData.datasets)) {
        allReportData.datasets.forEach(ds => {
            reportDesigner.addDataSet(ds.name, ds.fields);
        });
    }
    if (allReportData.parameters && Array.isArray(allReportData.parameters)) {
        reportDesigner.addParameters(allReportData.parameters);
    }

    // --- Refresh the UI just ONCE ---
    if (typeof populateToolbox === 'function') {
        populateToolbox();
    }
});
}
