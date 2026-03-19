<script lang="ts">
  export let titulo: string;
  export let subtitulo: string;
  export let numero: string | number;
  export let oculto: number | null = null;
  export let familia: number | null = null;
  export let descripcion: string = '';
</script>

<div class="bg-white flex flex-col h-full border-solid border-[1px] border-gray-200 top-border-accent rounded-xl shadow-sm p-6 text-center transform transition-all hover:shadow-md">
  <h4 class="text-amber-600 font-medium capitalize text-lg mb-1">{titulo}</h4>
  <p class="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-4">{subtitulo}</p>
  
  
  <div class="text-2xl lg:text-3xl font-serif font-medium text-gray-900 mb-4 pb-4 border-b border-gray-100 break-words">
    {numero}
  </div>
  
  {#if oculto !== null}
    <p class="text-gray-500 text-sm font-medium mb-1">Valor oculto: {oculto}</p>
  {/if}
  {#if familia !== null}
    <p class="text-gray-900 font-bold text-sm tracking-tight mb-2">Familia numérica: {familia}</p>
  {/if}
  {#if descripcion}
    <div class="mt-auto pt-4">
      <p class="text-gray-600 text-sm leading-relaxed font-medium bg-slate-50 p-3 rounded">{descripcion}</p>
    </div>
  {/if}
</div>

<style>
  .top-border-accent {
    border-top-width: 4px;
    border-top-color: #f59e0b; /* amber-500 */
  }
</style>
