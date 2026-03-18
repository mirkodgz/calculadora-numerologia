import type { APIRoute } from 'astro';
import { signNumerologyToken } from '../../lib/jwt';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { nombre, apellido, segundo_apellido, fecha_nacimiento, idioma, email, telefono } = body;

    if (!nombre || !apellido || !fecha_nacimiento || !idioma || !email) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Crear el token JWT con todos los datos necesarios para el cálculo
    const tokenPayload = {
      nombre,
      apellido,
      segundo_apellido,
      fecha_nacimiento,
      idioma,
      email,
    };
    
    const jwtToken = await signNumerologyToken(tokenPayload);

    // 2. Construir la URL mágica de resultados (basada en el dominio actual)
    const resultsUrl = new URL(`/resultados?token=${jwtToken}`, url.origin).toString();

    // 3. Enviar a GoHighLevel (GHL)
    const apiKey = import.meta.env.GHL_API_KEY;
    const customFieldId = import.meta.env.GHL_CUSTOM_FIELD_URL || 'resultados_url'; // Reemplazar con ID real del custom field
    
    if (apiKey) {
      const ghlPayload = {
        firstName: nombre,
        lastName: `${apellido} ${segundo_apellido || ''}`.trim(),
        email: email,
        phone: telefono || '',
        tags: ['lead-calculadora', 'pendiente-confirmacion'],
        customField: {
          [customFieldId]: resultsUrl // Aquí enviamos el enlace único al CRM
        }
      };

      // Intentamos buscar y crear/actualizar en GHL
      const searchRes = await fetch(`https://rest.gohighlevel.com/v1/contacts/?query=${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
      });
      
      const searchData = await searchRes.json();
      
      if (searchData.contacts && searchData.contacts.length > 0) {
        // Actualizar contacto existente
        const contactId = searchData.contacts[0].id;
        await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
             tags: [...(searchData.contacts[0].tags || []), 'lead-calculadora'],
             customField: ghlPayload.customField
          })
        });
      } else {
        // Crear nuevo contacto
        await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(ghlPayload)
        });
      }
    } else {
      console.warn('GHL_API_KEY no detectada. Modo desarrollo simulado.');
      console.log('Result URL Generada:', resultsUrl);
    }

    // Respuesta exitosa al frontend (Svelte)
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Revisa tu bandeja de entrada para ver tus resultados.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error procesando formulario:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor', stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
