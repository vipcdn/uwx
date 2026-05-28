// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    if (text == null || text === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    if (event && event.target) {
    event.target.classList.add('active');
    }
    
   
    if (section === 'shop') loadShopProducts();
    if (section === 'points') loadPoints();
	if (section === 'announcements') loadAnnouncements();
    if (section === 'videos') loadVideos();
}



function updateExpireTimeInput() {
    const unlimitedCheckbox = document.getElementById('unlimitedCheckbox');
    const expireTimeInput = document.getElementById('expireTimeInput');
    
    if (!unlimitedCheckbox || !expireTimeInput) {
        return;
    }
    
    // 确保VIP状态已初始化（使用window.userIsVip作为后备）
    if (window.isVip === undefined) {
        window.isVip = window.userIsVip || false;
    }
    
    // 非VIP用户不能选择无限制
    if (!window.isVip) {
        unlimitedCheckbox.disabled = true;
        unlimitedCheckbox.checked = false;
    } else {
        unlimitedCheckbox.disabled = false;
    }
    
    if (unlimitedCheckbox.checked) {
        expireTimeInput.disabled = true;
        expireTimeInput.value = '';
    } else {
        expireTimeInput.disabled = false;
        // 设置默认值为7天后
        if (!expireTimeInput.value) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 7);
            expireTimeInput.value = defaultDate.toISOString().slice(0, 16);
        }
    }
}


// 解析User-Agent获取浏览器信息
function parseUserAgent(ua) {
    if (!ua) return '未知';
    
    // Chrome
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1) {
        const match = ua.match(/Chrome\/(\d+)/);
        return match ? 'Chrome ' + match[1] : 'Chrome';
    }
    // Edge
    if (ua.indexOf('Edg') > -1) {
        const match = ua.match(/Edg\/(\d+)/);
        return match ? 'Edge ' + match[1] : 'Edge';
    }
    // Firefox
    if (ua.indexOf('Firefox') > -1) {
        const match = ua.match(/Firefox\/(\d+)/);
        return match ? 'Firefox ' + match[1] : 'Firefox';
    }
    // Safari
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        const match = ua.match(/Version\/(\d+)/);
        return match ? 'Safari ' + match[1] : 'Safari';
    }
    // Opera
    if (ua.indexOf('OPR') > -1) {
        const match = ua.match(/OPR\/(\d+)/);
        return match ? 'Opera ' + match[1] : 'Opera';
    }
    // 微信内置浏览器
    if (ua.indexOf('MicroMessenger') > -1) {
        return '微信浏览器';
    }
    // 移动设备
    if (ua.indexOf('Mobile') > -1) {
        if (ua.indexOf('Android') > -1) {
            return 'Android浏览器';
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
            return 'iOS浏览器';
        }
    }
    
    // 默认返回截取的UA（前30个字符）
    return ua.length > 30 ? ua.substring(0, 30) + '...' : ua;
}

// 解析User-Agent获取设备信息
function parseDeviceModel(ua) {
    if (!ua) return '未知';
    
    // iPhone
    if (ua.indexOf('iPhone') > -1) {
        const match = ua.match(/iPhone OS (\d+)_(\d+)/);
        if (match) {
            return `iPhone iOS ${match[1]}.${match[2]}`;
        }
        return 'iPhone';
    }
    
    // iPad
    if (ua.indexOf('iPad') > -1) {
        const match = ua.match(/OS (\d+)_(\d+)/);
        if (match) {
            return `iPad iOS ${match[1]}.${match[2]}`;
        }
        return 'iPad';
    }
    
    // Android
    if (ua.indexOf('Android') > -1) {
        const match = ua.match(/Android ([\d.]+)/);
        if (match) {
            // 尝试提取设备型号
            const deviceMatch = ua.match(/; ([^;)]+)\)/);
            if (deviceMatch) {
                return `Android ${match[1]} (${deviceMatch[1]})`;
            }
            return `Android ${match[1]}`;
        }
        return 'Android设备';
    }
    
    // Windows
    if (ua.indexOf('Windows') > -1) {
        if (ua.indexOf('Windows NT 10.0') > -1) return 'Windows 10/11';
        if (ua.indexOf('Windows NT 6.3') > -1) return 'Windows 8.1';
        if (ua.indexOf('Windows NT 6.2') > -1) return 'Windows 8';
        if (ua.indexOf('Windows NT 6.1') > -1) return 'Windows 7';
        return 'Windows';
    }
    
    // macOS
    if (ua.indexOf('Mac OS X') > -1) {
        const match = ua.match(/Mac OS X ([\d_]+)/);
        if (match) {
            return `macOS ${match[1].replace(/_/g, '.')}`;
        }
        return 'macOS';
    }
    
    // Linux
    if (ua.indexOf('Linux') > -1) {
        return 'Linux';
    }
    
    return '未知设备';
}




