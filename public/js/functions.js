var posts = [];
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

$(document).ready(function(){

  // load latest n blog posts
  $('#latest-posts').load('blog/latest.html')
/*  var $blog = $('#blog-posts');
  var prev_month = '';
  Object.keys(blog).sort().reverse().forEach(function(year){
    Object.keys(blog[year]).sort().reverse().forEach(function(month){
      var arr = blog[year][month]
      arr.forEach(function(slug){
        var post = new Post(slug,year+'/'+month)
        post.meta.year = year;
        post.meta.month = month;
        posts.push(post)
        if (posts.length < 6){
          if (month != prev_month){
            $blog.append('<h2>'+months[month]+' '+year+'</h2>')
            prev_month = month;
          }
          $blog.append('<div class="post" id="'+slug+'"></div>')
          post.loadMarkdown(posts.length == 1);
        }
      })
    })
  })*/

	$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    //var page_id = $target.closest('div').attr('id');
    //$('content').removeClass().addClass(page_id)
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
      //window.location.hash = target;
    });
	});

	$('.read-more').each(function () {
    var $this = $(this);
    var date = $(this).attr('rel');
    var post = $this.parent().parent().find('h2').text().toLowerCase().replace(' ','-');
    $this.attr("href",date+'/#'+post)
    $this.html('<a href="'+date+'/#'+post+'">read more&hellip;</a>')
  })

  if ($(window).scrollTop() == 0){
    $(window).scrollTop(1)
  }

  $(window).scroll(function() {
    var $window = $(window),
        $content = $('content'),
        $page = $('.page');
    var scroll = $window.scrollTop() + ($window.height() / 3);
    $page.each(function () {
      var $this = $(this);
      if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {
        $content.removeClass();
        var id = $this.attr('id')
        $content.addClass(id);
        $('nav li a.active').removeClass('active');
        $('nav li a.'+id).addClass('active');
      }
    });
  }).scroll();
});


function Post(slug,path) {
  this.slug = slug;
  this.path = path;
  this.meta = {};
}

Post.prototype.loadMarkdown = function(full){
  var result = null;
  var post = this;
  var converter = new Markdown.Converter();
  $.ajax( { url: 'markdown/'+post.path+'/'+post.slug+'.md',
            type: 'get',
            dataType: 'html',
            success: function(data) {
              var content = '';
              data.split('\n').forEach(function(line){
                if (line.match(':') && content == ''){
                  var tmp = line.split(/\s*:\s*/);
                  post.meta[tmp[0]] = tmp[1];
                }
                else {
                  content = content + '\n' + line;
                }
              })

              post.html = converter.makeHtml(content);
              $slug = $('#'+post.slug)
              $slug.append('<h3>'+post.meta.title+'</h3>')
              if (full){
                $slug.append(post.html)
              }
              else {
                post.short = post.html.split(/<span[^>]+read-more.+?\/.*?>/)[0];
                post.short = post.short + ' <a href="blog/'+post.path+'/'+post.slug+'">read more&hellip;</a>';
                $slug.append(post.short)
              }
            }
          }
        );

}
