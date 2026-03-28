export type CareerConfig = {
  name: string;
  area: string;
  modalities: string[];
  dimension_weights: Record<string, number>;
};

export const CAREERS: Record<string, CareerConfig> = {
  ingenieria_sistemas: {
    name: "Ingeniería en Sistemas Computacionales",
    area: "TECNOLOGIA",
    modalities: ["presencial_cuatrimestral"],
    dimension_weights: { INTERES_TECNOLOGIA: 0.6, ANALISIS_LOGICO: 0.4 },
  },
  derecho: {
    name: "Derecho",
    area: "LEGAL",
    modalities: ["presencial_cuatrimestral", "online"],
    dimension_weights: { INTERES_LEGAL: 0.6, HABILIDAD_SOCIAL: 0.4 },
  },
  psicologia: {
    name: "Psicología",
    area: "SALUD_BIENESTAR",
    modalities: ["presencial_semestral"],
    dimension_weights: { INTERES_SALUD_BIENESTAR: 0.5, HABILIDAD_SOCIAL: 0.5 },
  },
  enfermeria: {
    name: "Enfermería",
    area: "SALUD_BIENESTAR",
    modalities: ["presencial_semestral"],
    dimension_weights: { INTERES_SALUD_BIENESTAR: 0.7, HABILIDAD_SOCIAL: 0.3 },
  },
  nutricion: {
    name: "Nutrición",
    area: "SALUD_BIENESTAR",
    modalities: ["presencial_semestral"],
    dimension_weights: { INTERES_SALUD_BIENESTAR: 0.6, ANALISIS_LOGICO: 0.4 },
  },
  gastronomia: {
    name: "Gastronomía",
    area: "SALUD_BIENESTAR",
    modalities: ["presencial_semestral"],
    dimension_weights: { INTERES_SALUD_BIENESTAR: 0.6, HABILIDAD_SOCIAL: 0.4 },
  },
  ventas_mercadotecnia: {
    name: "Ventas y Mercadotecnia",
    area: "NEGOCIOS",
    modalities: ["presencial_cuatrimestral", "online"],
    dimension_weights: { INTERES_NEGOCIOS: 0.6, HABILIDAD_SOCIAL: 0.4 },
  },
  negocios_internacionales: {
    name: "Negocios Internacionales",
    area: "NEGOCIOS",
    modalities: ["presencial_cuatrimestral"],
    dimension_weights: { INTERES_NEGOCIOS: 0.7, ANALISIS_LOGICO: 0.3 },
  },
  administracion: {
    name: "Administración",
    area: "NEGOCIOS",
    modalities: ["sabatina"],
    dimension_weights: { INTERES_NEGOCIOS: 0.6, ANALISIS_LOGICO: 0.4 },
  },
  administracion_desarrollo_empresarial: {
    name: "Administración y Desarrollo Empresarial",
    area: "NEGOCIOS",
    modalities: ["online"],
    dimension_weights: { INTERES_NEGOCIOS: 0.5, ANALISIS_LOGICO: 0.5 },
  },
};

export const CAREER_SELECTION_RULES = {
  max_recommended_careers: 2,
  minimum_difference_between_careers: 12, // percentage points
  dual_sector_threshold: 5,               // percentage points
};
