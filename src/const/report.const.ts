export const REPORT = {
  VALIDATION: false,
  INSULATION: {
    UNINSULATED_EQUIPMENTS: {
      SURFACE: `Insulation\\Un-Insulated Equipments\\Surface`,
      PIPE: `Insulation\\Un-Insulated Equipments\\Pipe`,
      FLANGE: `Insulation\\Un-Insulated Equipments\\Flange`,
      VALVE:  `Insulation\\Un-Insulated Equipments\\Valve`,
      CUSTOM: `Insulation\\Un-Insulated Equipments\\Custom`
    },
    INSULATED_EQUIPMENTS: {
      SURFACE: `Insulation\\Insulated Equipments\\Surface`,
      PIPE: `Insulation\\Insulated Equipments\\Pipe`,
      DAMAGED: `Insulation\\Insulated Equipments\\Generic`,
    },
    COLD_INSULATION: {
      ENERGY: `Insulation\\Cold insulation\\Energy`,
      CONDENSATION: `Insulation\\Cold insulation\\Condensation`,
      DAMAGED: `Insulation\\Cold insulation\\Damaged`,
    }
  },
  SAFETY: {
    FIRE_PROTECTION:  `Safety\\Fire Protection`,
    HOUSEKEEPING:  `Safety\\Housekeeping`,
    TRAFFIC:  `Safety\\Traffic`,
    OTHER:  `Safety\\Other`,
    HOT_SURFACE: {
        UNINSULATED_EQUIPMENTS: {
          SURFACE: `Safety\\Hot Surface\\Insulation\\Un-Insulated Equipments\\Surface`,
          PIPE: `Safety\\Hot Surface\\Insulation\\Un-Insulated Equipments\\Pipe`,
          FLANGE: `Safety\\Hot Surface\\Insulation\\Un-Insulated Equipments\\Flange`,
          VALVE:  `Safety\\Hot Surface\\Insulation\\Un-Insulated Equipments\\Valve`,
          GENERIC: `Safety\\Hot Surface\\Insulation\\Un-Insulated Equipments\\Generic`
        },
        INSULATED_EQUIPMENTS: {
          SURFACE: `Safety\\Hot Surface\\Insulation\\Insulated Equipments\\Surface`,
          PIPE: `Safety\\Hot Surface\\Insulation\\Insulated Equipments\\Pipe`,
          DAMAGED: `Safety\\Hot Surface\\Insulation\\Insulated Equipments\\Damaged`,
        }
    }
  },
  MANTENANCE: {
    LEAKAGE: 'Maintenance\\Leakege',
    DAMAGED: `Maintenance\\Damaged`,
    CONDENSATION: `Maintenance\\Condensation`,
    STRUCTURAL: `Maintenance\\Structural`,
    MECHANICAL: `Maintenance\\Mechanical`,
    ELECTRICAL: `Maintenance\\Electrical`,
  },
  CUSTOM: `Custom`,
  DAMAGED: 'Damaged',
  CONDENSATION: 'Condensation'
}
