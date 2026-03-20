<script lang="ts">
  export let data: any = null;
  export let nombre: string = '';

  let isExporting = false;

  $: cleanName = nombre ? nombre.trim().replace(/\s+/g, '_') : 'Resultados';
  $: filename = `${cleanName}_Mapa_Cabalistico.pdf`;

  const exportPDF = async () => {
    if (isExporting || !data) return;
    isExporting = true;
    
    try {
      const { jsPDF } = await import('jspdf');

      // Aumentamos la altura a 460 para evitar cortes en el final y dejar buen padding inferior
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 460] 
      });

      // Helper para convertir imagenes a Base64 rápido y sin errores CORS
      const loadBase64 = async (path: string) => {
          try {
              const res = await fetch(path);
              const blob = await res.blob();
              const reader = new FileReader();
              return await new Promise<string | null>((resolve) => {
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
              });
          } catch (e) { return null; }
      };

      const wDataUrl = await loadBase64('/watermark.png');
      const logoDataUrl = await loadBase64('/sabiduriadealma-logo-png-v2.png');

      // Convertir y dibujar marca de agua en formato sutil
      if (wDataUrl) {
          try {
              const imgW = new Image();
              imgW.src = wDataUrl;
              await new Promise(r => imgW.onload = r);
              const wSide = 140; 
              const wH = (imgW.height * wSide) / imgW.width;
              
              if (doc.GState) {
                  doc.setGState(new doc.GState({ opacity: 0.08 }));
              }
              // Centrado vertical y horizontal
              doc.addImage(wDataUrl, 'PNG', 105 - (wSide/2), 160, wSide, wH);
              if (doc.GState) {
                  doc.setGState(new doc.GState({ opacity: 1.0 }));
              }
          } catch (e) { console.warn(e); }
      }

      // Paleta
      const primaryColor = [30, 41, 59]; // slate-800
      const accentColor = [217, 119, 6]; // amber-600
      const grayColor = [100, 116, 139]; // slate-500

      let yPos = 30;

      // Encabezado
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFontSize(10);
      doc.text("TU MAPA PERSONAL", 105, yPos, { align: "center" });
      
      yPos += 8; // Espacio debajo del subtitulo

      // DIBUJAR LOGO PRINCIPAL ARRIBA
      let logoW = 45;
      let logoH = 15;
      if (logoDataUrl) {
          try {
              const imgLogo = new Image();
              imgLogo.src = logoDataUrl;
              await new Promise(r => imgLogo.onload = r);
              logoH = (imgLogo.height * logoW) / imgLogo.width;
              doc.addImage(logoDataUrl, 'PNG', 105 - (logoW/2), yPos, logoW, logoH);
              yPos += logoH + 8;
          } catch (e) { yPos += 10; }
      } else {
          yPos += 10;
      }
      
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFontSize(25);
      const fullName = `${data.datosPersonales.nombre.texto} ${data.datosPersonales.apellido1.texto} ${data.datosPersonales.apellido2 ? data.datosPersonales.apellido2.texto : ''}`.trim();
      doc.text(fullName, 105, yPos, { align: "center" });
      
      yPos += 12;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFontSize(12);
      doc.text("Aquí están los secretos numéricos ocultos en tu fecha y tu nombre.", 105, yPos, { align: "center" });

      yPos += 5; // Reducido el margen gigante previo a Datos Personales

      const addSectionTitle = (title: string, y: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(title, 105, y + 10, { align: "center" });
        doc.setDrawColor(226, 232, 240);
        doc.line(20, y + 16, 190, y + 16);
        return y + 30;
      };

      // Función para dibujar cada tarjetita nativamente
      const drawCard = (x: number, y: number, titulo: string, subtitulo: string, numero: string, familia: string, desc: string, props: any) => {
         const width = props.w;
         const height = props.h;
         const cx = x + width / 2;

         // Fondo e contorno sutil
         doc.setFillColor(252, 252, 253); 
         doc.setDrawColor(220, 220, 225);
         doc.setLineWidth(0.4);
         doc.roundedRect(x, y, width, height, 3, 3, 'FD'); 

         // Subtítulo Superior (E.g. NOMBRE, NÚMERO DE ALMA)
         doc.setFontSize(7);
         doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
         doc.setFont('helvetica', 'bold');
         doc.text(subtitulo.toUpperCase(), cx, y + 8, { align: "center" });

         let nextY = y + 14;

         // Título Real (E.g. "Mirko") va ABAJO del subtítulo y ARRIBA del super número
         if(titulo) {
             doc.setFontSize(10);
             doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
             doc.setFont('helvetica', 'bold');
             doc.text(titulo, cx, nextY, { align: "center" });
             nextY += 8;
         } else {
             nextY += 4; // Un respiro extra si no hay título
         }

         // Número Gigante 
         doc.setFontSize(19);
         doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
         doc.setFont('helvetica', 'bold');
         doc.text(String(numero), cx, nextY, { align: "center" });

         nextY += 7;

         // Familia Numérica
         doc.setFontSize(8);
         doc.setFont('helvetica', 'bold');
         doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
         doc.text(`Familia num\u00e9rica: ${familia}`, cx, nextY, { align: "center" });
         
         // Descripción
         nextY += 5;
         doc.setFontSize(7);
         doc.setFont('helvetica', 'normal');
         doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
         const splitDesc = doc.splitTextToSize(desc, width - 8);
         doc.text(splitDesc, cx, nextY, { align: "center" });
      };

      yPos = addSectionTitle("Datos Personales", yPos);

      // Usamos 3 columnas para Datos Personales
      const cols3X = [20, 78, 136];
      const cardW = 54;
      const cardH = 48;
      
      let items = [
        { t: data.datosPersonales.nombre.texto, s: "Nombre", num: data.datosPersonales.nombre.valor, fam: data.datosPersonales.nombre.info.familia, desc: data.datosPersonales.nombre.info.desc },
        { t: data.datosPersonales.apellido1.texto, s: "1° Apellido", num: data.datosPersonales.apellido1.valor, fam: data.datosPersonales.apellido1.info.familia, desc: data.datosPersonales.apellido1.info.desc }
      ];
      if (data.datosPersonales.apellido2) {
          items.push({ t: data.datosPersonales.apellido2.texto, s: "2° Apellido", num: data.datosPersonales.apellido2.valor, fam: data.datosPersonales.apellido2.info.familia, desc: data.datosPersonales.apellido2.info.desc });
      }
      items.push({ t: data.datosPersonales.dia.texto, s: "Día", num: data.datosPersonales.dia.valor, fam: data.datosPersonales.dia.info.familia, desc: data.datosPersonales.dia.info.desc });
      items.push({ t: data.datosPersonales.mes.texto, s: "Mes", num: data.datosPersonales.mes.valor, fam: data.datosPersonales.mes.info.familia, desc: data.datosPersonales.mes.info.desc });
      items.push({ t: data.datosPersonales.anio.texto, s: "Año", num: data.datosPersonales.anio.valor, fam: data.datosPersonales.anio.info.familia, desc: data.datosPersonales.anio.info.desc });

      for(let i=0; i<items.length; i++){
          const colIndex = i % 3;
          drawCard(cols3X[colIndex], yPos, items[i].t, items[i].s, items[i].num, items[i].fam, items[i].desc, { w: cardW, h: cardH });
          // Avanzar Y solo después de terminar la columna 3 (índice 2)
          if (colIndex === 2 && i !== items.length - 1) yPos += (cardH + 5);
      }
      
      yPos += (cardH + 15);
      yPos = addSectionTitle("Cálculos Kármicos y Compuestos", yPos);

      let karmicos = [
          { s: "Número de Alma", num: data.alma.num, fam: data.alma.familia, desc: data.alma.desc },
          { s: "Carácter Esencial", num: data.caracterEsencial.num, fam: data.caracterEsencial.familia, desc: data.caracterEsencial.desc },
          { s: "Esencia", num: data.esencia.num, fam: data.esencia.familia, desc: data.esencia.desc },
          { s: "Camino de Vida", num: data.caminoVida.num, fam: data.caminoVida.familia, desc: data.caminoVida.desc },
          { s: "Misión Infancia", num: data.misionInfancia.num, fam: data.misionInfancia.familia, desc: data.misionInfancia.desc },
          { s: "Misión Adolescencia", num: data.misionAdolescencia.num, fam: data.misionAdolescencia.familia, desc: data.misionAdolescencia.desc },
          { s: "Crisis de Ciclo Corto", num: data.crisisCorto.num, fam: data.crisisCorto.familia, desc: data.crisisCorto.desc },
          { s: "Crisis de Ciclo Largo", num: data.crisisLargo.num, fam: data.crisisLargo.familia, desc: data.crisisLargo.desc },
      ];

      for(let i=0; i<karmicos.length; i++){
          const colIndex = i % 3;
          drawCard(cols3X[colIndex], yPos, "", karmicos[i].s, karmicos[i].num, karmicos[i].fam, karmicos[i].desc, { w: cardW, h: cardH });
          if (colIndex === 2 && i !== karmicos.length - 1) yPos += (cardH + 5);
      }

      // Pie de página final
      yPos += (cardH + 15);

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generado por la Calculadora de Sabiduría de Alma", 105, yPos, { align: "center" });

      doc.save(filename);

    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Hubo un error al generar el documento. Asegúrate de intentar desde tu computadora o actualizar la página.");
    } finally {
      isExporting = false;
    }
  };
</script>

<div class="mt-4 mb-20 text-center flex justify-center w-full no-pdf">
  <button 
    on:click={exportPDF} 
    disabled={isExporting || !data}
    class="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-amber-500 font-serif font-medium tracking-wide py-4 px-8 sm:px-12 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto"
  >
    {#if isExporting}
      <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Construyendo Documento...
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Descargar en Formato PDF 
    {/if}
  </button>
</div>
