export interface Point {
  x: number;
  y: number;
}

export interface LabData {
  name: string;
  ca: number;
  caPercentage: number;
  margin: number;
  marginPercentage: number;
}

export interface ZoneBusinessData {
  ca: number;
  caPercentage: number;
  margin: number;
  marginPercentage: number;
  topLabs: LabData[];
}

export interface Zone {
  id: string;
  name: string;
  category: ZoneCategory;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color: string;
  isSelected?: boolean;
  zIndex?: number;
  businessData: ZoneBusinessData;
}

export enum ZoneCategory {
  DERMOCOSMETIC = 'dermocosmetic',
  MAMAN_BEBE = 'maman_bebe',
  NATURE_SANTE = 'nature_sante',
  BIEN_ETRE = 'bien_etre',
  MEDICATION_FAMILIALE = 'medication_familiale',
  ORTHOPEDIE = 'orthopedie',
  VETERINAIRE = 'veterinaire',
}

export const ZONE_CATEGORIES = {
  [ZoneCategory.DERMOCOSMETIC]: {
    label: 'Dermocosmétique',
    color: '#E6B3FF',
    description: 'Soins de la peau et cosmétiques',
    averageData: {
      ca: 125000,
      caPercentage: 18.5,
      margin: 38500,
      marginPercentage: 30.8,
      topLabs: [
        { name: 'La Roche-Posay', ca: 45000, caPercentage: 36.0, margin: 15750, marginPercentage: 35.0 },
        { name: 'Avène', ca: 32000, caPercentage: 25.6, margin: 11200, marginPercentage: 35.0 },
        { name: 'Vichy', ca: 28000, caPercentage: 22.4, margin: 9800, marginPercentage: 35.0 }
      ]
    }
  },
  [ZoneCategory.MAMAN_BEBE]: {
    label: 'Maman Et Bébé',
    color: '#FFB3E6',
    description: 'Produits pour mamans et bébés',
    averageData: {
      ca: 85000,
      caPercentage: 12.5,
      margin: 29750,
      marginPercentage: 35.0,
      topLabs: [
        { name: 'Mustela', ca: 35000, caPercentage: 41.2, margin: 12250, marginPercentage: 35.0 },
        { name: 'Gallia', ca: 22000, caPercentage: 25.9, margin: 7700, marginPercentage: 35.0 },
        { name: 'Gifrer', ca: 18000, caPercentage: 21.2, margin: 6300, marginPercentage: 35.0 }
      ]
    }
  },
  [ZoneCategory.NATURE_SANTE]: {
    label: 'Nature et Santé',
    color: '#B3FFB3',
    description: 'Produits naturels et phytothérapie',
    averageData: {
      ca: 95000,
      caPercentage: 14.0,
      margin: 38000,
      marginPercentage: 40.0,
      topLabs: [
        { name: 'Arkopharma', ca: 38000, caPercentage: 40.0, margin: 15200, marginPercentage: 40.0 },
        { name: 'Pileje', ca: 28000, caPercentage: 29.5, margin: 11200, marginPercentage: 40.0 },
        { name: 'Boiron', ca: 20000, caPercentage: 21.1, margin: 8000, marginPercentage: 40.0 }
      ]
    }
  },
  [ZoneCategory.BIEN_ETRE]: {
    label: 'Bien Être',
    color: '#B3E6FF',
    description: 'Produits de bien-être et détente',
    averageData: {
      ca: 65000,
      caPercentage: 9.5,
      margin: 26000,
      marginPercentage: 40.0,
      topLabs: [
        { name: 'Léro', ca: 25000, caPercentage: 38.5, margin: 10000, marginPercentage: 40.0 },
        { name: 'Forté Pharma', ca: 20000, caPercentage: 30.8, margin: 8000, marginPercentage: 40.0 },
        { name: 'Nhco', ca: 15000, caPercentage: 23.1, margin: 6000, marginPercentage: 40.0 }
      ]
    }
  },
  [ZoneCategory.MEDICATION_FAMILIALE]: {
    label: 'Médication Familiale',
    color: '#FFE6B3',
    description: 'Médicaments sans ordonnance',
    averageData: {
      ca: 180000,
      caPercentage: 26.5,
      margin: 54000,
      marginPercentage: 30.0,
      topLabs: [
        { name: 'Sanofi', ca: 65000, caPercentage: 36.1, margin: 19500, marginPercentage: 30.0 },
        { name: 'Bayer', ca: 45000, caPercentage: 25.0, margin: 13500, marginPercentage: 30.0 },
        { name: 'Johnson & Johnson', ca: 38000, caPercentage: 21.1, margin: 11400, marginPercentage: 30.0 }
      ]
    }
  },
  [ZoneCategory.ORTHOPEDIE]: {
    label: 'Orthopédie',
    color: '#FFB3B3',
    description: 'Matériel orthopédique et maintien',
    averageData: {
      ca: 45000,
      caPercentage: 6.6,
      margin: 18000,
      marginPercentage: 40.0,
      topLabs: [
        { name: 'Thuasne', ca: 18000, caPercentage: 40.0, margin: 7200, marginPercentage: 40.0 },
        { name: 'Gibaud', ca: 14000, caPercentage: 31.1, margin: 5600, marginPercentage: 40.0 },
        { name: 'Epitact', ca: 10000, caPercentage: 22.2, margin: 4000, marginPercentage: 40.0 }
      ]
    }
  },
  [ZoneCategory.VETERINAIRE]: {
    label: 'Vétérinaire',
    color: '#D4B3FF',
    description: 'Produits pour animaux',
    averageData: {
      ca: 75000,
      caPercentage: 11.0,
      margin: 26250,
      marginPercentage: 35.0,
      topLabs: [
        { name: 'Virbac', ca: 30000, caPercentage: 40.0, margin: 10500, marginPercentage: 35.0 },
        { name: 'Clément Thékan', ca: 25000, caPercentage: 33.3, margin: 8750, marginPercentage: 35.0 },
        { name: 'Biocanina', ca: 15000, caPercentage: 20.0, margin: 5250, marginPercentage: 35.0 }
      ]
    }
  },
} as const;

export interface ZoneState {
  zones: Zone[];
  selectedZoneId: string | null;
  activeTool: 'select' | 'zone';
  isDrawing: boolean;
  currentCategory: ZoneCategory;
  drawStart: Point | null;
}

export interface ZoneDragEvent {
  zoneId: string;
  newBounds: Zone['bounds'];
}

export interface ZoneResizeEvent {
  zoneId: string;
  newBounds: Zone['bounds'];
}