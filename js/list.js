// API 기본 URL 설정
const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market/'; 

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateUserInterface();
    
    // 장바구니 아이콘 클릭
    const cartSection = document.querySelector('.cart-section');
    const cartLink = document.querySelector('.cart-link');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartLink && cartIcon) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 로그인 확인
            if (!isLoggedIn()) {
                alert('로그인이 필요합니다.');
                window.location.href = 'index.html';
                return;
            }
            
            // 아이콘 변경
            if (cartIcon.src.includes('icon-shopping-cart-2.svg')) {
                cartIcon.src = 'img/icon-shopping-cart.svg';
            } else {
                cartIcon.src = 'img/icon-shopping-cart-2.svg';
            }
        });
    }
    
    // 유저 아이콘 클릭
    const userSection = document.querySelector('.user-section');
    const userLink = document.querySelector('.user-link');
    const userIcon = document.querySelector('.user-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userLink && dropdownMenu && userIcon) {
        userLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 로그인 확인
            if (!isLoggedIn()) {
                alert('로그인이 필요합니다.');
                window.location.href = 'index.html';
                return;
            }
            
            // 드롭다운 메뉴 토글
            dropdownMenu.classList.toggle('show');
            
            // 유저 아이콘 src 변경
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
                logout();
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
    
    // 검색 기능
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('#search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});


// 상품 목록 불러오기 함수
async function loadProducts(searchQuery = '') {
    try {
        let url = `${API_BASE_URL}products`; 

        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        let response;
        if (isLoggedIn()) {
            response = await authenticatedFetch(url);
        } else {
            response = await fetch(url);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayProducts(data.results);

    } catch (error) {
        console.error('상품 목록을 불러오는 중 오류:', error);
        showError('상품 목록을 불러올 수 없습니다. 다시 시도해주세요.');
    }
}

// 상품 목록 화면에 표시하는 함수
function displayProducts(products) {
    const main = document.querySelector('main');
    main.innerHTML = ''; 

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <a href="detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" style="width: 200px; height: 200px;">
                <h2>${product.name}</h2>
                <p>가격: ${product.price}원</p>
                <p>설명: ${product.info}</p>
            </a>
        `;
        main.appendChild(productDiv);
    });
}

// 상품 목록 화면에 표시하는 함수
function displayProducts(products) {
    const main = document.querySelector('main');
    
    if (products.length === 0) {
        main.innerHTML = `
            <div class="error-message-container">
                <p class="error-message">검색 결과가 없습니다.</p>
                <button onclick="loadProducts()" class="retry-btn">전체 상품 보기</button>
            </div>
        `;
        return;
    }
    
    // 그리드 컨테이너 생성
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    
    products.forEach(product => {
        const productCard = document.createElement('a');
        productCard.className = 'product-card';
        productCard.href = `detail.html?id=${product.id}`;
        productCard.dataset.productId = product.id;
        
        productCard.innerHTML = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    main.innerHTML = '';
    main.appendChild(productsGrid);
}

// 개별 상품 카드 HTML 생성 함수
function createProductCard(product) {
    const formattedPrice = product.price.toLocaleString();
    
    return `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='img/default-product.png'">
        </div>
        <div class="product-info">
            <div class="product-description">${product.info}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formattedPrice}원</p>
        </div>
    `;
}

// 로딩 상태 표시 함수
function showLoading() {
    const main = document.querySelector('main');
    main.innerHTML = '<div class="loading">상품을 불러오는 중...</div>';
}

// 상품 목록 불러오기 함수 
async function loadProducts(searchQuery = '') {
    showLoading(); 
    
    try {
        let url = `${API_BASE_URL}products`;

        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        let response;
        if (isLoggedIn()) {
            response = await authenticatedFetch(url);
        } else {
            response = await fetch(url);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayProducts(data.results);

    } catch (error) {
        console.error('상품 목록을 불러오는 중 오류:', error);
        showError('상품 목록을 불러올 수 없습니다. 다시 시도해주세요.');
    }
}

// 상품 카드 클릭 이벤트 추가
function addProductClickEvents() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            window.location.href = `/product/${productId}.html`;
        });
        card.style.cursor = 'pointer';
    });
}

// 검색 기능
function performSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery) {
        loadProducts(searchQuery);
    } else {
        loadProducts(); 
    }
}

// 로그아웃 함수
function logout() {
    clearAuthData();
    
    // 드롭다운 메뉴 닫기
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userIcon = document.querySelector('.user-icon');
    
    if (dropdownMenu && userIcon) {
        dropdownMenu.classList.remove('show');
        userIcon.src = 'img/icon-user.svg';
    }
    
    alert('로그아웃 되었습니다.');
    
    window.location.href = 'index.html';
}

// 인증 데이터 클리어 함수
function clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('token_expiry');
}

// 로그인 상태 확인
function isLoggedIn() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
}

// 현재 로그인된 사용자 정보 가져오기
function getCurrentUser() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
}

// 사용자 인터페이스 업데이트
function updateUserInterface() {
    const userSection = document.querySelector('.user-section');
    const userLink = document.querySelector('.user-link');
    
    if (!isLoggedIn()) {
        // 로그인하지 않은 경우
        if (userLink) {
            userLink.innerHTML = `
                <img src="img/icon-user.svg" alt="로그인" class="user-icon">
                <span>로그인</span>
            `;
            
            // 로그인 페이지로 이동하는 이벤트로 변경
            userLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }
        
        // 드롭다운 메뉴 숨기기
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    } else {
        // 로그인한 경우
        const user = getCurrentUser();
        if (user && userLink) {
            const userName = user.name || user.username;
            userLink.innerHTML = `
                <img src="img/icon-user.svg" alt="마이페이지" class="user-icon">
                <span>${userName}님</span>
            `;
        }
    }
}

// 에러 메시지 표시 함수
function showError(message) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="error-message-container">
            <p class="error-message">${message}</p>
            <button onclick="loadProducts()" class="retry-btn">다시 시도</button>
        </div>
    `;
}

// 토큰 갱신 함수 (로그인 페이지와 동일)
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
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
            
            return true;
        } else {
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