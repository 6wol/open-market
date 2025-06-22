// API 기본 URL
const API_BASE_URL = 'https://api.wenivops.co.kr/services/open-market';

// 탭 전환
function switchTab(type) {
    const purchaseTab = document.getElementById('signup-purchase');
    const saleTab = document.getElementById('signup-sale');
    const purchaseBtn = document.querySelector('.tab-button-login1');
    const saleBtn = document.querySelector('.tab-button-login2');
    
    if (type === 'purchase') {
        purchaseTab.classList.add('active');
        saleTab.classList.remove('active');
        purchaseBtn.classList.add('active');
        saleBtn.classList.remove('active');
    } else {
        purchaseTab.classList.remove('active');
        saleTab.classList.add('active');
        purchaseBtn.classList.remove('active');
        saleBtn.classList.add('active');
    }
}

// 유효성 검사
const validators = {
    validateUsername: function(username) {
        const regex = /^[a-zA-Z0-9]{1,20}$/;
        if (!username) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        if (!regex.test(username)) {
            return { isValid: false, message: 'ID는 20자 이내의 영어 소문자, 대문자, 숫자만 가능합니다.' };
        }
        return { isValid: true, message: '' };
    },
    
    validatePassword: function(password) {
        if (!password) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        if (password.length < 8) {
            return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
        }
        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: '비밀번호는 한개 이상의 영소문자가 필수적으로 들어가야 합니다.' };
        }
        if (!/\d/.test(password)) {
            return { isValid: false, message: '비밀번호는 한개 이상의 숫자가 필수적으로 들어가야 합니다.' };
        }
        return { isValid: true, message: '' };
    },
    
    // 비밀번호 재확인
    validatePasswordConfirm: function(password, confirmPassword) {
        if (!confirmPassword) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        if (password !== confirmPassword) {
            return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
        }
        return { isValid: true, message: '' };
    },
    
    // 이름 유효성 검사
    validateName: function(name) {
        if (!name) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        return { isValid: true, message: '' };
    },
    
    // 휴대폰 번호 유효성 검사
    validatePhone: function(fullPhone) {
        const phoneRegex = /^01\d{8,9}$/;
        
        if (!fullPhone) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        if (!phoneRegex.test(fullPhone)) {
            return { isValid: false, message: '핸드폰번호는 01*으로 시작해야 하는 10~11자리 숫자여야 합니다.' };
        }
        return { isValid: true, message: '' };
    },

    validateBusinessNumber: function(businessNumber) {
        const cleanNumber = businessNumber.replace(/-/g, '');
        if (!businessNumber) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        if (!/^\d{10}$/.test(cleanNumber)) {
            return { isValid: false, message: '사업자등록번호는 10자리 숫자여야 합니다.' };
        }
        return { isValid: true, message: '' };
    },

    validateStoreName: function(storeName) {
        if (!storeName) {
            return { isValid: false, message: '이 필드는 필수 항목입니다.' };
        }
        return { isValid: true, message: '' };
    }
};

// 에러 메시지 표시 함수
function showError(elementId, message, isSuccess = false) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        if (isSuccess) {
            errorElement.classList.add('success');
        } else {
            errorElement.classList.remove('success');
        }
    }
}

// 에러 메시지 숨기기 함수
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible', 'success');
    }
}

// 입력 필드 스타일 업데이트
function updateInputStyle(inputElement, isValid) {
    inputElement.classList.remove('valid', 'invalid');
    if (isValid) {
        inputElement.classList.add('valid');
    } else {
        inputElement.classList.add('invalid');
    }
}

// 비밀번호 확인 아이콘 업데이트
function updatePasswordIcon(container, isValid) {
    const checkOffIcon = container.querySelector('img[src*="check-off"]');
    const checkOnIcon = container.querySelector('img[src*="check-on"]');
    
    if (checkOffIcon && checkOnIcon) {
        checkOffIcon.classList.remove('show');
        checkOnIcon.classList.remove('show');
        
        if (isValid) {
            checkOnIcon.classList.add('show');
        } else {
            checkOffIcon.classList.add('show');
        }
    }
}

