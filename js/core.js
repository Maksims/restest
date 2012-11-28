$(document).ready(function() {
  app = {
    dom: {
      frame: $('#frame'),
      iframe: $('#frame > iframe'),
      width: $('#width'),
      height: $('#height'),
      modal: $('#modal'),
      resolutionTitle: $('#modal > div.container > h2#resolutionTitle')
    },
    width: 0,
    height: 0,
    update: function(width, height) {
      width = parseInt(width);
      if (width) {
        width = Math.max(width, 96);
      } else {
        width = 96;
      }
      height = parseInt(height);
      if (height) {
        height = Math.max(height, 96);
      } else {
        height = 96;
      }

      if (width != this.width || height != this.height) {
        this.width = width;
        this.height = height;
        $('#frame').animate({ 'width': this.width, 'height': this.height }, { duration: 200, queue: false });
      }
    },

    resize: {
      snap: false,
      x: {
        width: 0,
        start: 0,
        cur: 0,
        active: false
      },
      y: {
        height: 0,
        start: 0,
        cur: 0,
        active: false
      },
      update: function() {
        if (this.x.active) {
          var width = this.x.width - (this.x.start - this.x.cur);
          if (this.snap) {
            width = Math.floor(width / 10) * 10;
          }
          app.dom.frame.width(Math.max(width, 96));
          app.dom.width.val(app.dom.frame.width());
        }
        if (this.y.active) {
          var height = this.y.height - (this.y.start - this.y.cur);
          if (this.snap) {
            height = Math.floor(height / 10) * 10;
          }
          app.dom.frame.height(Math.max(height, 96));
          app.dom.height.val(app.dom.frame.height());
        }
      }
    },

    resolutions: [ {
      title: 'Desktop',
      width: 1920,
      height: 1200
    }, {
      title: 'Desktop, Full HD',
      width: 1920,
      height: 1080
    }, {
      title: 'Desktop',
      width: 1600,
      height: 1200
    }, {
      title: 'Desktop',
      width: 1680,
      height: 1050
    }, {
      title: 'Desktop',
      width: 1440,
      height: 900
    }, {
      title: 'Desktop',
      width: 1280,
      height: 1024
    }, {
      title: 'Desktop',
      width: 1280,
      height: 960
    }, {
      title: 'Desktop',
      width: 1280,
      height: 800
    }, {
      title: 'Desktop, HD',
      width: 1280,
      height: 720
    }, {
      title: 'Desktop, iPad',
      width: 1024,
      height: 768
    }, {
      title: 'Desktop',
      width: 1024,
      height: 600
    }, {
      title: 'facebook[pagetab]',
      width: 810,
      height: 880
    }, {
      title: 'Mobile, HTC Sensation',
      width: 540,
      height: 960
    }, {
      title: 'Mobile, Galaxy S3',
      width: 480,
      height: 800
    }, {
      title: 'Mobile',
      width: 480,
      height: 640
    }, {
      title: 'Mobile, HTC One X',
      width: 360,
      height: 640
    }, {
      title: 'Mobile, iPhone 5',
      width: 320,
      height: 568
    }, {
      title: 'Mobile, iPhone 2, 3, 4, 4S',
      width: 320,
      height: 480
    }, {
      title: 'Mobile',
      width: 240,
      height: 320
    }]
  };

  $('#url').change(function() {
    var url = $(this).val();
    if (url.substr(0, 4) != 'http' || url.substr(0, 3) != 'ftp') {
      url = 'http://' + url;
    }
    app.dom.iframe.animate({ 'opacity': 0 }, { duraiton: 200, queue: false });
    app.dom.iframe.attr('src', url);
  });
  $('#go').click(function() {
    $('#url').trigger('change');
  });

  app.dom.width.change(function() {
    app.update($(this).val().trim(), app.height);
  });
  app.dom.height.change(function() {
    app.update(app.width, $(this).val().trim());
  });
  $('#swap').click(function() {
    var temp = app.dom.width.val();
    app.dom.width.val(app.dom.height.val());
    app.dom.height.val(temp);
    app.update(app.dom.width.val().trim(), app.dom.height.val().trim());
  });

  app.dom.iframe.load(function() {
    $(this).stop(true, true);
    $(this).animate({ 'opacity': 1 }, { duration: 200, queue: false });
  });

  $(window).keydown(function(e) {
    if (e.keyCode == 16) {
      app.resize.snap = true;
    }
  });
  $(window).keyup(function(e) {
    if (e.keyCode == 16) {
      app.resize.snap = false;
    }
  });

  app.dom.frame.children('div.scaleRight').mousedown(function(e) {
    var data = app.resize.x;
    data.start = e.clientX;
    data.active = true;
    data.width = app.dom.frame.width();
    $('html').css('cursor', 'col-resize');
    app.dom.frame.children('div.overlay').css('display', 'block');
    return false;
  });
  app.dom.frame.children('div.scaleBottom').mousedown(function(e) {
    var data = app.resize.y;
    data.start = e.clientY;
    data.active = true;
    data.height = app.dom.frame.height();
    $('html').css('cursor', 'row-resize');
    app.dom.frame.children('div.overlay').css('display', 'block');
    return false;
  });
  app.dom.frame.children('div.scaleCorner').mousedown(function(e) {
    app.resize.x.start = e.clientX;
    app.resize.y.start = e.clientY;
    app.resize.x.active = true;
    app.resize.y.active = true;
    app.resize.x.width = app.dom.frame.width();
    app.resize.y.height = app.dom.frame.height();
    $('html').css('cursor', 'nwse-resize');
    app.dom.frame.children('div.overlay').css('display', 'block');
    return false;
  });
  $(window).mouseup(function(e) {
    if (app.resize.x.active || app.resize.y.active) {
      app.resize.x.active = false;
      app.resize.y.active = false;

      app.dom.width.val(app.dom.frame.width());
      app.dom.height.val(app.dom.frame.height());
      app.update(app.dom.frame.width(), app.dom.frame.height());
      app.dom.frame.children('div.overlay').css('display', 'none');
      $('html').css('cursor', '');
    }
  });
  $(window).mousemove(function(e) {
    if (app.resize.x.active) {
      app.resize.x.cur = e.clientX;
    }
    if (app.resize.y.active) {
      app.resize.y.cur = e.clientY;
    }
    app.resize.update();
  });

  app.dom.width.val(app.dom.frame.width());
  app.dom.height.val(app.dom.frame.height());
  app.update(app.dom.frame.width(), app.dom.frame.height());

  $('#url').trigger('change');

  for(var i in app.resolutions) {
    var html = "<div style='width:" + Math.round(app.resolutions[i].width / 2) + "px;height:" + Math.round(app.resolutions[i].height / 2) + "px;' data-width='" + app.resolutions[i].width + "' data-height='" + app.resolutions[i].height + "' data-title='" + app.resolutions[i].title + "'><div><div>" + app.resolutions[i].title.replace(/((Desktop)?(Mobile)?(,\s)?)+/, '') + "</div>" + app.resolutions[i].width + " x " + app.resolutions[i].height + "</div></div>";
    $('#modal > div.container > div.resolutions').append(html);
  }

  app.dom.modal.find('> div.container > div.resolutions > div').hover(function() {
    app.dom.resolutionTitle.html($(this).attr('data-title') + '<span>' + $(this).attr('data-width') + ' x ' + $(this).attr('data-height') + '</span>');
  }, function() {
    app.dom.resolutionTitle.html('');
  });

  $('.button#presets').click(function() {
    app.dom.modal.css('display', 'block').animate({ opacity: 1 }, { duration: 200, queue: false });
  });

  app.dom.modal.find('.close').click(function() {
    app.dom.modal.animate({ opacity: 0 }, { duration: 200, queue: false, complete: function() {
      $(this).css('display', 'none');
    }});
  });

  app.dom.modal.find('> div.container > div.resolutions > div').click(function() {
    app.dom.width.val($(this).attr('data-width'));
    app.dom.height.val($(this).attr('data-height'));
    app.update($(this).attr('data-width'), $(this).attr('data-height'));
    app.dom.modal.animate({ opacity: 0 }, { duration: 200, queue: false, complete: function() {
      $(this).css('display', 'none');
    }});
  });

  var shareTitle = encodeURIComponent('Responsive Design Tester');
  var shareUrl = 'http://moka.co/restest/';
  $('.share').click(function() {
    var network = $(this).attr('data-share');
    var url = '';
    var width = 640;
    var height = 380;
    switch(network) {
      case 'facebook':
        url = "http://facebook.com/sharer.php?u=" + encodeURIComponent(shareUrl + '?src=fb') + "&t=" + shareTitle;
        break;
      case 'googleplus':
        url = "https://plus.google.com/share?url=" + encodeURIComponent(shareUrl + '?src=gp');
        break;
      case 'twitter':
        height = 325;
        url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent('#html5 #responsive by @mrmaxm Test your Responsive Design, using this tool:') + "&url=" + encodeURIComponent(shareUrl);
        break;
    }
    if (url != "") {
      var left = (screen.width / 2) - (width / 2);
      var top = (screen.height / 2) - (height / 2);

      var popup = window.open(url, 'name', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height +', top=' + top + ', left=' + left);
      if (window.focus && popup) {
        popup.focus();
      }
    }
  });
});