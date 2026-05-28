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
    
    if (section === 'invites') loadInvites();
    if (section === 'photos') {
        // 切换到照片列表时，强制刷新
        loadPhotos();
    }
    if (section === 'shop') loadShopProducts();
    if (section === 'points') loadPoints();
    if (section === 'ranking') loadRanking('total');
    if (section === 'security') loadLoginLogs();
}

function generateInvite() {
    const generateBtn = document.getElementById('generateInviteBtn');
    if (generateBtn && generateBtn.disabled) {
        return;
    }
    
    // 确保VIP状态已初始化（使用window.userIsVip作为后备）
    if (window.isVip === undefined) {
        window.isVip = window.userIsVip || false;
    }
    
    // 会员用户直接生成永久链接，普通用户需要先检查是否有未过期的链接
    if (window.isVip) {
        // VIP用户生成永久链接
        generateInviteWithExpire('unlimited');
    } else {
        // 普通用户先检查是否有未过期的链接
        checkActiveInviteBeforeGenerate();
    }
}

function showInviteExpireModal() {
    const modal = document.getElementById('inviteExpireModal');
    if (!modal) {
        // 如果模态框不存在，直接生成（使用默认设置）
        generateInviteWithExpire(null);
        return;
    }
    
    // 重置表单
    const unlimitedCheckbox = document.getElementById('unlimitedCheckbox');
    const expireTimeInput = document.getElementById('expireTimeInput');
    
    if (!unlimitedCheckbox || !expireTimeInput) {
        console.error('拍摄链接模态框元素未找到');
        return;
    }
    
    // 确保VIP状态已初始化（使用window.userIsVip作为后备）
    if (window.isVip === undefined) {
        window.isVip = window.userIsVip || false;
    }
    
    // VIP用户默认勾选无限制
    if (window.isVip) {
        unlimitedCheckbox.checked = true;
        expireTimeInput.value = '';
    } else {
        unlimitedCheckbox.checked = false;
        // 设置默认值为7天后
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        expireTimeInput.value = defaultDate.toISOString().slice(0, 16);
    }
    
    updateExpireTimeInput();
    modal.style.display = 'flex';
    modal.style.alignItems = 'flex-start';
    modal.style.justifyContent = 'center';
}

function closeInviteExpireModal() {
    const modal = document.getElementById('inviteExpireModal');
    if (modal) {
        modal.style.display = 'none';
    }
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

// 检查普通用户是否有未过期的链接
function checkActiveInviteBeforeGenerate() {
    fetch('check_active_invite.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.has_active_invite && !data.is_vip) {
                    // 有未过期的链接，显示确认对话框
                    showConfirmGenerateInviteModal();
                } else {
                    // 没有未过期的链接，直接生成
                    generateInviteWithExpire(null);
                }
            } else {
                alert(data.message || '检查失败');
            }
        })
        .catch(err => {
            console.error('检查未过期链接错误:', err);
            // 出错时直接生成
            generateInviteWithExpire(null);
        });
}

// 显示确认生成拍摄链接对话框
function showConfirmGenerateInviteModal() {
    const modal = document.getElementById('confirmGenerateInviteModal');
    if (!modal) {
        // 如果对话框不存在，直接生成
        generateInviteWithExpire(null);
        return;
    }
    modal.style.display = 'flex';
    modal.style.alignItems = 'flex-start';
    modal.style.justifyContent = 'center';
}

// 关闭确认生成拍摄链接对话框
function closeConfirmGenerateInviteModal() {
    const modal = document.getElementById('confirmGenerateInviteModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 确认生成拍摄链接
function confirmGenerateInvite() {
    closeConfirmGenerateInviteModal();
    generateInviteWithExpire(null);
}

function generateInviteWithExpire(expireTime) {
    const generateBtn = document.getElementById('generateInviteBtn');
    if (generateBtn && generateBtn.disabled) {
        return;
    }
    
    // 使用 URLSearchParams 而不是 FormData，避免空的 multipart/form-data 被防火墙拦截
    const params = new URLSearchParams();
    if (expireTime) {
        params.append('expire_time', expireTime);
    }
    
    fetch('generate_invite.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                closeInviteExpireModal();
                closeConfirmGenerateInviteModal();
                let message = '拍摄链接已生成：\n';
                message += '拍照链接：' + data.invite_url + '\n';
                message += '录像链接：' + (data.video_invite_url || '');
                alert(message);
                loadInvites();
            } else {
                alert(data.message || '生成失败');
                loadInvites(); // 重新加载以更新状态
            }
        })
        .catch(err => {
            alert('生成失败，请重试');
            console.error('生成拍摄链接错误:', err);
        });
}

function submitInviteForm() {
    const unlimitedCheckbox = document.getElementById('unlimitedCheckbox');
    const expireTimeInput = document.getElementById('expireTimeInput');
    
    if (!unlimitedCheckbox || !expireTimeInput) {
        alert('表单元素未找到');
        return;
    }
    
    // 确保VIP状态已初始化（使用window.userIsVip作为后备）
    if (window.isVip === undefined) {
        window.isVip = window.userIsVip || false;
    }
    
    let expireTime = null;
    if (unlimitedCheckbox.checked && window.isVip) {
        // 只有VIP用户才能设置无限制
        expireTime = 'unlimited';
    } else if (expireTimeInput.value) {
        expireTime = expireTimeInput.value;
    } else {
        alert('请设置到期时间');
        return;
    }
    
    generateInviteWithExpire(expireTime);
}

