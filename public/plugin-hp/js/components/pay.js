const compData = {
    bx : paypage,
    category: 'popup_page'
};
BX.regist('Pay', compData);

/**
 * 결제 페이지 컴포넌트 
 * @param {object} scheme 
 * @returns 결제 box
 */
function paypage(scheme) {
    $('.purchasePop').remove();

    const billSheet = BX.component(schemes.checkout);
    const summary = $(billSheet).find('.billSummary')[0];
    $(billSheet).find('.billing').maxWidth(1470).left('50%').css('transform', 'translate(-50%, 0)');
    const type = scheme;
    const data = {
        type : type,
        option : homepage.price[type]
    }
    //account box   
    if(user) {
        BX.component(schemes.signedBox).appendTo(summary);
        $(billSheet).find('.signedBox :nth-child(2) > span')[0].innerText = user.email;
        appendSubscribeTable(summary, data);
    }
    else {
        BX.component(schemes.accountBox).appendTo(summary);
        appendSubscribeTable(summary, data);
    }   

    return billSheet;
}

/**
 * 결제 팝업창에서 구독테이블 생성
 * @param {*} target append 대상
 * @param {*} data 선택한 구독 데이터
 */
function appendSubscribeTable(target, data) { console.log(data);
    const selectType = data.type;
    const option = data.option;

    const subscribeType = BX.component(schemes.rowBox).appendTo(target);
    subscribeType.children()[0].innerText = `Business site builder Pro - ${selectType.charAt(0).toUpperCase() + selectType.slice(1)}`;
    subscribeType.children()[0].className = 'subscriptionType';
    subscribeType.children()[0].dataset.type = selectType;
    subscribeType.children()[1].innerText = `${option.price.toFixed(2)} USD / year`;

    var now = new Date();
    var fromNow = new Date();
    fromNow.setFullYear(fromNow.getFullYear() + 1);//1년 기간 설정
    var oneYearLater = new Date(fromNow);

    const period = BX.component(schemes.rowBox).appendTo(target);
    period.children()[0].innerText = 'Subscription period';
    period.children()[0].className = 'period';
    period.children()[0].dataset.start = now.getTime();
    period.children()[0].dataset.end = oneYearLater.getTime();
    period.children()[1].innerText = `${now.toLocaleDateString()} ~ ${oneYearLater.toLocaleDateString()}`;

    BX.component(schemes.discountBox).appendTo(target);
    
    const total = BX.component(schemes.rowBox).appendTo(target);
    total.children()[0].innerText = 'Total';
    total.children()[1].innerText = `${option.price.toFixed(2)} USD`;
    total.children()[1].dataset.price = option.price;
    total.children()[1].dataset.final = option.price;
    total.children()[1].className = 'totalPrice';

    BX.component(schemes.payBtn).appendTo(target);

    const appdx = `* By purchasing, you acknowledge that your subscription will renew annually unless you switch to manual renewal.<br>
* 30-day money back guarantee. For refund inquiries, please contact ${homepage.adminEmail}<br>
* If you're already subscribed, your final payment may vary depending on whether the subscription plan you choose is a renewal or upgrade, so please check at checkout.`;
    
    box().appendTo(target).width('100%').wordBreak('keep-all').html(appdx).padding('0 20px').fontSize(12).marginTop(20).textColor('gray').textAlign('justify').maxWidth(1100);
}

/**
 * 할인코드 확인 버튼 클릭이벤트 
 * @param {*} e 
 * @returns 
 */
