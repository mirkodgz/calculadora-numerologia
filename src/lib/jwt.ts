import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => {
  const secret = import.meta.env.JWT_SECRET || 'default_secret_for_dev_only';
  return new TextEncoder().encode(secret);
};

export type NumerologyPayload = {
  nombre: string;
  apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  idioma: string;
  email: string;
};

export async function signNumerologyToken(payload: NumerologyPayload): Promise<string> {
  const alg = 'HS256';
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('30d') // El token será válido por 30 días
    .sign(getSecret());

  return token;
}

export async function verifyNumerologyToken(token: string): Promise<NumerologyPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as NumerologyPayload;
  } catch (error) {
    console.error('Error verificando token JWT:', error);
    return null;
  }
}
