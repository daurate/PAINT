var svg = document.getElementById("drawing-area");
var svgNamespace = "http://www.w3.org/2000/svg";
var numberOfRect = 0;
var numberOfCircle = 0;
var numberOfTriangle = 0;
var selectedTool;
var selectedShape;
var primaryColor = document.getElementById("primaryColor").value;
var secondaryColor = document.getElementById("secondaryColor").value;

// fonction qui permet de selectionner une outil
var select_tool = function (tool, e) {
  e.preventDefault();
  if (selectedTool) {
    selectedTool.tool_element.classList.remove("active");
  }

  selectedTool = {
    tool_name: tool,
    tool_element: document.getElementById(tool),
  };
  selectedTool.tool_element.classList.add("active");

  if (tool === "rectangle" || tool === "circle" || tool === "triangle") {
    svg.style.cursor = "crosshair";
  } else if (tool === "text") {
    svg.style.cursor = "text";
  } else {
    svg.style.cursor = "auto";
  }
};

//fonction qui permet de traduire les coordonnées du DOM en SVG
const svgPoint = (x, y) => {
  const p = new DOMPoint(x, y);
  return p.matrixTransform(svg.getScreenCTM().inverse());
};

// fonction qui permet de tracer un rectangle
var create_rect = function (event) {
  const rect = document.createElementNS(svgNamespace, "rect");
  const rectId = "rect" + numberOfRect;
  const start = svgPoint(event.clientX, event.clientY);
  rect.setAttribute("id", rectId);
  rect.setAttribute("onmousedown", "dragShape(this.id, event)");
  rect.setAttribute("onclick", "handle_shape(this.id)");
  numberOfRect++;

  const drawRect = function (e) {
    const p = svgPoint(e.clientX, e.clientY);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);
    if (p.x > start.x) {
      p.x = start.x;
    }

    if (p.y > start.y) {
      p.y = start.y;
    }
    rect.setAttribute("x", p.x);
    rect.setAttribute("y", p.y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("stroke", primaryColor);
    rect.setAttribute("fill", secondaryColor);
    rect.setAttribute("stroke-width", 3);
    svg.appendChild(rect);
  };

  const endDraw = function () {
    svg.removeEventListener("mousemove", drawRect);
    select_shape(rectId);
  };

  svg.addEventListener("mousemove", drawRect);
  svg.addEventListener("mouseup", endDraw);
};

// fonction qui permet de tracer un cercle
var create_circle = function (event) {
  const ellipse = document.createElementNS(svgNamespace, "ellipse");
  const circleId = "circle" + numberOfCircle;
  const start = svgPoint(event.clientX, event.clientY);

  ellipse.setAttribute("id", circleId);
  ellipse.setAttribute("onmousedown", "dragShape(this.id, event)");
  ellipse.setAttribute("onclick", "handle_shape(this.id)");
  numberOfCircle++;

  const drawEllipse = function (e) {
    const p = svgPoint(e.clientX, e.clientY);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);

    ellipse.setAttribute("cx", p.x);
    ellipse.setAttribute("cy", p.y);
    ellipse.setAttribute("rx", w);
    ellipse.setAttribute("ry", h);
    ellipse.setAttribute("stroke", primaryColor);
    ellipse.setAttribute("fill", secondaryColor);
    ellipse.setAttribute("stroke-width", 3);
    svg.appendChild(ellipse);
  };

  const endDraw = function () {
    svg.removeEventListener("mousemove", drawEllipse);
    select_shape(circleId);
  };

  svg.addEventListener("mousemove", drawEllipse);
  svg.addEventListener("mouseup", endDraw);
};

// fonction qui permet de créer un triangle
var create_triangle = function (event) {
  const polygon = document.createElementNS(svgNamespace, "polygon");
  const polygonId = "triangle" + numberOfTriangle;
  const start = svgPoint(event.clientX, event.clientY);

  polygon.setAttribute("id", polygonId);
  polygon.setAttribute("onmousedown", "dragShape(this.id, event)");
  polygon.setAttribute("onclick", "handle_shape(this.id)");
  numberOfTriangle++;

  const drawtriangle = function (e) {
    const p = svgPoint(e.clientX, e.clientY);
    const y = start.x - (p.x - start.x);

    polygon.setAttribute(
      "points",
      `${start.x} ${start.y}, ${p.x} ${p.y}, ${y} ${p.y}`
    );
    polygon.setAttribute("stroke", primaryColor);
    polygon.setAttribute("fill", secondaryColor);
    polygon.setAttribute("stroke-width", 3);
    svg.appendChild(polygon);
  };

  const endDraw = function () {
    svg.removeEventListener("mousemove", drawtriangle);
    select_shape(polygonId);
  };

  svg.addEventListener("mousemove", drawtriangle);
  svg.addEventListener("mouseup", endDraw);
};

