//모든 페이지에서 공통으로 사용
const DOMAIN = location.protocol + location.hostname + '/plugin-hp';

//로딩애니메이션
BX.component(schemes.loading).appendTo(topBox);
function showLoading(){
    $('.pageLoading').addClass('on');
}
function hideLoading() {
    $('.pageLoading').removeClass('on');
}

//toastr 알림팝업창 옵션
toastr.options = {
    closeButton: true,
    progressBar: true,
    showMethod: 'slideDown',
    timeOut: 3500,
};

/**
 * 헤더 높이에 따라 하단 영역 margin 조절
 */
function adjustHeight() {
    const headerHeight = $('.header').outerHeight(true); 
    $('.myinfo_wrap').css('height', `calc(100vh - ${headerHeight}px)`);
    $('.myinfo_wrap').css('margin-top',headerHeight);
}

/**
 * 구글 소셜 계정로그인 버튼 클릭이벤트
 * @param {*} e 
 */
function onGoogleAuth(e) {
    e.stopPropagation();

    signinGoogle().then((result) => {
        toastr.success('Account logged in.');
        $('.signinDropdown').remove(); //로그인창 팝업 닫기
        if(location.pathname == '/plugin-hp/' && window.innerWidth < 1040) { //모바일의 경우
            $('.menuTrigger')[0].click();
        }
    }).catch((error) => {
        console.log(error.message);
    });
}

function createHash(str) {
    const passhash = CryptoJS.SHA256(str);
    return passhash.toString(CryptoJS.enc.Hex);
}

/**
 * 시리얼넘버 암호화
 * @param {*} val - sid 문자열
 * @returns 
 */
function encrypted(val) {
    return CryptoJS.AES.encrypt(val, homepage.screatKey).toString();
}
/**
 * 시리얼넘버 복호화
 * @param {*} encrypted - 암호화된 시리얼 문자열
 * @returns 
 */
function decrypted(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, homepage.screatKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * 1년 뒤 날짜(타임스탬프) 반환
 * @param {*} timestamp 
 * @returns 
 */
function getOneyearLater(timestamp) {
    const endDay = new Date(timestamp);
    endDay.setDate(endDay.getDate() + 365);
    return endDay.getTime();
}
/**
 * 페이플 결제 요청시 필요
 * @returns 
 */
const createOid = () => {
    const now_date = new Date();
    const now_year = now_date.getFullYear();
    let now_month = now_date.getMonth() + 1;
    let now_day = now_date.getDate();
    now_month = (now_month < 10) ? '0' + now_month : now_month;
    now_day = (now_day < 10) ? '0' + now_day : now_day;
    return now_year + now_month + now_day + now_date.getTime();
};