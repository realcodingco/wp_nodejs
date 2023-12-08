const compData = {
    bx : header,
    category: 'header'
};
BX.regist('Header', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function header(scheme) {
    const b = BX.component(schemes.header);
    const ci = BX.component(schemes.ciBox).appendTo(b);
    $(ci[0]).find('img')[0].src = '/plugin-hp/style/ic2.svg';

    ci[0].href = '/plugin-hp';
    const menuBox = BX.component(schemes.menuBox).appendTo(b);
    BX.component(schemes.hambugerIcon).appendTo(b);
    if(scheme) {
        scheme.menuData.forEach(function(o) {
            if(o.state == 'close') return;
            
            const menu = BX.component(schemes.menu);
            menu[0].innerHTML = '<a onClick="closeMenu()" href="'+ o.link +'">'+ o.title + '</a>';
            menuBox[0].appendChild(menu[0]);
        });
    }
    else { //모바일 myaccount의 경우,, side menuBox 붙이기. 
        BX.component(myinfo.menuBox).appendTo(menuBox);
    }

    const signStatus = BX.component(schemes.signBtn).appendTo(menuBox);

    if(user) { //로그인 상태라면
        const userName = user.displayName? 'Hi ' + user.displayName.split(' ')[0] + '!' : user.email;
        if(user.photoURL) {
            $(signStatus).find('.img').css('background', `url('${user.photoURL}') no-repeat center/cover`);
        }
        else { //프로필 이미지가 없으면 이름 첫글자 노출
            $(signStatus).find('.img').text(userName[0].toUpperCase());
        }   
        
        $(signStatus).find('.img').show();
        $(signStatus).find('text').text(userName);
        $(signStatus).find('.button > span').show();
        $(signStatus).find('.button').attr('name','on');
        BX.component(schemes.profileDropdown).appendTo(signStatus);
        if(window.innerWidth < 1040)
        $('.menuBox > :last-child').addClass('notBtn'); // 모바일 일때만 버튼 아님.

        if(!user.emailVerified) {
            appendVerifyPop();
        }
    }
    else { //로그아웃 상태라면
        // $('.profileDropdown').hide();
    }
    $(signStatus).show(); //로그인 상태 확인 후 노출.

    return b;
}

function appendVerifyPop() {
    $('body').css('overflow','hidden'); //바디영역 스크롤 바 없애기
    $('.verifyPopup').remove(); //여러개 안 붙도록
    BX.component(schemes.verifyPopup).appendTo(topBox);
}
/**
 * 
 */
function closeMenu() {
    if($('.menuTrigger').hasClass('active') == true)
        $('.menuTrigger').click();
}
/**
 * 모바일에서 햄버거 메뉴 아이콘 클릭 이벤트 : 메뉴 상자 열림
 */
function menuOpen() {
    if($('.menuTrigger')[0].className == 'box menuTrigger') {
        $('.menuTrigger').addClass('active');
    } else {
        $('.menuTrigger').removeClass('active');
    }
    openMenu();
}

/**
 * 모바일에서 메뉴 아이콘 클릭 이벤트 : 메뉴 상자 열림
 */
function openMenu() {
    if($('.menuBox')[0].className == 'menuBox') {
        $('.menuBox').addClass('clicked');
        $('.header').addClass('clicked');
    } else {
        $('.menuBox').removeClass('clicked');
        $('.header').removeClass('clicked');
    }
}

// function openAccount(e) {
//     e.stopPropagation();

//     console.log('내 정보 열기')
// }

/**
 * 헤더 sign in 버튼 클릭이벤트
 * @param {*} e 
 */
function onAccount(e) {
    if($(e.target).hasClass('button')) return; //중복클릭 방지
    
    if(auth.currentUser) { //로그인 상태
        $('.profileDropdown').toggleClass('active');
        if(!$('.profileDropdown').hasClass('active')) {
            $('.button').find('span').text('arrow_drop_down');
        }
        else { 
            $('.button').find('span').text('arrow_drop_up');
        }
    }
    else {// 로그아웃 상태. 로그인 폼 열기.
        if(document.querySelector('.signinDropdown') == null) {
            BX.component(schemes.signinDropdown).appendTo(topBox);
            $('.signTitle + div > a').click(); // signin 폼에서 시작하기
        }
    }
}
/**
 * Log Out 버튼 클릭이벤트 
 * @param {*} e 
 */
function signOut(e){
    e.stopPropagation();

    BX.components.Popup.bx({text: 'Do you want to log out?', fn : e => {
        signOutAuth().then(function() {
            location.replace('/plugin-hp');
        });
    }}).appendTo(topBox);
}