function loadInvites() {
    fetch('get_invites.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const total = data.data.total || 0;
                const maxInvites = data.data.max_invites || 7;
                const canGenerate = data.data.can_generate !== false;
                const isVip = data.data.is_vip || false;
                
                // 更新拍摄链接数量信息
                const countInfo = document.getElementById('inviteCountInfo');
                if (isVip) {
                    countInfo.textContent = `当前：${total} 个拍摄链接（VIP用户无限制）`;
                    countInfo.style.color = '#5B9BD5';
                } else {
                    countInfo.textContent = `当前：${total}/${maxInvites} 个拍摄链接`;
                    if (total >= maxInvites) {
                        countInfo.style.color = '#dc3545';
                        countInfo.textContent += '（已达上限）';
                    }
                }
                
                // 更新生成按钮状态
                const generateBtn = document.getElementById('generateInviteBtn');
                if (!isVip && total >= maxInvites) {
                    generateBtn.disabled = true;
                    generateBtn.style.opacity = '0.6';
                    generateBtn.style.cursor = 'not-allowed';
                    generateBtn.textContent = '已达上限（最多' + maxInvites + '个）';
                } else {
                    generateBtn.disabled = false;
                    generateBtn.style.opacity = '1';
                    generateBtn.style.cursor = 'pointer';
                    generateBtn.textContent = '生成新拍摄链接';
                }
                
                // 保存VIP状态到全局变量，供模态框使用
                window.isVip = isVip;
                
                const html = data.data.list.map(invite => {
                    // 检查是否过期
                    let isExpired = false;
                    if (invite.expire_time) {
                        const expireTimestamp = new Date(invite.expire_time).getTime();
                        isExpired = expireTimestamp < Date.now();
                    }
                    
                    const expireTime = invite.expire_time ? invite.expire_time : '无限制';
                    const expireTimeClass = invite.expire_time ? '' : 'invite-unlimited';
                    const expiredClass = isExpired ? 'expired' : '';
                    const label = invite.label || '';
                    const statusBadge = invite.status == 1 ? 
                        '<span style="color: #28a745; font-size: 12px;">✓ 启用</span>' : 
                        '<span style="color: #dc3545; font-size: 12px;">✗ 禁用</span>';
                    const safeInviteCode = escapeHtml(invite.invite_code);
                    const safeLabel = escapeHtml(label);
                    const editButtonHtml = isVip ? `<button class="btn invite-edit-btn invite-edit-btn-mobile" ${isExpired ? 'disabled' : ''} onclick="${isExpired ? 'return false;' : `showEditInviteModal(${invite.id}, '${safeInviteCode}', '${safeLabel.replace(/'/g, "\\'")}', ${invite.status})`}" style="padding: 4px 12px; font-size: 12px; flex-shrink: 0;">编辑</button>` : '';
                    const editButtonDesktopHtml = isVip ? `<button class="btn invite-edit-btn invite-edit-btn-desktop" ${isExpired ? 'disabled' : ''} onclick="${isExpired ? 'return false;' : `showEditInviteModal(${invite.id}, '${safeInviteCode}', '${safeLabel.replace(/'/g, "\\'")}', ${invite.status})`}" style="padding: 4px 12px; font-size: 12px; flex-shrink: 0;">编辑</button>` : '';
                    
                    return `
                        <div class="invite-url ${expiredClass}">
                            <div class="invite-header-row">
                                <div style="flex: 1; min-width: 0;">
                                    <strong>拍摄链接码：</strong>${safeInviteCode}
                                    ${label ? `<span style="margin-left: 8px; padding: 2px 8px; background: #5B9BD5; color: white; border-radius: 4px; font-size: 12px;">${safeLabel}</span>` : ''}
                                    ${statusBadge}
                                </div>
                                ${editButtonHtml}
                            </div>
                            <div class="invite-details" style="line-height: 1.6;">
                                <div class="invite-link-row" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="margin-bottom: 8px;">
                                            <strong>拍照链接：</strong><a href="${invite.invite_url}" target="_blank">${invite.invite_url}</a>
                                        </div>
                                        <div>
                                            <strong>录像链接：</strong><a href="${invite.video_invite_url || invite.invite_url.replace('/invite.php', '/record.php')}" target="_blank">${invite.video_invite_url || invite.invite_url.replace('/invite.php', '/record.php')}</a>
                                        </div>
                                    </div>
                                    ${editButtonDesktopHtml}
                                </div>
                                <strong>有效期：</strong><span class="${expireTimeClass}">${expireTime}</span><br>
                                <strong>上传数量：</strong>${invite.upload_count}
                            </div>
                        </div>
                    `;
                }).join('');
                document.getElementById('inviteList').innerHTML = html || '暂无拍摄链接';
            }
        });
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

