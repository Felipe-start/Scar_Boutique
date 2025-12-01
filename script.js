// Variables globales
let musicPlaying = false;
let bellsPlayed = false;
let videoEnded = false;
let userName = "";
let isMobile = window.innerWidth <= 768;

// Detectar cambio de tamaño
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("Scar Boutique - Carta Navideña cargada");
    console.log("Dispositivo móvil:", isMobile);
    
    // Configurar eventos
    setupEventListeners();
    
    // Iniciar el contador regresivo
    startCountdown();
    
    // Configurar video para que se reproduzca correctamente
    setupVideo();
    
    // Configurar handling de errores de archivos multimedia
    setupMediaErrorHandling();
});

// Setup de handling de errores multimedia
function setupMediaErrorHandling() {
    const audioElements = document.querySelectorAll('audio, video');
    audioElements.forEach(element => {
        element.addEventListener('error', (e) => {
            console.warn(`Error cargando multimedia:`, element.src || element.children[0]?.src, e.error);
        });
        
        // Agregar timeouts para archivos que tarden mucho
        setTimeout(() => {
            if (element.readyState < 2) {
                console.warn(`Timeout cargando: ${element.id}`);
            }
        }, 5000);
    });
}

// Configurar el video/GIF
function setupVideo() {
    const videoPlayer = document.getElementById('videoPlayer');
    if (!videoPlayer) return;
    
    // Usar un timeout para simular la duración del GIF (14 segundos)
    const gifDuration = 14000; // 14 segundos en milisegundos
    
    setTimeout(() => {
        console.log("GIF terminado (simulado)");
        videoEnded = true;
        if (userName) {
            startMainExperience();
        }
    }, gifDuration);
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para comenzar la experiencia
    const startBtn = document.getElementById('startExperience');
    if (startBtn) {
        startBtn.addEventListener('click', startExperience);
    }
    
    // Botón para abrir/cerrar la carta
    const openCardBtn = document.getElementById('openCardBtn');
    if (openCardBtn) {
        openCardBtn.addEventListener('click', toggleCard);
    }
    
    // Botón para ver oferta
    const viewOfferBtn = document.getElementById('viewOfferBtn');
    if (viewOfferBtn) {
        viewOfferBtn.addEventListener('click', showSpecialOffer);
    }
    
    // Permitir enviar el formulario con Enter
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        userNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startExperience();
            }
        });
        
        // Enfocar el input automáticamente
        userNameInput.focus();
    }
}

// Comenzar la experiencia
function startExperience() {
    const userNameInput = document.getElementById('userName');
    if (!userNameInput) return;
    
    userName = userNameInput.value.trim();
    
    // Validar que se haya ingresado un nombre
    if (!userName) {
        alert('Por favor, ingresa tu nombre para personalizar tu experiencia navideña.');
        userNameInput.focus();
        return;
    }
    
    // Personalizar el saludo en el video
    const greetingName = document.getElementById('greetingName');
    if (greetingName) {
        greetingName.textContent = `¡Hola ${userName}!`;
    }
    
    // Ocultar pantalla de bienvenida
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Mostrar video/GIF
    const introVideo = document.getElementById('introVideo');
    if (introVideo) {
        introVideo.style.display = 'block';
    }
    
    // Reproducir audio
    const bells = document.getElementById('bellsSound');
    
    if (bells) {
        const playPromise = bells.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                bellsPlayed = true;
                console.log("Campanitas reproduciéndose");
            }).catch(e => {
                console.warn("No se pudo reproducir campanitas:", e.message);
            });
        }
    }
    
    // Timeout de respaldo (18 segundos para GIF de 14s + margen)
    setTimeout(() => {
        if (!videoEnded) {
            console.log("Timeout alcanzado, continuando...");
            handleVideoError();
        }
    }, 18000);
}

// Manejar error del video
function handleVideoError() {
    videoEnded = true;
    const introVideo = document.getElementById('introVideo');
    if (introVideo) {
        introVideo.style.display = 'none';
    }
    startMainExperience();
}

