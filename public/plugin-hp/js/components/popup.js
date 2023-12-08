const compData = {
    bx : popup,
    category: 'section'
};
BX.regist('Popup', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme - {text: 'message', fn: 'ok btn click event'}
 * @returns 헤더 box
 */
function popup(scheme) {
    const b = BX.component(elementScheme.customPopup);
    $(b).find('span')[0].innerText = scheme.text;
    $(b).find('button:nth-child(2)')[0].onclick = scheme.fn;

    return b;
}