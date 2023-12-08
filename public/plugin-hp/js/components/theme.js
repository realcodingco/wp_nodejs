const compData = {
    bx : theme,
    category: 'section'
};
BX.regist('Theme', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function theme(scheme) {
    const b = box().paddingTop(100).textAlign('center');
    b[0].id = 'theme';
    BX.component(schemes.themeTitle).appendTo(b).html(scheme.title);
    
    const themes = scheme.theme;
    for(let i=0; i<themes.length; i++) {
        let el = BX.component(schemes.themeBox).appendTo(b);
        el.children()[0].textContent = themes[i].name.toUpperCase() + ' THEME';
        el.children()[2].src = themes[i].img;

        getThemepkURL( url => { // 테마 패키지 파일 firestore에서 다운로드 링크 가져오기.
            $(el).find('a')[0].href = url;
        });

        const features = themes[i].feature;
        for(let f=0; f<features.length; f++) {
            const ftEl = BX.component(schemes.feature).appendTo(el);
            ftEl.find('h5')[0].textContent = features[f].title;
            ftEl.find('div')[0].textContent = features[f].desc;
        }
    }

    const adminIntro = BX.component(schemes.adminTool).appendTo(b);
    adminIntro[0].id = 'plugin';
    const admintool = scheme.admin;
    for(let f=0; f<admintool.length; f++) {
        const ftEl = BX.component(schemes.feature).appendTo(adminIntro);
        ftEl.find('h5')[0].textContent = admintool[f].title;
        ftEl.find('div')[0].textContent = admintool[f].desc;
    }
    
    BX.component(schemes.lineBanner).appendTo(b);

    return b;
}