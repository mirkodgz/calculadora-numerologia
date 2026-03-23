<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  let visible = false;

  onMount(() => {
    // Revisamos si el usuario ya lo cerró en esta sesión para no molestar
    const dismissed = sessionStorage.getItem('popupOrientacionDismissed');
    
    if (!dismissed) {
      // Mostrar después de 8 segundos (8000ms)
      setTimeout(() => {
        visible = true;
      }, 8000);
    }
  });

  function closePopup() {
    visible = false;
    sessionStorage.setItem('popupOrientacionDismissed', 'true');
  }
</script>

{#if visible}
  <div 
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-[90%] sm:w-[320px] max-w-sm rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] bg-white border border-[#e6b866]/30 overflow-hidden flex flex-col"
    in:fly={{ x: 50, y: 0, duration: 800, delay: 100 }}
    out:fade={{ duration: 300 }}
  >
    <!-- Botón de Cerrar (X) -->
    <button 
      on:click={closePopup}
      class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full transition-colors z-10"
      aria-label="Cerrar popup"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <!-- Imagen de Portada -->
    <div class="w-full h-[180px] sm:h-[220px] bg-[#FCFBF9] relative overflow-hidden border-b border-[#e6b866]/10">
      <img 
        src="https://assets.cdn.filesafe.space/CabgvOcQpufVilP7BGnj/media/69bd746af40bbb652567dd2f.png" 
        alt="Sesión de Orientación 1 a 1" 
        class="w-full h-full object-cover"
      />
      <!-- Gradiente sutil para que el botón de cerrar se vea bien -->
      <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
    </div>

    <!-- Contenido -->
    <div class="p-5 flex flex-col gap-3 relative">
      <h4 class="text-[1.15rem] leading-snug font-serif text-slate-800">
        ¿Te gustaría profundizar en tus resultados?
      </h4>
      <p class="text-[13.5px] text-slate-500 font-sans leading-relaxed">
        Descubre cómo avanzar en tu proceso con una <strong class="text-[#B11252]">Sesión de Orientación Privada y 100% Gratuita</strong> de 15 minutos.
      </p>
      
      <a 
        href="/agenda-sesion-orientacion"
        class="mt-1 w-full text-center bg-[#B11252] hover:bg-[#800b39] text-white font-medium text-[14px] tracking-wide py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        👉 Agendar Mi Sesión
      </a>
      
      <button 
        on:click={closePopup}
        class="text-[12px] text-slate-400 hover:text-slate-600 transition-colors text-center mt-1 underline decoration-slate-300"
      >
        No por ahora, gracias
      </button>
    </div>
  </div>
{/if}
