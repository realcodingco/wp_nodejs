let bsb, analytics;
let auth;
/**
 * Auth 초기화
 * 의존 스크립트 : firebase-app.js
 */

function initAuth(fn) {
  if(!bsb) {
    axios.post('/node/config')
    .then(res => {
        const firebaseConfig = res.data;
        bsb = firebase.initializeApp(firebaseConfig);
        // analytics = firebase.getAnalytics(bsb);
        fn(true);  
    })
    .catch(err => {
        console.error(err);
    });
    
  }
  else {
    fn(true);
  }
}

function isLogin(fn) {
  initAuth(done => {
    if(done) {
      auth = firebase.auth();
      return auth.onAuthStateChanged(fn);
    }
  });
}

function signupEmail(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function signinEmail(email, password){
  return auth.signInWithEmailAndPassword(email, password);
}

function signinGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

function signOutAuth() {
  return auth.signOut();
}

/**
 * 비밀번호를 잃어버렸어요 클릭 이벤트
 * @param {*} e 
 */
function openForgotForm(e) {
  const parentClassName = $(e.target).parents('.checkoutForm').parent()[0].className.split('box ')[1];
  console.log(parentClassName)
  $(`.${parentClassName} .checkoutForm`).hide();
  BX.component(accountSchemes.resetPassword).appendTo($(`.${parentClassName}`)[0]);
}

/**
 * 비밀번호 재설정 버튼 클릭 이벤트
 * @param {*} e 
 */
function sendResetEmail(e) {
  const email = $('.resetPassword input').val();
  auth.sendPasswordResetEmail(email).then(() => {
    alert('이메일이 발송되었습니다. 비밀번호를 재설정 후 다시 로그인해보세요.');
  });
}

function getUserData(uid, callback) { //sid, domain
  bsb.firestore().collection('bsb').doc(uid).get().then(doc => {
    if(doc.exists) {
      callback(doc.data());
    }
    else {
      callback(null);
    }
  }).catch();
}
function userUpdateSid(uid, sid, callback) {
  bsb.firestore().collection('bsb').doc(uid).update({sid: sid}).then(callback).catch();
}

/**
 * history 데이터에서 sid 기준의 구독 데이터 가져오기
 * @param {*} uid 
 * @param {*} sid 
 * @param {*} callback 
 */
function getUserSubscription(uid, sid, callback) {
  bsb.firestore().collection('bsb').doc(uid).collection('history').doc(sid).get().then(doc => {
    if(doc.exists) callback(doc.data());
    else callback(null);
  }).catch();
}
/**
 * 워드프레스 테마 패키지 다운로드 URL 링크 가져오기 : 리얼코딩 파일스토어 업로드
 */
function getThemepkURL(callback) {
  bsb.firestore().collection("bsbAdmin").doc('theme').get().then(doc => { 
    callback(doc.data()? doc.date().url : null); 
  });
}

/**
 *  대기상태인 구독 sid 가져오기
 * @param {*} uid 
 * @param {*} callback 
 */
function getUserWaitSubscription(uid, callback) { // history 컬렉션에서 wait 구독 찾기
  bsb.firestore().collection('bsb').doc(uid).collection('history').where("state", "==", 'wait')
    .get()
    .then(querySnapshot => {
      if(querySnapshot.empty) {  //일치하는 sid가 없는 경우
          callback(null);
      }
      else { 
        querySnapshot.forEach( doc => {
          callback(doc.id); // 대기상태 구독 sid
        });
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
/**
 * 현재 구독상태인지 확인 
 * @param {*} uid 
 * @param {*} fn - 구독여부 callback
 */
function isSubscribed(uid, fn){
  //sid가 잇는지.
  getUserData(uid, result => {
      const sid = result && result.sid;
      if(sid){
          getUserSubscription(uid, sid, doc => { //현재 구독
              const endDate = doc.end;
              if(Date.now() <= endDate) { // 만료일이 경과하지 않은 경우,
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
  });
}

/**
 * 현재 활성화된 sid로 uid 찾기
 * @param {*} sid 
 * @param {*} callback - uid
 */
function getUidbySid(sid, callback) {
  bsb.firestore().collection("bsb").where("sid", "==", sid)
    .get()
    .then((querySnapshot) => {
      if(querySnapshot.empty) {  //일치하는 sid가 없는 경우
          callback(null);
      }
      else {
        querySnapshot.forEach((doc) => { //반복문이라... 
          if(doc.id) callback(doc.id);
          else callback(null);
        });
      }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

/**
 * 구독 만료 7일전인지 체크
 * @param {*} uid 
 * @param {*} callback 
 */
function aWeekagoAlert(uid) { 
  let today = new Date();
  today.setDate(today.getDate() + 7);
  const after7day = today.getTime(); 
  let msg;

  toastr.options.timeOut = 0;
  bsb.firestore().collection("bsb").doc(uid).collection('history')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => { //
      const data = doc.data();
      if(data.end <= after7day && data.state == 'on') { //현 구독이 7일전인지..
        msg = ['Your subscription is nearing expiration. Proceed to pay for additional subscriptions to continue using.', 'Subscription expiration coming up'];
      }
    });
    getUserWaitSubscription(uid, sid => { //wait 항목이 있는지 체크..
      if(sid) {
        msg = '';
      }
      
      if(msg) toastr.info(msg[0], msg[1]);
    });
  });
}

function getUserHistory(uid, querySnapshot) {
  bsb.firestore().collection("bsb").doc(uid).collection('history').get().then(querySnapshot);
}
/**
 * 구독자 데이터 저장
 * @param {*} uid 
 * @param {*} data 
 */
function userSaveSubscription(uid, data, callback) {
  bsb.firestore().collection('bsb').doc(uid).set(data).then(callback).catch();
}
function userUpdateSubscription(uid, data, callback) {
  bsb.firestore().collection('bsb').doc(uid).update(data).then(callback).catch(error => console.log(error));
}
/**
 * 구독 히스토리 저장
 * @param {*} uid 
 * @param {*} sid 
 * @param {*} data 
 * @param {*} callback 
 */
function userWirteHistory(uid, sid, data, callback) {
  bsb.firestore().collection('bsb').doc(uid).collection('history').doc(sid).set(data).then(callback).catch();
}
function userUpdateHistory(uid, sid, data, callback) {
  bsb.firestore().collection('bsb').doc(uid).collection('history').doc(sid).update(data).then(callback).catch();
}