// 页面加载时初始化VIP状态
if (window.userIsVip !== undefined && window.isVip === undefined) {
    window.isVip = window.userIsVip || false;
}

// 点击模态框外部关闭
document.addEventListener('DOMContentLoaded', function() {
    // 初始化VIP状态
    if (window.userIsVip !== undefined && window.isVip === undefined) {
        window.isVip = window.userIsVip || false;
    }
    
    const modal = document.getElementById('photoDetailModal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                closePhotoDetail();
            }
        }
    }
    
    // 加载密码要求（如果存在密码输入框）
    if (document.getElementById('newPasswordInput')) {
        loadPasswordRequirements();
    }
});


// 获取积分类型的中文名称
function getPointsTypeName(type) {
    const typeMap = {
        'register_reward': '注册奖励',
        'invite_reward': '邀请奖励',
        'upload_reward': '上传奖励',
        'other': '其他'
    };
    return typeMap[type] || type;
}

// 获取积分类型的图标
function getPointsTypeIcon(type) {
    const iconMap = {
        'register_reward': '🎁',
        'invite_reward': '👥',
        'upload_reward': '📷',
        'checkin_reward': '📅',
        'other': '⭐'
    };
    return iconMap[type] || '⭐';
}

// 检查签到状态
function checkCheckinStatus() {
    fetch('check_checkin_status.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const checkinBtn = document.getElementById('checkinBtn');
                const checkinBtnText = document.getElementById('checkinBtnText');
                const checkinStatus = document.getElementById('checkinStatus');
                const consecutiveDays = document.getElementById('consecutiveDays');
                const checkinInfo = document.getElementById('checkinInfo');
                
                if (data.data.is_checked_in) {
                    checkinBtn.disabled = true;
                    checkinBtn.style.opacity = '0.6';
                    checkinBtn.style.cursor = 'not-allowed';
                    checkinBtnText.textContent = '今日已签到';
                    checkinStatus.innerHTML = '<span style="color: #28a745;">✓ 今日已签到</span>';
                } else {
                    checkinBtn.disabled = false;
                    checkinBtn.style.opacity = '1';
                    checkinBtn.style.cursor = 'pointer';
                    checkinBtnText.textContent = '签到';
                    checkinStatus.innerHTML = '<span style="color: #dc3545;">今日未签到</span>';
                }
                
                if (data.data.consecutive_days > 0) {
                    consecutiveDays.textContent = data.data.consecutive_days + ' 天';
                    checkinInfo.style.display = 'block';
                } else {
                    checkinInfo.style.display = 'none';
                }
            }
        })
        .catch(err => {
            console.error('检查签到状态错误:', err);
        });
}

// 执行签到
function doCheckin() {
    const checkinBtn = document.getElementById('checkinBtn');
    if (checkinBtn.disabled) {
        return;
    }
    
    checkinBtn.disabled = true;
    checkinBtn.style.opacity = '0.6';
    checkinBtn.style.cursor = 'not-allowed';
    const originalText = document.getElementById('checkinBtnText').textContent;
    document.getElementById('checkinBtnText').textContent = '签到中...';
    
    fetch('do_checkin.php', {
        method: 'POST'
    })
        .then(res => {
            // 先检查响应状态
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            // 检查响应内容类型
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return res.text().then(text => {
                    console.error('非JSON响应:', text);
                    throw new Error('服务器返回了非JSON格式的响应');
                });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                const checkinStatus = document.getElementById('checkinStatus');
                const consecutiveDays = document.getElementById('consecutiveDays');
                const todayReward = document.getElementById('todayReward');
                const checkinInfo = document.getElementById('checkinInfo');
                
                // 显示签到成功信息
                let rewardText = `+${data.data.base_points}`;
                if (data.data.vip_bonus > 0) {
                    rewardText += ` (VIP+${data.data.vip_bonus})`;
                }
                if (data.data.consecutive_bonus > 0) {
                    rewardText += ` (连续+${data.data.consecutive_bonus})`;
                }
                rewardText += ` = ${data.data.points}`;
                
                todayReward.textContent = rewardText;
                consecutiveDays.textContent = data.data.consecutive_days + ' 天';
                checkinInfo.style.display = 'block';
                
                checkinStatus.innerHTML = `<span style="color: #28a745;">✓ 签到成功！获得 ${data.data.points} 积分</span>`;
                
                // 更新按钮状态
                checkinBtn.disabled = true;
                checkinBtn.style.opacity = '0.6';
                document.getElementById('checkinBtnText').textContent = '今日已签到';
                
                // 重新加载积分信息
                setTimeout(() => {
                    loadPoints();
                }, 500);
            } else {
                alert('签到失败：' + (data.message || '未知错误'));
                checkinBtn.disabled = false;
                checkinBtn.style.opacity = '1';
                checkinBtn.style.cursor = 'pointer';
                document.getElementById('checkinBtnText').textContent = originalText;
            }
        })
        .catch(err => {
            console.error('签到错误:', err);
            alert('签到失败：' + (err.message || '请重试'));
            checkinBtn.disabled = false;
            checkinBtn.style.opacity = '1';
            checkinBtn.style.cursor = 'pointer';
            document.getElementById('checkinBtnText').textContent = originalText;
        });
}

