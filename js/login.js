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
});

// 로그인 처리 함수
function handleLogin(event) {
    event.preventDefault(); // 폼 기본 제출 방지

    const form = event.target;
    const idInput = form.querySelector('input[placeholder="아이디"]');
    const passwordInput = form.querySelector('input[placeholder="비밀번호"]');
    const submitBtn = form.querySelector('.submit-btn');
    
    // 에러 메시지 div 찾기 또는 생성
    let errorMessageDiv = form.querySelector('.error-message');
    if (!errorMessageDiv) {
        errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'error-message';
        form.insertBefore(errorMessageDiv, submitBtn);
    }

    const id = idInput.value.trim();
    const password = passwordInput.value.trim();

    // 에러 메시지 초기화
    errorMessageDiv.textContent = '';

    // 유효성 검사
    if (!id && !password) {
        // 아이디, 비밀번호 모두 공란
        showErrorMessage(errorMessageDiv, '아이디를 입력해 주세요.');
        return;
    }

    if (!id && password) {
        // 비밀번호만 입력했을 경우
        showErrorMessage(errorMessageDiv, '아이디를 입력해 주세요.');
        return;
    }

    if (id && !password) {
        // 아이디만 입력했을 경우
        showErrorMessage(errorMessageDiv, '비밀번호를 입력해 주세요.');
        return;
    }

    // 아이디와 비밀번호가 모두 입력된 경우
    if (id && password) {
        // 실제 로그인 로직에서는 서버와 통신하여 검증
        // 여기서는 예시로 간단한 검증을 수행
        if (isValidLogin(id, password)) {
            // 로그인 성공
            alert('로그인 성공!');
            // 실제로는 다른 페이지로 리다이렉트하거나 다른 처리를 수행
        } else {
            // 로그인 실패
            showErrorMessage(errorMessageDiv, '아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    }
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

// 로그인 유효성 검사 함수 (예시)
// 실제 구현에서는 서버 API를 호출하여 검증해야 함
function isValidLogin(id, password) {
    // 예시: 간단한 더미 데이터로 검증
    const validUsers = [
        { id: 'user1', password: 'pass1' },
        { id: 'user2', password: 'pass2' },
        { id: 'admin', password: 'admin123' }
    ];

    return validUsers.some(user => user.id === id && user.password === password);
}

// 입력 필드 포커스 시 에러 메시지 제거
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const form = this.closest('form');
            let errorMessageDiv = form.querySelector('.error-message');
            if (!errorMessageDiv) {
                errorMessageDiv = createErrorMessageDiv(form);
            }
            errorMessageDiv.textContent = '';
        });
    });
});

input.addEventListener('focus', function () {
    const form = this.closest('form');
    let errorMessageDiv = form.querySelector('.error-message');

    if (!errorMessageDiv) {
        errorMessageDiv = createErrorMessageDiv(form);
    }

    // 에러 텍스트는 즉시 제거
    errorMessageDiv.textContent = '';

    // 마진 클래스는 딜레이 후 제거 (ex: 300ms 후)
    setTimeout(() => {
        errorMessageDiv.classList.remove('show');
    }, 300);
});