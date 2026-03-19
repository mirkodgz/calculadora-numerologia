<script lang="ts">
  import { fade, slide, fly, scale } from 'svelte/transition';
  import confetti from 'canvas-confetti';
  
  let nombre = '';
  let apellido = '';
  let segundo_apellido = '';
  let fecha_nacimiento = '';
  let email = '';
  let idioma = 'castellano';
  let aceptoPoliticas = false;

  let loading = false;
  let success = false;
  let errorMsg = '';
  let showLoadingScreen = false;
  let loadingProgress = 0;
  
  // Custom focus states
  let activeField = '';

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!aceptoPoliticas) {
      errorMsg = "Debes aceptar los términos y el envío del correo para recibir tu cálculo.";
      return;
    }
    
    loading = true;
    showLoadingScreen = true;
    loadingProgress = 0;
    errorMsg = '';
    
    // Generar un tiempo de carga aleatorio entre 8 y 17 segundos (en milisegundos)
    // Esto da la sensación de un cálculo complejo auténtico que varía según la persona.
    const MIN_LOADING_TIME = Math.floor(Math.random() * (17000 - 8000 + 1)) + 8000;
    const startTime = Date.now();
    
    // Simulate thinking progress as a function of time
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const targetProgress = Math.min(99, Math.floor((elapsed / MIN_LOADING_TIME) * 100));
      // Give it slightly random chunky updates for realism
      if (Math.random() > 0.2) {
        loadingProgress = Math.max(loadingProgress, targetProgress);
      }
    }, 250);
    
    try {
      const fetchPromise = fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, apellido, segundo_apellido, fecha_nacimiento, email, idioma
        })
      });

      const delayPromise = new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));
      
      const [response] = await Promise.all([fetchPromise, delayPromise]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado');
      }

      // Finish progress and show success
      clearInterval(progressInterval);
      loadingProgress = 100;
      
      setTimeout(() => {
        showLoadingScreen = false;
        success = true;
        // Lanzar lluvia de confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e6b866', '#B11252', '#f4d393', '#ffffff']
        });
      }, 600);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      showLoadingScreen = false;
      errorMsg = error.message;
    } finally {
      loading = false;
    }
  };
</script>

