const capitalize=e=>e.charAt(0).toUpperCase()+e.slice(1);window.swal=(e,a="error")=>{var n;Swal.fire({title:(n=a,n.charAt(0).toUpperCase()+n.slice(1)),html:e,icon:a,heightAuto:!1})},window.swalConfirm=(e,a)=>{Swal.fire({title:"Are you sure?",html:e,icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, do it!",heightAuto:!1}).then(e=>{e.isConfirmed&&a()})},window.toast=e=>{Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:5e3,timerProgressBar:!0,icon:"success",title:e,didOpen:e=>{e.addEventListener("mouseenter",Swal.stopTimer),e.addEventListener("mouseleave",Swal.resumeTimer)}}).fire()};let loadingToast=null;function getCurrentElementValue(e,a){let n=void 0;switch(a){case"input":n=e.attr("element/variableName");break;case"output":case"comment":case"if":case"doWhileExpr":case"while":if("for"!==e.attr("element/loopType"))n=e.attr("element/expression");else{const{forLoop:a,expression:t}=e.attr("element");n={forLoop:a,expression:t}}break;case"declare":case"assignment":case"function":n=e.attr("element")}return n||""}function shouldSelectDataType(e,a){return"Default"===a?e.variableType&&"Default"!==e.variableType?"":"selected":e.variableType&&e.variableType.startsWith(a)?"selected":""}function shouldMarkArrayCheckbox(e){return e.variableType&&e.variableType.endsWith("array")?"checked":""}function onArrayCheckboxChanged(){$("#isArray").is(":checked")?($("#arrayDimension").show(),onArrayDimensionChanged()):$("#arrayDimension").hide()}function shouldMarkArray2D(e){return e.is2DArray?"checked":""}function shouldMarkArray1D(e){return e.is2DArray?"":"checked"}function onArrayDimensionChanged(){"1D"===$("input[name='dimension']:checked").val()?($("#arrayLength").show(),$("#array2D").hide()):($("#arrayLength").hide(),$("#array2D").show())}function handleElementDoubleClick(e){const a=findModel(e.model.id);$("#delbtn").text("Delete").attr("onclick","handleDelete()"),$("#modal .modal-content").attr("data-element",JSON.stringify(a));const n=a.attr("element/type"),t=getCurrentElementValue(a,n);let r,o;switch(n){case"declare":o=`\n                    <p>Enter Variable Name and Type</p>\n                     <div class="input-group">\n                        <input id="variable" type="text" class="form-control" placeholder="Name"\n                                value="${t.variableName||""}">\n                        <select class="custom-select" id="variableType">\n                            <option value="Default" ${shouldSelectDataType(t,"Default")} disabled>\n                                Type\n                            </option>\n                            <option value="Integer" ${shouldSelectDataType(t,"Integer")}>\n                                Integer\n                            </option>\n                            <option value="Float" ${shouldSelectDataType(t,"Float")}>\n                                Float\n                            </option>\n                            <option value="Char" ${shouldSelectDataType(t,"Char")}>\n                                Character\n                            </option>\n                        </select>\n                    </div>\n                    <hr>\n                    <div class="form-check ml-1 mt-1">\n                      <input class="form-check-input" type="checkbox" id="isArray" \n                            ${shouldMarkArrayCheckbox(t)} onclick="onArrayCheckboxChanged()">\n                      <label class="form-check-label" for="isArray">\n                        Is an array\n                      </label>\n                    </div>\n                    <div id='arrayDimension'>\n                        <div class="form-check" >\n                            <div class="form-check form-check-inline">\n                              <input class="form-check-input" type="radio" id="1D" value='1D' name='dimension' ${shouldMarkArray1D(t)} onchange="onArrayDimensionChanged()">\n                              <label class="form-check-label" for="1D">1D</label>\n                            </div>\n                            <div class="form-check form-check-inline">\n                              <input class="form-check-input" type="radio" name='dimension' value='2D' id="2D" ${shouldMarkArray2D(t)} onchange='onArrayDimensionChanged()'>\n                              <label class="form-check-label" for="2D">2D</label>\n                            </div>\n                        </div>\n                        <div class="input-group mt-2" >\n                            <input id="arrayLength" type="number" class="form-control" placeholder="Array length"\n                                        value="${t.arrayLength||""}" min="1">\n                        </div>  \n                        <div class="input-group mt-2" id='array2D'>\n                            <input id="arrayRow" type="number" class="form-control" placeholder="Rows"\n                                        value="${t.rowLen||""}" min="1">\n                            <input id="arrayCol" type="number" class="form-control" placeholder="Columns"\n                                        value="${t.colLen||""}" min="1">\n                        </div>   \n                    </div> \n            `,r=function(){const e=$("#variable").val();let n=$("#variableType option:selected").val(),t=$("#arrayLength").val(),r=$("#arrayRow").val(),o=$("#arrayCol").val();if($("#modal").modal("hide"),e.length<=0)swal("Enter the variable name before declaring it");else if("Default"===n)swal("Enter the variable type before declaring it");else if($("#isArray").is(":checked")&&"1D"===$("input[name='dimension']:checked").val()&&(0===parseInt(t)||isNaN(parseInt(t))))swal("The array length should be declared");else if($("#isArray").is(":checked")&&"2D"===$("input[name='dimension']:checked").val()&&(0===parseInt(r)||isNaN(parseInt(r))||isNaN(parseInt(o))||0===parseInt(o)))swal("The number of rows and columns should be declared");else if(r.includes(".")||o.includes(".")||t.includes("."))swal("Array sizes must only be natural numbers");else{const l=$("#isArray").is(":checked"),i="2D"===$("input[name='dimension']:checked").val();n+=l?" array":"";let s=n+" ";variableArray=e.split(",");let c=!0;for(let e=0;e<variableArray.length&&(c=c&&handleNamingConvention(variableArray[e]),c);e++);c&&(l?i?(variableArray.forEach(e=>{s+=`${e}[${r}][${o}], `}),t=""):(variableArray.forEach(e=>{s+=`${e}[${t}], `}),r=o=""):variableArray.forEach(e=>{s+=e+", "}),a.attr({label:{text:getWrapText(s.slice(0,-2))},element:{variableName:e,variableArray:variableArray,variableType:n,is2DArray:i,rowLen:r,colLen:o,arrayLength:t,isArrayChecked:l}}))}};break;case"input":o=`\n                <p>Enter Variable Name</p>\n                <div class="input-group">\n                    <input id="variable" type="text" class="form-control"\n                            value="${escapeQuotes(t)}">\n                </div>\n            `,r=function(){const e=$("#variable").val();$("#modal").modal("hide"),e.length>0?a.attr({label:{text:getWrapText("Input "+e)},element:{variableName:e}}):swal("Enter input variable name")};break;case"comment":o=`\n                    <p>Enter the comment</p>\n                    <div class="input-group">\n                        <input id="exp" type="text" class="form-control"\n                                value="${escapeQuotes(t)}">\n                    </div>\n                `,r=function(){const e=$("#exp").val();$("#modal").modal("hide"),e.length>0?a.attr({label:{text:getWrapText(e)},element:{expression:e}}):swal("Enter the comment")};break;case"output":case"if":case"doWhileExpr":case"while":"for"!==a.attr("element/loopType")?(o=`\n                    <p>Enter the expression</p>\n                    <div class="input-group">\n                        <input id="exp" type="text" class="form-control"\n                                value="${escapeQuotes(t)}">\n                    </div>\n                `,r=function(){const e=$("#exp").val();$("#modal").modal("hide"),e.length>0?a.attr({label:{text:getWrapText(("output"===n?"Print ":"")+e)},element:{expression:e}}):swal("Enter the expression")}):(o=`\n                      <p>Enter expressions below</p>\n                      <hr>\n                      <div class="form-group">\n                        <label for="initialisation">Initialisation</label>\n                        <input type="text" class="form-control" id="initialisation"\n                            value="${t.forLoop&&escapeQuotes(t.forLoop.init)||""}">\n                      </div>\n                      <div class="form-group">\n                        <label for="condition">Condition</label>\n                        <input type="text" class="form-control" id="condition"\n                            value="${t.expression?escapeQuotes(t.expression):""}">\n                      </div>\n                      <div class="form-group">\n                        <label for="incrementation">Incrementation</label>\n                        <input type="text" class="form-control" id="incrementation"\n                            value="${t.forLoop&&escapeQuotes(t.forLoop.incr)||""}">\n                      </div>\n                `,r=function(){const e=$("#initialisation").val(),n=$("#condition").val(),t=$("#incrementation").val();$("#modal").modal("hide"),0===e.length?swal("Enter initial value"):0===n.length?swal("Enter the condition"):0===t.length?swal("Increment the variable"):a.attr({label:{text:getWrapText(`${e}; ${n}; ${t}`)},element:{expression:n,forLoop:{init:e,incr:t}}})});break;case"assignment":o=`\n                <p>Select a variable and enter the value</p>\n                <div class="input-group mb-3">\n                  <input type="text" id="variableName" class="form-control" placeholder="Variable name"\n                    value="${t.variableName?escapeQuotes(t.variableName):""}">\n                  <input type="text" id="variableValue" class="form-control" placeholder="Variable value"\n                    value="${t.variableName?escapeQuotes(t.variableValue):""}">\n                </div>\n            `,r=function(){const e=$("#variableValue").val(),n=$("#variableName").val();$("#modal").modal("hide"),n.length<=0?swal("Enter the variable name"):e.length<=0?swal("Enter variable value"):a.attr({label:{text:getWrapText(n+" = "+e)},element:{variableName:n,variableValue:e}})};break;case"function":o=`\n                <p>Function call</p>\n                <div class="input-group mb-3">\n                  <input type="text" id="functionName" class="form-control" placeholder="Function name"\n                    value="${t.functionName?escapeQuotes(t.functionName):""}">\n                </div>\n                <div class="input-group mb-3">\n                  <input type="text" id="functionParams" class="form-control" placeholder="Comma separated parameters"\n                    value="${t.functionParams?escapeQuotes(t.functionParams):""}">\n                </div>\n                <div class="input-group">\n                  <input type="text" id="functionVariable" class="form-control" placeholder="Variable for return value"\n                    value="${t.functionVariable?escapeQuotes(t.functionVariable):""}">\n                </div>\n            `,r=function(){const e=$("#functionParams").val(),n=$("#functionName").val(),t=$("#functionVariable").val();$("#modal").modal("hide"),n.length<=0?swal("Enter the function name"):a.attr({label:{text:getWrapText((t?t+" = ":"")+`${n}(${e})`)},element:{functionName:n,functionParams:e,functionVariable:t}})}}$("#modal .modal-body").html(o),$("#modal").modal("show"),$("#okButton").one("click",r),$("#xbtn").on("click",(function(){$("#okButton").off("click")})),$("#isArray").ready(onArrayCheckboxChanged)}function handleNamingConvention(e,a="Variable"){return new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$").test(e)?!["int","float","string","array","char","if","else","while","for","switch","case","default","break","continue","auto","const","let","var","do","foreach","enum","long","register","return","short","signed","sizeof","static","struct","typedef","union","unsigned","void","volatile","new","throw","catch","printf","scanf","print","cin","cout","scanner","list","in","true","false","null","None","not"].includes(e)||(swal(a+" name must not be a keyword"),!1):(swal("Follow naming convention <br> <hr>"+a+" name should start only either with an underscore or an alphabet. It should not start with number or any other special symbols <hr>Other characters apart from first character can be alphabets, numbers or _ character <hr>"+a+" name should not contain space <br>"),!1)}function handleDelete(){try{let e=$("#modal .modal-content").attr("data-element");if(e&&(e=findModel(JSON.parse(e).id)),"if"===e.attr("element/type"))deleteIF(e);else if("while"===e.attr("element/type"))deleteWhile(e);else{if("doWhileExpr"===e.attr("element/type"))throw new Error("DoWhile Block can't be deleted");deleteBlock(e)}}catch(e){swal(e.toString())}}function openNewTab(e,a){return window.open(e,a)}window.showLoader=(e,a)=>{loadingToast=Swal.fire({heightAuto:!1,html:`\n            <div class="p-4">\n                <div class="loader"></div>\n                <h2><b>${e}</b></h2>\n                <p>${a}</p>\n            </div>`,showConfirmButton:!1})},window.hideLoader=()=>{loadingToast&&(loadingToast.close(),loadingToast=null)},preventIndependentOpen=()=>{"localhost"===window.location.hostname||window.opener||(window.location.href="/")};let parentWindowContexts=window.opener.getCurrentContexts();function saveFunctions(){window.opener.updateCurrentContexts(parentWindowContexts),window.close()}function manageFunctionProps(e,a){const n=parentWindowContexts[a],t=$("#functionName");t.val(a).prop("disabled",!0),t.parent().prev().remove(),t.parent().before('<div class="alert alert-warning" role="alert">\n                Function names are not editable. \n                In case you want to edit, kindly delete and create a new function.\n            </div>'),$("#returnVariable").val(n.returnVariable),n.returnType&&$("#returnType").val(n.returnType),$("#parametersTable tr").remove(),n.parameters&&n.parameters.length>0&&n.parameters.forEach(e=>{addFunctionParamsToTable(e.variableName,e.variableType)}),$("#functionsTable > tr").removeClass("table-info"),$(e).parent().parent().addClass("table-info")}function getHTMLForFunctionTableRow(e){return`<tr>\n                <td>${e}</td>\n                <td>\n                    <a class="nav-item d-inline-flex" href="#" role="button" onclick="manageFunctionProps(this, '${e}')" title="Edit Function">\n                        <svg class="mx-2 bi bi-list-task my-auto" fill="cornflowerblue" height="1.25em"\n                             viewBox="0 0 16 16"\n                             width="1.25em"\n                             xmlns="http://www.w3.org/2000/svg">\n                            <path\n                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />\n                            <path fill-rule="evenodd"\n                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />\n                        </svg>\n                    </a>\n                    <a class="nav-item d-inline-flex" href="#" role="button" onclick="deleteFunction(this, '${e}')" title="Delete Function">\n                        <svg class="mx-2 bi bi-list-task my-auto" fill="maroon" height="1.25em" viewBox="0 0 16 16"\n                             width="1.25em"\n                             xmlns="http://www.w3.org/2000/svg">\n                            <path\n                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />\n                            <path fill-rule="evenodd"\n                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />\n                        </svg>\n                    </a>\n                </td>\n            </tr>`}function addFunctionToTable(e){$("#functionsTable").append(getHTMLForFunctionTableRow(e))}function saveFunction(e){const a=$("#functionName"),n=a.val(),t=$("#returnVariable").val(),r=$("#returnType").val();if(!n)return swal("Function name cannot be empty"),!1;if(t&&(!r||"Default"===r))return swal("Return type of the function need to be selected, when you are returning a variable"),!1;if(!handleNamingConvention(n,"Function"))return!1;parentWindowContexts[n]||addFunctionToTable(n);const o=[];return $("#parametersTable tr").each((function(e,a){const n=$(a),t=n.find("td:eq(0)").text(),r=n.find("td:eq(1)").text();o.push({variableName:t,variableType:r})})),parentWindowContexts[n]={...parentWindowContexts[n]||{},returnVariable:t,returnType:r,parameters:o},e.reset(),$("#parametersTable > tr").remove(),$("#functionsTable > tr").removeClass("table-info"),a.prop("disabled",!1),a.parent().prev().remove(),toast(`Function '${n}' saved`),!1}function deleteFunction(e,a){delete parentWindowContexts[a],$(e).parent().parent().remove();const n=$("#functionName");$("form").trigger("reset"),$("#parametersTable > tr").remove(),$("#functionsTable > tr").removeClass("table-info"),n.prop("disabled",!1),n.parent().prev().remove(),toast(`Function '${a}' deleted successfully`)}function deleteParameter(e,a){$(e).parent().parent().remove(),toast(`Parameter '${a}' deleted successfully`)}function getHTMLForParameterRow(e,a){return`<tr>\n                <td>${e}</td>\n                <td>${a}</td>\n                <td>\n                    <a class="nav-item d-inline-flex" href="#" role="button" onclick="manageFunctionParams(this, '${e}','${a}')" title="Edit parameter">\n                        <svg class="mx-2 bi bi-list-task my-auto" fill="cornflowerblue" height="1.25em"\n                             viewBox="0 0 16 16"\n                             width="1.25em"\n                             xmlns="http://www.w3.org/2000/svg">\n                            <path\n                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />\n                            <path fill-rule="evenodd"\n                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />\n                        </svg>\n                    </a>\n                    <a class="nav-item d-inline-flex" href="#" role="button" onclick="deleteParameter(this, '${e}')" title="Delete parameter">\n                        <svg class="mx-2 bi bi-list-task my-auto" fill="maroon" height="1.25em" viewBox="0 0 16 16"\n                             width="1.25em"\n                             xmlns="http://www.w3.org/2000/svg">\n                            <path\n                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />\n                            <path fill-rule="evenodd"\n                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />\n                        </svg>\n                    </a>\n                </td>\n            </tr>`}function addFunctionParamsToTable(e,a){$("#parametersTable").append(getHTMLForParameterRow(e,a))}function getModalBodyForManagingParameter(e,a){return`<p>Enter Variable Name and Type</p>\n             <div class="input-group">\n                <input id="variableName" type="text" class="form-control" placeholder="Name"\n                        value="${e||""}">\n                <select class="custom-select" id="variableType">\n                    <option value="Default" ${shouldSelectDataType({variableType:a},"Default")} disabled>\n                        Type\n                    </option>\n                    <option value="Integer" ${shouldSelectDataType({variableType:a},"Integer")}>\n                        Integer\n                    </option>\n                    <option value="Float" ${shouldSelectDataType({variableType:a},"Float")}>\n                        Float\n                    </option>\n                    <option value="Char" ${shouldSelectDataType({variableType:a},"Char")}>\n                        Character\n                    </option>\n                </select>\n            </div>\n            <hr>\n            <div class="form-check ml-1 mt-1">\n              <input class="form-check-input" type="checkbox" id="isArray" \n                    ${shouldMarkArrayCheckbox({variableType:a})}>\n              <label class="form-check-label" for="isArray">\n                Is an array\n              </label>\n            </div>`}function manageFunctionParams(e,a,n){const t=e&&a&&n;$("#modal .modal-body").html(getModalBodyForManagingParameter(a,n)),$("#modal").modal("show"),$("#okButton").one("click",()=>{const a=$("#variableName").val();let n=$("#variableType option:selected").val();$("#modal").modal("hide"),a.length<=0?swal("Enter the variable name before declaring it"):"Default"===n?swal("Enter the variable type before declaring it"):(n+=$("#isArray").is(":checked")?" array":"",handleNamingConvention()&&(t?($(e).parent().parent().after(getHTMLForParameterRow(a,n)),$(e).parent().parent().remove()):addFunctionParamsToTable(a,n)))})}$(document).ready((function(){parentWindowContexts&&Object.keys(parentWindowContexts).forEach(e=>{addFunctionToTable(e)})}));