function loadPhotos() {
    // 显示加载状态
    const photoListElement = document.getElementById('photoList');
    if (photoListElement) {
        photoListElement.innerHTML = '<div style="text-align:center; padding:40px; color:#999;">加载中...</div>';
    }
    
    // 构建请求URL
    let url = 'get_photos.php';
    const params = [];
    // 设置较大的page_size，确保加载所有照片（包括所有拍摄码）
    params.push('page_size=10000');
    // 添加时间戳防止缓存
    params.push('_t=' + Date.now());
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.data.list.length === 0) {
                    document.getElementById('photoList').innerHTML = '<div style="text-align:center; padding:40px; color:#999;">暂无照片</div>';
                    return;
                }
                
                // 按拍摄链接码分组，并收集标签信息
                const groupedPhotos = {};
                const inviteLabels = {}; // 存储每个拍摄链接码的标签
                data.data.list.forEach(photo => {
                    const inviteCode = photo.invite_code || '未分类';
                    if (!groupedPhotos[inviteCode]) {
                        groupedPhotos[inviteCode] = [];
                        inviteLabels[inviteCode] = photo.invite_label || '';
                    }
                    groupedPhotos[inviteCode].push(photo);
                });
                
                // 按标签优先排序：有标签的在前，然后按标签名称排序，最后按拍摄链接码排序
                const sortedInviteCodes = Object.keys(groupedPhotos).sort((a, b) => {
                    const labelA = inviteLabels[a] || '';
                    const labelB = inviteLabels[b] || '';
                    
                    // 有标签的优先
                    if (labelA && !labelB) return -1;
                    if (!labelA && labelB) return 1;
                    
                    // 如果都有标签，按标签名称排序
                    if (labelA && labelB) {
                        const labelCompare = labelA.localeCompare(labelB, 'zh-CN');
                        if (labelCompare !== 0) return labelCompare;
                    }
                    
                    // 标签相同或都没有标签，按拍摄链接码排序
                    return a.localeCompare(b, 'zh-CN');
                });
                
                // 生成HTML
                let html = '';
                let groupIndex = 0;
                const isVip = window.userIsVip || false;
                
                for (const inviteCode of sortedInviteCodes) {
                    const groupId = `invite-group-${groupIndex}`;
                    const groupCheckboxId = `group-checkbox-${groupIndex}`;
                    const label = inviteLabels[inviteCode] || '';
                    
                    html += `<div class="invite-group">
                        <div class="invite-group-header" onclick="toggleInviteGroup('${groupId}')">
                            <span style="display: flex; align-items: center; gap: 10px; flex: 1;">
                                ${isVip ? `<input type="checkbox" id="${groupCheckboxId}" class="group-checkbox" data-group-id="${groupId}" onclick="event.stopPropagation(); toggleGroupSelection('${groupId}', '${groupCheckboxId}')" style="cursor: pointer;">` : ''}
                                <span style="font-weight: bold; font-size: 14px; color: #333;">
                                    ${label ? `<span style="padding: 2px 8px; background: #5B9BD5; color: white; border-radius: 4px; font-size: 12px; margin-right: 8px;">${label}</span>` : ''}
                                    拍摄链接码: <span style="color: #5B9BD5;">${inviteCode}</span> <span style="color: #999; font-weight: normal; font-size: 12px;">(${groupedPhotos[inviteCode].length} 张)</span>
                                </span>
                            </span>
                            <span class="expand-icon" id="${groupId}-icon">▼</span>
                        </div>
                        <div class="invite-group-content" id="${groupId}" style="display: none;">
                            <div class="photo-grid">`;
                    
                    groupedPhotos[inviteCode].forEach(photo => {
                        const thumbnailUrl = photo.thumbnail_url || '';
                        const photoId = photo.photo_id || photo.id;
                        const fileType = photo.file_type || 'photo';
                        const videoDuration = photo.video_duration || null;
                        const uploadTime = photo.upload_time || '';
                        const uploadIp = photo.upload_ip || '未知';
                        const rawUploadUa = photo.upload_ua || '';
                        const uploadUa = rawUploadUa.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                        const tags = photo.tags || [];
                        
                        const browserInfo = parseUserAgent(rawUploadUa);
                        const formatTime = uploadTime ? uploadTime.replace(/:\d{2}$/, '').replace(' ', ' ') : '未知';
                        
                        const tagsHtml = tags.map(tag => {
                            return `<span class="photo-tag">${tag.name || ''}</span>`;
                        }).join('');
                        
                        // 列表中统一使用缩略图图片，保证卡片高度一致
                        // 如果是视频类型，叠加一个小的 🎥 标记和时长
                        const isVideo = fileType === 'video';
                        const durationText = isVideo && videoDuration ? ` ${Math.floor(videoDuration)}秒` : '';
                        let mediaHtml = '';
                        if (thumbnailUrl) {
                            // 图片需要position: absolute才能正确填充使用padding-bottom创建的容器
                            mediaHtml = `
                                <img src="${thumbnailUrl}" alt="${isVideo ? '视频缩略图' : '照片'}"
                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block;"
                                     onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div style=\'position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f0f0f0; color:#999;\'>图片加载失败</div>';">
                                ${isVideo ? `<div style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.8); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; z-index:10; white-space:nowrap;">🎥${durationText}</div>` : ''}
                            `;
                        } else {
                            mediaHtml = `<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f0f0f0; color:#999;">加载中...</div>`;
                        }
                        
                        html += `
                            <div class="photo-item">
                                ${isVip ? `<div class="photo-checkbox-wrapper"><input type="checkbox" class="photo-checkbox" value="${photoId}" onclick="event.stopPropagation(); updateSelectedCount()"></div>` : ''}
                                <div class="photo-image-wrapper" onclick="showPhotoDetail(${photoId})" style="cursor: pointer;">
                                    ${mediaHtml}
                                </div>
                                <div class="photo-info">
                                    <div class="photo-info-item">时间: ${formatTime}</div>
                                    <div class="photo-info-item">IP: ${uploadIp}</div>
                                    <div class="photo-info-item" title="${uploadUa}">浏览器: ${browserInfo}</div>
                                    ${tagsHtml ? `<div class="photo-tags">${tagsHtml}</div>` : ''}
                                </div>
                                <div class="photo-actions">
                                    <a href="download_photo.php?id=${photoId}&type=original" download>下载</a>
                                    <a href="javascript:void(0)" onclick="showAddTagModal(${photoId})" class="tag-btn">标签</a>
                                    <a href="javascript:void(0)" onclick="deletePhoto(${photoId})" class="delete-btn">删除</a>
                                </div>
                            </div>
                        `;
                    });
                    
                    html += '</div></div></div>';
                    groupIndex++;
                }
                
                document.getElementById('photoList').innerHTML = html;
            } else {
                document.getElementById('photoList').innerHTML = '<div style="text-align:center; padding:40px; color:#f00;">加载失败：' + (data.message || '未知错误') + '</div>';
            }
        })
        .catch(err => {
            console.error('加载照片列表错误:', err);
            document.getElementById('photoList').innerHTML = '<div style="text-align:center; padding:40px; color:#f00;">加载失败，请刷新重试</div>';
        });
}