// Iniciar la experiencia principal después del video
function startMainExperience() {
    console.log("Iniciando experiencia principal para:", userName);
    
    // Ocultar video si aún está visible
    const introVideo = document.getElementById('introVideo');
    if (introVideo && introVideo.style.display !== 'none') {
        introVideo.style.display = 'none';
    }
    
    // Mostrar cortinas primero
    const curtains = document.getElementById('curtains');
    if (curtains) {
        curtains.style.display = 'block';
        
        // Abrir cortinas después de un breve momento
        setTimeout(() => {
            curtains.classList.add('open');
            console.log("Cortinas abiertas");
            
            // Después de que las cortinas se abran, mostrar el contenido
            setTimeout(() => {
                showMainContent();
            }, 2500); // Tiempo para que las cortinas se abran completamente
        }, 500);
    } else {
        // Si no hay cortinas, mostrar contenido directamente
        showMainContent();
    }
}

// Mostrar contenido principal
function showMainContent() {
    // Personalizar todos los elementos con el nombre del usuario
    personalizeExperience();
    
    // Mostrar contenido principal
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
        // Forzar reflow
        mainContent.offsetHeight;
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 100);
    }
    
    // En mobile, reducir animaciones pesadas
    if (!isMobile) {
        createShootingStars();
    }
    
    // Iniciar música navideña automáticamente (con fallback para autoplay policy)
    const music = document.getElementById('christmasMusic');
    if (music) {
        music.volume = 0.5; // Volumen reducido
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                activateMusicVisualizer();
                console.log("Música navideña reproduciéndose");
            }).catch(e => {
                console.log("No se pudo reproducir música automáticamente:", e.message);
                // Permitir que el usuario inicie la música con un click
                document.addEventListener('click', function playMusicOnUserInteraction() {
                    if (!musicPlaying) {
                        music.play().then(() => {
                            musicPlaying = true;
                            activateMusicVisualizer();
                            console.log("Música iniciada por usuario");
                        }).catch(err => {
                            console.warn("No se pudo reproducir música:", err.message);
                        });
                        document.removeEventListener('click', playMusicOnUserInteraction);
                    }
                }, { once: true });
            });
        }
    }
}

// Personalizar la experiencia con el nombre del usuario
function personalizeExperience() {
    if (!userName) return;
    
    console.log("Personalizando experiencia para:", userName);
    
    // Personalizar la carta
    const personalizedName = document.getElementById('personalizedName');
    if (personalizedName) {
        personalizedName.textContent = userName;
    }
    
    // Personalizar la oferta
    const offerName = document.getElementById('offerName');
    if (offerName) {
        offerName.textContent = userName;
    }
    
    const exclusiveName = document.getElementById('exclusiveName');
    if (exclusiveName) {
        exclusiveName.textContent = userName;
    }
    
    // Personalizar contacto
    const contactName = document.getElementById('contactName');
    if (contactName) {
        contactName.textContent = userName;
    }
}

// Alternar entre abrir y cerrar la carta
function toggleCard() {
    const card = document.getElementById('christmasCard');
    const button = document.getElementById('openCardBtn');
    
    if (!card || !button) return;
    
    if (!card.classList.contains('open')) {
        // Abrir la carta
        card.classList.add('open');
        button.textContent = 'Cerrar Carta';
        console.log("Carta abierta");
        
        // Detener campanitas y continuar música navideña
        if (bellsPlayed) {
            const bells = document.getElementById('bellsSound');
            if (bells) {
                bells.pause();
                bells.currentTime = 0;
            }
        }
        
        // Crear más estrellas fugaces durante la apertura
        createShootingStars();
    } else {
        // Cerrar la carta
        card.classList.remove('open');
        button.textContent = 'Abrir Carta';
        console.log("Carta cerrada");
    }
}

// Mostrar oferta especial
function showSpecialOffer() {
    const specialOffer = document.getElementById('specialOffer');
    if (specialOffer) {
        specialOffer.style.display = 'block';
        createConfetti();
        console.log("Oferta especial mostrada");
        
        // Desplazar suavemente hacia la oferta
        specialOffer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Cerrar la carta automáticamente
        const card = document.getElementById('christmasCard');
        const button = document.getElementById('openCardBtn');
        if (card && button) {
            card.classList.remove('open');
            button.textContent = 'Abrir Carta';
        }
    }
}

