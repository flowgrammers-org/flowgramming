var graph = window.graph;
var paper = window.paper;
var objects = window.objects;
var links = window.links;
var start = window.start;
var variables = window.variables;

async function delay_loop(currentElement) {
    var delay = 1000;
    let width = currentElement.model.attr("body/strokeWidth");
    currentElement.model.attr("body/strokeWidth", 5);
    var ifresult;
    if (currentElement.type === 'input') {
        await handleInput(currentElement).then((doc) => {

        }).catch((err) => {
            alert(err.toString());
            currentElement.model.attr("body/strokeWidth", width);
            currentElement = null;
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
    }, delay);
}


async function handleInput(element) {
    if (!element.variablename) {
        throw new Error("Assign a variable name");
    }
    renderProgram("Enter the value for variable " + element.variablename);

    var A = await allowUser();
    let type, val;

    if (is_int(A) === true) {
        type = "int";
        val = parseInt(A);
        window.geval("var " + element.variablename + " = " + "parseInt(" + A + ");");
    } else if (is_float(A) === true) {
        type = "float";
        val = parseFloat(A);
        window.geval(window, "var " + element.variablename + " = " + "parseFloat(" + A + ");");
    } else {
        // console.log(A);
        type = "string";
        val = A;
        window.geval(window, "var " + element.variablename + " = '" + A + "';");
    }
    variables[element.variablename] = {
        type: type,
        value: val
    };
    // console.log(variables)
    return { status: "Ok" };
}

async function handleOutput(element) {
    if (!element.exp) {
        throw new Error("Assign a Expression");
    }
    var A = window.geval(element.exp)
    renderProgram(A)
    return { status: "Ok" };
}

async function handleIf(element) {
    if (!element.exp) {
        throw new Error("Assign a Expression");
    }
    var A = window.geval(element.exp)
    if (A)
        return true;
    else
        return false;
}


function run() {
    var currentElement = start;
    delay_loop(currentElement);
    clearChat();
}



function is_float(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        if (n.includes(".")) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

function is_int(n) {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
        if (n.includes(".")) {
            return false;
        } else {
            return true;
        }
    }
    return false;
}