function checkDiscount(e) {
    const inputEl = $(e.target).prev()[0];
    const warnMsg = $(e.target).next()[0];
    if(!inputEl.value) {
        inputEl.classList.add('warn');
        $(warnMsg).show();
        return;
    }
    
    //코드 유효성 체크 : 유효하면 할인율 반환 - 어떻게 적용할지 미정
    const valid = false;
    if(!valid) { // 유효하지 않으면
        $(warnMsg).text('invalid').show();
        return;
    }

    const dcRate = 20;
    $(warnMsg).text('available').show();
    $('.discountRate').text(`${dcRate}%`).show();
    const rawprice = $('.totalPrice')[0].getAttribute('data-price') * 1;
    const finalPrice = rawprice - (rawprice * (dcRate / 100));
    $('.totalPrice')[0].dataset.final = finalPrice;
    $('.totalPrice')[0].innerHTML = `<font size=3 color=lightgray><del>${rawprice.toFixed(2)}</del></font><br>
    <font size=4 color=red>${finalPrice.toFixed(2)} USD</font>`;
}

function isDowngrade(uid, userData, domain, fn) {
    const sid = userData && userData.sid;
    if(sid){
        getUserSubscription(uid, userData.sid, doc => { //현재 구독
            if(domain < doc.domain) { // 선택한 도메인이 현재보다 적은 경우
                fn(true);
            }
            else {
                fn(false);
            }
        });
    } 
    else {
        fn(false);
    }
}

/**
 * Pay now 버튼 클릭이벤트 
 * @returns 
 */
function onPay() {
    showLoading();
    if(!user) {
        toastr.error('Sign in to your account first.');
        return;
    }
    if(!user.emailVerified) { //인증된 이메일 계정이 아닌 경우, 결제 안됨.  
        toastr.error('Email is not verified.', 'Error');
        return; 
    }
    const uid = user.uid;
    let payData = new Object();
    payData.price = $('.totalPrice')[0].getAttribute('data-final') * 1;
    payData.type = $('.subscriptionType')[0].getAttribute('data-type');
    payData.periodStart = $('.period')[0].getAttribute('data-start') * 1;
    payData.periodEnd = $('.period')[0].getAttribute('data-end') *1;
    payData.uid = uid;
    payData.email = user.email;
    payData.domain = homepage.price[payData.type].site;
    payData.paytime = payData.periodStart; //결제시점 데이터

    getUserData(uid, userData => { //domain, sid
        isDowngrade(uid, userData, payData.domain, is => {
            if(is) { //현 구독에서 다운그레이드는 원칙적으로 불가. 구독상태에서의 결제와 관련한 안내..
                toastr.info('You have an existing subscription.<br>You can renew your subscription expires.');
            }
            else { 
                getUserWaitSubscription(uid, sid => { //대기상태 구독건이 있는지 확인. 업그레이드 진행도 안됨.. 대기구독건 환불 처리 후 진행. 
                    if(sid) {
                        toastr.info('You have the following upcoming subscriptions.'); // wait 구독은 어떻게 on 상태로 state를 변경시킬 것인가..
                    }
                    else {
                        payProcessing(uid, userData, payData, json => {
                            hideLoading();
                            requsetGlobalPay(json); //페이플 결제 진행
                            toastr.options.timeOut = 0;
                            if(json.type == 'same') { // 동일플랜 연장결제
                                toastr.info(`Existing subscriptions will be renewed.<br>
                                 - Term : ${new Date(json.data.periodStart).toLocaleDateString()} ~ ${new Date(json.data.periodEnd).toLocaleDateString()}`);
                            }
                            else if(json.type == 'up') { // 업그레이드
                                toastr.info(`You've chosen to upgrade.<br> 
                                The remaining term of your existing subscription will be prorated and reflected in your final payment.<br><br> 
                                 - Amount : ${json.data.price} USD<br>
                                 - Term : ${new Date(json.data.periodStart).toLocaleDateString()} ~ ${new Date(json.data.periodEnd).toLocaleDateString()}`);
                            }
                        });
                    }
                });
            }
        });
    });
}

/**
 * 결제 데이터 재산정 : 구독연장, 업그레이드, 기타
 * @param {*} uid 
 * @param {*} userData - {sid, domain}
 * @param {*} paydata 
 * @param {*} callback - json
 */