// 순차 입력 검사 함수
function checkSequentialInput(currentField) {
    const fields = ['username', 'password', 'passwordConfirm', 'name', 'phone'];
    const currentIndex = fields.indexOf(currentField);
    
    // 이전 필드들이 모두 채워졌는지 확인
    for (let i = 0; i < currentIndex; i++) {
        const field = fields[i];
        let isEmpty = false;
        
        switch (field) {
            case 'username':
                isEmpty = !document.getElementById('signup-username-purchase').value;
                if (isEmpty) showError('signup-id-purchase', '이 필드는 필수 항목입니다.');
                break;
            case 'password':
                isEmpty = !document.getElementById('signup-pw-purchase').value;
                if (isEmpty) showError('signup-pw-error-purchase', '이 필드는 필수 항목입니다.');
                break;
            case 'passwordConfirm':
                isEmpty = !document.getElementById('signup-pw-reconfirm-purchase').value;
                if (isEmpty) showError('signup-pw-reconfirm-purchase', '이 필드는 필수 항목입니다.');
                break;
            case 'name':
                isEmpty = !document.querySelector('input[name="name"]').value;
                if (isEmpty) showError('signup-name-error-purchase', '이 필드는 필수 항목입니다.');
                break;
        }
    }
}

// 폼 유효성 검사 상태 체크 (구매자용)
function checkFormValidity() {
    const username = document.getElementById('signup-username-purchase').value;
    const password = document.getElementById('signup-pw-purchase').value;
    const confirmPassword = document.getElementById('signup-pw-reconfirm-purchase').value;
    const name = document.querySelector('input[name="name"]').value;
    const phonePrefix = document.getElementById('phone-prefix').value;
    const phoneMiddle = document.getElementById('phone-middle').value;
    const phoneLast = document.getElementById('phone-last').value;
    const consent = document.getElementById('information').checked;
    
    const fullPhone = phonePrefix + phoneMiddle + phoneLast;
    
    const isUsernameValid = validators.validateUsername(username).isValid;
    const isPasswordValid = validators.validatePassword(password).isValid;
    const isPasswordConfirmValid = validators.validatePasswordConfirm(password, confirmPassword).isValid;
    const isNameValid = validators.validateName(name).isValid;
    const isPhoneValid = validators.validatePhone(fullPhone).isValid;
    
    // 아이디 중복확인 여부 체크
    const isUsernameDuplicateChecked = document.getElementById('signup-username-purchase').dataset.duplicateChecked === 'true';
    
    const submitBtn = document.getElementById('join-submit-btn');
    if (isUsernameValid && isUsernameDuplicateChecked && isPasswordValid && isPasswordConfirmValid && isNameValid && isPhoneValid && consent) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// 판매자용 폼 유효성 검사
function checkSaleFormValidity() {
    const username = document.getElementById('signup-username-sale').value;
    const password = document.getElementById('signup-pw-sale').value;
    const confirmPassword = document.getElementById('signup-pw-reconfirm-sale').value;
    const name = document.getElementById('signup-name-sale').value;
    const phonePrefix = document.getElementById('phone-prefix-sale').value;
    const phoneMiddle = document.getElementById('phone-middle-sale').value;
    const phoneLast = document.getElementById('phone-last-sale').value;
    const businessNumber = document.getElementById('signup-business-number').value;
    const storeName = document.getElementById('signup-store-name').value;
    const consent = document.getElementById('information').checked;
    
    const fullPhone = phonePrefix + phoneMiddle + phoneLast;
    
    const isUsernameValid = validators.validateUsername(username).isValid;
    const isPasswordValid = validators.validatePassword(password).isValid;
    const isPasswordConfirmValid = validators.validatePasswordConfirm(password, confirmPassword).isValid;
    const isNameValid = validators.validateName(name).isValid;
    const isPhoneValid = validators.validatePhone(fullPhone).isValid;
    const isBusinessNumberValid = validators.validateBusinessNumber(businessNumber).isValid;
    const isStoreNameValid = validators.validateStoreName(storeName).isValid;
    
    // 중복확인 여부 체크
    const isUsernameDuplicateChecked = document.getElementById('signup-username-sale').dataset.duplicateChecked === 'true';
    const isBusinessNumberVerified = document.getElementById('signup-business-number').dataset.businessChecked === 'true';
    
    const submitBtn = document.getElementById('join-submit-btn');
    if (isUsernameValid && isUsernameDuplicateChecked && isPasswordValid && isPasswordConfirmValid && 
        isNameValid && isPhoneValid && isBusinessNumberValid && isBusinessNumberVerified && 
        isStoreNameValid && consent) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// API 호출
async function validateUsername(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/validate-username/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('아이디 검증 API 오류:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
}

async function validateBusinessNumber(companyRegistrationNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/seller/validate-registration-number/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ company_registration_number: companyRegistrationNumber })
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('사업자등록번호 검증 API 오류:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
}

async function signupBuyer(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/buyer/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, errors: data };
        }
    } catch (error) {
        console.error('구매자 회원가입 API 오류:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
}

async function signupSeller(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/seller/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, errors: data };
        }
    } catch (error) {
        console.error('판매자 회원가입 API 오류:', error);
        return { success: false, message: '서버 연결에 실패했습니다.' };
    }
}


