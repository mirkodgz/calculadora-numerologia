<script lang="ts">
  let openIndex: number | null = 0;

  const faqs = [
    {
      question: '¿Qué nombre debo utilizar?',
      answer: 'Debes escribir tu nombre completo exactamente como aparece en tu partida de nacimiento original, incluso si hoy utilizas otro distinto. Ese primer nombre carga la vibración con la que decidiste encarnar.'
    },
    {
      question: '¿Uso mis dos apellidos?',
      answer: 'Sí. Utiliza los apellidos que figuren en tu documento original. Si solo tienes uno, deja el segundo espacio en blanco. Si eres mujer casada, utiliza tus apellidos de soltera.'
    },
    {
      question: '¿Qué pasa si mi nombre o apellido tiene acentos o la letra Ñ?',
      answer: 'Escríbelos con total normalidad. Nuestra calculadora cabalística está programada para interpretar los caracteres especiales según la lengua en la que fuiste registrado al nacer y analizará tu energía de manera perfecta.'
    }
  ];

  function toggle(index: number) {
    if (openIndex === index) {
      openIndex = null;
    } else {
      openIndex = index;
    }
  }
</script>

<div class="w-full max-w-3xl mx-auto my-12 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300">
  <div class="bg-gradient-to-r from-slate-50/50 to-white px-8 md:px-10 py-10 border-b border-slate-100/80 text-left">
    <div class="flex items-center gap-3 mb-3">
      <div class="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg>
      </div>
      <h2 class="text-2xl md:text-3xl font-serif font-medium text-slate-800 tracking-tight">Instrucciones de Uso</h2>
    </div>
    <p class="text-slate-500 font-medium text-sm md:text-base ml-[52px]">Lee atentamente antes de generar tu mapa</p>
  </div>
  
  <div class="divide-y divide-slate-100/80">
    {#each faqs as faq, i}
      <div class="bg-white group">
        <button 
          class="w-full px-8 md:px-10 py-6 flex justify-between items-center text-left focus:outline-none hover:bg-slate-50/50 transition-colors duration-200"
          on:click={() => toggle(i)}
          aria-expanded={openIndex === i}
        >
          <span class="font-sans font-medium text-[17px] text-slate-700 group-hover:text-brand-primary transition-colors pr-4">{faq.question}</span>
          <span class="flex-shrink-0 text-brand-secondary transform transition-all duration-300" class:rotate-180={openIndex === i} class:text-brand-primary={openIndex === i}>
            <div class="bg-brand-secondary/10 p-2 rounded-full group-hover:bg-brand-secondary/20 transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </span>
        </button>
        
        {#if openIndex === i}
          <div class="px-8 md:px-10 pb-8 pt-1 text-slate-600 font-sans font-medium text-[15px] md:text-base leading-relaxed text-left animate-fade-in relative">
            <div class="absolute left-8 top-1 bottom-8 w-[3px] bg-brand-primary/20 rounded-full hidden md:block"></div>
            <div class="md:pl-6">
              {faq.answer}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
