// 3D 卡片交互效果 for .text-section-bg（降低强度）
document.querySelectorAll('.text-section-bg').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5; // 降低强度
        const rotateY = ((x - centerX) / centerX) * 6; // 降低强度
        card.style.setProperty('--rotateX', `${-rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
    });
    card.addEventListener('mouseleave', function() {
        card.style.setProperty('--rotateX', '0deg');
        card.style.setProperty('--rotateY', '0deg');
    });
});
// 3D 卡片交互效果 for ul li（降低强度）
document.querySelectorAll('.decorated-future-text ul').forEach(ul => {
    ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('mousemove', function(e) {
            const rect = li.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 5; // 降低强度
            const rotateY = ((x - centerX) / centerX) * 6; // 降低强度
            li.style.setProperty('--rotateX', `${-rotateX}deg`);
            li.style.setProperty('--rotateY', `${rotateY}deg`);
        });
        li.addEventListener('mouseleave', function() {
            li.style.setProperty('--rotateX', '0deg');
            li.style.setProperty('--rotateY', '0deg');
        });
    });
});
// 鼠标悬停显示图片
document.querySelectorAll('#acrylic-board-design li, #function-explanation li').forEach(li => {
    li.addEventListener('mouseenter', function(e) {
        const imgSrc = li.getAttribute('data-img');
        if (!imgSrc) return;
        let img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '预览图';
        img.className = 'hover-preview-img';
        img.style.position = 'fixed';
        img.style.pointerEvents = 'none';
        img.style.zIndex = 9999;
        img.style.maxWidth = '220px';
        img.style.maxHeight = '180px';
        img.style.border = '2px solid #4ecdc4';
        img.style.borderRadius = '10px';
        img.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
        document.body.appendChild(img);
        function moveImg(ev) {
            img.style.left = (ev.clientX + 18) + 'px';
            img.style.top = (ev.clientY - 10) + 'px';
        }
        moveImg(e);
        // 动画触发
        setTimeout(() => img.classList.add('show'), 10);
        li._moveImgHandler = moveImg;
        li._imgEl = img;
        li.addEventListener('mousemove', moveImg);
    });
    li.addEventListener('mouseleave', function() {
        if (li._imgEl) {
            // 动画消失
            li._imgEl.classList.remove('show');
            setTimeout(() => {
                if (li._imgEl && li._imgEl.parentNode) {
                    document.body.removeChild(li._imgEl);
                }
            }, 200);
            li.removeEventListener('mousemove', li._moveImgHandler);
            li._imgEl = null;
            li._moveImgHandler = null;
        }
    });
});