function formatBusinessNumber(value) {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 5) {
        return numbers.replace(/(\d{3})/, '$1-');
    } else {
        return numbers.replace(/(\d{3})(\d{2})(\d{0,5})/, '$1-$2-$3');
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('signup-username-purchase');
    const usernameForm = document.getElementById('signUpPurchase');
    
    usernameInput.addEventListener('input', function() {
        this.dataset.duplicateChecked = 'false';
        checkFormValidity();
    });
    
    usernameInput.addEventListener('blur', function() {
        const validation = validators.validateUsername(this.value);
        updateInputStyle(this, validation.isValid);
        
        if (!validation.isValid && this.value) {
            showError('signup-id-purchase', validation.message);
        } else if (this.value) {
            hideError('signup-id-purchase');
        }
        checkFormValidity();
    });
    
    // 아이디 중복 확인 (구매자)
    usernameForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = usernameInput.value;
        const validation = validators.validateUsername(username);

        if (!validation.isValid) {
            showError('signup-id-purchase', validation.message);
            updateInputStyle(usernameInput, false);
            usernameInput.dataset.duplicateChecked = 'false';
            checkFormValidity();
            return;
        }

        const result = await validateUsername(username);
        
        if (result.success) {
            showError('signup-id-purchase', result.message, true);
            updateInputStyle(usernameInput, true);
            usernameInput.dataset.duplicateChecked = 'true';
        } else {
            showError('signup-id-purchase', result.message);
            updateInputStyle(usernameInput, false);
            usernameInput.dataset.duplicateChecked = 'false';
        }

        checkFormValidity();
    });
    
    // 비밀번호 입력 (구매자)
    const passwordInput = document.getElementById('signup-pw-purchase');
    const passwordGroup = passwordInput.closest('.password-group');
    
    passwordInput.addEventListener('input', function() {
        const validation = validators.validatePassword(this.value);
        updatePasswordIcon(passwordGroup, validation.isValid);
        checkFormValidity();
    });
    
    passwordInput.addEventListener('blur', function() {
        const validation = validators.validatePassword(this.value);
        updateInputStyle(this, validation.isValid);
        
        if (!validation.isValid && this.value) {
            showError('signup-pw-error-purchase', validation.message);
        } else if (this.value) {
            hideError('signup-pw-error-purchase');
        }
        
        const confirmPasswordInput = document.getElementById('signup-pw-reconfirm-purchase');
        if (confirmPasswordInput.value) {
            const confirmValidation = validators.validatePasswordConfirm(this.value, confirmPasswordInput.value);
            updateInputStyle(confirmPasswordInput, confirmValidation.isValid);
            const reconfirmGroup = confirmPasswordInput.closest('.reconfirm-group');
            updatePasswordIcon(reconfirmGroup, confirmValidation.isValid);
            
            if (!confirmValidation.isValid) {
                showError('signup-pw-reconfirm-purchase', confirmValidation.message);
            } else {
                hideError('signup-pw-reconfirm-purchase');
            }
        }
        checkFormValidity();
    });
    
    passwordInput.addEventListener('focus', function() {
        checkSequentialInput('password');
    });
    
    // 비밀번호 재확인 (구매자)
    const confirmPasswordInput = document.getElementById('signup-pw-reconfirm-purchase');
    const reconfirmGroup = confirmPasswordInput.closest('.reconfirm-group');
    
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const validation = validators.validatePasswordConfirm(password, this.value);
        updatePasswordIcon(reconfirmGroup, validation.isValid);
        checkFormValidity();
    });
    
    confirmPasswordInput.addEventListener('blur', function() {
        const password = passwordInput.value;
        const validation = validators.validatePasswordConfirm(password, this.value);
        updateInputStyle(this, validation.isValid);
        
        if (!validation.isValid && this.value) {
            showError('signup-pw-reconfirm-purchase', validation.message);
        } else if (this.value) {
            hideError('signup-pw-reconfirm-purchase');
        }
        checkFormValidity();
    });
    
    confirmPasswordInput.addEventListener('focus', function() {
        checkSequentialInput('passwordConfirm');
        
        if (!passwordInput.value) {
            showError('signup-pw-error-purchase', '이 필드는 필수 항목입니다.');
            updateInputStyle(passwordInput, false);
        }
    });
    
    // 이름 입력 (구매자)
    const nameInput = document.querySelector('input[name="name"]');
    nameInput.addEventListener('blur', function() {
        const validation = validators.validateName(this.value);
        updateInputStyle(this, validation.isValid);
        
        if (!validation.isValid && this.value) {
            showError('signup-name-error-purchase', validation.message);
        } else if (this.value) {
            hideError('signup-name-error-purchase');
        }
        checkFormValidity();
    });
    
    nameInput.addEventListener('focus', function() {
        checkSequentialInput('name');
    });
    
    // 휴대폰 번호 입력 (구매자)
    const phoneMiddleInput = document.getElementById('phone-middle');
    const phoneLastInput = document.getElementById('phone-last');
    
    function validatePhoneInputs() {
        const prefix = document.getElementById('phone-prefix').value;
        const middle = phoneMiddleInput.value;
        const last = phoneLastInput.value;
        const fullPhone = prefix + middle + last;
        
        if (middle && last) {
            const validation = validators.validatePhone(fullPhone);
            updateInputStyle(phoneMiddleInput, validation.isValid);
            updateInputStyle(phoneLastInput, validation.isValid);
            
            if (!validation.isValid) {
                showError('signup-phone-purchase', validation.message);
            } else {
                hideError('signup-phone-purchase');
            }
        }
        checkFormValidity();
    }
    
    phoneMiddleInput.addEventListener('blur', validatePhoneInputs);
    phoneLastInput.addEventListener('blur', validatePhoneInputs);
    
    [phoneMiddleInput, phoneLastInput].forEach(input => {
        input.addEventListener('focus', function() {
            checkSequentialInput('phone');
        });
        
        input.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });

    // 판매회원가입
    function initSaleSignup() {
        // 아이디
        const saleUsernameInput = document.getElementById('signup-username-sale');
        const saleUsernameForm = document.getElementById('signUpSale');
        
        if (saleUsernameInput) {
            saleUsernameInput.addEventListener('input', function() {
                this.dataset.duplicateChecked = 'false';
                checkSaleFormValidity();
            });
            
            saleUsernameInput.addEventListener('blur', function() {
                const validation = validators.validateUsername(this.value);
                updateInputStyle(this, validation.isValid);
                
                if (!validation.isValid && this.value) {
                    showError('signup-id-sale', validation.message);
                } else if (this.value) {
                    hideError('signup-id-sale');
                }
                checkSaleFormValidity();
            });
        }
        
        // 아이디 중복 확인 - 판매자용
        if (saleUsernameForm) {
            saleUsernameForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const username = saleUsernameInput.value;
                const validation = validators.validateUsername(username);

                if (!validation.isValid) {
                    showError('signup-id-sale', validation.message);
                    updateInputStyle(saleUsernameInput, false);
                    saleUsernameInput.dataset.duplicateChecked = 'false';
                    checkSaleFormValidity();
                    return;
                }

                const result = await validateUsername(username);
                
                if (result.success) {
                    showError('signup-id-sale', result.message, true);
                    updateInputStyle(saleUsernameInput, true);
                    saleUsernameInput.dataset.duplicateChecked = 'true';
                } else {
                    showError('signup-id-sale', result.message);
                    updateInputStyle(saleUsernameInput, false);
                    saleUsernameInput.dataset.duplicateChecked = 'false';
                }

                checkSaleFormValidity();
            });
        }
        
        // 판매 회원가입 - 비밀번호
        const salePasswordInput = document.getElementById('signup-pw-sale');
        if (salePasswordInput) {
            const salePasswordGroup = salePasswordInput.closest('.password-group');
            
            salePasswordInput.addEventListener('input', function() {
                const validation = validators.validatePassword(this.value);
                updatePasswordIcon(salePasswordGroup, validation.isValid);
                checkSaleFormValidity();
            });
            
            salePasswordInput.addEventListener('blur', function() {
                const validation = validators.validatePassword(this.value);
                updateInputStyle(this, validation.isValid);
                
                if (!validation.isValid && this.value) {
                    showError('signup-pw-error-sale', validation.message);
                } else if (this.value) {
                    hideError('signup-pw-error-sale');
                }
                checkSaleFormValidity();
            });
        }
        
        // 판매 회원가입 - 비밀번호 재확인
        const saleConfirmPasswordInput = document.getElementById('signup-pw-reconfirm-sale');
        if (saleConfirmPasswordInput) {
            const saleReconfirmGroup = saleConfirmPasswordInput.closest('.reconfirm-group');
            
            saleConfirmPasswordInput.addEventListener('input', function() {
                const password = salePasswordInput.value;
                const validation = validators.validatePasswordConfirm(password, this.value);
                updatePasswordIcon(saleReconfirmGroup, validation.isValid);
                checkSaleFormValidity();
            });
            
            saleConfirmPasswordInput.addEventListener('blur', function() {
                const password = salePasswordInput.value;
                const validation = validators.validatePasswordConfirm(password, this.value);
                updateInputStyle(this, validation.isValid);
                
                if (!validation.isValid && this.value) {
                    showError('signup-pw-reconfirm-sale', validation.message);
                } else if (this.value) {
                    hideError('signup-pw-reconfirm-sale');
                }
                checkSaleFormValidity();
            });
        }
        
        // 판매 회원가입 - 이름
        const saleNameInput = document.getElementById('signup-name-sale');
        if (saleNameInput) {
            saleNameInput.addEventListener('blur', function() {
                const validation = validators.validateName(this.value);
                updateInputStyle(this, validation.isValid);
                
                if (!validation.isValid && this.value) {
                    showError('signup-name-error-sale', validation.message);
                } else if (this.value) {
                    hideError('signup-name-error-sale');
                }
                checkSaleFormValidity();
            });
        }
        
        // 판매 회원가입 - 휴대폰 번호
        const salePhoneMiddleInput = document.getElementById('phone-middle-sale');
        const salePhoneLastInput = document.getElementById('phone-last-sale');
        
        function validateSalePhoneInputs() {
            const prefix = document.getElementById('phone-prefix-sale').value;
            const middle = salePhoneMiddleInput.value;
            const last = salePhoneLastInput.value;
            const fullPhone = prefix + middle + last;
            
            if (middle && last) {
                const validation = validators.validatePhone(fullPhone);
                updateInputStyle(salePhoneMiddleInput, validation.isValid);
                updateInputStyle(salePhoneLastInput, validation.isValid);
                
                if (!validation.isValid) {
                    showError('signup-phone-sale', validation.message);
                } else {
                    hideError('signup-phone-sale');
                }
            }
            checkSaleFormValidity();
        }
        
        if (salePhoneMiddleInput && salePhoneLastInput) {
            salePhoneMiddleInput.addEventListener('blur', validateSalePhoneInputs);
            salePhoneLastInput.addEventListener('blur', validateSalePhoneInputs);
            
            [salePhoneMiddleInput, salePhoneLastInput].forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                        e.preventDefault();
                    }
                });
            });
        }
        
