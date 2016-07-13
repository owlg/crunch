(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["browser.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"row\">\n\n    <div class=\"col-md-12 main\">\n    \n        <h4 class=\"page-header\">Table Browser</h4>\n\n        <div class=\"table-responsive\" id=\"browser\">\n\n        </div>\n\n    </div>\n\n    <!-- Modal box for table details -->\n\t<div class=\"modal\" id=\"table-detail\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"table-detail\">\n\t  <div class=\"modal-dialog modal-lg\" role=\"document\">\n\t    <div class=\"modal-content\">\n\t      <div class=\"modal-header\">\n\t        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n\t        <h4 class=\"modal-title\" id=\"table-detail-title\">table</h4>\n\t      </div>\n\t      <div class=\"modal-body\" id=\"table-detail-body\">\n\t\t      <h5>Columns</h6>\n\t\t      <ul id=\"table-columns\"></ul>\n\t\t      <h5>Sample</h6>\n\t\t      <div class=\"table-responsive\" id=\"browser-sample\">\n\t    \t\t\t<table class=\"table table-striped table-sm\" id=\"table-sample\"></table>\n\t\t\t  </div>\n\t      </div>\n\t      <div class=\"modal-footer\">\n\t        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n\t      </div>\n\t    </div>\n\t  </div>\n\t</div>\n\n</div>\n\n<script>\n\n$('#browser').html(nunjucks.render('partials/table-browser.html', {tables: alasql('SHOW TABLES;')}));\n\n$(\".table-name\").click(function(event) {\n\tevent.preventDefault();\n\n\t// Get table ID\n\ttableid = $(this).data(\"tableid\");\n\n\t// Set title of modal\n\t$('#table-detail-title').text(\"Table: \" + tableid);\n\n\t// Render sample\n    alasql.promise('SELECT * FROM ' + tableid + ' LIMIT 10;')\n    .then(function(res){\n        alasql('SELECT * INTO HTML(\"#table-sample\", {headers:true}) FROM ?',[res]);\n\n\t\t// Get & set columns\n\t\tcolumns = [];\n\t\t$('#table-columns').empty();\n\t\t$('#table-sample thead th').each(function() {\n\t\t    $('#table-columns').append('<li>' + $(this).text() + '</li>');\n\t\t});\n\n\t\t// Pop modal\n\t\t$('#table-detail').modal('show');\n\n    }).catch(function(err){\n        console.log('There was an error:', err);\n    });\n\n\t});\n\n</script>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["editor.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"row\">\n\n    <div class=\"col-sm-3 col-md-2 sidebar\">\n        <ul class=\"nav nav-sidebar\" id=\"tables\">\n            <li>\n                <h6>Tables</h6>\n            </li>\n        </ul>\n\n        <ul class=\"nav nav-sidebar\">\n            <li>\n                <h6>Upload a CSV:</h6>\n            </li>\n            <input type=\"file\" id=\"readfile\" onchange=\"loadFile(event)\" style=\"display: none;\" />\n            <li>\n                <input type=\"button\" class=\"btn btn-secondary btn-sm\" value=\"Browse...\" onclick=\"document.getElementById('readfile').click();\" />\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main\">\n    \n        <h4 class=\"page-header\">Query</h4>\n        <div id=\"editor\"></div>\n        <button type=\"button\" class=\"btn btn-primary m-t-1\" id=\"run\">Run Query</button>\n\n        <h4 class=\"page-header m-t-2\">Results <a href=\"javascript:exportCSV();\" id=\"export\"><i class=\"fa fa-download\"></i></a></h4>\n\n        <div class=\"alert alert-danger\" id=\"error\" role=\"alert\">\n            <strong>Error:</strong> <span></span>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table table-striped table-sm\" id=\"results\"></table>\n        </div>\n\n    </div>\n\n</div>\n\n<script>\n\n    // Populate editor div with last query, or sample query if it doesn't exist\n    if(localStorage.lastQuery) {\n        $('#editor').html(decodeURIComponent(localStorage.lastQuery));\n    }\n\n    else {\n        $('#editor').html('-- Example Query \\nSHOW TABLES;');\n    }\n\n    // Get theme configuration\n    var editorTheme = 'ace/theme/clouds';\n    if(localStorage.editorTheme) {\n        editorTheme = localStorage.editorTheme;\n    }\n\n    // Setup ACE editor\n    var editor = ace.edit(\"editor\");\n    editor.setTheme(editorTheme);\n    editor.getSession().setMode(\"ace/mode/sql\");\n\n   // Slugify\n    function convertToSlug(Text)\n    {\n        return Text\n            .replace(/\\W+/g, \"\")\n            .toLowerCase();\n    }\n\n    // Refresh table sidebar\n    function refreshSidebar() {\n        $('#tables').html(nunjucks.render('partials/table-list.html', {tables: alasql('SHOW TABLES;')}));\n    }\n\n    // Export CSV\n    function exportCSV() {\n            alasql('SELECT * INTO CSV(\"results.csv\",{headers:true, separator: \",\"}) \\\n                    FROM HTML(\"#results\",{headers:true})');\n        }\n\n    // Function to be called upon import button click\n     function loadFile(event) {\n         alasql('SELECT * FROM FILE(?,{headers:true})',[event],function(data){\n\n         slug = convertToSlug($('#readfile')[0].files[0].name);\n\n         alasql('DROP TABLE IF EXISTS ' + slug + '; \\\n                 CREATE TABLE ' + slug + '; \\\n                 SELECT * INTO ' + slug + ' FROM ?', [data], function(){\n\n                    refreshSidebar();\n\n              });\n         });\n     }\n\n     // Log query history\n     function logHistory(query, status) {\n        \n        if (localStorage.history) {\n            queryHistory = JSON.parse(localStorage.history);\n        }\n\n        else {\n            queryHistory = [];\n        }\n\n        queryHistory.push({ body: query, status: status });\n        localStorage.history = JSON.stringify(queryHistory);\n        localStorage.lastQuery = encodeURIComponent(query);\n        \n     }\n\n     // Run button clicked\n     $(\"#run\").click(function() {\n        query = editor.getValue()\n        alasql.promise(query)\n        .then(function(res){\n            console.log(res);\n            alasql('SELECT * INTO HTML(\"#results\", {headers:true}) FROM ?',[res]);\n            $('#error').hide();\n            $('#results').show();\n            $('#export').show();\n            logHistory(query, \"Completed\");\n        }).catch(function(err){\n            console.log('There was an error:', err);\n            $('#error > span').text(err);\n            $('#results').hide();\n            $('#error').show();\n            $('#export').hide();\n            logHistory(query, \"Failed\");\n        });\n     });\n\n     refreshSidebar();\n</script> ";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["history.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"row\">\n\n    <div class=\"col-md-12 main\">\n    \n        <h4 class=\"page-header\">History</h4>\n\n        <div class=\"table-responsive\" id=\"history\">\n\n        </div>\n\n    </div>\n\n</div>\n\n<script>\n\nqueryHistory = [];\n\nif (localStorage.history) {\n\tqueryHistory = JSON.parse(localStorage.history).reverse();\n}\n\n$('#history').html(nunjucks.render('partials/history-table.html', {history: queryHistory }));\n\n$(\".query\").click(function(event) {\n\tevent.preventDefault();\n\tlocalStorage.lastQuery = $(this).data(\"query\");\n\twindow.location.hash = '#editor';\n\t});\n\n</script>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["partials/history-table.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "            <table class=\"table table-striped table-sm\" id=\"history\">\n                <thead>\n                    <tr>\n                        <th>Query</th>\n                        <th>Status</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "history");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("query", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n                    <tr>\n                        <td><a href=\"#history\" class=\"query\" data-query=\"";
output += runtime.suppressValue(env.getFilter("urlencode").call(context, runtime.memberLookup((t_4),"body")), env.opts.autoescape);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"body"), env.opts.autoescape);
output += "</a></td>\n                        <td class=\"";
if(runtime.memberLookup((t_4),"status") == "Completed") {
output += "text-success";
;
}
else {
output += "text-danger";
;
}
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"status"), env.opts.autoescape);
output += "</td>\n                    </tr>\n                    ";
;
}
}
frame = frame.pop();
output += "\n            </table>\n                </tbody>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["partials/table-browser.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "    <table class=\"table table-striped table-sm\">\n        <thead>\n            <tr>\n                <th>Table</th>\n                <th>Actions</th>\n            </tr>\n        </thead>\n        <tbody>\n            ";
frame = frame.push();
var t_3 = env.getFilter("sort").call(context, runtime.contextOrFrameLookup(context, frame, "tables"),true,false,"tableid");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("table", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n            <tr>\n                <td><a href=\"#browser\" class=\"table-name\" data-tableid=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"tableid"), env.opts.autoescape);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"tableid"), env.opts.autoescape);
output += "</a></td>\n                <td><a href=\"#browser\" class=\"text-danger\" data-tableid=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"tableid"), env.opts.autoescape);
output += "\">DROP</a></td>\n            </tr>\n            ";
;
}
}
frame = frame.pop();
output += "\n    </table>\n        </tbody>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["partials/table-list.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "\t\t<li><h6>Tables</h6></li>\n\t\t";
frame = frame.push();
var t_3 = env.getFilter("sort").call(context, runtime.contextOrFrameLookup(context, frame, "tables"),true,false,"tableid");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("table", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n\t\t<li><a href=\"javascript:editor.insert('";
output += runtime.suppressValue(runtime.memberLookup((t_4),"tableid"), env.opts.autoescape);
output += "'); editor.focus()\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"tableid"), env.opts.autoescape);
output += "</a></li>\n\t\t";
;
}
}
frame = frame.pop();
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["settings.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"row\">\n\n    <div class=\"col-md-6 main\">\n    \n        <h4 class=\"page-header\">Settings</h4>\n        <h6>Editor Theme</h6>\n\t\t<select id=\"theme\" size=\"1\">\n\t\t    <optgroup label=\"Bright\">\n\t\t        <option value=\"ace/theme/chrome\">Chrome</option>\n\t\t        <option value=\"ace/theme/clouds\">Clouds</option>\n\t\t        <option value=\"ace/theme/crimson_editor\">Crimson Editor</option>\n\t\t        <option value=\"ace/theme/dawn\">Dawn</option>\n\t\t        <option value=\"ace/theme/dreamweaver\">Dreamweaver</option>\n\t\t        <option value=\"ace/theme/eclipse\">Eclipse</option>\n\t\t        <option value=\"ace/theme/github\">GitHub</option>\n\t\t        <option value=\"ace/theme/iplastic\">IPlastic</option>\n\t\t        <option value=\"ace/theme/solarized_light\">Solarized Light</option>\n\t\t        <option value=\"ace/theme/textmate\">TextMate</option>\n\t\t        <option value=\"ace/theme/tomorrow\">Tomorrow</option>\n\t\t        <option value=\"ace/theme/xcode\">XCode</option>\n\t\t        <option value=\"ace/theme/kuroir\">Kuroir</option>\n\t\t        <option value=\"ace/theme/katzenmilch\">KatzenMilch</option>\n\t\t        <option value=\"ace/theme/sqlserver\">SQL Server</option>\n\t\t    </optgroup>\n\t\t    <optgroup label=\"Dark\">\n\t\t        <option value=\"ace/theme/ambiance\">Ambiance</option>\n\t\t        <option value=\"ace/theme/chaos\">Chaos</option>\n\t\t        <option value=\"ace/theme/clouds_midnight\">Clouds Midnight</option>\n\t\t        <option value=\"ace/theme/cobalt\">Cobalt</option>\n\t\t        <option value=\"ace/theme/idle_fingers\">idle Fingers</option>\n\t\t        <option value=\"ace/theme/kr_theme\">krTheme</option>\n\t\t        <option value=\"ace/theme/merbivore\">Merbivore</option>\n\t\t        <option value=\"ace/theme/merbivore_soft\">Merbivore Soft</option>\n\t\t        <option value=\"ace/theme/mono_industrial\">Mono Industrial</option>\n\t\t        <option value=\"ace/theme/monokai\">Monokai</option>\n\t\t        <option value=\"ace/theme/pastel_on_dark\">Pastel on dark</option>\n\t\t        <option value=\"ace/theme/solarized_dark\">Solarized Dark</option>\n\t\t        <option value=\"ace/theme/terminal\">Terminal</option>\n\t\t        <option value=\"ace/theme/tomorrow_night\">Tomorrow Night</option>\n\t\t        <option value=\"ace/theme/tomorrow_night_blue\">Tomorrow Night Blue</option>\n\t\t        <option value=\"ace/theme/tomorrow_night_bright\">Tomorrow Night Bright</option>\n\t\t        <option value=\"ace/theme/tomorrow_night_eighties\">Tomorrow Night 80s</option>\n\t\t        <option value=\"ace/theme/twilight\">Twilight</option>\n\t\t        <option value=\"ace/theme/vibrant_ink\">Vibrant Ink</option>\n\t\t    </optgroup>\n\t\t</select>\n\n\t\t<p class=\"text-muted m-t-2\"><small>Settings are automatically saved</small></p>\n\n\t\t</div>\n\n\t\t<div class=\"col-md-6 main\">\n\n\n\t        <h6>Editor Preview:</h6>\n\n<div id=\"editor-preview\">SELECT category, count(*) as total\nFROM table\nGROUP BY category\nLIMIT 10</div>\n\n    \t</div>\n\n</div>\n\n<script>\n\n\t// Get theme configuration\n\tvar editorTheme = 'ace/theme/clouds';\n\tif(localStorage.editorTheme) {\n\t\teditorTheme = localStorage.editorTheme;\n\t}\n\n\t// Pre-select editor dropdown\n\t$('#theme').val(editorTheme);\n\n    // Setup ACE editor, put into read only mode (for preview)\n    var editorPreview = ace.edit(\"editor-preview\");\n    editorPreview.setTheme(editorTheme);\n    editorPreview.getSession().setMode(\"ace/mode/sql\");\n    editorPreview.setReadOnly(true);\n\n    // On change preview + save\n    $('#theme').on('change', function() {\n\t  editorTheme = $(this).val();\n\t  localStorage.editorTheme = editorTheme;\n\t  editorPreview.setTheme(editorTheme);\n\t});\n\n\n</script>";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

