// 添加背景图片
document.body.style.backgroundImage = "url('./static/image/bg.jpg')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";

const buttons = document.querySelectorAll(".btn");
buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        // 停止所有正在播放的音频
        document.querySelectorAll('.media-audio').forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // 播放选中的音频
        const audioId = `Jaudio${index}`;
        audioAutoPlay(audioId);
        
        // 显示加载文本
        document.getElementById("overlay").innerHTML =
            '<div class="text-loading">祝福加载中...</div>';
            
        // 延迟移除 overlay
        setTimeout(() => {
            const overlay = document.getElementById("overlay");
            if (overlay) {
                overlay.style.display = 'none';
                document.querySelector('.puzzle-box').style.visibility = 'visible';
            }
        }, 1000);
    });
});

function audioAutoPlay(id) {
    var audio_tag = document.getElementById(id);
    if (!audio_tag) return;
    
    var play = function(){
        audio_tag.play();
        document.removeEventListener("touchstart", play, false);
    };
    
    audio_tag.play();
    
    document.addEventListener("WeixinJSBridgeReady", play, false);
    document.addEventListener('YixinJSBridgeReady', play, false);
    document.addEventListener("touchstart", play, false);
}