// 판매 회원가입 - 사업자 등록번호
    const businessNumberInput = document.getElementById('signup-business-number');
    const businessConfirmBtn = document.getElementById('business-confirm-btn');
    
    if (businessNumberInput) {
        businessNumberInput.addEventListener('input', function() {
            const numbers = this.value.replace(/[^\d]/g, '');
            this.value = numbers.slice(0, 10);
            this.dataset.businessChecked = 'false';
        });
        
        businessNumberInput.addEventListener('blur', function() {
            const validation = validators.validateBusinessNumber(this.value);
            updateInputStyle(this, validation.isValid);
            
            if (!validation.isValid && this.value) {
                showError('signup-business-error', validation.message);
            } else if (this.value) {
                hideError('signup-business-error');
            }
        });
        
        businessNumberInput.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    // 사업자 등록번호 인증 버튼 - API 연동
    if (businessConfirmBtn) {
        businessConfirmBtn.addEventListener('click', async function() {
            const businessNumber = businessNumberInput.value;
            const validation = validators.validateBusinessNumber(businessNumber);
            
            if (!validation.isValid) {
                showError('signup-business-error', validation.message);
                updateInputStyle(businessNumberInput, false);
                businessNumberInput.dataset.businessChecked = 'false';
                return;
            }
            
            try {
                const res = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/seller/validate-registration-number/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ company_registration_number: businessNumber }),
                });

                const data = await res.json();

                if (res.ok && data.message) {
                    showError('signup-business-error', data.message, true);
                    updateInputStyle(businessNumberInput, true);
                    businessNumberInput.dataset.businessChecked = 'true';
                } else {
                    showError('signup-business-error', data.error || '사업자 등록번호 검증에 실패했습니다.');
                    updateInputStyle(businessNumberInput, false);
                    businessNumberInput.dataset.businessChecked = 'false';
                }
            } catch (err) {
                console.error('사업자 등록번호 검증 실패:', err);
                showError('signup-business-error', '서버 요청 중 오류가 발생했습니다.');
                updateInputStyle(businessNumberInput, false);
                businessNumberInput.dataset.businessChecked = 'false';
            }
        });
    }
    
    // 판매 회원가입 - 스토어 이름
    const storeNameInput = document.getElementById('signup-store-name');
    if (storeNameInput) {
        storeNameInput.addEventListener('blur', function() {
            const validation = validators.validateStoreName(this.value);
            updateInputStyle(this, validation.isValid);
            
            if (!validation.isValid && this.value) {
                showError('signup-store-error', validation.message);
            } else if (this.value) {
                hideError('signup-store-error');
            }
        });
    }
}

