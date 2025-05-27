<?php
session_start();

// Configuration
$config = [
    'app_name' => 'Document Editor',
    'version' => '1.0.0',
    'default_page_size' => 'a4',
    'max_upload_size' => '5MB'
];

// Static field templates
$static_fields = [
    'invoice_type_name' => 'Invoice Type',
    'transaction_qty' => 'Transaction Quantity', 
    'transaction_name' => 'Transaction Name',
    'invoice_number' => 'Invoice Number'
];

// Page sizes configuration
$page_sizes = [
    'a4' => ['width' => 794, 'height' => 1123, 'name' => 'A4'],
    'a4-landscape' => ['width' => 1123, 'height' => 794, 'name' => 'A4 Landscape'],
    'a5' => ['width' => 559, 'height' => 794, 'name' => 'A5'],
    'a5-landscape' => ['width' => 794, 'height' => 559, 'name' => 'A5 Landscape']
];

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    switch ($_GET['action']) {
        case 'save_document':
            $document_data = json_decode(file_get_contents('php://input'), true);
            // Here you would save to database or file
            $_SESSION['document'] = $document_data;
            echo json_encode(['success' => true, 'message' => 'Document saved successfully']);
            break;
            
        case 'load_document':
            $document = $_SESSION['document'] ?? null;
            echo json_encode(['success' => true, 'document' => $document]);
            break;
            
        case 'upload_image':
            if (isset($_FILES['image'])) {
                $target_dir = "uploads/";
                if (!file_exists($target_dir)) {
                    mkdir($target_dir, 0777, true);
                }
                
                $file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
                $new_filename = uniqid() . '.' . $file_extension;
                $target_file = $target_dir . $new_filename;
                
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                    echo json_encode(['success' => true, 'url' => $target_file]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Upload failed']);
                }
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action']);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $config['app_name']; ?></title>
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="toolbar.css">
    <link rel="stylesheet" href="toolbox.css">
    <link rel="stylesheet" href="editor.css">
</head>
<body>
    <div class="container">
        <!-- Border Toolbar -->
        <div class="toolbar" id="border-toolbar">
            <select id="border-style">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
            </select>
            
            <input type="number" id="border-size" value="1" min="0" max="10">
            
            <input type="color" id="border-color" value="#000000" class="color-input">
            
            <div class="toolbar-separator"></div>
            
            <div class="border-set-group">
                <button id="border-all" title="All Borders">⬜</button>
                <button id="border-none" title="No Border">⬚</button>
                <button id="border-top" title="Top Border">⬆</button>
                <button id="border-bottom" title="Bottom Border">⬇</button>
                <button id="border-left" title="Left Border">⬅</button>
                <button id="border-right" title="Right Border">➡</button>
            </div>
        </div>

        <!-- Font Toolbar -->
        <div class="toolbar" id="font-toolbar">
            <select id="font-family">
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
            </select>
            
            <input type="number" id="font-size" value="14" min="8" max="72">
            
            <div class="toolbar-separator"></div>
            
            <button id="bold" title="Bold"><b>B</b></button>
            <button id="italic" title="Italic"><i>I</i></button>
            <button id="underline" title="Underline"><u>U</u></button>
            <button id="strikethrough" title="Strikethrough"><s>S</s></button>
            
            <div class="toolbar-separator"></div>
            
            <input type="color" id="fore-color" value="#000000" class="color-input" title="Text Color">
            <input type="color" id="back-color" value="#ffffff" class="color-input" title="Background Color">
            
            <div class="toolbar-separator"></div>
            
            <div class="alignment-group">
                <button id="align-left" title="Align Left">⬅</button>
                <button id="align-center" title="Align Center">⬌</button>
                <button id="align-right" title="Align Right">➡</button>
            </div>
            
            <div class="toolbar-separator"></div>
            
            <input type="number" id="line-height" value="1.2" min="0.5" max="3" step="0.1" title="Line Height">
            
            <select id="page-size">
                <?php foreach ($page_sizes as $key => $size): ?>
                    <option value="<?php echo $key; ?>" <?php echo $key === $config['default_page_size'] ? 'selected' : ''; ?>>
                        <?php echo $size['name']; ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="main-content">
            <!-- Toolbox -->
            <div class="toolbox">
                <div class="toolbox-section">
                    <h3>Report Items</h3>
                    <div class="tool-item active" data-tool="pointer">
                        <div class="tool-icon pointer"></div>
                        Pointer
                    </div>
                    <div class="tool-item" data-tool="textbox">
                        <div class="tool-icon textbox"></div>
                        Text Box
                    </div>
                    <div class="tool-item" data-tool="image">
                        <div class="tool-icon image"></div>
                        Image
                    </div>
                    <div class="tool-item" data-tool="table">
                        <div class="tool-icon table"></div>
                        Table
                    </div>
                </div>

                <div class="toolbox-section">
                    <h3>Static Field Values</h3>
                    <?php foreach ($static_fields as $key => $name): ?>
                        <div class="tool-item" data-tool="static-field" data-field="<?php echo $key; ?>">
                            <div class="tool-icon textbox"></div>
                            <?php echo $name; ?>
                        </div>
                        <div class="static-field">[<?php echo $key; ?>]</div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Editor Area -->
            <div class="editor-area" id="editor-area">
                <div class="paper <?php echo $config['default_page_size']; ?>" id="paper">
                    <!-- Objects will be added here dynamically -->
                </div>
            </div>
        </div>
    </div>

    <!-- Hidden file input for image uploads -->
    <input type="file" id="image-upload" accept="image/*" style="display: none;">

    <!-- Pass PHP data to JavaScript -->
    <script>
        window.editorConfig = <?php echo json_encode($config); ?>;
        window.staticFields = <?php echo json_encode($static_fields); ?>;
        window.pageSizes = <?php echo json_encode($page_sizes); ?>;
    </script>

    <!-- JavaScript Files -->
    <script src="main.js"></script>
    <script src="toolbar.js"></script>
    <script src="toolbox.js"></script>
    <script src="editor.js"></script>
    <script src="objects.js"></script>
</body>
</html>