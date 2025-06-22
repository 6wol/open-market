// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 장바구니 아이콘 클릭 기능
    const cartSection = document.querySelector('.cart-section');
    const cartLink = document.querySelector('.cart-link');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartLink && cartIcon) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 아이콘 src 직접 변경
            if (cartIcon.src.includes('icon-shopping-cart-2.svg')) {
                cartIcon.src = 'img/icon-shopping-cart.svg';
            } else {
                cartIcon.src = 'img/icon-shopping-cart-2.svg';
            }
        });
    }
    
    // 유저 아이콘 클릭 기능 (드롭다운)
    const userSection = document.querySelector('.user-section');
    const userLink = document.querySelector('.user-link');
    const userIcon = document.querySelector('.user-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userLink && dropdownMenu && userIcon) {
        userLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 드롭다운 메뉴 토글
            dropdownMenu.classList.toggle('show');
            
            // 유저 아이콘 src 직접 변경
            if (dropdownMenu.classList.contains('show')) {
                userIcon.src = 'img/icon-user-2.svg';
            } else {
                userIcon.src = 'img/icon-user.svg';
            }
        });
    }
    
    // 드롭다운 외부 클릭 시 메뉴 닫기
    document.addEventListener('click', function(e) {
        if (dropdownMenu && userSection && userIcon) {
            // 클릭한 요소가 user-section 내부가 아닌 경우
            if (!userSection.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                userIcon.src = 'img/icon-user.svg';
            }
        }
    });
    
    // 로그아웃 버튼 클릭 기능
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 로그아웃 확인 대화상자
            if (confirm('로그아웃 하시겠습니까?')) {
                // 실제 로그아웃 처리 (예: 서버 요청)
                // 여기서는 알림으로 대체
                alert('로그아웃 되었습니다.');
                
                // 드롭다운 메뉴 닫기
                dropdownMenu.classList.remove('show');
                userIcon.src = 'img/icon-user.svg';
                
                // 실제 구현에서는 로그인 페이지로 리다이렉트하거나
                // 세션을 종료하는 로직을 추가해야 합니다.
                // window.location.href = '/login';
            }
        });
    }
    
    // ESC 키로 드롭다운 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdownMenu && userIcon) {
            dropdownMenu.classList.remove('show');
            userIcon.src = 'img/icon-user.svg';
        }
    });
    
});