// 체크박스 관련 코드 (수정된 부분)
const consentCheckEmpty = document.getElementById('consent-check-empty');
const consentCheckFill = document.getElementById('consent-check-fill');
const consentCheckbox = document.getElementById('information');

// 초기 상태 설정 
consentCheckEmpty.classList.add('show');
consentCheckFill.classList.remove('show');

// 체크박스 아이콘 클릭 이벤트
function toggleConsent() {
    const isChecked = consentCheckbox.checked;
    
    if (isChecked) {
        // 이미 체크되어 있으면 체크 해제
        consentCheckEmpty.classList.add('show');
        consentCheckFill.classList.remove('show');
        consentCheckbox.checked = false;
    } else {
        // 체크되어 있지 않으면 체크
        consentCheckEmpty.classList.remove('show');
        consentCheckFill.classList.add('show');
        consentCheckbox.checked = true;
    }
    
    // 현재 활성화된 탭에 따라 해당 폼 유효성 검사 실행
    if (document.querySelector('.tab-purchase.active')) {
        checkFormValidity();
    } else if (document.querySelector('.tab-sale.active')) {
        checkSaleFormValidity();
    }
}
// 체크박스 이미지에만 클릭 이벤트 추가
consentCheckEmpty.addEventListener('click', toggleConsent);
consentCheckFill.addEventListener('click', toggleConsent);

