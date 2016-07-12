(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["browser.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"row\">\n\n    <div class=\"col-md-12 main\">\n    \n        <h4 class=\"page-header\">Table Browser</h4>\n\n        <p>Coming soon!</p>\n\n    </div>\n\n</div>\n\n<script>\n</script>";
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
output += "<div class=\"row\">\n\n    <div class=\"col-sm-3 col-md-2 sidebar\">\n        <ul class=\"nav nav-sidebar\" id=\"tables\">\n            <li>\n                <h6>Tables</h6>\n            </li>\n        </ul>\n\n        <ul class=\"nav nav-sidebar\">\n            <li>\n                <h6>Upload a CSV:</h6>\n            </li>\n            <input type=\"file\" id=\"readfile\" onchange=\"loadFile(event)\" style=\"display: none;\" />\n            <li>\n                <input type=\"button\" class=\"btn btn-secondary btn-sm\" value=\"Browse...\" onclick=\"document.getElementById('readfile').click();\" />\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main\">\n    \n        <h4 class=\"page-header\">Query</h4>\n        <div id=\"editor\"></div>\n        <button type=\"button\" class=\"btn btn-primary m-t-1\" id=\"run\">Run Query</button>\n\n        <h4 class=\"page-header m-t-2\">Results <a href=\"javascript:exportCSV();\" id=\"export\"><i class=\"fa fa-download\"></i></a></h4>\n\n        <div class=\"alert alert-danger\" id=\"error\" role=\"alert\">\n            <strong>Error:</strong> <span></span>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table table-striped table-sm\" id=\"results\"></table>\n        </div>\n\n    </div>\n\n</div>\n\n<script>\n\n    // Populate editor div with last query, or sample query if it doesn't exist\n    if(localStorage.lastQuery) {\n        $('#editor').html(decodeURIComponent(localStorage.lastQuery));\n    }\n\n    else {\n        $('#editor').html('-- Example Query \\nSHOW TABLES;');\n    }\n\n    // Setup ACE editor\n    var editor = ace.edit(\"editor\");\n    editor.setTheme(\"ace/theme/clouds\");\n    editor.getSession().setMode(\"ace/mode/sql\");\n\n   // Slugify\n    function convertToSlug(Text)\n    {\n        return Text\n            .replace(/\\W+/g, \"\")\n            .toLowerCase();\n    }\n\n    // Refresh table sidebar\n    function refreshSidebar() {\n        $('#tables').html(nunjucks.render('partials/table-list.html', {tables: alasql('SHOW TABLES;')}));\n    }\n\n    // Export CSV\n    function exportCSV() {\n            alasql('SELECT * INTO CSV(\"results.csv\",{headers:true, separator: \",\"}) \\\n                    FROM HTML(\"#results\",{headers:true})');\n        }\n\n    // Function to be called upon import button click\n     function loadFile(event) {\n         alasql('SELECT * FROM FILE(?,{headers:true})',[event],function(data){\n\n         slug = convertToSlug($('#readfile')[0].files[0].name);\n\n         alasql('DROP TABLE IF EXISTS ' + slug + '; \\\n                 CREATE TABLE ' + slug + '; \\\n                 SELECT * INTO ' + slug + ' FROM ?', [data], function(){\n\n                    refreshSidebar();\n\n              });\n         });\n     }\n\n     // Log query history\n     function logHistory(query, status) {\n        \n        if (localStorage.history) {\n            queryHistory = JSON.parse(localStorage.history);\n        }\n\n        else {\n            queryHistory = [];\n        }\n\n        queryHistory.push({ body: query, status: status });\n        localStorage.history = JSON.stringify(queryHistory);\n        localStorage.lastQuery = encodeURIComponent(query);\n        \n     }\n\n     // Run button clicked\n     $(\"#run\").click(function() {\n        query = editor.getValue()\n        alasql.promise(query)\n        .then(function(res){\n            console.log(res);\n            alasql('SELECT * INTO HTML(\"#results\", {headers:true}) FROM ?',[res]);\n            $('#error').hide();\n            $('#results').show();\n            $('#export').show();\n            logHistory(query, \"Completed\");\n        }).catch(function(err){\n            console.log('There was an error:', err);\n            $('#error > span').text(err);\n            $('#results').hide();\n            $('#error').show();\n            $('#export').hide();\n            logHistory(query, \"Failed\");\n        });\n     });\n\n     refreshSidebar();\n</script> ";
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
output += "</a></td>\n                        <td>";
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
output += "<div class=\"row\">\n\n    <div class=\"col-md-12 main\">\n    \n        <h4 class=\"page-header\">Settings</h4>\n\n        <p>Coming soon!</p>\n\n    </div>\n\n</div>\n\n<script>\n</script>";
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