// 显示添加标签模态框
function showAddTagModal(photoId) {
    const tagName = prompt('请输入标签名称（最多10个字符）：');
    if (tagName && tagName.trim()) {
        addTagToPhoto(photoId, tagName.trim());
    }
}

// 添加标签
function addTagToPhoto(photoId, tagName) {
    const formData = new FormData();
    formData.append('photo_id', photoId);
    formData.append('tag_name', tagName);
    
    fetch('add_photo_tag.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('标签添加成功');
            loadPhotos();
        } else {
            alert('添加失败：' + (data.message || '未知错误'));
        }
    })
    .catch(err => {
        console.error('添加标签错误:', err);
        alert('添加失败，请重试');
    });
}

// 切换拍摄链接码组的折叠/展开
function toggleInviteGroup(groupId) {
    const content = document.getElementById(groupId);
    const icon = document.getElementById(groupId + '-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
        icon.style.transform = 'rotate(0deg)';
    }
}

// 更新选中数量
function updateSelectedCount() {
    const isVip = window.userIsVip || false;
    if (!isVip) return;
    
    // 查找所有复选框（包括折叠区域内的），然后过滤出已勾选的
    const allCheckboxes = document.querySelectorAll('.photo-checkbox');
    const checkedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
    const count = checkedCheckboxes.length;
    
    const batchActions = document.getElementById('batchActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (!batchActions || !selectedCount) return;
    
    if (count > 0) {
        batchActions.style.display = 'flex';
        selectedCount.textContent = `已选择 ${count} 张`;
    } else {
        batchActions.style.display = 'none';
    }
}

// 切换分组选择
function toggleGroupSelection(groupId, checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    const groupContent = document.getElementById(groupId);
    const photoCheckboxes = groupContent.querySelectorAll('.photo-checkbox');
    
    photoCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
    
    updateSelectedCount();
}

// 清除选择
function clearSelection() {
    const checkboxes = document.querySelectorAll('.photo-checkbox, .group-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
    updateSelectedCount();
}

// 批量删除照片
function batchDeletePhotos() {
    // 查找所有可见的已勾选复选框（包括折叠区域内的）
    const allCheckboxes = document.querySelectorAll('.photo-checkbox');
    const checkedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
    
    if (checkedCheckboxes.length === 0) {
        alert('请先选择要删除的照片');
        return;
    }
    
    if (!confirm(`确定要删除选中的 ${checkedCheckboxes.length} 张照片吗？删除后无法恢复。`)) {
        return;
    }
    
    const photoIds = checkedCheckboxes.map(cb => cb.value);
    const formData = new FormData();
    formData.append('photo_ids', JSON.stringify(photoIds));
    
    fetch('batch_delete_photos.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(`已成功删除 ${data.count || photoIds.length} 张照片`);
            clearSelection();
            loadPhotos();
        } else {
            alert('删除失败：' + (data.message || '未知错误'));
        }
    })
    .catch(err => {
        console.error('批量删除照片错误:', err);
        alert('删除失败，请重试');
    });
}

