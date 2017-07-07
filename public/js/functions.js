$(document).ready(function(){

  // load latest blog posts
  $('#latest-posts').load('blog/latest.html')

	$('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
      window.location.hash = target;
    });
	});

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