<div class="relative max-w-2xl mx-auto mt-[-80px] z-20" in:fly={{ y: 50, duration: 1000, delay: 200 }}>
  <!-- Premium Glass Container -->
  <div class="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden px-3 py-6 sm:p-12 relative group transition-all duration-500 hover:shadow-[0_30px_60px_rgba(177,18,82,0.1)]">
    
    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e6b866]/10 to-transparent rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>

    <h2 class="text-3xl sm:text-4xl font-serif text-center text-slate-900 mb-3 tracking-tight">Calculadora Cabalística</h2>
    <p class="text-center text-slate-500 mb-10 font-sans font-medium">Completa tus datos sagrados originales para iniciar.</p>

    {#if success}
      <div class="bg-[#FCFBF9] border border-[#e6b866]/30 px-6 py-10 sm:p-12 rounded-2xl text-center" in:scale={{ duration: 400, opacity: 0, start: 0.9 }}>
        <h3 class="text-3xl font-serif text-slate-800 mb-6">¡Cálculo Finalizado!</h3>
        <p class="text-slate-600 font-sans font-medium text-lg leading-relaxed max-w-lg mx-auto mb-4">
          Por motivos de estricta privacidad y confirmación de identidad, hemos enviado tu <strong class="text-[#B11252]">Link de Acceso Sensible</strong> directamente a tu correo electrónico.
        </p>
        <p class="text-slate-500 font-sans text-base leading-relaxed max-w-lg mx-auto mb-8">
          Por favor, revisa tu bandeja principal (o la de correos no deseados/spam) para confirmar tu correo y poder acceder inmediatamente a los resultados de tu mapa numerológico.
        </p>
        
        <div class="py-3 px-6 bg-white border border-slate-100 rounded-lg inline-flex items-center gap-3 font-medium text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-lg border-b-2 border-b-[#B11252]/20">
          <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {email}
        </div>
      </div>
    {:else if showLoadingScreen}
      <div class="py-12 px-6 sm:px-12 text-center space-y-8 min-h-[400px] flex flex-col items-center justify-center" in:fade={{ duration: 300 }}>
        <div class="relative w-28 h-28 mx-auto">
          <!-- spinner central -->
          <div class="absolute inset-0 bg-[#e6b866]/30 rounded-full animate-ping"></div>
          <div class="absolute inset-0 border-t-4 border-[#B11252] rounded-full animate-spin"></div>
          <div class="absolute inset-2 border-r-4 border-[#e6b866] rounded-full animate-[spin_2s_reverse_infinite]"></div>
          <div class="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
            <span class="text-[#B11252] font-serif text-3xl font-bold">{loadingProgress}%</span>
          </div>
        </div>
        
        <div class="space-y-2">
          <h3 class="text-2xl font-serif text-slate-800 animate-pulse">Descodificando tus números...</h3>
          <p class="text-slate-500 text-sm italic font-medium">Conectando con la vibración de tu linaje...</p>
        </div>
        
        <div class="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
          <div class="bg-linear-to-r from-[#e6b866] via-[#f4d393] to-[#B11252] h-3 rounded-full transition-all duration-300 ease-out" style="width: {loadingProgress}%"></div>
        </div>
      </div>
    {:else}
      <form on:submit={handleSubmit} class="space-y-6 relative" out:fade={{ duration: 300 }}>
        
        {#if errorMsg}
          <div class="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 shadow-sm flex items-center gap-3" transition:slide>
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            <span class="font-medium">{errorMsg}</span>
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-3 sm:gap-6">
          <div class="relative group col-span-2 sm:col-span-1">
            <label for="nombre" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Nombre Exacto</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e6b866] transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <input type="text" id="nombre" bind:value={nombre} required class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-[15px] placeholder:text-[14px] sm:text-base sm:placeholder:text-[15px] text-slate-800 placeholder-slate-400 shadow-sm" placeholder="Primeros nombres">
            </div>
          </div>
          
          <div class="relative group col-span-1">
            <label for="apellido" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Primer Apellido</label>
            <div class="relative">
              <input type="text" id="apellido" bind:value={apellido} required class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-[15px] placeholder:text-[14px] sm:text-base sm:placeholder:text-[15px] text-slate-800 placeholder-slate-400 shadow-sm" placeholder="Apellido paterno">
            </div>
          </div>

          <div class="relative group col-span-1">
            <label for="segundo_apellido" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Segundo Apellido</label>
            <input type="text" id="segundo_apellido" bind:value={segundo_apellido} class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-[15px] placeholder:text-[14px] sm:text-base sm:placeholder:text-[15px] text-slate-800 placeholder-slate-400 shadow-sm" placeholder="Opcional">
          </div>
          
          <div class="relative group col-span-2 sm:col-span-1">
            <label for="fecha_nacimiento" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Fecha de Nacimiento</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e6b866] transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <input type="date" id="fecha_nacimiento" bind:value={fecha_nacimiento} required class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-slate-800 shadow-sm" max={new Date().toISOString().split("T")[0]}>
            </div>
          </div>
        </div>

        <div class="relative group">
          <label for="email" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Correo (Para Resultados)</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e6b866] transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <input type="email" id="email" bind:value={email} required class="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-[15px] placeholder:text-[14px] sm:text-base sm:placeholder:text-[15px] text-slate-800 placeholder-slate-400 text-slate-800 placeholder-slate-400 shadow-sm" placeholder="correo@ejemplo.com">
          </div>
        </div>

        <div class="relative group">
          <label for="idioma" class="block text-[9px] sm:text-[11px] font-bold text-[#B11252] uppercase tracking-widest mb-2 ml-1">Idioma Materno Original</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#e6b866] transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            </div>
            <select id="idioma" bind:value={idioma} class="appearance-none w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-3 sm:py-4 bg-white rounded-[1rem] border border-[#c15f3c] shadow-sm outline-none transition-all duration-300 focus:bg-white focus:border-[#B11252]/50 focus:ring-4 focus:ring-[#B11252]/10 text-[15px] sm:text-base text-slate-800 cursor-pointer shadow-sm">
              <option value="castellano">Castellano (Español)</option>
              <option value="ingles">Inglés</option>
              <option value="euskera">Euskera</option>
              <option value="gallego">Gallego</option>
              <option value="italiano">Italiano</option>
              <option value="aleman">Alemán</option>
              <option value="frances">Francés</option>
              <option value="catalan">Catalán</option>
              <option value="portugues">Portugués</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-focus-within:text-[#B11252]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-2 ml-1 italic">El idioma natal de tu madre es determinante para el cálculo de tu sonido base.</p>
        </div>

        <!-- Checkbox Mixto -->
        <div class="flex items-start gap-3 mt-6 mb-4 px-1">
          <div class="flex items-center h-5">
            <input 
              id="politicas" 
              type="checkbox" 
              bind:checked={aceptoPoliticas}
              class="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#B11252] focus:ring-[#B11252] focus:ring-offset-1 focus:ring-2 bg-slate-50 cursor-pointer transition-colors"
              required
            >
          </div>
          <div class="text-[11px] sm:text-xs text-slate-500 font-sans leading-relaxed">
            <label for="politicas" class="cursor-pointer">
              He leído y acepto la <a href="https://sabiduriadealma.com/politica-de-privacidad/" target="_blank" rel="noopener noreferrer" class="text-[#B11252] hover:text-[#800b39] hover:underline font-medium transition-colors">política de privacidad</a>, y consiento el uso de mis datos para enviarme este cálculo y futuras comunicaciones de crecimiento espiritual alineadas.
            </label>
          </div>
        </div>

        <div class="pt-4 pb-2">
          <button type="submit" disabled={loading} class="w-full relative overflow-hidden group bg-[#a61c47] hover:bg-[#851639] text-white font-medium tracking-wide text-lg py-4 px-6 rounded-[1rem] transition-all duration-300 disabled:opacity-70 flex justify-center items-center shadow-[0_8px_20px_rgba(166,28,71,0.3)] hover:shadow-[0_12px_25px_rgba(166,28,71,0.5)] transform hover:-translate-y-0.5">
            
            {#if loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white/90" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculando...
            {:else}
              Revelar Mi Mapa Cabalístico
            {/if}
          </button>
        </div>
      </form>
    {/if}
  </div>
</div>

<style>
  @keyframes shine {
    100% { transform: translateX(100%) skew(-12deg); }
  }
</style>