// 批量下载照片
function batchDownloadPhotos() {
    // 查找所有可见的已勾选复选框（包括折叠区域内的）
    const allCheckboxes = document.querySelectorAll('.photo-checkbox');
    const checkedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
    
    if (checkedCheckboxes.length === 0) {
        alert('请先选择要下载的照片');
        return;
    }
    
    const photoIds = checkedCheckboxes.map(cb => cb.value);
    const idsParam = photoIds.join(',');
    
    // 创建隐藏的下载链接，触发浏览器下载
    const link = document.createElement('a');
    link.href = `batch_download_photos.php?ids=${idsParam}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 生成EXIF信息HTML
function generateExifInfo(photo) {
    if (!photo) {
        return '';
    }
    
    // 检查是否有任何EXIF数据
    const hasLocation = photo.latitude != null && photo.longitude != null && 
                        parseFloat(photo.latitude) != 0 && parseFloat(photo.longitude) != 0;
    const hasCamera = photo.camera_make || photo.camera_model;
    const hasParams = photo.focal_length || photo.aperture || photo.shutter_speed || photo.iso;
    const hasSize = photo.width || photo.height;
    
    if (!hasLocation && !hasCamera && !hasParams && !hasSize) {
        return '';
    }
    
    let exifHtml = '<div class="exif-section" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">';
    exifHtml += '<h4 style="margin-bottom: 15px; color: #5B9BD5;">📷 拍摄信息</h4>';
    
    // 地理位置信息
    if (hasLocation) {
        const lat = parseFloat(photo.latitude);
        const lon = parseFloat(photo.longitude);
        exifHtml += '<div class="exif-group" style="margin-bottom: 15px;">';
        exifHtml += '<div style="font-weight: 600; color: #333; margin-bottom: 8px;">📍 地理位置</div>';
        exifHtml += `<div class="detail-info-item">
            <span class="detail-label">经纬度：</span>
            <span class="detail-value">${lat.toFixed(6)}, ${lon.toFixed(6)}</span>
        </div>`;
        if (photo.altitude != null && photo.altitude !== '') {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">海拔：</span>
                <span class="detail-value">${photo.altitude} 米</span>
            </div>`;
        }
        if (photo.location_address) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">地址：</span>
                <span class="detail-value">${photo.location_address}</span>
            </div>`;
        }
        // 添加地图链接
        exifHtml += `<div class="detail-info-item">
            <span class="detail-label">地图：</span>
            <span class="detail-value">
                <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=15" target="_blank" style="color: #5B9BD5; text-decoration: none;">查看地图</a>
            </span>
        </div>`;
        exifHtml += '</div>';
    }
    
    // 相机信息
    if (hasCamera) {
        exifHtml += '<div class="exif-group" style="margin-bottom: 15px;">';
        exifHtml += '<div style="font-weight: 600; color: #333; margin-bottom: 8px;">📷 相机信息</div>';
        if (photo.camera_make) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">品牌：</span>
                <span class="detail-value">${photo.camera_make}</span>
            </div>`;
        }
        if (photo.camera_model) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">型号：</span>
                <span class="detail-value">${photo.camera_model}</span>
            </div>`;
        }
        if (photo.lens_model) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">镜头：</span>
                <span class="detail-value">${photo.lens_model}</span>
            </div>`;
        }
        exifHtml += '</div>';
    }
    
    // 拍摄参数
    if (hasParams) {
        exifHtml += '<div class="exif-group" style="margin-bottom: 15px;">';
        exifHtml += '<div style="font-weight: 600; color: #333; margin-bottom: 8px;">⚙️ 拍摄参数</div>';
        if (photo.focal_length) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">焦距：</span>
                <span class="detail-value">${photo.focal_length}</span>
            </div>`;
        }
        if (photo.aperture) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">光圈：</span>
                <span class="detail-value">${photo.aperture}</span>
            </div>`;
        }
        if (photo.shutter_speed) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">快门：</span>
                <span class="detail-value">${photo.shutter_speed}</span>
            </div>`;
        }
        if (photo.iso) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">ISO：</span>
                <span class="detail-value">${photo.iso}</span>
            </div>`;
        }
        if (photo.exposure_mode) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">曝光模式：</span>
                <span class="detail-value">${photo.exposure_mode}</span>
            </div>`;
        }
        if (photo.white_balance) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">白平衡：</span>
                <span class="detail-value">${photo.white_balance}</span>
            </div>`;
        }
        if (photo.flash) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">闪光灯：</span>
                <span class="detail-value">${photo.flash}</span>
            </div>`;
        }
        exifHtml += '</div>';
    }
    
    // 照片尺寸
    if (hasSize) {
        exifHtml += '<div class="exif-group">';
        exifHtml += '<div style="font-weight: 600; color: #333; margin-bottom: 8px;">📐 照片尺寸</div>';
        if (photo.width && photo.height) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">尺寸：</span>
                <span class="detail-value">${photo.width} × ${photo.height} 像素</span>
            </div>`;
        } else if (photo.width) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">宽度：</span>
                <span class="detail-value">${photo.width} 像素</span>
            </div>`;
        } else if (photo.height) {
            exifHtml += `<div class="detail-info-item">
                <span class="detail-label">高度：</span>
                <span class="detail-value">${photo.height} 像素</span>
            </div>`;
        }
        exifHtml += '</div>';
    }
    
    exifHtml += '</div>';
    return exifHtml;
}

// 显示照片详情
function showPhotoDetail(photoId) {
    const modal = document.getElementById('photoDetailModal');
    const content = document.getElementById('photoDetailContent');
    
    // 显示模态框
    modal.style.display = 'flex';
    modal.style.alignItems = 'flex-start';
    modal.style.justifyContent = 'center';
    content.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading">加载中...</div></div>';
    
    // 获取照片详情
    fetch(`get_photo_detail.php?id=${photoId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const photo = data.data;
                const fileType = photo.file_type || 'photo';
                const videoDuration = photo.video_duration || null;
                const uploadTime = photo.upload_time || '未知';
                const uploadIp = photo.upload_ip || '未知';
                const uploadUa = photo.upload_ua || '';
                const inviteCode = photo.invite_code || '未知';
                const tags = photo.tags || [];
                
                // 解析浏览器信息
                const browserInfo = parseUserAgent(uploadUa);
                const deviceInfo = parseDeviceModel(uploadUa);
                
                // 格式化时间
                const formatTime = uploadTime.replace(/:\d{2}$/, '').replace(' ', ' ');
                
                // 标签HTML
                const tagsHtml = tags.length > 0 
                    ? tags.map(tag => `<span class="photo-tag">${tag.name}</span>`).join('')
                    : '<span style="color: #999;">无标签</span>';
                
                // 根据文件类型生成不同的媒体HTML
                let mediaHtml = '';
                let downloadText = '';
                if (fileType === 'video') {
                    const durationText = videoDuration ? ` (${Math.floor(videoDuration)}秒)` : '';
                    mediaHtml = `
                        <video src="${photo.image_url}" controls style="width: 100%; max-width: 100%; max-height: 70vh;" class="photo-detail-large-image">
                            您的浏览器不支持视频播放
                        </video>
                    `;
                    downloadText = `<span>📥</span> 下载录像${durationText}`;
                } else {
                    mediaHtml = photo.image_url ? 
                        `<img src="${photo.image_url}" alt="照片" class="photo-detail-large-image">` : 
                        '<div class="photo-load-error">图片加载失败</div>';
                    downloadText = '<span>📥</span> 下载照片';
                }
                
                content.innerHTML = `
                    <div class="photo-detail-container">
                        <div class="photo-detail-images">
                            <div class="photo-detail-image-section active" id="original-section">
                                <div class="photo-detail-image-wrapper">
                                    ${mediaHtml}
                                </div>
                                <div class="photo-detail-actions">
                                    <a href="download_photo.php?id=${photoId}&type=original" download class="photo-download-btn">
                                        ${downloadText}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="photo-detail-info">
                            <h3>详细信息</h3>
                            <div class="detail-info-item">
                                <span class="detail-label">上传时间：</span>
                                <span class="detail-value">${formatTime}</span>
                            </div>
                            <div class="detail-info-item">
                                <span class="detail-label">上传IP：</span>
                                <span class="detail-value">${uploadIp}</span>
                            </div>
                            <div class="detail-info-item">
                                <span class="detail-label">拍摄链接码：</span>
                                <span class="detail-value">${inviteCode}</span>
                            </div>
                            <div class="detail-info-item">
                                <span class="detail-label">浏览器：</span>
                                <span class="detail-value" title="${uploadUa}">${browserInfo}</span>
                            </div>
                            <div class="detail-info-item">
                                <span class="detail-label">设备信息：</span>
                                <span class="detail-value" title="${uploadUa}">${deviceInfo}</span>
                            </div>
                            <div class="detail-info-item">
                                <span class="detail-label">标签：</span>
                                <span class="detail-value">
                                    <div class="photo-tags">${tagsHtml}</div>
                                </span>
                            </div>
                            
                            ${generateExifInfo(photo)}
                        </div>
                    </div>
                `;
            } else {
                content.innerHTML = '<div style="text-align: center; padding: 40px; color: #f00;">加载失败：' + (data.message || '未知错误') + '</div>';
            }
        })
        .catch(err => {
            console.error('获取照片详情错误:', err);
            content.innerHTML = '<div style="text-align: center; padding: 40px; color: #f00;">加载失败，请重试</div>';
        });
}