function loadPoints() {
    // 先检查签到状态
    checkCheckinStatus();
    
    fetch('get_points.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.data.points_log.list.length === 0) {
                    document.getElementById('pointsInfo').innerHTML = `
                        <div style="padding: 20px; background: linear-gradient(135deg, #87CEEB 0%, #5B9BD5 100%); border-radius: 8px; margin-bottom: 20px; color: white; text-align: center;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">总积分</div>
                            <div style="font-size: 32px; font-weight: bold;">${data.data.total_points}</div>
                        </div>
                        <div style="text-align: center; padding: 40px; color: #999;">
                            <p>暂无积分记录</p>
                        </div>
                    `;
                    return;
                }
                
                const logs = data.data.points_log.list.map(log => {
                    const typeName = log.remark || getPointsTypeName(log.type);
                    const icon = getPointsTypeIcon(log.type);
                    const pointsClass = log.points > 0 ? 'points-positive' : 'points-negative';
                    const pointsText = log.points > 0 ? `+${log.points}` : `${log.points}`;
                    const formatTime = log.create_time ? log.create_time.replace(/:\d{2}$/, '').replace(' ', ' ') : '';
                    
                    // 根据记录类型显示相关信息
                    let relatedUserInfo = '';
                    if (log.type === 'invite_reward') {
                        if (log.remark === '通过邀请码注册奖励' || log.remark === '通过注册码注册奖励') {
                            // 新用户：显示邀请人
                            const inviterName = (log.related_user_nickname && log.related_user_nickname.trim()) 
                                ? log.related_user_nickname 
                                : (log.related_user_name || '未知用户');
                            relatedUserInfo = `邀请人：${inviterName}`;
                        } else if (log.remark === '邀请新用户注册奖励') {
                            // 邀请人：显示被邀请人
                            const invitedName = (log.related_user_nickname && log.related_user_nickname.trim()) 
                                ? log.related_user_nickname 
                                : (log.related_user_name || '未知用户');
                            relatedUserInfo = `被邀请人：${invitedName}`;
                        }
                    } else if (log.related_user_name) {
                        // 其他类型：显示新用户（如果有）
                        const userName = (log.related_user_nickname && log.related_user_nickname.trim()) 
                            ? log.related_user_nickname 
                            : log.related_user_name;
                        relatedUserInfo = `关联用户：${userName}`;
                    }
                    
                    return `
                        <div class="points-log-card">
                            <div class="points-log-card-header">
                                <div class="points-log-icon">${icon}</div>
                                <div class="points-log-points ${pointsClass}">${pointsText}</div>
                            </div>
                            <div class="points-log-card-body">
                                <div class="points-log-type">${typeName}</div>
                                ${relatedUserInfo ? `<div class="points-log-user">${relatedUserInfo}</div>` : ''}
                                <div class="points-log-time">${formatTime}</div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                document.getElementById('pointsInfo').innerHTML = `
                    <div style="padding: 20px; background: linear-gradient(135deg, #87CEEB 0%, #5B9BD5 100%); border-radius: 8px; margin-bottom: 20px; color: white; text-align: center;">
                        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">总积分</div>
                        <div style="font-size: 32px; font-weight: bold;">${data.data.total_points}</div>
                    </div>
                    <h3 style="margin-bottom: 15px;">积分明细</h3>
                    <div class="points-log-grid">
                        ${logs}
                    </div>
                `;
            }
        });
}





// 编辑昵称
function editNickname() {
    const nicknameInput = document.getElementById('nicknameInput');
    const editBtn = document.getElementById('nicknameEditBtn');
    const saveBtn = document.getElementById('nicknameSaveBtn');
    const cancelBtn = document.getElementById('nicknameCancelBtn');
    
    // 保存原始值
    nicknameInput.dataset.originalValue = nicknameInput.value;
    
    // 启用输入框
    nicknameInput.disabled = false;
    nicknameInput.style.background = 'white';
    nicknameInput.focus();
    
    // 重置保存按钮状态（防止之前的状态残留）
    saveBtn.disabled = false;
    saveBtn.textContent = '保存';
    
    // 显示保存和取消按钮，隐藏修改按钮
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
}

// 取消编辑昵称
function cancelEditNickname() {
    const nicknameInput = document.getElementById('nicknameInput');
    const editBtn = document.getElementById('nicknameEditBtn');
    const saveBtn = document.getElementById('nicknameSaveBtn');
    const cancelBtn = document.getElementById('nicknameCancelBtn');
    
    // 恢复原始值
    nicknameInput.value = nicknameInput.dataset.originalValue || '';
    
    // 禁用输入框
    nicknameInput.disabled = true;
    nicknameInput.style.background = '#f5f5f5';
    
    // 显示修改按钮，隐藏保存和取消按钮
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// 保存昵称
function saveNickname() {
    const nicknameInput = document.getElementById('nicknameInput');
    const editBtn = document.getElementById('nicknameEditBtn');
    const saveBtn = document.getElementById('nicknameSaveBtn');
    const cancelBtn = document.getElementById('nicknameCancelBtn');
    const nickname = nicknameInput.value.trim();
    
    const formData = new FormData();
    formData.append('nickname', nickname);
    
    // 禁用按钮，显示加载状态
    saveBtn.disabled = true;
    saveBtn.textContent = '保存中...';
    
    fetch('set_nickname.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 更新原始值
                nicknameInput.dataset.originalValue = nickname;
                
                // 禁用输入框
                nicknameInput.disabled = true;
                nicknameInput.style.background = '#f5f5f5';
                
                // 重置保存按钮状态
                saveBtn.disabled = false;
                saveBtn.textContent = '保存';
                
                // 显示修改按钮，隐藏保存和取消按钮
                editBtn.style.display = 'inline-block';
                saveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                
                alert('昵称设置成功');
            } else {
                alert('设置失败：' + (data.message || '未知错误'));
                saveBtn.disabled = false;
                saveBtn.textContent = '保存';
            }
        })
        .catch(err => {
            console.error('设置昵称错误:', err);
            alert('设置失败，请重试');
            saveBtn.disabled = false;
            saveBtn.textContent = '保存';
        });
}
// 订阅码充值vip
function renewVIP() {
    const authCodeInput = document.getElementById('authCode');
    const user_name = document.getElementById('user_name').value.trim();
     	
    const authCode = authCodeInput.value.trim();
    const renewTips = document.getElementById('renewTips');
	const renewSubmitBtn = document.getElementById('renewSubmitBtn');
    const formData = new FormData();
    formData.append('authCode', authCode);
	formData.append('user_name', user_name);
		
	if(!authCode || !user_name) {
        alert('请填写用户名或订阅码');
        return;
    }
    
    //提示在验证订阅码   
    //renewTips.textContent = '订阅码验证中...';
	// 禁用按钮，显示加载状态
    renewSubmitBtn.disabled = true;
    renewSubmitBtn.textContent = '充值中...';
    
    fetch('userAction.php?act=renewVIP', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renewTips.textContent = data.message;
				
				renewSubmitBtn.disabled = false;
				renewSubmitBtn.textContent = '提交';
            } else {				
                renewTips.textContent = data.message;
				renewSubmitBtn.disabled = false;
				renewSubmitBtn.textContent = '提交';
            }
        })
        .catch(err => {
            console.error('验证失败错误:', err);           
			renewTips.textContent = "服务器繁忙验证失败，请稍后重试";
            renewSubmitBtn.disabled = false;
			renewSubmitBtn.textContent = '提交';
        });
}
// 发送邮箱验证码
function sendEmailCode() {
    const email = document.getElementById('emailInput').value.trim();
    
    if (!email) {
        alert('请填写邮箱地址');
        return;
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('type', 'verify');
    
    fetch('send_email_code.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('验证码已发送到您的邮箱，请查收');
                document.getElementById('emailCodeSection').style.display = 'block';
            } else {
                alert('发送失败：' + (data.message || '未知错误'));
            }
        })
        .catch(err => {
            console.error('发送验证码错误:', err);
            alert('发送失败，请重试');
        });
}

// 验证邮箱
function verifyEmail() {
    const email = document.getElementById('emailInput').value.trim();
    const code = document.getElementById('emailCodeInput').value.trim();
    
    if (!email || !code) {
        alert('请填写完整信息');
        return;
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('code', code);
    
    fetch('verify_email.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('邮箱验证成功');
                location.reload();
            } else {
                alert('验证失败：' + (data.message || '未知错误'));
            }
        })
        .catch(err => {
            console.error('验证邮箱错误:', err);
            alert('验证失败，请重试');
        });
}

// 保存邮箱提醒设置
function saveEmailNotify() {
    const notify = document.getElementById('emailNotifyCheckbox').checked ? 1 : 0;
    
    const formData = new FormData();
    formData.append('notify_photo', notify);
    
    fetch('set_email_notify.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 静默保存，不提示
            } else {
                alert('设置失败：' + (data.message || '未知错误'));
                // 恢复原状态
                document.getElementById('emailNotifyCheckbox').checked = !notify;
            }
        })
        .catch(err => {
            console.error('设置邮箱提醒错误:', err);
            alert('设置失败，请重试');
            document.getElementById('emailNotifyCheckbox').checked = !notify;
        });
}

// 修改密码
// 加载密码要求
async function loadPasswordRequirements() {
    try {
        const response = await fetch('get_password_strength.php?password=');
        const data = await response.json();
        if (data.success && data.requirements) {
            updateRequirementsDisplay(data.requirements);
        }
    } catch (err) {
        console.error('加载密码要求失败:', err);
    }
}

// 更新密码要求显示
function updateRequirementsDisplay(requirements) {
    const requirementsList = document.getElementById('requirementsList');
    if (!requirementsList) return;
    
    requirementsList.innerHTML = requirements.map(req => {
        const icon = req.met ? '✓' : '○';
        const color = req.met ? '#00C851' : '#999';
        return `<div style="color: ${color}; margin-bottom: 3px;">
            <span style="margin-right: 5px; font-weight: bold;">${icon}</span>
            ${req.text}
        </div>`;
    }).join('');
}

// 检查密码强度
async function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    const requirementsList = document.getElementById('requirementsList');
    
    if (!password) {
        if (strengthDiv) {
            strengthDiv.style.display = 'none';
        }
        // 显示初始要求（未满足状态）
        try {
            const response = await fetch('get_password_strength.php?password=');
            const data = await response.json();
            if (data.success && data.requirements) {
                updateRequirementsDisplay(data.requirements);
            }
        } catch (err) {
            console.error('加载密码要求失败:', err);
        }
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('password', password);
        
        const response = await fetch('get_password_strength.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            // 更新要求显示
            if (data.requirements) {
                updateRequirementsDisplay(data.requirements);
            }
            
            // 更新强度显示
            if (strengthDiv) {
                const strengthBarFill = document.getElementById('strengthBarFill');
                const strengthText = document.getElementById('strengthText');
                
                if (strengthBarFill && strengthText) {
                    strengthDiv.style.display = 'block';
                    
                    const level = data.level || 0;
                    const text = data.text || '未知';
                    
                    // 设置进度条
                    const percentages = [0, 25, 50, 75, 100];
                    const colors = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];
                    const percentage = percentages[level] || 0;
                    const color = colors[level] || '#999';
                    
                    strengthBarFill.style.width = percentage + '%';
                    strengthBarFill.style.background = color;
                    strengthText.textContent = text;
                    strengthText.style.color = color;
                }
            }
        }
    } catch (err) {
        console.error('检查密码强度失败:', err);
    }
}

function changePassword() {
    const oldPassword = document.getElementById('oldPasswordInput').value;
    const newPassword = document.getElementById('newPasswordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('请填写完整信息');
        return;
    }
    
    // 密码强度验证（前端验证，后端会再次验证）
    if (newPassword.length < 8) {
        alert('新密码长度至少为8个字符');
        return;
    }
    
    // 检查是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
        alert('密码必须包含至少一个字母和一个数字');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);
    
    fetch('userAction.php?act=changePassword', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('密码修改成功，请重新登录');
                // 清空输入框
                document.getElementById('oldPasswordInput').value = '';
                document.getElementById('newPasswordInput').value = '';
                document.getElementById('confirmPasswordInput').value = '';
				setTimeout(function () {
                                 window.location.href = '/user/';
                            },2000);
            } else {
                alert('修改失败：' + (data.message || '未知错误'));
            }
        })
        .catch(err => {
            console.error('修改密码错误:', err);
            alert('修改失败，请重试');
        });
}


//===========公告=================
let currentAnnouncementPage = 1;
let currentReadStatusPage = 1;
let currentReadStatusAnnouncementId = 0;

// 加载公告列表
function loadAnnouncements(page = 1) {
    currentAnnouncementPage = page;
    fetch(`get_announcements.php?page=${page}&page_size=10`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderAnnouncements(data.data);
            } else {
                document.getElementById('announcementList').innerHTML = '<p>加载失败</p>';
            }
        })
        .catch(err => {
            console.error('加载公告列表错误:', err);
            document.getElementById('announcementList').innerHTML = '<p>加载失败</p>';
        });
}

// 渲染公告列表
function renderAnnouncements(data) {
    const { list, total, page, page_size } = data;
    
    if (!list || list.length === 0) {
        document.getElementById('announcementList').innerHTML = '<p>暂无公告</p>';
        document.getElementById('announcementPagination').innerHTML = '';
        return;
    }
    
    const levelMap = {
        'important': { text: '重要', class: 'level-important', color: '#dc3545' },
        'normal': { text: '一般', class: 'level-normal', color: '#007bff' },
        'notice': { text: '通知', class: 'level-notice', color: '#28a745' }
    };
    
    const html = list.map(announcement => {
        const level = levelMap[announcement.level] || levelMap['normal'];
        const formatTime = announcement.create_time ? announcement.create_time.replace(/:\d{2}$/, '') : '';
        
        return `
            <div class="announcement-item" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span class="${level.class}" style="padding: 4px 12px; background: ${level.color}; color: white; border-radius: 4px; font-size: 12px; font-weight: bold;">${level.text}</span>
                            <strong style="font-size: 16px; color: #333;">${announcement.title}</strong>
                        </div>
                        <div style="font-size: 12px; color: #999;">
                            发布者：${announcement.admin_username || '未知'} | 
                            发布时间：${formatTime}
                            ${announcement.require_read ? ' | <span style="color: #dc3545;">强制已读</span>' : ''}
                            ${announcement.is_visible ? '' : ' | <span style="color: #999;">已隐藏</span>'}
                        </div>
                    </div>
                   
                </div>
                <div class="admin-announcement-content" style="color: #666; line-height: 1.6; word-break: break-word;" data-content-type="${announcement.content_type || 'auto'}"></div>
            </div>
        `;
    }).join('');
    
    document.getElementById('announcementList').innerHTML = html;
    
    // 渲染内容（支持HTML和Markdown）
    document.querySelectorAll('.admin-announcement-content').forEach(async (el, index) => {
        const announcement = list[index];
        if (announcement && announcement.content) {
            const content = announcement.content;
            const contentType = announcement.content_type || 'auto';
            el.innerHTML = await renderContent(content, contentType);
        }
    });
    
    // 分页
    const totalPages = Math.ceil(total / page_size);
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml = '<div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">';
        if (page > 1) {
            paginationHtml += `<button class="btn" onclick="loadAnnouncements(${page - 1})">上一页</button>`;
        }
        paginationHtml += `<span style="line-height: 38px;">第 ${page} / ${totalPages} 页，共 ${total} 条</span>`;
        if (page < totalPages) {
            paginationHtml += `<button class="btn" onclick="loadAnnouncements(${page + 1})">下一页</button>`;
        }
        paginationHtml += '</div>';
    }
    document.getElementById('announcementPagination').innerHTML = paginationHtml;
}


//======================收藏管理==================
let currentVideoPage = 1;
// 加载公告列表
function loadVideos(page = 1) {
    currentVideoPage = page;	
    fetch(`stow.php?act=get&page=${page}&page_size=10`)
        .then(res => res.json())
        .then(data => {			
            if (data.success) {				
                renderVideos(data.data);
            } else {
                document.getElementById('videoList').innerHTML = '<p>加载失败</p>';
            }
        })
        .catch(err => {
            console.error('加载公告列表错误:', err);
            document.getElementById('videoList').innerHTML = '<p>加载失败</p>';
        });
}

// 渲染视频列表
function renderVideos(data) {
    const { list, total, page, page_size } = data;
	
	
    if (!list || list.length === 0) {
        document.getElementById('videoList').innerHTML = '<p>暂无收藏</p>';
        document.getElementById('videoPagination').innerHTML = '';
        return;
    }
    
    const levelMap = {
        'important': { text: '重要', class: 'level-important', color: '#dc3545' },
        'normal': { text: '一般', class: 'level-normal', color: '#007bff' },
        'notice': { text: '通知', class: 'level-notice', color: '#28a745' }
    };
    
    
    const html = list.map(video => {
        const level = levelMap[video.level] || levelMap['normal'];
         
        return `
            <div class="video-item" style="background: white;  border-radius: 8px; margin-bottom: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px; ">
                            <span class="${level.class}" style="padding: 4px 12px; background: ${level.color}; color: white; border-radius: 4px; font-size: 12px; font-weight: bold;">${video.cat_id}</span>
                            <a style="text-decoration: none;" target="_blank" href="/H/${video.cat_id}/${video.eid}.html">${video.title}</a>
                        </div>
                        
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn" onclick="deleteVideo(${video.id})" style="padding: 4px 12px; font-size: 12px; background: #dc3545;">删除</button>
                    </div>
                </div>
               
            </div>
        `;
    }).join('');
    
    document.getElementById('videoList').innerHTML = html;
    
    // 渲染内容（支持HTML和Markdown）
    document.querySelectorAll('.admin-video-content').forEach(async (el, index) => {
        const video = list[index];
        if (video && video.content) {
            const content = video.content;
            const contentType = video.content_type;
            el.innerHTML = await renderContent(content, contentType);
        }
    });
    
    // 分页
    const totalPages = Math.ceil(total / page_size);
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml = '<div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">';
        if (page > 1) {
            paginationHtml += `<button class="btn" onclick="loadVideos(${page - 1})">上一页</button>`;
        }
        paginationHtml += `<span style="line-height: 38px;">第 ${page} / ${totalPages} 页，共 ${total} 条</span>`;
        if (page < totalPages) {
            paginationHtml += `<button class="btn" onclick="loadVideos(${page + 1})">下一页</button>`;
        }
        paginationHtml += '</div>';
    }
    document.getElementById('videoPagination').innerHTML = paginationHtml;
}

// 删除收藏
function deleteVideo(id) {
    if (!confirm('确定要删除这条内容吗？')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('id', id);
    
    fetch('stow.php?act=del', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('删除成功');
                loadVideos(currentVideoPage);
            } else {
                alert(data.message || '删除失败');
            }
        })
        .catch(err => {
            console.error('删除收藏错误:', err);
            alert('删除失败，请重试');
        });
}



// ==================== 积分商城 ====================

// 加载商品列表
function loadShopProducts() {
    fetch('get_shop_products.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 更新当前积分显示
                document.getElementById('currentShopPoints').textContent = data.data.user_points || 0;
                
                displayShopProducts(data.data.products);
            } else {
                console.error('加载商品列表失败：', data.message);
                document.getElementById('shopProductList').innerHTML = '';
                document.getElementById('shopProductEmpty').style.display = 'block';
            }
        })
        .catch(err => {
            console.error('加载商品列表错误：', err);
            document.getElementById('shopProductList').innerHTML = '';
            document.getElementById('shopProductEmpty').style.display = 'block';
        });
}

// 显示商品列表
function displayShopProducts(products) {
    const container = document.getElementById('shopProductList');
    const emptyDiv = document.getElementById('shopProductEmpty');
    
    if (!products || products.length === 0) {
        container.innerHTML = '';
        emptyDiv.style.display = 'block';
        return;
    }
    
    emptyDiv.style.display = 'none';
    
    const typeMap = {
        'vip_temporary': { name: '临时VIP', icon: '👑', color: '#ffd700' },
        'vip_permanent': { name: '永久VIP', icon: '💎', color: '#ff6b6b' },
        'invite_limit': { name: '邀请链接数量', icon: '🔗', color: '#4ecdc4' }
    };
    
    const html = products.map(product => {
        const typeInfo = typeMap[product.type] || { name: product.type, icon: '🎁', color: '#5B9BD5' };
        const valueInfo = product.value !== null ? ` · ${product.value}${product.type === 'vip_temporary' ? '天' : '个'}` : '';
        const stockInfo = product.total_stock !== null 
            ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">剩余库存：${product.remaining_stock} / ${product.total_stock}</div>` 
            : '';
        const maxPerUserInfo = product.max_per_user !== null 
            ? `<div style="font-size: 12px; color: #666; margin-top: 3px;">每人限兑：${product.max_per_user}次</div>` 
            : '';
        const userExchangedInfo = product.max_per_user !== null && product.user_exchanged_count > 0
            ? `<div style="font-size: 12px; color: #5B9BD5; margin-top: 3px;">您已兑换：${product.user_exchanged_count}次</div>`
            : '';
        
        const canExchange = product.can_exchange;
        const buttonText = canExchange ? '立即兑换' : (product.exchange_reason || '无法兑换');
        
        return `
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s;" 
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';" 
                 onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 36px; margin-right: 15px;">${typeInfo.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${product.name}</div>
                        <div style="font-size: 13px; color: ${typeInfo.color}; font-weight: 500;">${typeInfo.name}${valueInfo}</div>
                    </div>
                </div>
                
                ${product.description ? `<div class="shop-product-description" style="font-size: 14px; color: #666; margin-bottom: 15px; line-height: 1.5;" data-content-type="${product.description_type || 'auto'}"></div>` : ''}
                
                <div style="border-top: 1px solid #f0f0f0; padding-top: 15px; margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 24px; font-weight: bold; color: #5B9BD5;">
                            <span style="font-size: 18px;">💰</span> ${product.points_price} 积分
                        </div>
                        <button class="btn" 
                                onclick="exchangeProduct(${product.id})" 
                                ${!canExchange ? 'disabled' : ''}
                                style="background: ${canExchange ? 'linear-gradient(135deg, #87CEEB 0%, #5B9BD5 100%)' : '#ccc'}; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: ${canExchange ? 'pointer' : 'not-allowed'}; font-weight: 500;">
                            ${buttonText}
                        </button>
                    </div>
                    ${stockInfo}
                    ${maxPerUserInfo}
                    ${userExchangedInfo}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    
    // 渲染商品描述（支持HTML和Markdown）
    // 需要找到对应的商品，因为HTML中可能没有按顺序排列
    document.querySelectorAll('.shop-product-description').forEach(async (el) => {
        // 通过父元素找到商品ID
        const productCard = el.closest('div[style*="background: white"]');
        if (!productCard) return;
        
        // 从按钮的onclick中提取商品ID
        const exchangeBtn = productCard.querySelector('button[onclick*="exchangeProduct"]');
        if (!exchangeBtn) return;
        
        const onclickAttr = exchangeBtn.getAttribute('onclick');
        const match = onclickAttr.match(/exchangeProduct\((\d+)\)/);
        if (!match) return;
        
        const productId = parseInt(match[1]);
        const product = products.find(p => p.id == productId);
        
        if (product && product.description) {
            const content = product.description;
            const contentType = product.description_type || 'auto';
            el.innerHTML = await renderContent(content, contentType);
        }
    });
}

// 兑换商品
function exchangeProduct(productId) {
    if (!confirm('确定要兑换这个商品吗？')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('product_id', productId);
    
    fetch('exchange_shop_product.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('兑换成功！' + (result.result.message || ''));
                // 重新加载商品列表（更新积分和库存）
                loadShopProducts();
                // 如果用户在积分明细页面，也刷新一下
                if (document.getElementById('points').classList.contains('active')) {
                    loadPoints();
                }
            } else {
                alert('兑换失败：' + result.message);
            }
        })
        .catch(err => {
            console.error('兑换商品错误：', err);
            alert('兑换失败，请稍后重试');
        });
}

// 加载注册码
function loadRegisterCode() {
    fetch('userAction.php?act=registerCode')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const registerCodeInput = document.getElementById('registerCodeInput');
                const registerUrlInput = document.getElementById('registerUrlInput');
                const registerUrlSection = document.getElementById('registerUrlSection');
                
                if (registerCodeInput) {
                    registerCodeInput.value = data.data.register_code;
                }
                if (registerUrlInput) {
                    registerUrlInput.value = data.data.register_url;
                    registerUrlSection.style.display = 'block';
                }
            }
        })
        .catch(err => {
            console.error('加载注册码错误:', err);
        });
}

// 复制注册码
function copyRegisterCode() {
    const input = document.getElementById('registerCodeInput');
    if (input) {
        input.select();
        document.execCommand('copy');
        alert('注册码已复制到剪贴板');
    }
}

// 复制注册链接
function copyRegisterUrl() {
    const input = document.getElementById('registerUrlInput');
    if (input) {
        input.select();
        document.execCommand('copy');
        alert('注册链接已复制到剪贴板');
    }
}

// 如果当前在个人资料页面，加载注册码
if (document.getElementById('profile').classList.contains('active')) {
    loadRegisterCode();
}

// 监听页面切换，当切换到个人资料页面时加载注册码
const originalShowSection = window.showSection;
window.showSection = function(section) {
    originalShowSection(section);
    if (section === 'profile') {
        loadRegisterCode();
    }
};