//fonction qui permet de déplacer une forme
function dragShape(id, e) {
  if (selectedTool) {
    if (selectedTool.tool_name === "cursor") {
      if (id.includes("rect")) {
        var shape = document.getElementById(id);
        const startP = svgPoint(e.clientX, e.clientY);
        startP.x -= parseFloat(shape.getAttribute("x"));
        startP.y -= parseFloat(shape.getAttribute("y"));

        var drag = function (e) {
          const p = svgPoint(e.clientX, e.clientY);
          var shapeX = p.x - startP.x;
          var shapeY = p.y - startP.y;

          shape.setAttribute("x", shapeX);
          shape.setAttribute("y", shapeY);
        };

        var endDrag = function () {
          svg.removeEventListener("mousemove", drag);
        };

        svg.addEventListener("mousemove", drag);
        svg.addEventListener("mouseup", endDrag);
      } else if (id.includes("circle")) {
        var shape = document.getElementById(id);
        const startP = svgPoint(e.clientX, e.clientY);
        startP.x -= parseFloat(shape.getAttribute("cx"));
        startP.y -= parseFloat(shape.getAttribute("cy"));

        var drag = function (e) {
          const p = svgPoint(e.clientX, e.clientY);
          var shapeX = p.x - startP.x;
          var shapeY = p.y - startP.y;

          shape.setAttribute("cx", shapeX);
          shape.setAttribute("cy", shapeY);
        };

        var endDrag = function () {
          svg.removeEventListener("mousemove", drag);
        };

        svg.addEventListener("mousemove", drag);
        svg.addEventListener("mouseup", endDrag);
      } else if (id.includes("triangle")) {
        var shape = document.getElementById(id);
        const startP = svgPoint(e.clientX, e.clientY);
        var transform;
        var transforms = shape.transform.baseVal;
        if (
          transforms.length === 0 ||
          transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE
        ) {
          var translate = svg.createSVGTransform();
          translate.setTranslate(0, 0);
          shape.transform.baseVal.insertItemBefore(translate, 0);
        }
        transform = transforms.getItem(0);
        startP.x -= transform.matrix.e;
        startP.y -= transform.matrix.f;

        var drag = function (e) {
          var p = svgPoint(e.clientX, e.clientY);
          transform.setTranslate(p.x - startP.x, p.y - startP.y);
        };

        var endDrag = function () {
          svg.removeEventListener("mousemove", drag);
        };

        svg.addEventListener("mousemove", drag);
        svg.addEventListener("mouseup", endDrag);
      }
    }
  }
}

//fonction qui pert selectionner une forme
function select_shape(id) {
  if (selectedShape) {
    selectedShape.classList.remove("selectedShape");
  }
  selectedShape = document.getElementById(id);
  selectedShape.classList.add("selectedShape");
  document.getElementById("primaryColor").value =
    selectedShape.getAttribute("stroke");
  document.getElementById("secondaryColor").value =
    selectedShape.getAttribute("fill");
}

//foncion qui permet de supprimer une forme
function remove_shape(id) {
  document.getElementById(id).remove();
}

//fonction qui permet de manipuler la forme
// en fonction de l'outil choisi
function handle_shape(id) {
  if (selectedTool) {
    if (selectedTool.tool_name === "trash") {
      remove_shape(id);
    } else {
      select_shape(id);
    }
  }
}

//fonction qui permet de changer la couleur proncipale
// du forme choisi
document.getElementById("primaryColor").addEventListener("input", function () {
  if (selectedShape) {
    selectedShape.setAttribute("stroke", this.value);
  }
});

//fonction qui permet de changer la couleur secondaire
// du forme choisi
document
  .getElementById("secondaryColor")
  .addEventListener("input", function () {
    if (selectedShape) {
      selectedShape.setAttribute("fill", this.value);
    }
  });

//fonction qui permet d'enregistrer le travail en cours
function saveDesign(event) {
  event.preventDefault();
  var ajax = new XMLHttpRequest();
  ajax.open("POST", "save-design.php", true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var shape = "shape=" + document.getElementById("drawing-area").outerHTML;
  ajax.send(shape);
  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText === "saved") {
        location.reload();
        alert("enregistrer avec succés");
      }
    }
  };
}

//fonction qui permet d'exporter en image
var exportPNG = function (event) {
  event.preventDefault();
  html2canvas(document.querySelector(".drawing-area-container")).then(function (
    canvas
  ) {
    var imageLink = canvas.toDataURL("image/png", 0.9);
    var downloadE = document.createElement("a");
    downloadE.setAttribute("href", imageLink);
    downloadE.setAttribute("download", "shapeIt");
    document.body.appendChild(downloadE);
    downloadE.click();
  });
};

//fonction qui permet d'exporter en PDF
var exportPDF = function (event) {
  event.preventDefault();
  html2canvas(document.querySelector(".drawing-area-container")).then(function (
    canvas
  ) {
    var imageLink = canvas.toDataURL("image/png", 0.9);
    var doc = new jsPDF("p", "mm", "a4");
    var ImageWidth = doc.internal.pageSize.width;
    var ImageHeight = doc.internal.pageSize.height;
    doc.addImage(imageLink, "PNG", 0, 0, ImageWidth, 400);
    doc.save("shapeIt.pdf");
  });
};

svg.addEventListener("mousedown", (event) => {
  if (selectedTool) {
    if (selectedTool.tool_name === "rectangle") {
      create_rect(event);
    } else if (selectedTool.tool_name === "circle") {
      create_circle(event);
    } else if (selectedTool.tool_name === "triangle") {
      create_triangle(event);
    } else if (selectedTool.tool_name === "text") {
      create_text(event);
    }
  }
});
