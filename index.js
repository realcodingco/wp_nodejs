const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require("./config");

const app = express();

app.set("port", config.port); // 포트 설정
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));
app.use((req,res,next)=>{ // 2번 미들웨어
    next();
})
app.use('/node', require('./routes'));

app.get('/plugin-hp', (req, res) => { 
    res.sendFile(path.join(__dirname, '/public/plugin-hp/index.html'));
});

app.post('/plugin-hp/pay', (req, res) => { 
    if(req.body.result == 'C0998') { //결제창 닫기버튼 클릭
        res.redirect('back');
    }
    else if(req.body.result == 'A0000') { //결제성공시 subscription 페이지 열기, 데이터 저장.
        const responseData = {
            type: req.body.type,                              // 요청종류 [결제: PAYMENT | 취소: CANCEL]
            result: req.body.result,                          // 응답 코드
            message: req.body.message,                        // 응답 메시지
            resultUrl: req.body.resultUrl,                    // 결제결과 반환(Return) URL
            api_id: req.body.api_id,                          // 결제 요청 고유키
            api_date: req.body.api_date,                      // 결제 시간 (페이플 서버기준: GMT +9)
            service_oid: req.body.service_oid,                // 주문번호
            comments: req.body.comments,                      // 상품명
            pay_type: req.body.pay_type,                      // 결제수단
            card_number: req.body.card_number,                // 카드번호 (일부 마스킹 처리)
            totalAmount: req.body.totalAmount,                // 결제 요청금액
            currency: req.body.currency,                      // 통화
            firstName: req.body.firstName,                    // 카드소유주 이름
            lastName: req.body.lastName,                      // 카드소유주 성
            email: req.body.email,                            // 이메일 주소
            billing_key: req.body.billing_key,                // 빌링키 (카드정보를 암호화 한 키 값)
            submitTimeUtc: req.body.submitTimeUtc             // 결제 시간
        }
        res.redirect(responseData.resultUrl + '&state=done' + '&id=' + responseData.api_id + '&oid=' + responseData.service_oid);
    }
});

app.listen(config.port, () => {
    console.info('Started on port', config.port);
});

module.exports = app;