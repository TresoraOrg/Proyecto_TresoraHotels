
// Estado inicial de la funcionalidad de voz
let isVoiceEnabled = false;
let lastSpokenElement = null; // Almacena el último elemento leído para evitar repeticiones

// Referencia al botón de activación/desactivación
const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');

// Crear una instancia de SpeechSynthesis
const synth = window.speechSynthesis;

// Función para leer texto en voz alta
function speak(text) {
    if (isVoiceEnabled && text) {
        // Cancelar cualquier síntesis de voz previa
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Configurar idioma a español
        utterance.rate = 1; // Velocidad de la voz
        utterance.pitch = 1; // Tono de la voz
        synth.speak(utterance);
    }
}

// Función para obtener el texto a leer de un elemento
function getElementText(element) {
    // Priorizar aria-label, luego textContent, luego title
    return (
        element.getAttribute('aria-label') ||
        element.textContent.trim() || element.getAttribute('title')
        //  ||'Elemento sin descripción'
    );
}

// Seleccionar todos los elementos que tienen aria-label
const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');

// También incluir botones y enlaces que podrían no tener aria-label
const buttons = document.querySelectorAll('button, a.btn');

// Combinar ambas selecciones y eliminar duplicados
const allElements = new Set([...elementsWithAriaLabel, ...buttons]);

// Añadir evento mouseenter a cada elemento
allElements.forEach(element => {
    const handleSpeak = () => {
        if (isVoiceEnabled) {
            const text = getElementText(element);
            if (lastSpokenElement !== element) {
                speak(text);
                lastSpokenElement = element;
            }
        }
    };

    element.addEventListener('mouseenter', handleSpeak);
    element.addEventListener('focus', handleSpeak); // <- Tabulador

    const clearSpoken = () => {
        lastSpokenElement = null;
    };

    element.addEventListener('mouseleave', clearSpoken);
    element.addEventListener('blur', clearSpoken); // <- Cuando pierde el foco
});


// Función para agregar eventos a nuevos elementos (útil para contenido dinámico)
function addVoiceEventsToNewElements() {
    const newElementsWithAriaLabel = document.querySelectorAll('[aria-label]:not([data-voice-enabled])');
    const newButtons = document.querySelectorAll('button:not([data-voice-enabled]), a.btn:not([data-voice-enabled])');

    const newElements = new Set([...newElementsWithAriaLabel, ...newButtons]);

    newElements.forEach(element => {
        // Marcar como procesado
        element.setAttribute('data-voice-enabled', 'true');

        element.addEventListener('mouseenter', () => {
            if (isVoiceEnabled) {
                const text = getElementText(element);
                if (lastSpokenElement !== element) {
                    speak(text);
                    lastSpokenElement = element;
                }
            }
        });

        element.addEventListener('mouseleave', () => {
            lastSpokenElement = null;
        });
    });
}

// Observador de mutaciones para detectar elementos añadidos dinámicamente
const observer = new MutationObserver((mutations) => {
    let shouldCheckForNewElements = false;

    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldCheckForNewElements = true;
        }
    });

    if (shouldCheckForNewElements) {
        addVoiceEventsToNewElements();
    }
});

// Iniciar la observación del DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Manejar el botón de activar/desactivar voz
toggleVoiceBtn.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    toggleVoiceBtn.setAttribute('aria-checked', isVoiceEnabled);
    toggleVoiceBtn.classList.toggle('active', isVoiceEnabled);
    toggleVoiceBtn.setAttribute('aria-label', isVoiceEnabled ? 'Desactivar lectura en voz alta' : 'Activar lectura en voz alta');
    toggleVoiceBtn.title = isVoiceEnabled ? 'Desactivar lectura en voz alta' : 'Activar lectura en voz alta';

    // Cambiar el icono según el estado
    toggleVoiceBtn.innerHTML = isVoiceEnabled
        ? '<i class="bi bi-volume-up-fill"></i>'
        : '<i class="bi bi-volume-mute"></i>';

    // Cancelar cualquier síntesis previa antes de anunciar el cambio de estado
    synth.cancel();
    speak(isVoiceEnabled ? 'Lectura en voz alta activada' : 'Lectura en voz alta desactivada');
});

// Ejecutar una vez al cargar para elementos añadidos dinámicamente
document.addEventListener('DOMContentLoaded', () => {
    addVoiceEventsToNewElements();
});