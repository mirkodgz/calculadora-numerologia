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

<div class="w-full max-w-3xl mx-auto my-12 bg-white rounded-2xl shadow-sm border border-[#e6b866]/20 overflow-hidden">
  <div class="bg-[#FCFBF9] px-6 py-8 border-b border-[#e6b866]/20 text-center">
    <h2 class="text-2xl font-serif text-[#333333] mb-2">Instrucciones de Uso</h2>
    <p class="text-slate-500 font-medium text-sm">Lee atentamente antes de generar tu mapa</p>
  </div>
  
  <div class="divide-y divide-gray-100">
    {#each faqs as faq, i}
      <div class="bg-white">
        <button 
          class="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none hover:bg-slate-50 transition-colors"
          on:click={() => toggle(i)}
          aria-expanded={openIndex === i}
        >
          <span class="font-medium text-[#333333]">{faq.question}</span>
          <span class="ml-6 flex-shrink-0 text-[#B11252] transform transition-transform duration-200" class:rotate-180={openIndex === i}>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {#if openIndex === i}
          <div class="px-6 pb-5 pt-1 text-slate-600 font-medium leading-relaxed animate-fade-in bg-slate-50/50">
            {faq.answer}
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
