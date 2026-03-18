<script lang="ts">
  export let titulo: string;
  export let subtitulo: string;
  export let numero: string | number;
  export let oculto: number | null = null;
</script>

<div class="bg-white border top-border-accent rounded-xl shadow-sm p-6 text-center transform transition-all hover:shadow-md">
  <h4 class="text-amber-600 font-medium capitalize text-lg mb-1">{titulo}</h4>
  <p class="text-gray-500 text-xs font-semibold tracking-wider uppercase mb-4">{subtitulo}</p>
  
  <div class="text-4xl font-serif font-medium text-gray-900 mb-4 pb-4 border-b border-gray-100">
    {numero}
  </div>
  
  {#if oculto !== null}
    <p class="text-gray-500 text-sm font-medium">Valor oculto: {oculto}</p>
  {/if}
</div>

<style>
  .top-border-accent {
    border-top-width: 4px;
    border-top-color: #f59e0b; /* amber-500 */
  }
</style>
