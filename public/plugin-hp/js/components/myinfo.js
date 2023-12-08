const compData = {
    bx : myInfo,
    category: 'account'
};
BX.regist('MyInfo', compData);

/**
 * My Account 페이지 컴포넌트 
 * @param {object} scheme 
 * @returns 프로필 box
 */
function myInfo(scheme) {
    const b = BX.component(myinfo.flexBox);

    BX.component(myinfo.menuBox).appendTo(b);
    const viewBox = BX.component(myinfo.dashViewBox).appendTo(b);
    BX.component(elementScheme.title).appendTo(viewBox).text('Profile');
    const detailBox = BX.component(profile.detail).appendTo(viewBox);

    const photoCircle = $('.button .img')[0].cloneNode();
    $(detailBox).find('.cardBody :nth-child(1)')[0].appendChild(photoCircle);
    
    const user = auth.currentUser;
    const userName = user.displayName? 'Hi ' + user.displayName.split(' ')[0] + '!' : user.email;
    if(user.photoURL) {
        $(photoCircle).css('background', `url('${user.photoURL}') no-repeat center/cover`);
    }
    else { //프로필 이미지가 없으면 이름 첫글자 노출
        $(photoCircle).text(userName[0].toUpperCase());
    } 

    $(detailBox).find('.cardBody div[name=name]').text(user.displayName || 'noname');
    $(detailBox).find('.cardBody div[name=email]').text(user.email);
    
    if(user.emailVerified) { //이메일 인증상태표시
        $(detailBox).find('.email_info > :nth-child(2) :nth-child(1)')[0].className = 'fa-solid fa-circle-check';
        $(detailBox).find('.email_info > :nth-child(2)').addClass('checked');
    }

    const secession = BX.component(profile.secession).appendTo(viewBox);
    $(secession).find('button')[0].onclick = deleteAccount; 
    
    return b;
}

/**
 * 계정삭제 버튼 클릭이벤트
 * @param {*} e 
 */
function deleteAccount(e) {
    const deleteAuth = () => {
        const enteredPassword = $(pop).find('input')[0].value;
        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            enteredPassword
        );
        
        user.reauthenticateWithCredential(credential)
        .then((result) => {
            user.delete().then(() => { 
                location.replace('./');
            });
        })
        .catch(error => {
            console.log(error.message)
            checkInvalid(0, 'password is incorrect');
        });
    }

    const openPopup = () => {
        const backdrop = BX.component(elementScheme.editPopupBackdrop).appendTo(topBox);
        const pop = BX.component(elementScheme.editPopup).appendTo(backdrop);
        $(pop).find('.editContentBox :nth-child(1)').text('Are you sure you want to delete your account?');
        $(pop).find('.saveBtn')[0].innerText = 'Delete';
        $(pop).find('.saveBtn')[0].onclick = deleteAuth;

        const body = $(pop).find('.modalBody')[0];
        const form = BX.component(elementScheme.editForm).appendTo(body);
        $(form).find('label')[0].innerText = 'Confirm password';
        $(form).find('input')[0].type = 'password';
        $(form).find('span').show();
    }; 
    showLoading();
    // 구독상태이면 삭제불가..
    isSubscribed(user.uid, is => {//먼저 구독상태인지 확인.
        if(is) {
            hideLoading();
            toastr.error('You have a valid subscription','Undeletable');
            return;
        }
        // wait 구독 여부 확인
        getUserWaitSubscription(user.uid, is => {
            hideLoading();
            if(is) { // 
                toastr.error('You have a valid subscription','Undeletable');
                return;
            }
            openPopup();
        })
    });
}

/**
 * 수정입력 폼에서 경고 문구 출력
 * @param {*} target 
 * @param {*} msg 
 */
function checkInvalid(target, msg) {
    const targetEl = (type) => {
        return $('.editForm').find(type)[target];
    }
    $(targetEl('input')).addClass('invalid');
    targetEl('div').innerText = msg;
}
/**
 * 프로필 상세 수정 아이콘 클릭 이벤트 - 수정항목 팝업생성
 * @param {*} e 
 */