// 라벨 클릭 시 기본 동작 방지 (이용약관 링크는 동작하도록 함)
document.querySelector('.consent label').addEventListener('click', function(e) {
    // 링크를 클릭한 경우에는 기본 동작 허용
    if (e.target.tagName === 'A') {
        return;
    }
    // 라벨의 다른 부분을 클릭한 경우 기본 동작 방지
    e.preventDefault();
});

// 숨겨진 체크박스의 change 이벤트는 제거하거나 주석 처리
// consentCheckbox.addEventListener('change', function() {
//     if (this.checked) {
//         consentCheckEmpty.classList.remove('show');
//         consentCheckFill.classList.add('show');
//     } else {
//         consentCheckEmpty.classList.add('show');
//         consentCheckFill.classList.remove('show');
//     }
//     checkFormValidity();
// });

 // 가입하기 버튼 - API 연동 (수정된 부분)
const joinButton = document.getElementById('join-submit-btn');
joinButton.addEventListener('click', async function() {
    if (!this.disabled) {
        const currentTab = document.querySelector('.tab-content .active') || document.querySelector('.tab-purchase.active');
        
        if (document.querySelector('.tab-purchase.active')) {
            // 구매자 회원가입
            const userData = {
                username: document.getElementById('signup-username-purchase').value,
                password: document.getElementById('signup-pw-purchase').value,
                name: document.querySelector('input[name="name"]').value,
                phone_number: document.getElementById('phone-prefix').value + document.getElementById('phone-middle').value + document.getElementById('phone-last').value
            };
            
            try {
                const res = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/buyer/signup/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

                const data = await res.json();

                if (res.ok) {
                    alert('구매자 회원가입에 성공했습니다! :)');
                    console.log('회원가입 성공:', data);
                    // 로그인 페이지로 이동
                    window.location.href = 'https://6wol.github.io/open-market/login.html';
                } else {
                    console.error('회원가입 실패:', data);
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (err) {
                console.error('회원가입 요청 실패:', err);
                alert('서버 요청 중 오류가 발생했습니다.');
            }
        } else if (document.querySelector('.tab-sale.active')) {
            // 판매자 회원가입
            const userData = {
                username: document.getElementById('signup-username-sale').value,
                password: document.getElementById('signup-pw-sale').value,
                name: document.getElementById('signup-name-sale').value,
                phone_number: document.getElementById('phone-prefix-sale').value + document.getElementById('phone-middle-sale').value + document.getElementById('phone-last-sale').value,
                company_registration_number: document.getElementById('signup-business-number').value,
                store_name: document.getElementById('signup-store-name').value
            };
            
            try {
                const res = await fetch('https://api.wenivops.co.kr/services/open-market/accounts/seller/signup/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });

                const data = await res.json();

                if (res.ok) {
                    alert('판매자 회원가입에 성공했습니다! :)');
                    console.log('회원가입 성공:', data);
                    // 로그인 페이지로 이동
                    window.location.href = 'https://6wol.github.io/open-market/login.html';
                } else {
                    console.error('회원가입 실패:', data);
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                }
            } catch (err) {
                console.error('회원가입 요청 실패:', err);
                alert('서버 요청 중 오류가 발생했습니다.');
            }
        }
    }
});
    
    // 초기 상태 설정
    checkFormValidity();
    initSaleSignup();
});