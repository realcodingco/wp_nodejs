//구독페이지
let user;

isLogin(function(result) { 
    user = result;
    if(user) {
        const wrap = box().appendTo(topBox).size('100%', '100%').maxWidth(1470).left('50%').css('transform', 'translate(-50%, 0)');
        BX.components.Header.bx().appendTo(topBox);

        // const paid = new URLSearchParams(location.search).get('type');
        BX.components.Subscribe.bx().appendTo(wrap);
        setTimeout(()=> {adjustHeight();}, 100); //로그인 로딩 고려

        $('.myinfo_wrap').on('click', e => {
            if($('.profileDropdown').hasClass('active')) { //헤더 팝업 닫기
                $('.menuBox .button :nth-child(1)').click();
            }
        });
    }
    else { //로그아웃시 메인페이지로 
        location.href = '/plugin-hp';
    }
});