function onEditAccountDetail(e) {
    if($('.menuPopup').is(':visible')) return; //이미 팝업이 있으면 

    const editItem = {
        name : {
            icon : 'person', 
            fn : ''
        },
        // photo : {
        //     icon : 'account_circle', 
        //     fn : '' 
        // },
        // email : {
        //     icon : 'mail', 
        //     fn : ''
        // },
        password : {
            icon : 'lock',
            fn : ''
        } 
    };

    const popup = BX.component(elementScheme.menuPopup).appendTo(topBox);
    $(popup).css('right', window.innerWidth - e.target.getBoundingClientRect().right);
    $(popup).css('top', e.target.getBoundingClientRect().bottom);

    Object.keys(editItem).forEach(function(o) {
        // 소셜계정은 비밀번호 변경 해당 없음
        if(o == 'password' && auth.currentUser.providerData[0].providerId != 'password') return;

        const item = BX.component(elementScheme.menuPopupItem).appendTo(popup);
        item[0].name = o;
        $(item).find('span:nth-child(1)').text(editItem[o].icon);
        $(item).find('span:nth-child(2)').text(o);

        item[0].onclick = openEditForm;
    });
}

/**
 * Account detail edit 버튼 클릭 이벤트
 * @param {*} e 
 */
function openEditForm(e) {
    const updateName = () => { // 이름 변경
        const newName = $(pop).find('input')[0].value + ' ' + $(pop).find('input')[1].value;
        auth.currentUser.updateProfile({
            displayName: newName
        }).then(() => {
            location.reload();
        })
    };  

    /**
     * 비밀변호 변경 저장 버튼 클릭이벤트 함수
     * @returns 
     */
    const changePassword = () => {
        /**
         * invalid 체크
         * @param {number} target - 몇번째 input 요소인지
         * @param {*} msg - 노출할 메시지
         */
        const currentPw = $(pop).find('input')[0].value;
        const newPw = $(pop).find('input')[1].value;
        const newConfirmPw = $(pop).find('input')[2].value;
        
        var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
        if(!reg.test(newPw)) {
            checkInvalid(1, 'Invalid password');
            return;
        }

        if(newPw != newConfirmPw) {
            checkInvalid(2, 'Passwords do not match');
            return;
        }
        const user = auth.currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPw
        );
        
        user.reauthenticateWithCredential(credential)
        .then(() => {
            user.updatePassword(newPw).then(() => {
                //팝업 닫기, 변경 성공
                $('.modalFooter button:nth-child(1)')[0].click();
                alert('비밀번호가 변경되었습니다. ');
            });
        })
        .catch(error => {
            checkInvalid(0, 'Old password is incorrect');
        });
    };

    $('.menuPopup').remove();
    const editType = e.currentTarget.name;

    const backdrop = BX.component(elementScheme.editPopupBackdrop).appendTo(topBox);
    const pop = BX.component(elementScheme.editPopup).appendTo(backdrop);
    let title, forms;
    if(editType == 'name') {
        title = 'Edit account detail';
        forms = ['First name','Last name'];
        $(pop).find('.saveBtn')[0].onclick = updateName;
    }
    else if (editType == 'photo') {
        title = 'Edit account detail';
    }
    else if(editType == 'email') {
        title = 'Update your email';
    }
    else if(editType == 'password') {
        title = 'Change password';
        forms = ['Current password', 'New password', 'Confirm new password'];
        $(pop).find('.saveBtn')[0].onclick = changePassword;
    }
    $(pop).find('.editContentBox :nth-child(1)').text(title);
    
    const body = $(pop).find('.modalBody')[0];
    const userName = auth.currentUser.displayName;

    if(forms) {
        for(var i=0; i<forms.length; i++){
            const form = BX.component(elementScheme.editForm).appendTo(body);
            $(form).find('label')[0].innerText = forms[i];
            if(editType == 'name' && userName){ //현재 이름 노출
                if(userName.split(' ')[i])
                $(form).find('input')[0].value = userName.split(' ')[i];
            }
            else if(editType == 'password') {
                $(form).find('input')[0].type = 'password';
                $(form).find('span').show();
            }
        }
    }   
}