function payProcessing(uid, userData, paydata, callback) {
    if(userData){ //기존 데이터가 있는 경우 - 구독상태인지 확인
        if(userData.sid) { //구독중, 유효한 sid인지 확인
            getUserSubscription(uid, userData.sid, subscription => {
                //가리키고 있는 구독의 기간이 남아 있는지.. 
                if(Date.now() < subscription.end) { //구독기간이 남은상태 
                    if(paydata.type == subscription.type) { //기존플랜 유지
                        //현 구독 마지막날 다음날을 start로 1년.
                        paydata.periodStart = subscription.end;
                        paydata.periodEnd = getOneyearLater(paydata.periodStart);
                        callback({type:'same', data: paydata});
                    }
                    else { // 업그레이드 : 날짜 차감해서 결제 예정금액에 반영 
                        var gap = subscription.end - Date.now();
                        var daysLeft = Math.ceil(gap / (1000 * 60 * 60 * 24)); //남은일수
                        var dayPrice = subscription.price / 365; //1일당 금액.
                        var proRate = daysLeft * dayPrice; // 남은일수의 금액...
                        var price = paydata.price - proRate;
                        paydata.price = price.toFixed(2); //소수점 2자리 
                        subscription.end = Date.now();
                        callback({type: 'up', data: paydata, sid: userData.sid, subscription: subscription});
                    }
                }
                else { // 구독만료 - 새로운 구독시작
                    callback({type: 'update', data: paydata});
                }
            });
        }
        else { //구독종료(환불) - sid값이 빈 값
            callback({type: 'new', data: paydata});
        }
    }
    else { //신규인 경우
        callback({type: 'new', data: paydata});
    }
}

/**
 * 페이플 결제창 생성 
 * @param {*} json - {type(결제유형), data(paydata)}
 */
function requsetGlobalPay(json) {
    const data = json.data; 
    let obj = new Object();
    obj.service_id = "demo";
    obj.comments = 'Business site builder Pro - ' + data.type; // 상품명
    obj.totalAmount = data.price;
    obj.currency = "USD";
    obj.email = data.email;
    obj.resultUrl = location.href;
    obj.isDirect = "";
    obj.serviceDefine = JSON.stringify(json); //결제정보

    axios.post('/node/auth') // 토큰발급 요청
        .then(res => {
            obj.payCls = res.data.payCls;   // 파트너 인증 토큰발급 응답값으로 오는 payCls 그대로 전송 : 테스트 결제시만 필요
            obj.Authorization = res.data.access_token;  
            //console.log("결제창 호출 파라미터: ", obj);
            localStorage.setItem('paydata', JSON.stringify(json));
            paypleGpayPaymentRequest(obj); // 결제창 오픈
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 결제 팝업에서의 create my account / sign in 버튼 클릭이벤트
 * @param {*} e 
 */
function submitAccount(e) { 
    const email = $($(e.target).parent()).find('input[name=email]').val();
    const password = $($(e.target).parent()).find('input[name=password]').val();
    const confirmPw = $($(e.target).parent()).find('input[name=password_confirm]').val();
    const submitType = $($(e.target).closest('.email-login')[0]).attr('name');
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    
    if(!email || !password) {
        toastr.error('Fill in all the fields.');
        return;
    }
    if(submitType == 'signup' && !confirmPw) {
        toastr.error('Fill in all the fields.');
        return;
    }
    if(!reg.test(password) && submitType == 'signup') {
        toastr.error('Passwords must be at least 6 characters long and contain uppercase letters, numbers, and special characters.'); 
        return;
    }
    if(submitType == 'signup' && password != confirmPw) {
        toastr.error('The passwords don\'t match.');
        return;
    }
    //가입과 로그인 분기
    if(submitType == 'signup') {
        signupEmail(email, password).then(function(result) {
            const user = result.user;
            if(user.emailVerified) {
                toastr.success('Account signed up.');
            }
            else {
                toastr.info('Email verification is required.');
            }
        })
        .catch(function(error) {
            // 실패했을 때 에러 처리
            toastr.error(error.message, error.code);
        });
    }
    else if (submitType == 'signin'){
        signinEmail(email, password).then(function(result) {
            const user = result.user;
        })
        .catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }
}