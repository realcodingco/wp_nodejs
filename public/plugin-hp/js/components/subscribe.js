const compData = {
    bx : subscribe,
    category: 'subscribe'
};
BX.regist('Subscribe', compData);

/**
 * 구독페이지 컴포넌트 
 * @param {object} scheme 
 * @returns 구독 box
 */
function subscribe(scheme) {
    const b = BX.component(myinfo.flexBox);

    BX.component(myinfo.menuBox).appendTo(b);
    const viewBox = BX.component(myinfo.dashViewBox).appendTo(b);

    BX.component(elementScheme.title).appendTo(viewBox).text('Subscriptions');

    // 구독여부 확인하기 
    const uid = user.uid;
    getUserData(uid, function(data) {
        //구독 히스토리는 있으나, 구독상태가 아닌 경우
        let sid;
        if(!data || !data.sid) {  // 구독상태가 아니라면 pricing 페이지 이동 버튼 붙이기
            BX.component(subscr.nothing).appendTo(viewBox);
        }
        else if(data && data.sid){ 
            sid = data.sid; 
            getUserSubscription(uid, sid, doc => { //현재 구독
                const subscrData = doc;
                const overviewBox = BX.component(subscr.overview).appendTo(viewBox);
                const items = [
                    { 
                        text: 'Plan',
                        for : subscrData.type
                    },
                    { 
                        text: 'S/N',
                        for : sid
                    },
                    {
                        text: 'Period',
                        for: `${new Date(subscrData.start).toLocaleDateString()} ~ ${new Date(subscrData.end).toLocaleDateString()}`
                    } 
                ];
                for(var i=0; i<items.length; i++){
                    const line = BX.component(subscr.overviewItem).appendTo(overviewBox);
                    const itemTitle = items[i].text;
                    $(line).find('[name=label]')[0].innerText = itemTitle;
                    if(itemTitle == 'S/N') {
                        const snBox = $(line).find('[name=for]');
                        snBox[0].innerHTML = encrypted(items[i].for);
                        snBox.addClass('sn');
                        line[0].onclick = e => { //시리얼넘버 클립보드 복사 클릭이벤트
                            const sn = $('.sn')[0].innerText;
                            window.navigator.clipboard.writeText(sn).then(() => {
                                toastr.info("The serial number has been copied to the clipboard.<br>Paste it in your WordPress plugin management page to use it.");
                            });
                        };
                        BX.component(elementScheme.copyIcon).appendTo(line);
                    }
                    else {
                        $(line).find('[name=for]')[0].innerHTML = items[i].for; 
                    }   
                }
                
                const domainBox = BX.component(subscr.domain).appendTo(viewBox);
                const domainListBox = $(domainBox).find('#historyList')[0];
                const validDomainCount = subscrData.domain; //유효 도메인수
                const domainData = data.domain;
                for(let d=0; d<validDomainCount; d++) { //도메인 입력창 붙이기
                    const el = BX.component(elementScheme.editForm).appendTo(domainListBox);
                    $(el).find('input')[0].type = 'url';
                    $(el).find('input')[0].name = 'domain';
                    if(domainData) $(el).find('input')[0].value = domainData[d];
                }

                $(domainBox).submit(e => {
                    e.preventDefault();
                    const isEmpty = (array) => array.every(x => (x == null || x == ''));
                    const domains = $('[name=domain]').map( function() { return this.value } ).get();

                    if(isEmpty(domains)) {
                        toastr.error('please enter a domain and try again.', 'No value entered');  
                        return;
                    }
                    
                    // 도메인 저장
                    userUpdateSubscription(uid, {domain: domains}, result => {
                        toastr.success('The domain settings are saved.');
                    });
                });
            });
        }

        const historyBox = BX.component(subscr.history).appendTo(viewBox);
        getUserHistory(uid, result => {
            if(!result) return;

            result.forEach((doc) => {
                const table = $(historyBox).find('table')[0]; 
                const line = BX.component(subscr.historyItem).appendTo(table);
                const historyData = doc.data(); 
                $(line).find('td:nth-child(1)').contents()[1].textContent = new Date(historyData.start).toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: 'numeric'});
                $(line).find('td')[1].innerText = historyData.type;
                $(line).find('td')[2].innerText = historyData.price;
                $(line).find('td')[3].innerText = historyData.state;

                let payDate = new Date(historyData.start); //결제시점
                payDate.setDate(payDate.getDate() + 7); // 7일 후
                
                // refund 기준 : 구입 후 7일 이내, 구독상태 'on'인 경우, 
                // 또는 다음 결제 대기 중인 상태 'wait' - 부분 환불은 없는걸로
                // wait 구독을 두고,,, on 구독을 환불하는 경우,
                if(historyData.state == 'on' && historyData.start < payDate.getTime() || historyData.state == 'wait') {// 환불가능한 결제건은 refund 버튼 노출
                    const refundBtn = $(line).find('td:last-child button');
                    refundBtn[0].onclick = e => {
                        cancelPay(historyData, doc.id);
                    }
                    refundBtn.show();
                }

                if(sid && doc.id == sid) { //현재 구독결제건 point 색표시
                    $(line).find('.curPoint').addClass('now');
                }
            });
        });    
    });
    
    return b;
}

/**
 * refund 버튼 클릭시 : 결제 취소
 * @param {*} data 
 */
function cancelPay(data, refundSid) { 
    BX.components.Popup.bx({text: 'When a payment is cancelled, the existing subscription is disabled.\nAre you sure you want to proceed?', fn : e => {
        showLoading();
        let obj = {
            service_id: "demo",
            comments: 'Business site builder Pro - ' + data.type,
            service_oid: data.payResult.oid,
            pay_id: data.payResult.payId,
            totalAmount: data.price,
            currency: "USD",
            resultUrl : location.href
        };
        console.log('결제 취소', data, obj, refundSid, user.uid);
        
        axios.post('/payple/cancel', obj)
        .then(res => {
            console.log(res.data, '<<<');
            
            if(res.data.result == 'A0000') { //취소 성공
                const refundDate = new Date(res.data.api_date).getTime();
                // wait 구독이 있으면,, 해당 wait 구독건을 바로 실행.. 
                getUserWaitSubscription(user.uid, waitSid => {
                    if(waitSid && refundSid != waitSid) {
                        userUpdateSid(user.uid, waitSid); 
                        const now = Date.now();
                        const updateData = { //대기 구독 활성화시 상태, 기간 업데이트..
                            state: 'on',
                            start: now,
                            end : getOneyearLater(now)
                        };
                        userUpdateHistory(user.uid, waitSid, updateData);
                    }
                    else {
                        userUpdateSid(user.uid, null); 
                    }
                    // history 데이터 state refund 처리
                    userUpdateHistory(user.uid, refundSid, {state: 'refund', end: refundDate}, () => {
                        $('.customPopup').remove(); //팝업닫고,,
                        hideLoading();
                        toastr.success('The payment was cancelled.');
                        setTimeout(()=>{location.reload();}, 2500);
                    });
                });
                
            }
            else { // 취소실패
    
            }
        })
        .catch(err => {
            console.error(err);
        });
    }}).appendTo(topBox);
}