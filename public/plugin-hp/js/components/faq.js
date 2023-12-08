const compData = {
    bx : faq,
    category: 'section'
};
BX.regist('Faq', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function faq(scheme) {
    const b = box().padding('150px 0px').maxWidth(1200).left('50%').css('transform', 'translate(-50%, 0)').textAlign('center');
    b[0].id = 'faq';
    box().appendTo(b).width('85%').margin('0 auto').text('FAQ').marginBottom(30).textAlign('left').fontSize(30);
    
    const items = scheme;

    for(var i=0; i<items.length;i++) {
        const item = BX.component(schemes.spreadBox).appendTo(b);
        item.find('p')[0].innerHTML = items[i].que;
        item.find('.detailBox')[0].innerHTML = items[i].ans;
    }

    return b;
}