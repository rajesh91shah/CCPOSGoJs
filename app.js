

var myDiagram;
function fetchNodePositions() { 

     fetch('https://ccposapi.onrender.com/api/data')  // Replace with your API URL
    .then(response => response.json())
    .then(data => {
        // Assuming the API returns data in a format that looks like this:
        // [
        //   { key: 1, name: "Round Table 1", category: "RoundTable" },
        //   { key: 2, name: "Rectangle Table 2", category: "RectangleTable" },
        //   ...
        // ]

        myDiagram.model = new go.GraphLinksModel(data.storedData[0]);  // Update model with API data
        data.storedData[0].forEach(nodeData => {
            // Find the node in the diagram's model by its key
            const modelNode = myDiagram.model.findNodeDataForKey(nodeData.key);
            if (modelNode) {
                // Update the position and other properties of the node
                myDiagram.model.setDataProperty(modelNode, "pos", nodeData.pos);
                myDiagram.model.setDataProperty(modelNode, "color", nodeData.color);
                myDiagram.model.setDataProperty(modelNode, "name", nodeData.name );
            } else {
                // Optionally, if node doesn't exist, you can add a new node
                myDiagram.model.addNodeData(nodeData);
            }
        });
        myDiagram.requestUpdate();

    })
    .catch(error => {
        console.error('Error fetching layout data:', error);
    });

}


function init() {
    var $ = go.GraphObject.make;

    // Create the diagram object
     myDiagram = $(go.Diagram, "myDiagramDiv",
        {
            "undoManager.isEnabled": true,  // Enable undo and redo
        });

   


    myDiagram.addDiagramListener("ObjectSingleClicked", function (ev) {
        console.log(ev.subject); //Successfully logs the node you clicked.
        console.log(ev.subject.ie); //Successfully logs the node's name.
        
        console.log("This is a log message 9.");
        const selected = ev.diagram.selection;
        selected.each(node => {
            console.log("Selected node:", node.data);
            
            console.log("web browser test ")
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            window.ReactNativeWebView.postMessage(JSON.stringify({"event":'click',"nodeName":node.data}));
      
            // Check for iOS
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                console.log("iOS Brouser")
                window.webkit.messageHandlers.observer.postMessage(JSON.stringify({"event":'click',"nodeName":node.data}));
           
                
            }
        
            // Check for Android
            else if (/android/i.test(userAgent)) {
                console.log("Android brouser")
             JSInterface.postMessage(JSON.stringify({"event":'click',"nodeName":node.data}))
    
            }
            
            else {
                console.log("web browser")
                window.parent.postMessage(JSON.stringify({"event":'click',"nodeName":node.data}))
          
            }
            window.webkit.messageHandlers.observer.postMessage(JSON.stringify({"event":'click',"nodeName_Test2":node.data}));
           
           
        });
    });



    myDiagram.nodeTemplateMap.add("RoundTable",
        $(go.Node, "Auto",
            // Bind the position of the node
            { position: new go.Point(0, 0) },
            new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Ellipse", // Circular table
                { width: 80, height: 80, fill: "lightgreen" },
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 5 },
                new go.Binding("text", "name"))
        )
    );

    // Rectangle Tables
    myDiagram.nodeTemplateMap.add("RectangleTable",
        $(go.Node, "Auto",
            { position: new go.Point(0, 0) },
            new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          
            $(go.Shape, "Rectangle", // Rectangular table
                { width: 120, height: 60, fill: "lightblue" },
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 5 },
                new go.Binding("text", "name"))
        ));

    // Sofas
    myDiagram.nodeTemplateMap.add("Sofa",
        $(go.Node, "Auto",
            { position: new go.Point(0, 0) },
            new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          
            $(go.Shape, "RoundedRectangle", // Sofas are rounded rectangles
                { width: 150, height: 50, fill: "orange" },
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 5 },
                new go.Binding("text", "name"))
                
        ));
 
        // Bathroom (Represented by a custom icon or text)
    myDiagram.nodeTemplateMap.add("Bathroom",
        $(go.Node, "Auto",
            { position: new go.Point(0, 0) },
            new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          
            $(go.Shape, "Rectangle", // Restrooms can be represented as squares or icons
                { width: 70, height: 70, fill: "lightgray" },
                new go.Binding("fill", "color")),
            $(go.TextBlock, { text: "Bathroom", margin: 5, font: "bold 10pt sans-serif" })
        ));
}

window.addEventListener('DOMContentLoaded', init);
document.getElementById("getPositionBtn").addEventListener("click", fetchNodePositions);
