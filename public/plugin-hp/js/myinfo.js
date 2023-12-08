// my account 페이지
let user;
isLogin(function(result) { 
    user = result;
    if(user) {
        const wrap = box().appendTo(topBox).size('100%', '100%').maxWidth(1470).left('50%').css('transform', 'translate(-50%, 0)');
        BX.components.Header.bx().appendTo(topBox);
        BX.components.MyInfo.bx().appendTo(wrap);
        setTimeout(()=> {adjustHeight();}, 100); //로그인 로딩 고려

        $('.myinfo_wrap').on('click', e => {
            if($('.profileDropdown').hasClass('active')) { //헤더 팝업 닫기
                $('.button :nth-child(1)').click();
            }
            if(e.target != $('span.fa-pen-to-square')[0] && $('.menuPopup').is(':visible')) {
                $('.menuPopup').remove();
            }
        });
    }
    else { //로그아웃시 메인페이지로 
        location.href = '/plugin-hp';
    }
});

$(window).on('resize', function(){
    // 모바일 메뉴팝업 열린상태에서 pc 사이즈로 변환시 팝업 닫기
    const mobileMenuIconOpened = $('.menuTrigger').hasClass('active');
    if (window.innerWidth >= 1040 && mobileMenuIconOpened) {
        $('.menuTrigger')[0].click();
    }
});