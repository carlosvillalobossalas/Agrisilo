export const customColors = {
  "colors": {
    // --- Colores principales (marca) ---
    primary: "#B5CE2F",
    onPrimary: "#283133",

    // contenedor claro derivado del primario
    primaryContainer: "#D7E88A",
    onPrimaryContainer: "#283133",

    secondary: "#283133",
    onSecondary: "#FFFFFF",

    // contenedor claro pero derivado de #283133
    secondaryContainer: "#4B575B",
    onSecondaryContainer: "#FFFFFF",

    // --- Tercarios (derivados de la marca) ---
    tertiary: "#B5CE2F",              // mismo verde brand (coherente)
    onTertiary: "#283133",
    tertiaryContainer: "#D7E88A",     // versión clara del verde
    onTertiaryContainer: "#283133",

    // --- Error (lo dejo estándar pero adaptado al brand oscuro) ---
    error: "#B00020",
    onError: "#FFFFFF",
    errorContainer: "#F8D7DA",
    onErrorContainer: "#721C24",

    // --- Fondo y Superficies (cambiados al color base oscuro y claro) ---
    background: "#FFFFFF",
    onBackground: "#283133",

    surface: "#FFFFFF",
    onSurface: "#283133",

    surfaceVariant: "#E4E8E9",       // gris claro derivado de #283133
    onSurfaceVariant: "#5A6669",

    // --- Outline / Bordes ---
    outline: "#5A6669",
    outlineVariant: "#D5DBDC",

    // --- Sombra y Scrim ---
    shadow: "#000000",
    scrim: "#000000",

    // --- Inverse (usado en Appbar, Modal, Drawer) ---
    inverseSurface: "#283133",
    inverseOnSurface: "#FFFFFF",
    inversePrimary: "#B5CE2F",

    // --- Elevaciones (basadas en el oscuro con transparencia) ---
    elevation: {
      level0: "transparent",
      level1: "rgba(40, 49, 51, 0.05)",
      level2: "rgba(40, 49, 51, 0.08)",
      level3: "rgba(40, 49, 51, 0.10)",
      level4: "rgba(40, 49, 51, 0.12)",
      level5: "rgba(40, 49, 51, 0.14)"
    },

    // --- Disabled States ---
    surfaceDisabled: "rgba(40, 49, 51, 0.12)",
    onSurfaceDisabled: "rgba(40, 49, 51, 0.38)",

    // --- Backdrop ---
    backdrop: "rgba(40, 49, 51, 0.4)",

    // --- Extras opcionales ---
    success: "#7CC44A",               // verde armónico al primario
    onSuccess: "#283133",
    successContainer: "#D7EEC1",
    onSuccessContainer: "#283133"
  }
}
