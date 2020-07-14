var graph = window.graph
var paper = window.paper
var objects = window.objects
var links = window.links
var start = window.start
var variables = window.variables

async function delay_loop (currentElement) {
  var delay = 1000
  const width = currentElement.model.attr('body/strokeWidth')
  currentElement.model.attr('body/strokeWidth', 5)
  var ifresult
  if (currentElement.type === 'input') {
    await handleInput(currentElement).then((doc) => {

    }).catch((err) => {
      alert(err.toString())
      currentElement.model.attr('body/strokeWidth', width)
      currentElement = null
    })
  } else if (currentElement.type === 'output') {
    await handleOutput(currentElement).then((doc) => {

        }).catch((err) => {
            alert(err.toString());
            currentElement.model.attr("body/strokeWidth", width);
            currentElement = null;
        })
    } else if (currentElement.type === 'if') {
        await handleIf(currentElement).then((doc) => {
            ifresult = doc;
        }).catch((err) => {
            alert(err.toString());
            currentElement.model.attr("body/strokeWidth", width);
            currentElement = null;
        })
    } else if (currentElement.type === 'declare') {
        await handleDeclaration(currentElement).then((doc) => {

        }).catch((err) => {
            alert(err.toString());
            currentElement.model.attr("body/strokeWidth", width);
            currentElement = null;
        })
    }
    setTimeout(function () {
        currentElement.model.attr("body/strokeWidth", width);
        if (currentElement.outgoing_link) {
            if (currentElement.type === 'if') {
                if (ifresult) {
                    let currentLink = findLink(currentElement.outgoing_link.trueLink);
                    currentElement = findObject(currentLink.target);
                } else {
                    let currentLink = findLink(currentElement.outgoing_link.falseLink);
                    currentElement = findObject(currentLink.target);
                }
                delay_loop(currentElement);
            } else {
                let currentLink = findLink(currentElement.outgoing_link.next);
                currentElement = findObject(currentLink.target);
                delay_loop(currentElement);
            }
        }
  }, delay)
}

async function handleDeclaration(element) {
    let type;
    if (element.variabletype === "Integer") {
        type = "int";
    } else if (element.variabletype === "Float") {
        type = "float";
    } else if (element.variabletype === 'Char') {
        type = "char";
    } else
    {
        type = 'string';
    }
    variables [element.variablename] = {
        type: type,
        value: null
    }
}

async function handleInput(element) {
    if (!element.variablename) {
        throw new Error("Assign a variable name");
    }
    renderProgram("Enter the value for variable " + element.variablename);
    if (!(element.variablename in variables) ){
        throw new Error("Declare the variable before using it.");
    }
    var A = await allowUser();
    let type, val, obj;
    obj = variables[element.variablename];
    type = obj.type;
    if (type === "int" && is_int(A) === true) {
        val = parseInt(A);
        window.geval("var " + element.variablename + " = " + "parseInt(" + A + ");");
    } else if (type === "float" &&is_float(A) === true) {
        val = parseFloat(A);
        window.geval("var " + element.variablename + " = " + "parseFloat(" + A + ");");
    } else if (type === "char"){
        if (A.length>1){
            throw new Error("Enter a Character");
        }
        val = A;
        window.geval("var " + element.variablename + " = '" + A + "';");
    } else if (type === "string"){
        val = A;
        window.geval("var " + element.variablename + " = '" + A + "';");
    } else {
        throw new Error("Data type mismatch.");
    }
    variables[element.variablename] = {
        type: type,
        value: val
    };
    return { status: "Ok" };
}

async function handleOutput(element) {
    if (!element.exp) {
        throw new Error("Assign a Expression");
    }
    var A = window.geval(element.exp);
    renderProgram(A);
    return { status: "Ok" };
}

async function handleIf(element) {
    if (!element.exp) {
        throw new Error("Assign a Expression");
    }
    var A = window.geval(element.exp);
    if (A)
        return true;
    else
        return false;
}


function run() {
    var currentElement = start;
    delay_loop(currentElement).then(() => variables = []);
    clearChat();
}



function is_float(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !!n.includes(".");
    }
    return false
  }

function is_int(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        return !n.includes(".");
    }
    return false
}
