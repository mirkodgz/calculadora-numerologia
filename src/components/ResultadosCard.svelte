<script lang="ts">
  export let titulo: string;
  export let numero: string | number;
  export let descripcion: string;
  export let icono: string = "✨";
</script>

<div class="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-center p-8 flex flex-col items-center transform hover:-translate-y-1">
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  
  <div class="text-4xl mb-4 opacity-80">{icono}</div>
  
  <h3 class="text-gray-500 font-medium text-sm tracking-widest uppercase mb-2">{titulo}</h3>
  
  <div class="text-5xl font-serif font-medium text-gray-900 mb-6 drop-shadow-sm">
    {numero}
  </div>
  
  <p class="text-gray-600 text-sm leading-relaxed font-medium mt-auto">
    {descripcion}
  </p>
</div>