// 关闭照片详情
function closePhotoDetail() {
    const modal = document.getElementById('photoDetailModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.alignItems = '';
        modal.style.justifyContent = '';
    }
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

// 删除照片（软删除）
function deletePhoto(photoId) {
    if (!confirm('确定要删除这张照片吗？删除后无法恢复。')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('id', photoId);
    
    fetch('delete_photo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('照片已删除');
            loadPhotos(); // 重新加载照片列表
        } else {
            alert('删除失败：' + (data.message || '未知错误'));
        }
    })
    .catch(err => {
        console.error('删除照片错误:', err);
        alert('删除失败，请重试');
    });
}

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

// 加载排行榜
function loadRanking(type) {
    // 更新标签按钮状态
    document.querySelectorAll('.ranking-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        }
    });
    
    // 构建URL（月度排行榜只显示当前月，不需要传递year和month参数）
    let url = `get_ranking.php?type=${type}&limit=100`;
    
    document.getElementById('rankingList').innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading">加载中...</div></div>';
    document.getElementById('rankingInfo').innerHTML = '';
    
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
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
                renderRanking(data.data);
            } else {
                document.getElementById('rankingList').innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <p>加载失败：${data.message || '未知错误'}</p>
                    </div>
                `;
            }
        })
        .catch(err => {
            console.error('加载排行榜错误:', err);
            document.getElementById('rankingList').innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <p>加载失败，请重试</p>
                </div>
            `;
        });
}

