// API 기본 URL 설정
const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

// 탭 전환 기능
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button button');
    const tabContents = document.querySelectorAll('.tab-content > div');

    // 탭 버튼 클릭 이벤트
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // 모든 탭 버튼과 컨텐츠에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 클릭된 탭 버튼과 해당 컨텐츠에 active 클래스 추가
            this.classList.add('active');
            tabContents[index].classList.add('active');

            // 에러 메시지 초기화
            clearErrorMessages();
        });
    });

    // 초기 상태: 첫 번째 탭 활성화
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
    }

    // 로그인 폼 제출 이벤트 처리
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleLogin);
    });

    // 입력 필드 포커스 시 에러 메시지 제거
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const form = this.closest('form');
            let errorMessageDiv = form.querySelector('.error-message');
            if (!errorMessageDiv) {
                errorMessageDiv = createErrorMessageDiv(form);
            }
            // 에러 텍스트는 즉시 제거
            errorMessageDiv.textContent = '';
            // 마진 클래스는 딜레이 후 제거
            setTimeout(() => {
                errorMessageDiv.classList.remove('show');
            }, 300);
        });
    });

    // 페이지 로드 시 토큰 확인 및 자동 갱신 설정
    checkAndRefreshToken();
    setTokenRefreshInterval();
});

// 로그인 처리 함수
async function handleLogin(event) {
    event.preventDefault(); // 폼 기본 제출 방지

    const form = event.target;
    const idInput = form.querySelector('input[name="username"]');
    const passwordInput = form.querySelector('input[name="pw"]');
    const submitBtn = form.querySelector('.submit-btn');
    
    // 에러 메시지 div 찾기 또는 생성
    let errorMessageDiv = form.querySelector('.error-message');
    if (!errorMessageDiv) {
        errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'error-message';
        form.insertBefore(errorMessageDiv, submitBtn);
    }

    const username = idInput.value.trim();
    const password = passwordInput.value.trim();

    // 에러 메시지 초기화
    errorMessageDiv.textContent = '';
    errorMessageDiv.classList.remove('show');

    // 유효성 검사
    if (!username && !password) {
        showErrorMessage(errorMessageDiv, '아이디를 입력해 주세요.');
        return;
    }

    if (!username && password) {
        showErrorMessage(errorMessageDiv, '아이디를 입력해 주세요.');
        return;
    }

    if (username && !password) {
        showErrorMessage(errorMessageDiv, '비밀번호를 입력해 주세요.');
        return;
    }

    // 로그인 버튼 비활성화 (중복 클릭 방지)
    submitBtn.disabled = true;
    submitBtn.textContent = '로그인 중...';

    try {
        // API 호출
        const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 로그인 성공
            handleLoginSuccess(data);
        } else {
            // 로그인 실패
            const errorMessage = data.error || '아이디 또는 비밀번호가 올바르지 않습니다.';
            showErrorMessage(errorMessageDiv, errorMessage);
        }
    } catch (error) {
        console.error('로그인 요청 중 오류:', error);
        showErrorMessage(errorMessageDiv, '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // 로그인 버튼 다시 활성화
        submitBtn.disabled = false;
        submitBtn.textContent = '로그인';
    }
}

// 로그인 성공 처리 함수
function handleLoginSuccess(data) {
    // 토큰과 사용자 정보 저장
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_info', JSON.stringify(data.user));
    
    // 토큰 만료 시간 저장 (5분)
    const tokenExpiry = new Date().getTime() + (5 * 60 * 1000);
    localStorage.setItem('token_expiry', tokenExpiry.toString());

    alert('로그인 성공!');
    
    // 실제로는 메인 페이지나 대시보드로 리다이렉트
    // window.location.href = '/dashboard.html';
    console.log('사용자 정보:', data.user);
}

// 토큰 갱신 함수
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
        console.log('Refresh token이 없습니다.');
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            
            // 새 토큰 만료 시간 저장 (5분)
            const tokenExpiry = new Date().getTime() + (5 * 60 * 1000);
            localStorage.setItem('token_expiry', tokenExpiry.toString());
            
            console.log('토큰이 갱신되었습니다.');
            return true;
        } else {
            console.log('토큰 갱신 실패, 다시 로그인이 필요합니다.');
            clearAuthData();
            return false;
        }
    } catch (error) {
        console.error('토큰 갱신 중 오류:', error);
        return false;
    }
}

// 토큰 확인 및 갱신 함수
async function checkAndRefreshToken() {
    const accessToken = localStorage.getItem('access_token');
    const tokenExpiry = localStorage.getItem('token_expiry');
    
    if (!accessToken || !tokenExpiry) {
        return;
    }

    const currentTime = new Date().getTime();
    const expiryTime = parseInt(tokenExpiry);
    
    // 토큰이 1분 이내에 만료될 예정이면 갱신
    if (currentTime >= (expiryTime - 60000)) {
        await refreshAccessToken();
    }
}

// 토큰 자동 갱신 간격 설정 (4분마다 체크)
function setTokenRefreshInterval() {
    setInterval(checkAndRefreshToken, 4 * 60 * 1000);
}

// 인증 데이터 클리어 함수
function clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('token_expiry');
}

// 로그아웃 함수
function logout() {
    clearAuthData();
    alert('로그아웃되었습니다.');
    // 로그인 페이지로 리다이렉트
    // window.location.href = '/login.html';
}

// 인증된 API 요청을 위한 헬퍼 함수
async function authenticatedFetch(url, options = {}) {
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        throw new Error('인증 토큰이 없습니다.');
    }

    // 토큰 확인 및 갱신
    await checkAndRefreshToken();
    
    const updatedToken = localStorage.getItem('access_token');
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${updatedToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    return fetch(url, { ...options, ...defaultOptions });
}

// 에러 메시지 표시 함수
function showErrorMessage(element, message) {
    element.textContent = message;
    element.classList.add('show');
    element.style.color = '#EB5757';
}

// 모든 에러 메시지 초기화 함수
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// 에러 메시지 div 생성 함수
function createErrorMessageDiv(form) {
    const submitBtn = form.querySelector('.submit-btn');
    let errorMessageDiv = form.querySelector('.error-message');
    
    if (!errorMessageDiv) {
        errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'error-message';
        form.insertBefore(errorMessageDiv, submitBtn);
    }
    
    return errorMessageDiv;
}

// 현재 로그인된 사용자 정보 가져오기
function getCurrentUser() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
}

// 로그인 상태 확인
function isLoggedIn() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
}

// 탭 전환 함수 (HTML에서 onclick으로 호출되는 경우를 위해)
function switchTab(tabType) {
    const tabButtons = document.querySelectorAll('.tab-button button');
    const tabContents = document.querySelectorAll('.tab-content > div');
    
    // 구매회원/판매회원에 따른 인덱스 설정
    const index = tabType === 'purchase' ? 0 : 1;
    
    // 모든 탭 버튼과 컨텐츠에서 active 클래스 제거
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    if (tabButtons[index] && tabContents[index]) {
        tabButtons[index].classList.add('active');
        tabContents[index].classList.add('active');
    }
    
    // 에러 메시지 초기화
    clearErrorMessages();
}