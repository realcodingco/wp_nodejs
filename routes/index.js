var express = require('express');
const path = require('path');
const axios = require("axios");
const config = require('../config');
const cors = require('cors');
const corsOpt = function(req, callbank) { //모든 도메인 허용
    callbank(null, {origin: true});
};
//app.options('*', cors(corsOpt)); // option 메서드로 사전 접근 허용
var router = express.Router();

router.post('/config', cors(corsOpt), (req, res) => {
    res.json(config.firebaseConfig);
});

/**
 * POST /auth, 파트너 인증 API
 * 1. 파트너 인증을 위한 토큰 발급은 결제요청(취소) 전 필수로 진행
 * 2. 토큰의 유효기간인 10분이 지나면 요청이 거부되니 유의해주세요.
 * 3. (운영) 파트너 인증 토큰발급 요청시에는 등록한 IP(White IP)와의 통신만 허용합니다.
 */
router.post('/auth', async (req, res) => {
    try {
        const authParams = {
            service_id: process.env.SERVICE_ID,   // 파트너 ID
            service_key: process.env.SERVICE_KEY, // 파트너 인증키
            code: process.env.SERVICE_CODE        // 파트너용 토큰 확인 코드
        }

        /*
         * 파트너 인증 HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/oauth/1.0/token
         * REAL : https://api.payple.kr/gpay/oauth/1.0/token
         */
        const {data} = await axios.post('https://demo-api.payple.kr/gpay/oauth/1.0/token', authParams, {
            headers: {
                'content-type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});

// POST /payBillkey, 빌링키 결제 API
router.post('/payBillkey', async (req, res) => {
    try {
        // 빌링키 결제요청전 파트너 인증
        const {data} = await axios.post(process.env.HOSTNAME + '/node/auth');
        const accessToken = data.access_token;
        const payData = {
            service_id: process.env.SERVICE_ID,                     // [필수] 파트너 ID
            service_oid: req.body.service_oid,                      // [선택] 주문번호
            comments: req.body.comments,                            // [필수] 상품명
            billing_key: req.body.billing_key,                      // [필수] 빌링키 (카드정보를 암호화 한 키 값)
            securityCode: req.body.securityCode,                    // [필수] 카드 CVC/CVV 번호
            totalAmount: req.body.totalAmount,                      // [필수] 결제 요청금액
            currency: req.body.currency,                            // [필수] 통화
            firstName: req.body.firstName,                          // [선택] 카드소유주 이름 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 이름으로 결제요청이 됩니다.)
            lastName: req.body.lastName,                            // [선택] 카드소유주 성 (보내지 않을 경우, 최초 결제시 입력한 카드소유주 성으로 결제요청이 됩니다.)
            email: req.body.email,                                  // [선택] 이메일 주소  (보내지 않을 경우, 최초 결제시 입력한 이메일 주소로 결제요청이 됩니다.)
            resultUrl: req.body.resultUrl                           // [선택] 해당 파라미터(resultUrl)는 별도의 기능은 하지 않으나, 파트너사에서 빌링키 결제 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
        }

        /*
         * 빌링키 결제 Request HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/billingKey
         * REAL : https://api.payple.kr/gpay/billingKey
         */
        const result = await axios.post('https://demo-api.payple.kr/gpay/billingKey', payData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        console.log("빌링키 결제 API 결과", result.data);
        res.status(200).json(result.data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
})

// POST /cancel, 결제취소 API//
router.post('/cancel', async (req, res) => {
    try {
        // 결제취소전 파트너 인증
        const {data} = await axios.post(process.env.HOST_URL + '/node/auth');
        const accessToken = data.access_token;

        const cancelData = {
            service_id: process.env.SERVICE_ID,                 // [필수] 파트너 ID
            comments: req.body.comments,                        // [필수] 상품명
            service_oid: req.body.service_oid,                  // [필수] 주문번호
            pay_id: req.body.pay_id,                            // [필수] 취소할 결제건의 api_id
            totalAmount: req.body.totalAmount,                  // [필수] 결제 취소 요청금액
            currency: req.body.currency,                        // [필수] 통화 (취소할 결제건의 통화로 보내야합니다)
            //resultUrl: process.env.HOST_URL + "/node/result"    // [선택] 파트너사에서 취소 성공시 리다이렉트 하는 등 활용할 수 있는 파라미터입니다.
        }

        /*
         * 결제취소 Request HTTP URL
         * TEST : https://demo-api.payple.kr/gpay/cancel
         * REAL : https://api.payple.kr/gpay/cancel
         */
        const result = await axios.post('https://demo-api.payple.kr/gpay/cancel', cancelData, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        // console.log("결제취소 API 결과", result.data);
        res.status(200).json(result.data);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
})


/* Oid 생성 함수
 * 리턴 예시: 202208011659339808756
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


module.exports = router;