// 渲染排行榜
function renderRanking(data) {
    const { type, ranking, user_ranking, year, month } = data;
    
    // 渲染用户排名信息
    if (user_ranking) {
        let userInfo = '';
        switch (type) {
            case 'total':
                userInfo = `我的排名：第 ${user_ranking.rank} 名 | 积分：${user_ranking.points}`;
                break;
            case 'monthly':
                userInfo = `我的排名：第 ${user_ranking.rank} 名 | 本月积分：${user_ranking.points}`;
                break;
            case 'invite':
                userInfo = `我的排名：第 ${user_ranking.rank} 名 | 邀请人数：${user_ranking.count}`;
                break;
            case 'photo':
                userInfo = `我的排名：第 ${user_ranking.rank} 名 | 照片数量：${user_ranking.count}`;
                break;
        }
        
        document.getElementById('rankingInfo').innerHTML = `
            <div style="padding: 15px; background: linear-gradient(135deg, #87CEEB 0%, #5B9BD5 100%); border-radius: 8px; margin-bottom: 20px; color: white; text-align: center; font-weight: bold;">
                ${userInfo}
            </div>
        `;
    }
    
    // 渲染排行榜列表
    if (!ranking || ranking.length === 0) {
        document.getElementById('rankingList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <p>暂无数据</p>
            </div>
        `;
        return;
    }
    
    const rankingHTML = ranking.map((item, index) => {
        const rank = index + 1;
        let medal = '';
        if (rank === 1) medal = '🥇';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';
        
        let value = '';
        let valueLabel = '';
        
        switch (type) {
            case 'total':
                value = item.points || 0;
                valueLabel = '积分';
                break;
            case 'monthly':
                value = item.monthly_points || 0;
                valueLabel = '积分';
                break;
            case 'invite':
                value = item.invite_count || 0;
                valueLabel = '人';
                break;
            case 'photo':
                value = item.photo_count || 0;
                valueLabel = '张';
                break;
        }
        
        return `
            <div class="ranking-item" style="display: flex; align-items: center; padding: 15px; background: white; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="width: 50px; text-align: center; font-size: 24px; font-weight: bold; color: ${rank <= 3 ? '#5B9BD5' : '#666'};">
                    ${medal || rank}
                </div>
                <div style="flex: 1; margin-left: 15px;">
                    <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 5px;">
                        ${escapeHtml((item.nickname && item.nickname.trim()) ? item.nickname : (item.username || '未知用户'))}
                        ${item.is_vip_active ? '<span style="margin-left: 6px; padding: 2px 8px; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #8b6914; border-radius: 4px; font-size: 12px; font-weight: bold;">VIP</span>' : ''}
                    </div>
                    ${type === 'total' ? `
                        <div style="font-size: 12px; color: #999;">
                            邀请 ${item.invite_count || 0} 人 | 照片 ${item.photo_count || 0} 张
                        </div>
                    ` : ''}
                    ${type === 'monthly' ? `
                        <div style="font-size: 12px; color: #999;">
                            获得积分次数：${item.points_count || 0} 次
                        </div>
                    ` : ''}
                    ${type === 'invite' ? `
                        <div style="font-size: 12px; color: #999;">
                            获得奖励积分：${item.total_reward_points || 0}
                        </div>
                    ` : ''}
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; min-width: 80px;">
                    <div style="font-size: 20px; font-weight: bold; color: #5B9BD5;">
                        ${value}
                    </div>
                    <div style="font-size: 12px; color: #999;">
                        ${valueLabel}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    let title = '';
    switch (type) {
        case 'total':
            title = '总积分排行榜';
            break;
        case 'monthly':
            title = `${year}年${month}月 积分排行榜`;
            break;
        case 'invite':
            title = '邀请人数排行榜';
            break;
        case 'photo':
            title = '上传照片数量排行榜';
            break;
    }
    
    document.getElementById('rankingList').innerHTML = `
        <h3 style="margin-bottom: 15px;">${title}</h3>
        ${rankingHTML}
    `;
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

// 加载登录日志
function loadLoginLogs() {
    fetch('get_login_logs.php?page=1&page_size=50')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                renderLoginLogs(data.data.list);
            } else {
                document.getElementById('loginLogsList').innerHTML = '<p style="color: #999;">加载失败</p>';
            }
        })
        .catch(err => {
            console.error('加载登录日志错误:', err);
            document.getElementById('loginLogsList').innerHTML = '<p style="color: #999;">加载失败</p>';
        });
}

