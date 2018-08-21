jQuery(document).ready(function ($) {


    /*======= Skillset *=======*/

    $('.level-bar-inner').css('width', '0');

    $(window).on('load', function () {

        $('.level-bar-inner').each(function () {

            var itemWidth = $(this).data('level');

            $(this).animate({
                width: itemWidth
            }, 800);

        });

    });

    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    GitHubActivity.feed({ username: "AnanthaKrish", selector: "#ghfeed" });



    $(function () {
        var $content = $('.itemClass');
          var url = 'https://mediumpoll.herokuapp.com/mediumDaily';

        $.get(url, function (response) {
                var output = '';
                console.log(response);
                $.each(response, function (k, item) {
                    console.log(item);
                // });
                // /*$.each(response.items, function (k, item) {
                    var visibleSm;
                    if (k < 3) {
                        visibleSm = '';
                    } else {
                        visibleSm = ' visible-sm';
                    }

                    var yourString = item.description.toString().replace(/<img[^>]*>/, ""); //replace with your string.
                    var maxLength = 120 // maximum number of characters to extract
                    //trim the string to the maximum length
                    var trimmedString = yourString.substr(0, maxLength);
                    //re-trim if we are in the middle of a word
                    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
                    // var url = item.link;
                    // var title = item.title;
                    // var shortBodyPlain = trimmedString;

                    var url = item.link;
                    var title = item.title;
                    var shortBodyPlain = trimmedString;
                    
                    output += '<h4 class="title"><a href="' + url + '" target="_blank">' + title + '</a></h4><div><p>' + shortBodyPlain + '</p><a class="more-link" href="' + url + '" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>';
                    return k < 3;
                });
                $content.html(output);
        });
    });
});

const lis = document.querySelectorAll(".buttons-container li");
const a = document.querySelectorAll(".buttons-container li a");

for (let i = 0; i < lis.length; i++) {
  lis[i].addEventListener("click", function() {
    for (let i = 0; i < lis.length; i++) {
      lis[i].classList.remove("active");
      a[i].classList.remove("active-text");
    }
    this.classList.add("active");
    a[i].classList.add("active-text");
  });
}