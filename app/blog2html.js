var fs = require('fs');
var md = require( "markdown" ).markdown

var md_path = 'public/markdown';

var meta = {}
meta.path = '../../../';
meta.css = [
  '//fonts.googleapis.com/css?family=Comfortaa|Open+Sans',
  'css/styles.css'
];
meta.js = [
  'js/jquery.min.js',
  'js/Markdown.Converter.js',
  'js/posts.js',
  'js/functions.js'
];
meta.nav = [
  ['#genomehubs','GenomeHubs','page1'],
  ['#lepbase','LepBase','page2'],
  ['#cgp','CGP','page3'],
  ['#docs','Documentation','page4'],
  ['#blog','Blog','page5']
];

readFiles(md_path);

function mkdirUnless (path) {
  try {
    fs.readdirSync(path);
  }
  catch (err) {
    fs.mkdirSync(path,'0755');
  }
}

function readFiles (path) {
  mkdirUnless(path.replace('/markdown','/blog'));
  fs.readdir(path,function(err, files){
    if (err) {
      return console.error(err);
    }
    files.forEach( function (file){
      if (file.match('.md')){
        md2html(path + '/' + file)
      }
      else {
        readFiles(path + '/' + file)
      }
    });
  });
}

function md2html (md_file){
  var ht_file = md_file.replace('/markdown/','/blog/').replace(/md$/,'html');
  var data = fs.readFileSync(md_file).toString();
  var text = '';
  meta.year = md_file.match(/\/markdown\/(\d+)/)[1];
  meta.month = md_file.match(/\/markdown\/\d+\/(\d+)/)[1];
  data.split('\n').forEach(function(line){
    if (line.match(':') && text == ''){
      var tmp = line.split(/\s*:\s*/);
      meta[tmp[0]] = tmp[1];
    }
    else {
  //    text = text.replace('[]()',' [read more…]('+ht_dir+'/'+year+'/'+month+'/'+ht_file+')');
      text = text + '\n' + line;
    }
  })
  meta.day = meta.created.match(/(\d+)$/)[1];
  // parse the markdown into a tree
  var tree = md.parse( text );

  // convert the tree into html
  var html = md.renderJsonML( md.toHTMLTree( tree ) );

  var page = wrapHtml(meta,html);
  fs.writeFileSync(ht_file,page);
}

function wrapHtml (meta,html) {
  var string = '<!DOCTYPE html>\n<html>\n<head>\n';
  string = string + '<title>'+meta.title+'</title>\n';
  meta.css.forEach(function(link){
    if (link.match(/^css/)) link = meta.path + link;
    string = string + '<link rel="stylesheet" type="text/css" href="'+link+'"></link>\n';
  })
  meta.js.forEach(function(script){
    if (script.match(/^js/)) script = meta.path + script;
    string = string + '<script href="'+script+'"></script>\n';
  })
  string = string + '</head>\n<body>\n<nav>\n<ul>\n';
  meta.nav.forEach(function(li){
    if (li[0].match(/^#/)) li[0] = meta.path + li[0];
    string = string + '<li><a href="'+li[0]+'" class="'+li[2]+'">'+li[1]+'</a>\n</li>';
  })
  string = string + '\n</ul>\n</nav>\n';

  string = string + '<content>\n<div id="page5" class="page">\n';
  string = string + '<span id="blog" class="smooth"></span>\n';
  string = string + '<div id="blog-posts" class="square">\n';
  string = string + '<h1>'+meta.title+'</h1>\n';
  string = string + '<h5>Posted by '+meta.author+' &mdash; '+monthNumber(meta.month)+' '+meta.day+', '+meta.year+'</h5>\n';
  string = string + html;
  string = string + '</div>\n</div>\n';
  string = string + '</content>\n</body>\n</html>';
  return string;
}

function monthNumber(month){
  var months = {
    "01":"January",
    "02":"February",
    "03":"March",
    "04":"April",
    "05":"May",
    "06":"June",
    "07":"July",
    "08":"August",
    "09":"September",
    "10":"October",
    "11":"November",
    "12":"December"
  }
  return months[month];
}
