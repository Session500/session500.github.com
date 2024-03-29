(function($){

  /* External links */
  $(document).ready(function() {
    $('a[href]').each(function() {
      if (this.href.indexOf(window.location.host) == -1) $(this).attr({target: '_blank' });
    });
    $('a[href^=#][href!=#]').click(function() {
      var target = document.getElementById(this.hash.slice(1));
      if (!target) return;
      var targetOffset = $(target).offset().top;
      $('html,body').animate({scrollTop: targetOffset}, 400);
      return false;
    });
  });

  /* Go to top */
  $(document).ready(function() {
    $("#toTop").hide(), $("#toTop a:first").click(function() {
        $("html,body").animate({
            scrollTop:0
        }, 200);
    });
    var a = parseInt($("body").css("height"));
    $("#toTop a:last").click(function() {
        $("html,body").animate({
            scrollTop:a
        }, 200);
    }), $(window).scroll(function() {
        $(this).scrollTop() > 200 ? $("#toTop").fadeIn() :$("#toTop").fadeOut();
    });
  });

  /* site search */
  $(document).ready(function() {
    var entries = null;
    function htmlEscape(s) {
      return String(s).replace(/[&<>"'\/]/g, function(s) {
        var entityMap = {
          "&": "&amp;",
             "<": "&lt;",
             ">": "&gt;",
             '"': '&quot;',
             "'": '&#39;',
             "/": '&#x2F;'
        };
        return entityMap[s];
        });
    }
    function xmlDateToJavascriptDate(xmlDate) {
      var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+-])([0-9]{2}):([0-9]{2}))?$/;
      var match = xmlDate.match(re);
      if (!match)
        return null;
      var all = match[0];
      var year = match[1];  var month = match[2];  var day = match[3];
      var hour = match[4];  var minute = match[5]; var second = match[6];
      var milli = match[7];
      var z_or_offset = match[8];  var offset_sign = match[9];
      var offset_hour = match[10]; var offset_minute = match[11];
      if (offset_sign) {
        var direction = (offset_sign == "+" ? 1 : -1);
        hour =   parseInt(hour)   + parseInt(offset_hour)   * direction;
        minute = parseInt(minute) + parseInt(offset_minute) * direction;
      }
      month = parseInt(month) - 1;
      var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
      return new Date(utcDate);
    }
    function formatDate(date) {
      return date.getFullYear()+"-"+ (date.getMonth()+1)+ '-' + date.getDate();
    }
    function findEntries(q) {
      var matches = [];
      var rq = new RegExp(q, 'im');
      var rl = /^https:\/\/session500\.github\.io\/(.+)$/;
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = $(entry.getElementsByTagName('title')[0]).text();
        var link = $(entry.getElementsByTagName('link')[0]).attr('href');
        //var title_en = rl.exec(link)[1].replace(/-/g, ' ');
        var content = $(entry.getElementsByTagName('content')[0]).text();
        //if (rq.test(title) || rq.test(title_en) || rq.test(content)) {
        if (rq.test(title) || rq.test(content)) {
          var updated = formatDate(xmlDateToJavascriptDate($(entry.getElementsByTagName('updated')[0]).text()));
          matches.push({'title': title, 'link': link, 'date': updated, 'content': content});
        }
      }
      var html = '<h3>Search Result:</h3>';
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        html += '<article class="news-item"><h4><a href="' + match.link.replace(/\/$/g,'') + '">' + htmlEscape(match.title) + '</a></h4>';
        html += '<section><p>' + htmlEscape(match.content) + '</p></section>';
        html += '<footer><p>Update: ' + match.date + '</p></footer></article>';
      }
      $('.row').html(html);
      $('#search-loader').hide();
      $('.row').show();
      }
      $('#search-form').submit(function() {
        var query = $('#query').val();
        //$('#query');.blur().attr('disabled', true);
        $('.raw').hide();
        $('#search-loader').show();
        if (entries == null) {
          $.ajax({url: '/atom.xml?r=' + (Math.random() * 99999999999), dataType: 'xml', success: function(data) {
            entries = data.getElementsByTagName('entry');
            findEntries(query);
          }});
        } else {
          findEntries(query);
        }
        $('#query').blur().attr('disabled', false);
        return false;
      });

    });

  })(jQuery);