// 渲染登录日志
function renderLoginLogs(logs) {
    if (!logs || logs.length === 0) {
        document.getElementById('loginLogsList').innerHTML = '<p style="color: #999;">暂无登录记录</p>';
        return;
    }
    
    const logsHTML = logs.map(log => {
        const successIcon = log.is_success == 1 ? '✓' : '✗';
        const successColor = log.is_success == 1 ? '#28a745' : '#dc3545';
        const time = log.login_time ? log.login_time.replace(/:\d{2}$/, '') : '';
        
        return `
            <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <span style="color: ${successColor}; font-weight: bold;">${successIcon}</span>
                        <span style="font-weight: bold;">${log.login_ip || '未知IP'}</span>
                    </div>
                    <div style="font-size: 12px; color: #999;">
                        ${time} ${log.fail_reason ? ' | ' + log.fail_reason : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('loginLogsList').innerHTML = logsHTML;
}

// 显示编辑邀请码模态框
function showEditInviteModal(inviteId, inviteCode, label, status) {
    const modal = document.getElementById('editInviteModal');
    document.getElementById('editInviteId').value = inviteId;
    document.getElementById('editInviteCode').value = inviteCode;
    document.getElementById('editInviteLabel').value = label || '';
    document.getElementById('editInviteStatus').checked = status == 1;
    modal.style.display = 'flex';
    modal.style.alignItems = 'flex-start';
    modal.style.justifyContent = 'center';
}

// 关闭编辑邀请码模态框
function closeEditInviteModal() {
    const modal = document.getElementById('editInviteModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.alignItems = '';
        modal.style.justifyContent = '';
    }
}

// 提交编辑邀请码
function submitEditInvite() {
    const inviteId = document.getElementById('editInviteId').value;
    const label = document.getElementById('editInviteLabel').value.trim();
    const status = document.getElementById('editInviteStatus').checked ? 1 : 0;
    
    const formData = new FormData();
    formData.append('invite_id', inviteId);
    if (label !== '') {
        formData.append('label', label);
    } else {
        formData.append('label', ''); // 空字符串表示清空标签
    }
    formData.append('status', status);
    
    fetch('update_invite.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('更新成功');
                closeEditInviteModal();
                loadInvites(); // 重新加载邀请列表
            } else {
                alert('更新失败：' + (data.message || '未知错误'));
            }
        })
        .catch(err => {
            console.error('更新邀请码错误:', err);
            alert('更新失败，请重试');
        });
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const editInviteModal = document.getElementById('editInviteModal');
    if (event.target == editInviteModal) {
        closeEditInviteModal();
    }
}

// 加载用户公告
function loadAnnouncements() {
    fetch('get_announcements.php?limit=5')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data.list && data.data.list.length > 0) {
                renderAnnouncements(data.data);
            } else {
                document.getElementById('announcementsContainer').innerHTML = '';
            }
        })
        .catch(err => {
            console.error('加载公告错误:', err);
        });
}

// 渲染用户公告
function renderAnnouncements(data) {
    const { list, unread_count } = data;
    
    const levelMap = {
        'important': { text: '重要', class: 'announcement-level-important', icon: '🔴' },
        'normal': { text: '一般', class: 'announcement-level-normal', icon: '🔵' },
        'notice': { text: '通知', class: 'announcement-level-notice', icon: '🟢' }
    };
    
    let html = '<div class="announcements-section">';
    
    list.forEach(announcement => {
        const level = levelMap[announcement.level] || levelMap['normal'];
        const isRead = announcement.is_read == 1;
        const requireRead = announcement.require_read == 1;
        const unreadClass = (!isRead && requireRead) ? 'announcement-unread' : '';
        
        html += `
            <div class="announcement-item-user ${unreadClass}" data-id="${announcement.id}">
                <div class="announcement-header-user">
                    <span class="announcement-level ${level.class}">${level.icon} ${level.text}</span>
                    <span class="announcement-title-user">${escapeHtml(announcement.title)}</span>
                    ${(!isRead && requireRead) ? '<span class="announcement-unread-badge">未读</span>' : ''}
                </div>
                <div class="announcement-content-user" data-content-type="${announcement.content_type || 'auto'}"></div>
                ${requireRead && !isRead ? 
                    `<button class="announcement-mark-read-btn" onclick="markAnnouncementRead(${announcement.id})">标记已读</button>` : 
                    ''
                }
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('announcementsContainer').innerHTML = html;
    
    // 渲染内容（支持HTML和Markdown）
    document.querySelectorAll('.announcement-content-user').forEach(async (el) => {
        const item = el.closest('.announcement-item-user');
        const announcementId = parseInt(item.getAttribute('data-id'));
        const announcement = list.find(a => a.id == announcementId);
        if (announcement && announcement.content) {
            const content = announcement.content;
            const contentType = announcement.content_type || 'auto';
            el.innerHTML = await renderContent(content, contentType);
        }
    });
}

// 标记公告为已读
function markAnnouncementRead(announcementId) {
    const formData = new FormData();
    formData.append('announcement_id', announcementId);
    
    fetch('mark_announcement_read.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 重新加载公告
                loadAnnouncements();
            } else {
                alert(data.message || '操作失败');
            }
        })
        .catch(err => {
            console.error('标记已读错误:', err);
            alert('操作失败，请重试');
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
    fetch('get_register_code.php')
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

// 页面加载时加载邀请列表和公告
loadInvites();
loadAnnouncements();

// 如果当前在照片列表页面，也加载照片列表
if (document.getElementById('photos') && document.getElementById('photos').classList.contains('active')) {
    loadPhotos();
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

