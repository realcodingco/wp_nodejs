const accountSchemes = {
    resetPassword: {
        kind: 'box',
        className: 'resetPassword',
        children: [
            {
                kind: 'h4',
                text: 'Reset Your Password'
            },
            {
                kind: 'box',
                text: 'Please enter your email and we’ll send you a link that will reset your password.'
            },
            {
                kind: 'box',
                className: 'input',
                children: [
                    {
                        kind: 'label',
                        text: 'Email'
                    },
                    {
                        kind: 'input'
                    },
                    {
                        kind: 'button',
                        text: 'Reset Password',
                        onClick: 'sendResetEmail'
                    }
                ]
            },
            {
                kind: 'box',
                text: 'Back to Log In',
                onClick : e => {
                    $($(e.target).parents()[1]).find('.checkoutForm').show();
                    $(e.target).parent().remove();
                }
            }
        ]
    },
    signin : {

    },
    signinForm : { // 이메일 로그인 폼
        kind: 'box',
        className: 'email-login',
        children: [
            {
                kind: 'button',
                text: '< Back',
                onClick : e => { //클릭이벤트는 UI가 다르므로 다르게 적용
                    const parentClassName = $(e.target).parents('.checkoutForm').parent()[0].className.split('box ')[1];
                    if(parentClassName == 'signinBox') {
                        $('.signinBox > :nth-child(2)').show();
                    } else {
                        $('.accountAuth > :nth-child(1)').show();
                    }
                    // $(`.${parentClassName} > :nth-child(2)`).show();
                    $(`.${parentClassName} .registerBox`).show();
                    $(`.${parentClassName} .email-login`).hide();
                }
            },
            {
                kind: 'box',
                className: 'email-login-form',
                children: [
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'label',
                                text: 'Email'
                            },
                            {
                                kind: 'input',
                                name: 'email',
                                placeholder: 'enter your email'
                            },
                            {
                                kind: 'box',
                                html: ''
                            }
                        ]
                    },
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'label',
                                text: 'Password'
                            },
                            {
                                kind: 'input',
                                name: 'password',
                                type: 'password',
                            },
                            {
                                kind: 'span',
                                className : "material-symbols-outlined",
                                text: 'visibility',
                                onClick: e => {
                                    if(e.target.innerText == 'visibility') {
                                        e.target.innerText = 'visibility_off';
                                        $(e.target).prev()[0].type = 'text';
                                    }
                                    else {
                                        e.target.innerText = 'visibility';
                                        $(e.target).prev()[0].type = 'password';
                                    }
                                }
                            },
                            {
                                kind: 'box',
                                html: '<u>Forgot your password?</u>',
                                onClick : 'openForgotForm' // 이메일을 입력하고,, 재설정할 수 있도록
                            }
                        ]
                    },
                    {
                        kind:'button',
                        text: 'Sign in',
                        onClick: e => { //클릭이벤트는 UI가 다르므로 다르게 적용
                            const parentClassName = $(e.target).parents('.checkoutForm').parent()[0].className.split('box ')[1];
                            
                            if(parentClassName == 'signinBox') {
                                submitSign(e);
                            }
                            else if(parentClassName == 'accountAuth') {
                                submitAccount(e);
                            } 
                        }
                    }
                ]
            }
        ]
    },
    signup : {

    },
    signupForm : { // 이메일 회원가입 폼
        kind: 'box',
        className: 'email-login',
        children: [
            {
                kind: 'button',
                text: '< Back',
                onClick : e => {
                    const parentClassName = $(e.target).parents('.checkoutForm').parent()[0].className.split('box ')[1];
                    if(parentClassName == 'signinBox') {
                        $('.signinBox > :nth-child(2)').show();
                    } else {
                        $('.accountAuth > :nth-child(1)').show();
                    }
                    
                    $(`.${parentClassName} .registerBox`).show();
                    $(`.${parentClassName} .email-login`).hide();
                }
            },
            {
                kind: 'box',
                className: 'email-login-form',
                children: [
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'label',
                                text: 'Email'
                            },
                            {
                                kind: 'input',
                                name: 'email',
                                placeholder: 'enter your email'
                            },
                            {
                                kind: 'box',
                                html: 'We’ll need to verify your account, so keep this inbox accessible.'
                            }
                        ]
                    },
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'label',
                                text: 'Password'
                            },
                            {
                                kind: 'box',
                                children: [
                                    {
                                        kind: 'input',
                                        name: 'password',
                                        type: 'password',
                                        placeholder: 'at least 6 characters long',
                                    },
                                    {
                                        kind: 'span',
                                        className : "material-symbols-outlined",
                                        text: 'visibility',
                                        onClick: e => {
                                            if(e.target.innerText == 'visibility') {
                                                e.target.innerText = 'visibility_off';
                                                $(e.target).prev()[0].type = 'text';
                                            }
                                            else {
                                                e.target.innerText = 'visibility';
                                                $(e.target).prev()[0].type = 'password';
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                kind: 'box',
                                children: [
                                    {
                                        kind: 'input',
                                        name: 'password_confirm',
                                        type: 'password',
                                        placeholder: 'password confirm',
                                    },
                                    {
                                        kind: 'span',
                                        className : "material-symbols-outlined",
                                        text: 'visibility',
                                        onClick: e => {
                                            if(e.target.innerText == 'visibility') {
                                                e.target.innerText = 'visibility_off';
                                                $(e.target).prev()[0].type = 'text';
                                            }
                                            else {
                                                e.target.innerText = 'visibility';
                                                $(e.target).prev()[0].type = 'password';
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                kind: 'box',
                                html: 'Must contain at least one of each: upper-case, lower-case, digit, special characters.'
                            }
                        ]
                    },
                    {
                        kind:'button',
                        text: 'Create my account',
                        onClick: e => { //클릭이벤트는 UI가 다르므로 다르게 적용
                            const parentClassName = $(e.target).parents('.checkoutForm').parent()[0].className.split('box ')[1];
                            
                            if(parentClassName == 'signinBox') { // 메인 페이지
                                submitSign(e);
                            }
                            else if(parentClassName == 'accountAuth') { // pay 페이지
                                submitAccount(e);
                            } 
                        }
                    }
                ]
            }
        ]
    },
    
};
const profile = {
    detail : {
        kind: 'box',
        className: 'profileDetail',
        children: [
            {
                kind: 'box',
                children: [
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'box',
                                className: 'title',
                                text: 'Account Detail'
                            },
                            {
                                kind: 'span', // 수정 아이콘
                                className: "fa-regular fa-pen-to-square",
                                onClick: 'onEditAccountDetail'
                            }
                        ]
                    },
                    {
                        kind: 'box', //card body
                        className:'cardBody',
                        children: [
                            {
                                kind: 'box', //이미지
                            },
                            {
                                kind: 'box', // 이름
                                children: [
                                    {
                                        kind: 'box',
                                        text: 'Name'
                                    },
                                    {
                                        kind: 'box', 
                                        name: 'name'
                                    },
                                ]
                            },
                            {
                                kind: 'box',// 이메일
                                children: [
                                    {
                                        kind: 'box',
                                        text: 'Email'
                                    },
                                    {
                                        kind: 'box',
                                        className: 'email_info',
                                        children: [
                                            {
                                                kind: 'box',
                                                name: 'email'
                                            },
                                            {
                                                kind: 'box',  //메일 인증표시
                                                children: [
                                                    {
                                                        kind: 'span',
                                                        className: 'fa-solid fa-circle-xmark'//'fa-solid fa-circle-check'
                                                    },
                                                    {
                                                        kind: 'span',
                                                        text: 'Email Verified'
                                                    }
                                                ]
                                            }
                                        ] 
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    secession : { //탈퇴 블록
        kind: 'box',
        className: 'deleteAccount',
        children: [
            {
                kind: 'box',
                className: 'title',
                text: 'Delete Account'
            },
            {
                kind: 'box',
                children: [
                    {
                        kind: 'span',
                        html : 'This action cannot be undone! <font color=#956712>Cancel any active subscriptions before you delete your account.</font>'
                    },
                ]
            },
            {
                kind: 'button',
                text: 'Delete Account'
            }
        ]
    }
}
const subscr = {
    nothing: {
        kind: 'box',
        className: 'nothing',
        children: [
            {
                kind: 'box',
                text: "No subscriptions are active.",
            },
            {
                kind: 'box',
                children: [
                    {
                        kind: 'a',
                        href: '/plugin-hp#price', //가격 영역으로 바로 가려면?? 
                        text: 'Get started'
                    }
                ]
            }
        ]
    },
    overview: { //구독유형, 기간
        kind: 'box',
        className:'overview'
    },
    overviewItem: {
        kind: 'box',
        className: 'overviewItem',
        children: [
            {
                kind: 'box',
                name: 'label'
            },
            {
                kind: 'box',
                name: 'for'
            }
        ]
    },  
    domain : {
        kind: 'form',
        className: 'domainSetting',
        children:[
            {
                kind: 'box',
                className: 'title',
                text: 'Domain Settings'
            },
            {
                kind: 'span',
                text: 'Enter a domain address that starts with "https://".'
            },
            {
                kind: 'box',
                id: 'historyList'
            },
            {
                kind:'input',
                type: 'submit',
                text: 'Save'
            }
        ]
    },
    history : {
        kind: 'box',
        className: 'history',
        children: [
            {
                kind: 'box',
                className: 'title',
                text: 'Payment History'
            },
            {
                kind: 'box',
                style: {marginTop: 20, zoom: 0.7, textAlign: 'right'},
                children: [
                    {
                        kind: 'box',
                        className: 'curPoint now'
                    },
                    {
                        kind: 'span',
                        text: 'current subscription'
                    }
                ]
            },
            {
                kind: 'table',
                children: [
                    {
                        kind: 'tr',
                        children: [
                            {
                                kind: 'th',
                                text: 'Date'
                            },
                            {
                                kind: 'th',
                                text: 'Plan'
                            },
                            {
                                kind: 'th',
                                text: 'Price($)'
                            },
                            {
                                kind: 'th',
                                text: 'State'
                            },
                            {
                                kind: 'th',
                            }
                        ]
                    }
                ]
            }
        ] 
    },
    historyItem: {
        kind: 'tr',
        children: [
            {
                kind:'td',
                children: [
                    {
                        kind: 'box',
                        className: 'curPoint'
                    },
                    {
                        kind: 'text'
                    }
                ]
            },
            {
                kind:'td'
            },
            {
                kind:'td'
            },
            {
                kind:'td'
            },
            {
                kind:'td'
            },
            {
                kind:'td',
                children: [
                    {
                        kind: 'button',
                        text: 'refund'
                    }
                ]
            }
        ]
    }
};
const schemes = {
    loading: {
        kind: 'box',
        className: 'pageLoading',
        children: [
            {
                kind:'box',
                className:'loadingio-eclipse',
                children:[
                    {
                        kind:'box',
                        className:'ldio-rpinwye8j0b',
                        text: 'Loading',
                        children: [
                            {
                                kind:'box'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    header: {
        kind: 'box',
        className: 'header fixed',
    },
    ciBox: {
        kind: 'a', 
        style: {
            textDecoration:'none',
            marginRight: 'auto'
        },
        children: [
            {
                kind: 'img',
                className: 'logoImage',
                // onLoad: 'checkHeight()',
                style: {
                    float: 'left',
                    width: 60,
                    height: 'auto', //106.15,
                    padding: 10,
                }
            },
            {
                kind: 'span',
                text: 'Business site builder',
                style: {
        
                }
            }
        ]
    },
    signBtn: {
        kind: 'box',
        style: {display: 'none', cursor: 'pointer'}, //firebase 인증 후, 보여지도록 초기설정은 hidden
        children: [
            {
                kind: 'box',
                className: 'button',
                name: 'off',
                onClick: 'onAccount',
                children: [
                    {
                        kind: 'box',
                        className: 'img'
                    },
                    {
                        kind: 'text',
                        text: 'sign in',
                    },
                    {
                        kind: 'span',
                        className: 'material-symbols-outlined',
                        text: 'arrow_drop_down'
                    }
                ]
            }
        ]
    },
    profileDropdown : {
        kind: 'box',
        className: 'profileDropdown',
        children: [
            {
                kind: 'box',
                children: [
                    {
                        kind: 'a',
                        text: 'My Account',
                        href: '/plugin-hp/myinfo',
                        style: {
                            textDecoration: 'none',
                            color: 'black',
                            width: '100%',
                            textAlign: 'center'
                        }
                    }
                ]
            },
            {
                kind: 'box',
                onClick : 'signOut',
                children: [
                    {
                        kind: 'span',
                        className: 'material-symbols-outlined',
                        text: 'power_settings_new'
                    },
                    {
                        kind: 'text',
                        text: 'Sign Out'
                    }
                ]
            }
        ]
    },
    menuBox: {
        kind: 'ul',
        className: 'menuBox',
    },
    menu: {
        kind: 'li',
        className: 'menuTitle',
    },
    hambugerIcon:  {
        kind: 'box',
        className: 'menuTrigger',
        onClick: 'menuOpen',
        children: [
            {
                kind: 'span'
            },
            {
                kind: 'span'
            },
            {
                kind: 'span'
            }
        ]
    },
    spreadBox: {
        kind: 'box',
        style: {
            textAlign: 'center'
        },
        children: [
            {
                kind: 'box',
                className: 'spreadBox',
                onClick: e => {
                    const mom = $(e.target).parents('.spreadBox');
                    $(mom).find('.detailBox').slideToggle();
                    $(mom).find('span')[0].innerText = $(mom).find('span')[0].innerText == 'expand_less' ? 'expand_more' : 'expand_less';
                },
                children: [
                    // {
                    //     kind: 'img'
                    // },
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'p'
                            },
                            {
                                kind : 'span',
                                className: 'material-symbols-outlined',
                                text: 'expand_more'
                            },
                        ]
                    },
                    { // 세부 내용
                        kind: 'box',
                        className: 'detailBox'
                    },
                    
                ]
            },
            
        ]
    },
    priceTitle : {
        kind: 'box',
        className: 'priceTitle',
        children: [
            {
                kind : 'p',
                text: 'BUSINESS SITE BUILDER PLUGIN'
            },
            {
                kind : 'p',
                text: 'Pick the Pro Plugin Plan That’s Right for You'
            }
        ]
    },
    priceTable : {
        kind: 'box',
        className: 'priceTable',
        children: [
            {
                kind: 'p'
            },
            {
                kind: 'p'
            },
            {
                kind: 'box',
                className: 'price',
                children: [
                    {
                        kind: 'span',
                        text: 'USD'
                    },
                    {
                        kind: 'box',
                    },
                    {
                        kind: 'box',
                        text: '/Year'
                    }
                ]
            },
            {
                kind: 'box',
                className: 'buy',
                text: 'Buy Now'
            }
        ]
    },
    themeTitle :  {
        kind: 'p',
        className: 'themeTitle',
    },
    themeBox : {
        kind: 'box',
        className: 'themebox',
        children : [
            {
                kind: 'p'
                
            },
            {
                kind: 'a',
                // href: 'https://www.realcoding.co/fdn/7wQk6ZW7RI',
                download: 'sitebuilder-business',
                className: 'dlBtn',
                text: 'Download now'
            },
            {
                kind: 'img'
            },
            {
                kind: 'box'
            }
        ]
    },
    feature :  {
        kind: 'box',
        className: 'feature',
        children: [
            {
                kind: 'h5'
            },
            {
                kind: 'box'
            }
        ]
    },
    footer : {
        kind: 'box',
        className: 'footer',
        children: [
            {
                kind : 'box',
                children: [
                    {
                        kind: 'img'
                    },
                    {
                        kind: 'box',
                        text: 'Business site builder'
                    },
                ]
            },
            // {
            //     kind: 'span',
            //     text: '879-87-00504'
            // }, 
            {
                kind: 'span',
                text: 'Realcoding © 2023'
            }
        ]
    },
    adminTool : {
        kind: 'box',
        className: 'adminTool',
        children: [
            {
                kind: 'h2',
                text: 'Easy customization editing' //'간편한 커스텀마이징 편집'
            }, 
            {
                kind: 'p',
                text: 'Use the admin tools provided by the plugin to make your own customizations' //'플러그인에서 제공하는 관리자 툴로 원하는 내용으로 수정해보세요'
            },
            {
                kind: 'img',
                src: './style/admin.png'
            }
        ]
    },
    lineBanner: {
        kind: 'box',
        className: 'linebanner',
        text: 'Theme templates will continue to be added'
    },
    topbutton:  {
        kind: 'box',
        className: 'topbtn',
        children : [
            {
                kind: 'a',
                href: '#mainapp',
                children: [
                    {
                        kind: 'i',
                        className :"fa-regular fa-circle-up"
                    }
                ]
            }
        ]
    },
    checkout: {
        kind: 'box',
        className:'purchasePop',
        children: [
            {
                kind: 'box',
                onClick: e => { //메인페이지 가격섹션으로 이동
                    window.location.replace('/plugin-hp#price');
                    // location.href = '/plugin-hp#price';
                },
                children: [
                    {
                        kind:'span',
                        className: 'material-symbols-outlined',
                        text : 'close'
                    }
                ]
            },
            {
                kind: 'box',
                text: 'Let\'s complete your subscription.'
            },
            {
                kind: 'box',
                className: 'billing',
                children: [
                    {
                        kind: 'box',
                        className: 'billSummary',
                    },
                    {
                        kind: 'box'
                    }
                ]
            }
        ]
    },
    rowBox: {
        kind: 'box',
        className: 'rowBox',
        children: [
            {
                kind: 'span'
            },
            {
                kind: 'span'
            }
        ]
    },
    discountBox: {
        kind: 'box',
        className:'discount',
        children : [
            {
                kind: 'box',
                text: 'Discount code'
            },
            {
                kind: 'box',
                children: [
                    {
                        kind: 'input',
                        placeholder:'Enter code',
                        focus: e => {
                            e.target.classList.remove('warn');
                            $('.discount').find('span').hide();
                        },
                        blur: e => {
                            if(e.target.value == '') {
                                $('.discountRate').hide();
                                const raw = $('.totalPrice')[0].getAttribute('data-price') * 1;
                                $('.totalPrice')[0].dataset.final = raw;
                                $('.totalPrice')[0].innerText = `${raw.toFixed(2)} USD`;
                            }   
                        }
                    },
                    {
                        kind: 'button',
                        text: 'Apply',
                        onClick: 'checkDiscount'
                    },
                    {
                        kind: 'span',
                        text: 'Please enter a coupon code.'
                    }, 
                    {
                        kind: 'box',
                        className: 'discountRate',
                        text: '10%'
                    }
                ]
            }
        ]
    },
    payBtn : {
        kind: 'button',
        className: 'payBtn',
        text: 'Pay now',
        onClick: 'onPay'
    },
    accountBox : {
        kind: 'box',
        className: 'accountAuth',
        children: [
            {
                kind: 'box',
                children: [
                    {
                        kind: 'h3',
                        className: 'accountTitle',
                        text: 'Create an account'
                    },
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'span',
                                text: 'Already have an account?'
                            },
                            {
                                kind: 'a',
                                text: 'sign in',
                                onClick: e => {
                                    if(e.target.innerText == 'sign in') {
                                        $('.accountTitle').text('Sign in');
                                        $(e.target).prev().text('Don\'t have an account?');
                                        e.target.innerText = 'Create an account';
                                        $('.accountAuth #checkout-login').show();
                                        $('.accountAuth #checkout-register').hide();
                                    }
                                    else {
                                        $('.accountTitle').text('Create an account');
                                        $(e.target).prev().text('Already have an account?');
                                        e.target.innerText = 'sign in';
                                        $('.accountAuth #checkout-login').hide();
                                        $('.accountAuth #checkout-register').show();
                                    }
                                }
                            }
                        ]
                    },
                ]
            },
            {
                kind: 'box',
                className: 'checkoutForm',
                children:[
                    {
                        kind: 'box',
                        id: 'checkout-login',
                        children: [
                            {
                                kind: 'box',
                                className: 'registerBox',
                                style: {
                                    width: 'auto'
                                },
                                children: [
                                    { // 구글
                                        kind : 'box',
                                        id : 'google-login-btn',
                                        children : [
                                            {
                                                kind: 'img',
                                                src : "https://img.icons8.com/color/48/google-logo.png",
                                                alt : "google-logo",
                                            },
                                            {
                                                kind: 'span',
                                                text: 'Sign in with Google',
                                                onClick: 'onGoogleAuth'
                                            }
                                        ]
                                    }, 
                                    { //구분선
                                        kind : 'box',
                                        className: 'formDivider',
                                        children: [
                                            {
                                                kind: 'hr'
                                            },
                                            {
                                                kind: 'span',
                                                text: 'OR'
                                            },
                                            {
                                                kind: 'hr'
                                            }
                                        ]
                                    },
                                    { //이메일
                                        kind : 'box',
                                        className: 'sign-with-email',
                                        children : [
                                            {
                                                kind: 'i'
                                            },
                                            {
                                                kind: 'span',
                                                text: 'Sign in with your email',
                                            }
                                        ],
                                        onClick : e => {
                                            $('.accountAuth > :nth-child(1)').hide();
                                            $('.accountAuth .registerBox').hide();
                                            $('.accountAuth .email-login').show();
                                            $('.accountAuth .email-login').attr('name', 'signin');
                                        }
                                    }
                                ]
                            },
                            accountSchemes.signinForm
                        ]
                    },
                    {
                        kind: 'box',
                        id: 'checkout-register',
                        children: [
                            {
                                kind: 'box',
                                children: [
                                    {
                                        kind: 'box',
                                        className: 'registerBox',
                                        children: [
                                            { // 구글
                                                kind : 'box',
                                                id : 'google-login-btn',
                                                children : [
                                                    {
                                                        kind: 'img',
                                                        src : "https://img.icons8.com/color/48/google-logo.png",
                                                        alt : "google-logo",
                                                    },
                                                    {
                                                        kind: 'span',
                                                        text: 'Continue with Google',
                                                        onClick : 'onGoogleAuth'
                                                    }
                                                ]
                                            }, 
                                            { //구분선
                                                kind : 'box',
                                                className: 'formDivider',
                                                children: [
                                                    {
                                                        kind: 'hr'
                                                    },
                                                    {
                                                        kind: 'span',
                                                        text: 'OR'
                                                    },
                                                    {
                                                        kind: 'hr'
                                                    }
                                                ]
                                            },
                                            { //이메일
                                                kind : 'box',
                                                className: 'continue-with-email',
                                                children : [
                                                    {
                                                        kind: 'i'
                                                    },
                                                    {
                                                        kind: 'span',
                                                        text: 'Continue with your email'
                                                    }
                                                ],
                                                onClick : e => {
                                                    $('.accountAuth > :nth-child(1)').hide();
                                                    $('.accountAuth .registerBox').hide();
                                                    $('.accountAuth .email-login').show();
                                                    $('.accountAuth .email-login').attr('name', 'signup');
                                                }
                                            },
                                        ]
                                    },
                                    accountSchemes.signupForm
                                ]
                            },
                            {
                                kind: 'box',
                                className : 'note-register',
                                html : 'By creating an account, you agree to receive Business site builder emails, including marketing emails, and to our<br>',
                                children: [
                                    {
                                        kind: 'a',
                                        target: '_blank',
                                        text: 'Terms of Service',
                                        href: '/plugin-hp/termsofuse.txt',
                                        
                                    },
                                    {
                                        kind: 'text',
                                        text: ' & '
                                    },
                                    {
                                        kind: 'a',
                                        text: 'Privacy Policy',
                                        href: '/plugin-hp/privacy.txt',
                                        target: '_blank'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            
        ]
    },
    signinDropdown: {
        kind: 'box',
        className: 'signinDropdown',
        children: [
            {
                kind: 'box',
                className: 'signinBox',
                children: [
                    {
                        kind:'span',
                        className: 'material-symbols-outlined',
                        text : 'close',
                        onClick : e => {
                            $('.signinDropdown').remove();
                        }
                    },
                    {
                        kind: 'box',
                        children: [
                            {
                                kind: 'h3',
                                className: 'signTitle',
                                html: 'Let\'s create your<br>Business site builder account'
                            },
                            {
                                kind: 'box',
                                children: [
                                    {
                                        kind: 'span',
                                        text: 'Already have an account?'
                                    },
                                    {
                                        kind: 'a',
                                        text: 'sign in',
                                        onClick: e => {
                                            if(e.target.innerText == 'sign in') { 
                                                $('.signTitle').html('Sign in to Business site builder');
                                                $(e.target).prev().text('New to Business site builder?');
                                                e.target.innerText = 'Create an account';
                                                $('#checkout-login').show();
                                                $('#checkout-register').hide();
                                            }
                                            else {
                                                $('.signTitle').html('Let\'s create your<br>Business site builder account');
                                                $(e.target).prev().text('Already have an account?');
                                                e.target.innerText = 'sign in';
                                                $('#checkout-login').hide();
                                                $('#checkout-register').show();
                                            }
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        kind: 'box',
                        className: 'checkoutForm',
                        children:[
                            {
                                kind: 'box',
                                id: 'checkout-login',
                                children: [
                                    {
                                        kind: 'box',
                                        style: {
                                            width: '100%'
                                        },
                                        children: [
                                            {
                                                kind: 'box',
                                                className: 'registerBox',
                                                style: {
                                                    width: '100%'
                                                },
                                                children: [
                                                    { // 구글
                                                        kind : 'box',
                                                        id : 'google-login-btn',
                                                        children : [
                                                            {
                                                                kind: 'img',
                                                                src : "https://img.icons8.com/color/48/google-logo.png",
                                                                alt : "google-logo",
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'Sign in with Google',
                                                                onClick: 'onGoogleAuth'
                                                            }
                                                        ]
                                                    }, 
                                                    { //구분선
                                                        kind : 'box',
                                                        className: 'formDivider',
                                                        children: [
                                                            {
                                                                kind: 'hr'
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'OR'
                                                            },
                                                            {
                                                                kind: 'hr'
                                                            }
                                                        ]
                                                    },
                                                    { //이메일
                                                        kind : 'box',
                                                        className: 'sign-with-email',
                                                        children : [
                                                            {
                                                                kind: 'i'
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'Sign in with your email'
                                                            }
                                                        ],
                                                        onClick : e => {
                                                            $('.signinBox > :nth-child(2)').hide();
                                                            $('.signinBox .registerBox').hide();
                                                            $('.signinBox .email-login').show();
                                                            $('.signinBox .email-login').attr('name', 'signin');
                                                        }
                                                    }
                                                ]
                                            },
                                            accountSchemes.signinForm
                                        ]
                                    },
                                    // {
                                    //     kind: 'box',
                                    //     className : 'note-register',
                                    //     html : 'By creating an account, you agree to receive Business site builder emails, including marketing emails, and to our<br>',
                                    //     children: [
                                    //         {
                                    //             kind: 'a',
                                    //             text: 'Terms of Service'
                                    //         },
                                    //         {
                                    //             kind: 'text',
                                    //             text: ' & '
                                    //         },
                                    //         {
                                    //             kind: 'a',
                                    //             text: 'Privacy Policy'
                                    //         }
                                    //     ]
                                    // }
                                ]
                            },
                            {
                                kind: 'box',
                                id: 'checkout-register',
                                children: [
                                    {
                                        kind: 'box',
                                        style: {
                                            width: '100%'
                                        },
                                        children: [
                                            {
                                                kind: 'box',
                                                className: 'registerBox',
                                                children: [
                                                    { // 구글
                                                        kind : 'box',
                                                        id : 'google-login-btn',
                                                        children : [
                                                            {
                                                                kind: 'img',
                                                                src : "https://img.icons8.com/color/48/google-logo.png",
                                                                alt : "google-logo",
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'Continue with Google',
                                                                onClick: 'onGoogleAuth'
                                                            }   
                                                        ]
                                                    }, 
                                                    { //구분선
                                                        kind : 'box',
                                                        className: 'formDivider',
                                                        children: [
                                                            {
                                                                kind: 'hr'
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'OR'
                                                            },
                                                            {
                                                                kind: 'hr'
                                                            }
                                                        ]
                                                    },
                                                    { //이메일
                                                        kind : 'box',
                                                        className: 'continue-with-email',
                                                        children : [
                                                            {
                                                                kind: 'i'
                                                            },
                                                            {
                                                                kind: 'span',
                                                                text: 'Continue with your email'
                                                            }
                                                        ],
                                                        onClick : e => {
                                                            $('.signinBox > :nth-child(2)').hide();
                                                            $('.signinBox .registerBox').hide();
                                                            $('.signinBox .email-login').show();
                                                            $('.signinBox .email-login').attr('name', 'signup');
                                                        }
                                                    },
                                                ]
                                            },
                                            accountSchemes.signupForm
                                        ]
                                    },
                                    {
                                        kind: 'box',
                                        className : 'note-register',
                                        html : 'By creating an account, you agree to receive Business site builder emails, including marketing emails, and to our<br>',
                                        children: [
                                            {
                                                kind: 'a',
                                                text: 'Terms of Service',
                                                href: '/plugin-hp/termsofuse.txt',
                                                target: '_blank'
                                            },
                                            {
                                                kind: 'text',
                                                text: ' & '
                                            },
                                            {
                                                kind: 'a',
                                                text: 'Privacy Policy',
                                                href: '/plugin-hp/privacy.txt',
                                                target: '_blank'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                    
                ]
            }
        ]
    },
    signedBox : { //결제팝업에서 계정 로그인 상태 박스
        kind: 'box',
        className: 'signedBox',
        children: [
            {
                kind: 'box',
                children: [
                    {
                        kind: 'span',
                        className :"material-symbols-outlined",
                        text: 'check_circle'
                    },
                ]
            },
            {
                kind: 'box',
                children: [
                    {
                        kind: 'h3',
                        className: 'accountTitle',
                        text: 'Signed in'
                    },
                    {
                        kind: 'span'
                    }
                ]
            }
        ]
    },
    verifyPopup : {
        kind: 'box',
        className: 'verifyPopup',
        children: [
            {
                kind: 'box',
                style: {
                    textAlign: 'center',
                    height: 'auto'
                },
                children: [
                    {
                        kind:'span',
                        className: 'material-symbols-outlined',
                        text: 'info',
                        style: {
                            fontSize: 80,
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: 10
                        },
                    }
                ]
            },
            {
                kind: 'p',
                html: 'Your email has not been verified yet.<br> After processing the authentication email sent to you, Click the Done button below.'
            },
            {
                kind: 'button',
                text: 'Verification Done',
                onClick : e => location.reload()
            },
            {
                kind: 'box',
                children: [
                    {
                        kind: 'span',
                        text: 'Resend authentication email',
                        onClick: e => {
                            auth.currentUser.sendEmailVerification().then(() => {
                                alert('메일이 발송되었습니다.');
                            });
                        }
                    },
                    {
                        kind: 'span',
                        text: 'Start with another account', // 다른계정으로 시작하기
                        onClick: e => { //로그아웃 : 계정삭제는 비밀번호 필요.
                            signOutAuth().then(function() {
                                location.replace('/plugin-hp');
                            });
                        }
                    }
                ]
            }
            
        ]
    }
}

const elementScheme = {
    copyIcon: {
        kind: 'span',
        className: 'material-symbols-outlined copyIcon',
        text: 'content_copy'
    },
    title : {
        kind: 'h3',
    },
    menuPopup : {
        kind: 'box',
        className: 'menuPopup'
    },
    menuPopupItem : {
        kind: 'box',
        children: [
            {
                kind: 'span',
                className: 'material-symbols-outlined'
            },
            {
                kind: 'span'
            }
        ]
    },
    hr : {
        kind: 'hr'
    },
    editPopupBackdrop:  {
        kind: 'box',
        className: 'editPopupBackdrop',
    },
    editPopup : {
        kind: 'box',
        className: 'editPopup',
        children: [
            {
                kind: 'box',
                className: 'editContentBox',
                children: [
                    {
                        kind: 'box',//header
                        className: 'modalHeader'
                    },{
                        kind: 'box',//body
                        className: 'modalBody'
                    },{
                        kind: 'box',//footer
                        className: 'modalFooter',
                        children: [
                            {
                                kind: 'button',
                                text: 'Cancel',
                                onClick: e => {
                                    $('.editContentBox').addClass('fadeOut');
                                    $('.editPopupBackdrop').fadeOut(701, function() {
                                        $('.editPopupBackdrop').remove();
                                    })
                                }
                            },
                            {
                                kind: 'button',
                                text: 'Save',
                                className: 'saveBtn'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    editForm: {
        kind: 'box',
        className: 'editForm',
        children: [
            {
                kind: 'label',
            },
            {
                kind: 'input',
                spellCheck: 'false',
                placeholder: 'Type here'
            },
            {
                kind: 'span',
                className : "material-symbols-outlined",
                text: 'visibility',
                onClick: e => {
                    if(e.target.innerText == 'visibility') {
                        e.target.innerText = 'visibility_off';
                        $(e.target).prev()[0].type = 'text';
                    }
                    else {
                        e.target.innerText = 'visibility';
                        $(e.target).prev()[0].type = 'password';
                    }
                }
            },
            {
                kind: 'box',
                className: 'feedback'
            }
        ]
    },
    customPopup: { //커스텀 confirm 창
        kind: 'box',
        class: 'customPopup',
        children: [
            {
                kind: 'box',
                children: [
                    {
                        kind: 'span'
                    },
                    {
                        kind: 'box',
                        className: 'btns',
                        children: [
                            {
                                kind: 'button',
                                text: 'Cancel',
                                onClick : e => {
                                    $('.customPopup').remove();
                                }
                            },
                            {
                                kind: 'button',
                                text: 'Ok'
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

const myinfo = {
    flexBox: {
        kind: 'box',
        className: 'myinfo_wrap',
        style: {
            display: 'flex'
        }
    },
    menuBox : {
        kind: 'box',
        className: 'myinfo_sidebar',
        children: [
            {
                kind: 'a',
                href: '/plugin-hp/subscription',
                // onClick: 'openSubscriptions',
                children: [
                    {
                        kind: 'i',
                        className: 'fa-regular fa-credit-card'
                    },
                    {
                        kind: 'span',
                        text: 'Subscriptions'
                    }
                ]
            }
        ]
    },
    dashViewBox : {
        kind: 'box',
        className: 'myinfo_dashview'
    }
}