// Activar visualizador de música
function activateMusicVisualizer() {
    const waveMenu = document.querySelector('.wave-menu');
    if (waveMenu) {
        waveMenu.style.display = 'flex';
        
        // Reiniciar animaciones
        const bars = waveMenu.querySelectorAll('li');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
        
        console.log("Visualizador de música activado");
    }
}

// Crear estrellas fugaces
function createShootingStars() {
    const container = document.querySelector('.shooting-stars');
    if (!container) return;
    
    // Crear 2-3 estrellas fugaces adicionales
    const starCount = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Posición aleatoria
        const top = Math.random() * 80 + 10; // 10% to 90%
        const width = 80 + Math.random() * 80; // 80px to 160px
        const height = 1 + Math.random(); // 1px to 2px
        const duration = 5 + Math.random() * 7; // 5s to 12s
        const delay = Math.random() * 5; // 0s to 5s
        
        star.style.width = `${width}px`;
        star.style.height = `${height}px`;
        star.style.top = `${top}%`;
        star.style.animation = `shootingStar ${duration}s linear infinite ${delay}s`;
        
        container.appendChild(star);
        
        // Eliminar la estrella después de que termine la animación
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, (duration + delay) * 1000);
    }
}

// Iniciar contador regresivo
function startCountdown() {
    // Establecer la fecha de finalización de la oferta (10 días desde ahora)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 10);
    countDownDate.setHours(23, 59, 59, 999); // Fin del día
    
    console.log("Contador regresivo iniciado. Finaliza:", countDownDate);
    
    // Actualizar el contador cada segundo
    const countdownFunction = setInterval(function() {
        // Obtener fecha y hora actual
        const now = new Date().getTime();
        
        // Calcular la diferencia entre ahora y la fecha de finalización
        const distance = countDownDate - now;
        
        // Cálculos de tiempo para días, horas, minutos y segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Mostrar el resultado en los elementos correspondientes
        updateElementText("days", formatTime(days));
        updateElementText("hours", formatTime(hours));
        updateElementText("minutes", formatTime(minutes));
        updateElementText("seconds", formatTime(seconds));
        
        // Si el contador llega a cero, detenerlo
        if (distance < 0) {
            clearInterval(countdownFunction);
            updateElementText("days", "00");
            updateElementText("hours", "00");
            updateElementText("minutes", "00");
            updateElementText("seconds", "00");
            console.log("Contador regresivo finalizado");
        }
    }, 1000);
}

// Función auxiliar para actualizar texto de elementos de forma segura
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Formatear el tiempo para mostrar siempre dos dígitos
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

// Efecto de confeti al hacer clic en el cupón
document.addEventListener('DOMContentLoaded', function() {
    const coupon = document.querySelector('.discount-coupon');
    
    if (coupon) {
        coupon.addEventListener('click', function() {
            createConfetti();
        });
    }
});

// Crear efecto de confeti navideño
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#4CAF50', '#81C784', '#A5D6A7', '#C62828', '#EF5350', '#FFA726', '#FFF176', '#29B6F6'];
    const symbols = ['❄', '🎄', '🎅', '🦌', '⭐', '🔔', '🎁', '❅'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.fontSize = Math.random() * 20 + 10 + 'px';
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '-30px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        confettiContainer.appendChild(confetti);
        
        // Animación del confeti
        const animation = confetti.animate([
            { top: '-30px', transform: `rotate(0deg)` },
            { top: '100vh', transform: `rotate(${Math.random() * 720}deg)` }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.2, 0.8, 0.9)'
        });
        
        // Eliminar el confeti después de la animación
        animation.onfinish = () => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        };
    }
    
    // Eliminar el contenedor después de que termine la animación
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 5000);
}

// Función global para abrir Instagram
function openInstagram() {
    window.open('https://www.instagram.com/scar___boutique?igsh=MWIzMzk2NTVuN3c0cA==', '_blank');
}

// Función global para abrir TikTok
function openTikTok() {
    window.open('https://www.tiktok.com/@scar____boutique?_r=1&_t=ZS-91qHtTPlzl6', '_blank');
}

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('Error no capturado:', e.error);
});