const compData = {
    bx : topBtn,
    category: 'header'
};
BX.regist('TopBtn', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function topBtn(scheme) {
    const b = BX.component(schemes.topbutton);
    // box().text('⬆︎');
    // b[0].className = 'topbtn';
    // b[0].onClick = 'moveTop'

    return b;
}
function moveTop() {
    window.scrollTop(0);
}

window.addEventListener('scroll', () => { 
    //스크롤을 할 때마다 로그로 현재 스크롤의 위치가 찍혀나온다.
    if(window.scrollY >= window.innerHeight) {
        $('.topbtn').show();
    }
    else {
        $('.topbtn').hide();
    }
});
  