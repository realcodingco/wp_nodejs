const compData = {
    bx : price,
    category: 'section'
};
BX.regist('Price', compData);

/**
 * 헤더 컴포넌트 
 * @param {object} scheme 
 * @returns 헤더 box
 */
function price(scheme) {
    const b = box();
    b[0].id = 'price';
    BX.component(schemes.priceTitle).appendTo(b);

    const table = box().appendTo(b);
    table[0].className = 'tableWrap';
    Object.keys(scheme).forEach(function(type, i) {
        const el = BX.component(schemes.priceTable).appendTo(table);
        el.children()[0].textContent = type.toUpperCase();
        const domain = scheme[type].site;
        el.children()[1].textContent = domain + ' Pro Website';
        
        el.find('.price').children()[1].textContent = scheme[type].price;
        // 플랜선택 buy now 버튼 클릭 : 결제 페이지로 이동
        $(el).find('.buy')[0].onclick = e => { 
            location.href = '/plugin-hp/pay?type=' + type;
        }
        $(el).find('.buy')[0].dataset.type = type;
    });

    const appdx = `* The above prices exclude any applicable taxes based on your billing address.<br>
    See the checkout page for final pricing.`;
    box().appendTo(b).width('90%').html(appdx).fontSize(10).textColor('gray').wordBreak('keep-all').textAlign('left').maxWidth(1100);

    return b;
}

/**
 * 메인페이지 signin open 상태에서의 create my account / sign in 버튼 클릭이벤트
 * @param {*} e 
 * @returns 
 */
function submitSign(e) { 
    const email = $($(e.target).parent()).find('input[name=email]').val();
    const password = $($(e.target).parent()).find('input[name=password]').val();
    const confirmPw = $($(e.target).parent()).find('input[name=password_confirm]').val();
    const submitType = $('.signinBox .email-login').attr('name');
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    
    if(!email || !password) { //입력된 항목이 없으면,
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
        console.log('가입');
        signupEmail(email, password).then(function(result) {
            const user = result.user;
            if(!user.emailVerified) { //이메일 인증상태가 아니면 인증메일 전송
                user.sendEmailVerification();
            }
        })
        .catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }
    else if (submitType == 'signin'){
        console.log('로그인');
        signinEmail(email, password).then(function(result) {
            const user = result.user;
            $('.signinDropdown').remove(); //로그인창 팝업 닫기
        })
        .catch(function(error) {
            toastr.error(error.message, error.code);
        });
    }
}
