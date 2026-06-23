export type ScholarshipRule = {
  id: string;
  name: string;
  promedioMin: number;
  promedioMax: number;
  tuitionScholarshipPercent: number;
  type: string;
  message: string;
};

export type FallbackRule = {
  id: string;
  type: string;
  message: string;
};

export const SCHOLARSHIP_RULES: ScholarshipRule[] = [
  {
    id: "beca_50",
    name: "Beca Académica 50%",
    promedioMin: 96,
    promedioMax: 100,
    tuitionScholarshipPercent: 50,
    type: "beca_academica",
    message:
      "Tu desempeño académico en el bachillerato se encuentra en un nivel sobresaliente. La universidad reconoce este esfuerzo mediante una beca académica del 50% sobre colegiatura.",
  },
  {
    id: "beca_40",
    name: "Beca Académica 40%",
    promedioMin: 90,
    promedioMax: 95,
    tuitionScholarshipPercent: 40,
    type: "beca_academica",
    message:
      "Tu promedio académico refleja un desempeño muy alto. Este nivel permite acceder a una beca académica del 40% sobre colegiatura.",
  },
  {
    id: "beca_30",
    name: "Beca Académica 30%",
    promedioMin: 85,
    promedioMax: 89,
    tuitionScholarshipPercent: 30,
    type: "beca_academica",
    message:
      "Tu desempeño académico demuestra constancia y compromiso con tus estudios. Por este motivo puedes acceder a una beca académica del 30% sobre colegiatura.",
  },
];

export const SCHOLARSHIP_FALLBACK: FallbackRule = {
  id: "asesoria_financiera",
  type: "revision_asesor",
  message:
    "Un asesor académico podrá orientarte sobre las opciones de beca por excelencia o financiamiento disponibles según tu situación particular.",
};

// Maps the text choice from the test to a numeric value for range matching
export const PROMEDIO_NUMERIC_MAP: Record<string, number | null> = {
  "Sobresaliente (9.5 o superior)": 97,
  "Muy alto (9.0 a 9.49)": 92,
  "Alto (8.5 a 8.99)": 87,
  "Bueno (8.0 a 8.49)": 82,
  "Suficiente (7.0 a 7.99)": 75,
  "Prefiero no decirlo": null,
};
