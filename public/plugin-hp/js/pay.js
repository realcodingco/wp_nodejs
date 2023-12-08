// 결제페이지
let user;
isLogin(function(result) { 
    user = result;
    const payType = new URLSearchParams(location.search).get('type');
    const state = new URLSearchParams(location.search).get('state');
    BX.components.Pay.bx(payType).appendTo(topBox);

    if(user && state == 'done') { //결제완료된 상태로 리다이렉트된 경우,
        let payData = JSON.parse(localStorage.getItem('paydata'));
        if(payData) {
            payData.data.apiId = new URLSearchParams(location.search).get('id');
            payData.data.oid = new URLSearchParams(location.search).get('oid');
            savePayment(user.uid, payData);
        }
    }
});

/**
 * 결제완료 후 구독데이터, 히스토리 firestore 저장 후, subscription 페이지로 이동
 * @param {*} uid 
 * @param {*} sendData {type,data,sid,subscription} : 종료처리 구독이 있는 경우 sid, subscription 참고
 */
function savePayment(uid, sendData) { // 구독이 남아있는지 여부에 따라 분기
    const sid = getRandomId(); // 새로운 시리얼넘버 생성
    const data = sendData.data;
    let paydata = {
        type : data.type,
        domain: data.domain,
        start: data.periodStart,
        end: data.periodEnd,
        price: data.price,
        paytime: data.paytime,
        payResult: { //결제 취소를 위한 필요 데이터
            payId : data.apiId,
            oid: data.oid
        }
    };
    const saveHistory = (type, uid, sid, paydata) => {
        let fn;
        if(type == 'new') fn = userWirteHistory;
        else fn = userUpdateHistory;

        fn(uid, sid, paydata, result => {
            localStorage.removeItem('paydata');
            // 3초 후, 구독페이지로 이동.
            setTimeout(()=> { 
                location.href = '/plugin-hp/subscription';
            }, 3000);
        });
    };
    const saveSubscription = (type, state, uid, sid, paydata) => {
        if(state != 'off') { //구독만료 처리가 아닌 경우.
            userSaveSubscription(uid, {sid: sid, expire: paydata.end}, (result) => { //만료일 갱신.
                paydata.state = state; 
                saveHistory(type, uid, sid, paydata);
            });
        }
        else { //구독만료
            userSaveSubscription(uid, {sid: sid}, (result) => {
                paydata.state = state; 
                saveHistory(type, uid, sid, paydata);
            });
        }
    }
    toastr.success('Your subscription has been paid for. After a moment, the subscription page opens.');

    if(sendData.type == 'same') {
        saveSubscription('new', 'wait', uid, sid, paydata); //대기 구독
    }
    else if(sendData.type == 'up') {
        saveSubscription('update', 'off', uid, sendData.sid, sendData.subscription); //현 구독 종료처리
        saveSubscription('new', 'on', uid, sid, paydata); //업그레이드 구독 시작
    }
    else { //'normal'
        saveSubscription(sendData.type, 'on', uid, sid, paydata);
    }
}

/**
 * sid 생성용 랜덤 문자열
 * @param {*} length 
 * @returns 
 */
const getRandomId = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
};
