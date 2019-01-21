var moreWaysState = 'closed';
(function ($) {
    var c = function (s, f) {
        if ($(s)[0]) {
            try {
                f.apply($(s)[0]);
            } catch (e) {
                setTimeout(function () {
                    c(s, f);
                }, 1);
            }
        } else {
            setTimeout(function () {
                c(s, f);
            }, 1);
        }
    };
    if ($.isReady) {
        setTimeout(c, 100);
    }
    $.fn.elementOnLoad = function (f) {
        c(this.selector, f);
    };
})(jQuery);

if (typeof jQuery == 'undefined') {
    console.warn('jQuery is not loaded');
} else {

    var browserDetect = function () {
        if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
            $('.scp-wrapper').addClass("ieSupport");
        }
    };

    jQuery(document).ready(function ($) {
        console.info('jQuery is loaded');

        // Run Browser Detection function
        browserDetect();

        // Featured Top Brands Carousel
        // if (jQuery().slick) {
        //     scpCarousel();
        // } else {
        //     $('.scp-wrapper .scp-carousel').find('.flex-col-auto').removeClass('flex-col-auto').addClass('flex-col-1');
        //     console.warn('slick is not loaded');
        // }

        $(".moreWays_mobile-copy--button").on('click', function () {
            if (moreWaysState === 'open') {
                $(".moreWays").removeClass('moreWays--open').addClass('moreWays--closed');
                moreWaysState = 'closed';
            } else {
                $(".moreWays").addClass('moreWays--open').removeClass('moreWays--closed');
                moreWaysState = 'open';
            }
        });

        // $('#fModal').on('click', function (e) {
        //     fCloseModal();
        //     e.stopPropagating();
        // });
    });
}

// function fOpenModal() {
//     $('#fModal').addClass('fmodal-open');
// }

// function fCloseModal() {
//     $('#fModal').removeClass('fmodal-open');
// }

jQuery(document).ready(function ($) {
    console.log('ready');
    var mainLink = $('.sw-promo-floating-cta--print');
    var promoUrl = window.location.href;
    var channel = promoUrl.substring(promoUrl.indexOf('?channel'));

    var closeLightbox = function () {
        $('#lightBoxContainer').fadeOut(500, function () {
            $('#correctGlobalCSS').remove();
        });
    };

    function printCoupon() {
        console.log('Printing Coupon...');
        printWindow = window.open();
        printWindow.document.write("<div style='width:100%;'>");
        printWindow.document.write("<img style='max-width:100%;margin:0 auto;display:block;' src='" + document.getElementById('coupon').src + "'/>");
        printWindow.document.write("</div>");
        printWindow.document.close();
        printWindow.print();
    }

    function openModal() {
        mainLink.on("click", function () {
            console.log('Opening Coupon...');
            $("#lightBoxContainer").show();
        });
        $('#lightBoxContainer, #lightBoxContainer .lightBoxCloseX').on('click', function () {
            closeLightbox();
        });
    }

    openModal();

    $('.modal-print').on('click', printCoupon);
});