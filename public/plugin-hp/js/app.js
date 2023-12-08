const wrap = box().appendTo(topBox).size('100%', '100%').maxWidth(1470).left('50%').css('transform', 'translate(-50%, 0)');
let user;
isLogin(function(result) {
    user = result; 
    BX.components.Header.bx(homepage.header).appendTo(topBox);
    BX.components.Theme.bx(homepage.themes).appendTo(wrap);
    BX.components.Price.bx(homepage.price).appendTo(wrap);
    BX.components.Faq.bx(homepage.faqItems).appendTo(wrap);
    BX.components.Footer.bx().appendTo(wrap);
    BX.components.TopBtn.bx().appendTo(topBox);

    var hash = window.location.hash;
    if (hash) {
        setTimeout(function() {
            var element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({block: 'start'});
            }
        }, 100);
    }
    if(user) aWeekagoAlert(user.uid); //구독 만료 알림
});

// 헤더 팝업이 열린상태에서 외부요소 클릭시 닫히도록.
$('#mainapp :first-child').click(e => {
    if($('.profileDropdown').hasClass('active')) {
        $('.button text')[0].click();
    }
});

$(window).on('resize', function(){
    // 모바일 메뉴팝업 열린상태에서 pc 사이즈로 변환시 팝업 닫기
    const mobileMenuIconOpened = $('.menuTrigger').hasClass('active');
    if (window.innerWidth >= 1040 && mobileMenuIconOpened) {
        $('.menuTrigger')[0].click();
    }
});

