<?php 
    $canvas = '<svg id="drawing-area"></svg>' ;
    $shapes;
    if(isset($_COOKIE['shapes'])){
        $shapes = unserialize($_COOKIE['shapes']);
        //print_r($shapes[0]->shape);
    }
    if(isset($_GET['id'])){
        $canvas = $shapes[$_GET['id']]->shape;
        //print_r(['id']);
        //print_r($shapes[$_GET['id']]->shape);
    } 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/7086ac27b5.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./style.css">
    <title>SHAPE.IT</title>
</head>
<body onload="select_tool('cursor', event)">
    <!--Nav bar section start-->
    <nav>
        <figure class="logo">
            <img src="./assets/logo.png" alt="logo">
            <figcaption>SHAPE.IT</figcaption>
        </figure>
        <ul class="menu">
            <li class="menu-link" title="Nouveau">
                <a href="index.php"><i class="fa-solid fa-file fa-xl"></i></a>
            </li>
            <li class="menu-link" id="open" title="Ouvrir">
                <a href="#" class="open">
                    <i class="fa-solid fa-folder-open fa-xl"></i>
                    <div class="list">
                        <?php 
                            if(sizeof($shapes) > 0 ){
                                foreach ($shapes as $shape){
                                    echo'<a href="index.php?id=' . $shape->id . '">' . $shape->name . '</a>'; 
                                }
                            }else{
                                echo'<a> aucun fichier enregistré <a>'; 
                            }   
                        ?>
                    </div>
                </a>
                
            </li>
            <li class="menu-link" title="Enregistrer">
                <a onclick="saveDesign(event)" href="#"><i class="fa-solid fa-floppy-disk fa-xl"></i></a>
            </li>
            <li class="menu-link" title="Exporter en PNG">
                <a onclick="exportPNG(event)" href="#"><i class="fa-solid fa-image fa-xl"></i></a>
            </li>
            <li class="menu-link" title="Exporter en PDF">
                <a onclick="exportPDF(event)" href="#"><i class="fa-solid fa-file-pdf fa-xl"></i></a>
            </li>
        </ul>
    </nav>
    <!--Navbar section end-->

    <!--Main section start-->
    <main>

        <!--ToolBar section start-->
        <div class="toolbar">
            <div class="tools">
                <a id="cursor" onclick="select_tool(this.id, event)" href="#" title="Select">
                    <i class="fa-solid fa-arrow-pointer fa-xl"></i>
                </a>
                <a id="rectangle" onclick="select_tool(this.id, event)" href="#" title="Rectangle">
                    <i class="fa-solid fa-square fa-xl"></i>
                </a>
                <a id="circle" onclick="select_tool(this.id, event)" href="#" title="Cercle">
                    <i class="fa-solid fa-circle fa-xl"></i>
                </a>
                <a id="triangle" onclick="select_tool(this.id, event)" href="#" title="Triangle">
                    <i class="fa-solid fa-play fa-rotate-270 fa-xl"></i>
                </a>
                <!-- <a id="text" onclick="select_tool(this.id, event)" href="#" title="Texte">
                    <i class="fa-solid fa-font fa-xl"></i>
                </a> -->
                <a id="trash" onclick="select_tool(this.id, event)"  href="#" title="Supprimer">
                    <i class="fa-solid fa-trash-can fa-xl"></i>
                </a>
            </div>
            <div class="color-picker-container">
                <div class="color-picker-item">
                    <input id="secondaryColor" type="color" name="secondaryColor" value="#FFFFFF">
                </div>
                <div class="color-picker-item">
                    <input id="primaryColor" type="color" name="primaryColor" value="#000000">
                </div>
            </div>
        </div>
        <!--ToolBar section end-->

        <!--DrawingArea section start-->
        <div class="drawing-area-container">
            <?php echo $canvas ?>
        </div>
        <!--DrawingArea section end-->
    </main>
    <!--Main section end-->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.debug.js"></script>
    <script src="html2canvas.js"></script>
    <script src="app.js"></script>

</body>
</html>
