var express = require('express');
var router = express.Router();
var fs = require('extfs');
var directory = 'C:/Users/Miky/WebstormProjects/OnePageGenerator/public/generator/';
var archiver = require('archiver');

//Ogólnie generator jest OK, wyglądowo można by porobić jakieś drobne poprawki.
//Po stronie serwera trzab zrobić logowanie i dwa typy usera:
//Regular z dostępem tylko do generatora
//Admin z dodatkową funkcją dodawania modułów
//ale to w przyszłości

router.get('/', function(req, res, next) {
  res.redirect('/generator');
});

router.get('/generator', function(req, res, next) {
    res.render('generator',{m1: ["/generator/1/1-1.jpg", "/generator/1/1-2.jpg", "/generator/1/1-3.jpg"],
                            m2: ["/generator/2/2-1.jpg", "/generator/2/2-2.jpg", "/generator/2/2-3.jpg"],
                            m3: ["/generator/3/3-1.jpg", "/generator/3/3-2.jpg"],
                            m4: ["/generator/4/4-1.jpg", "/generator/4/4-2.jpg", "/generator/4/4-3.jpg"],
                            m5: ["/generator/5/5-1.jpg", "/generator/5/5-2.jpg", "/generator/5/5-3.jpg"],
                            m6: ["/generator/6/6-1.jpg", "/generator/6/6-2.jpg", "/generator/6/6-3.jpg"],
                            m7: ["/generator/7/7-1.jpg", "/generator/7/7-2.jpg"]});

});


router.get('/generator/download/:structure', function(req, res, next) {
    var data = req.params;
    createFiles(data.structure.split(','), res);

});

module.exports = router;

//Fetch files source code and Sending to browser as zip file.
function createFiles(array, res){
    var archive = archiver('zip');
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': 'attachment; filename=site.zip'
    });
    var HTMLBuffer = fs.readFileSync(directory + "main/start.html");
    var CSSBuffer = fs.readFileSync(directory + "main/start.css");;
    var JSBuffer = "";

    console.log("Creating files...");

    for(var i=0;i<array.length;i++ ){
        var firstCatalog = array[i].slice(0, 1);
        var path = directory + firstCatalog + "/" + array[i] + "/" + array[i];
        var pathToHTML =  path + ".html";
        var pathToCss =  path + ".css";
        var pathToJS = path + ".js";
        var pathToPublic = directory + firstCatalog + "/" + array[i] + "/public"  ;
        HTMLBuffer += fs.readFileSync(pathToHTML);
        CSSBuffer += fs.readFileSync(pathToCss);
        JSBuffer += fs.readFileSync(pathToJS);
        var empty = fs.isEmptySync(pathToPublic);
        console.log(empty);
        if(!empty){
            archive.directory(pathToPublic, "public");
        }
    }

    HTMLBuffer += fs.readFileSync(directory + "main/end.html");
    archive.append(HTMLBuffer, { name:'custom.html' });
    archive.append(CSSBuffer, { name:'style.css' });
    archive.append(JSBuffer, { name:'custom.js'});
    archive.on('error', function(err){
        throw err;
    });
    archive.pipe(res);
    archive.finalize();
}


