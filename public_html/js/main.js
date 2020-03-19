var errors = document.getElementById("errors");
var file = document.getElementById("selectedFile").value;
var nodes = null;

class Node {
    constructor(name) {
        this.children = [];
        this.name = name;
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
                return;
            }
        }
    }

    getChild(i) {
        return this.children[i];
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return this.children.length > 0;
    }
}
;

document.getElementById('selectedFile').addEventListener('change', function selectedFileChanged() {
    if (this.files.length === 0) {
        console.log('No file selected.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
        document.getElementById('result').innerHTML = "";
        var json = JSON.parse(reader.result);
        console.log(json);
        populateTree(json);
    };
    reader.readAsText(this.files[0]);
});


function populateTree(json) {
    nodes = new Array();
    errors.innerHTML = '';
    for (var i = 0; i < json.length; i++) {
        var splitJson = json[i].split(' ');
        var child = splitJson[0];
        var parent = splitJson[1];

        if (splitJson.length != 2 || splitJson == " ") {
            errors.innerHTML += 'Invalid data format! ' + json[i] + "<br />";
        } else if (parent == child) {
            errors.innerHTML += 'Parent can not be his own child!  ' + parent + "->" + child + "<br />";
            break;
        } else {
            var exists = false;
            nodeParent = new Node(parent);
            nodeChild = new Node(child);
            for (var j = 0; j < nodes.length; j++) {
                if (nodes[j].name == parent) {
                    nodes[j].add(nodeChild);
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                nodeParent.add(nodeChild);
                nodes.push(nodeParent);
            }
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        var path = new Array();
        checkForCycle(path, nodes[i]);
        switcherooni(nodes[i]);
    }
    document.getElementById('result').appendChild(makeHTMLTree());
}
;


function makeHTMLTree() {
    var parents = document.createElement('ul');
    for (var i = 0; i < nodes.length; i++) {
        var parent = createLi(nodes[i]);
        parents.appendChild(parent);
    }
    return parents;
}

function createLi(node) {
    if (node.getChildren().length > 0) {
        var parent = document.createElement('ul');
        var parentName = document.createElement('li');
        parentName.appendChild(document.createTextNode(node.name));
        parent.appendChild(parentName);
        for (var i = 0; i < node.getChildren().length; i++) {
            node.getChildren().sort((a, b) => a.name.localeCompare(b.name));
            child = createLi(node.getChild([i]));
            parent.appendChild(child);
        }
        return parent;
    } else {
        var parent = document.createElement('ul');
        var child = document.createElement('li');
        child.appendChild(document.createTextNode(node.name));
        parent.appendChild(child);
        return parent;
    }
}


function switcherooni(node) {
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes[i].getChildren().length; j++) {
            if (nodes.indexOf(nodes[i].getChild(j)) > -1) {
                nodes.splice(nodes.indexOf(nodes[i].getChild(j)), 1);
                i = 0;
            }
            if (nodes[i].getChild(j).name == node.name) {
                nodes[i].remove(nodes[i].getChild(j));
                nodes[i].add(node);
                break;
            }
        }
    }
}

function checkForCycle(path, node) {
    if (!path.includes(node.name)) {
        path.push(node.name);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].name == node.name) {
                for (var j = 0; j < nodes[i].getChildren().length; j++) {
                    checkForCycle(path, nodes[i].getChild(j));
                }
            }
        }
    } else {
        errors.innerHTML += 'There is cycle between  ' + path[path.length - 1] + ' and ' + node.name + '<br />';
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].name == path[path.length - 1]) {
                for (var j = 0; j < nodes[i].getChildren().length; j++) {
                    if (nodes[i].getChild(j).name == node.name) {
                        nodes[i].remove(nodes[i].getChild(j));
                    }
                }
            }
        }
        errors.innerHTML += 'Cycle removed!' + '<br />';
        return;
    }
}
