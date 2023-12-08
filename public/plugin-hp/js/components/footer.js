const compData = {
    bx : footer,
    category: 'section'
};
BX.regist('Footer', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function footer() {
    const b = box();

    const el = BX.component(schemes.footer).appendTo(b);
    el.find('img')[0].src = './style/ic2.svg';

    return b;
}