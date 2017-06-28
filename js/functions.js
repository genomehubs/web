$(document).ready(function(){
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
