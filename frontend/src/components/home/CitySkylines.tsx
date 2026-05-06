const svgClass = 'absolute bottom-0 w-full h-24 pointer-events-none'
const viewBox = '0 0 300 120'
const props = { viewBox, 'aria-hidden': true, preserveAspectRatio: 'xMidYMax meet' as const }

function Paris() {
  return (
    <svg {...props} className={svgClass}>
      {/* Tour Eiffel */}
      <polygon points="150,4 143,120 157,120" fill="white" fillOpacity="0.38" />
      <rect x="139" y="30" width="22" height="2.5" rx="1" fill="white" fillOpacity="0.38" />
      <rect x="133" y="52" width="34" height="2.5" rx="1" fill="white" fillOpacity="0.38" />
      {/* Immeubles Haussmann gauche */}
      <rect x="18"  y="60" width="28" height="60" rx="1" fill="white" fillOpacity="0.17" />
      <rect x="50"  y="72" width="20" height="48" rx="1" fill="white" fillOpacity="0.17" />
      <rect x="74"  y="80" width="14" height="40" rx="1" fill="white" fillOpacity="0.13" />
      {/* Immeubles droite */}
      <rect x="212" y="80" width="14" height="40" rx="1" fill="white" fillOpacity="0.13" />
      <rect x="230" y="72" width="20" height="48" rx="1" fill="white" fillOpacity="0.17" />
      <rect x="254" y="60" width="28" height="60" rx="1" fill="white" fillOpacity="0.17" />
    </svg>
  )
}

function Marseille() {
  return (
    <svg {...props} className={svgClass}>
      {/* Colline Notre-Dame de la Garde */}
      <path d="M0,120 L0,80 Q80,20 160,75 L300,75 L300,120 Z" fill="white" fillOpacity="0.14" />
      {/* Tour + dôme */}
      <rect x="143" y="26" width="14" height="52" fill="white" fillOpacity="0.42" />
      <ellipse cx="150" cy="26" rx="11" ry="9" fill="white" fillOpacity="0.42" />
      {/* Croix */}
      <rect x="148" y="12" width="4" height="17" fill="white" fillOpacity="0.55" />
      <rect x="142" y="17" width="16" height="3"  fill="white" fillOpacity="0.55" />
      {/* Bâtiments portuaires */}
      <rect x="18"  y="92" width="26" height="28" rx="1" fill="white" fillOpacity="0.14" />
      <rect x="248" y="88" width="34" height="32" rx="1" fill="white" fillOpacity="0.14" />
    </svg>
  )
}

function Lyon() {
  return (
    <svg {...props} className={svgClass}>
      {/* Colline Croix-Rousse gauche */}
      <path d="M0,120 Q55,28 128,78 L128,120 Z" fill="white" fillOpacity="0.13" />
      {/* Basilique Fourvière */}
      <rect x="50" y="28" width="12" height="30" fill="white" fillOpacity="0.48" />
      <path d="M46,28 L56,14 L66,28 Z" fill="white" fillOpacity="0.48" />
      {/* Presqu'île */}
      <rect x="130" y="52" width="14" height="68" rx="1" fill="white" fillOpacity="0.2" />
      <rect x="148" y="62" width="11" height="58" rx="1" fill="white" fillOpacity="0.2" />
      <rect x="163" y="70" width="9"  height="50" rx="1" fill="white" fillOpacity="0.2" />
      {/* Colline Fourvière droite */}
      <path d="M172,120 Q230,38 300,82 L300,120 Z" fill="white" fillOpacity="0.11" />
      {/* Saône */}
      <path d="M110,115 Q150,108 190,115" stroke="white" strokeWidth="3" fill="none" strokeOpacity="0.2" strokeLinecap="round" />
    </svg>
  )
}

function Toulouse() {
  return (
    <svg {...props} className={svgClass}>
      {/* Capitole : colonnes + dôme */}
      <rect x="128" y="50" width="44" height="70" rx="1" fill="white" fillOpacity="0.18" />
      <ellipse cx="150" cy="49" rx="24" ry="13" fill="white" fillOpacity="0.4" />
      <rect x="146" y="30" width="8" height="22" fill="white" fillOpacity="0.48" />
      {/* Bâtiments briques gauche */}
      <rect x="20"  y="65" width="26" height="55" rx="1" fill="white" fillOpacity="0.16" />
      <rect x="50"  y="75" width="18" height="45" rx="1" fill="white" fillOpacity="0.14" />
      <rect x="72"  y="82" width="14" height="38" rx="1" fill="white" fillOpacity="0.12" />
      {/* Bâtiments droite */}
      <rect x="214" y="82" width="14" height="38" rx="1" fill="white" fillOpacity="0.12" />
      <rect x="232" y="75" width="18" height="45" rx="1" fill="white" fillOpacity="0.14" />
      <rect x="254" y="65" width="26" height="55" rx="1" fill="white" fillOpacity="0.16" />
    </svg>
  )
}

function Bordeaux() {
  return (
    <svg {...props} className={svgClass}>
      {/* Façade courbe Place de la Bourse */}
      <path d="M18,120 L18,68 Q150,28 282,68 L282,120 Z" fill="white" fillOpacity="0.15" />
      {/* Flèche centrale */}
      <rect x="144" y="34" width="12" height="36" fill="white" fillOpacity="0.42" />
      <path d="M142,34 L150,18 L158,34 Z" fill="white" fillOpacity="0.42" />
      {/* Garonne */}
      <path d="M0,112 Q75,104 150,108 Q225,112 300,104"
            stroke="white" strokeWidth="4" fill="none" strokeOpacity="0.18" strokeLinecap="round" />
    </svg>
  )
}

function Aix() {
  return (
    <svg {...props} className={svgClass}>
      {/* Montagne Sainte-Victoire */}
      <path d="M0,120 L20,120 L150,10 L280,120 L300,120 Z" fill="white" fillOpacity="0.16" />
      {/* Sommet plus contrasté */}
      <path d="M128,45 L150,10 L172,45 Z" fill="white" fillOpacity="0.1" />
      {/* Oliviers / végétation méditerranéenne */}
      <circle cx="28"  cy="112" r="11" fill="white" fillOpacity="0.14" />
      <circle cx="46"  cy="108" r="8"  fill="white" fillOpacity="0.14" />
      <circle cx="62"  cy="111" r="7"  fill="white" fillOpacity="0.11" />
      <circle cx="238" cy="111" r="7"  fill="white" fillOpacity="0.11" />
      <circle cx="254" cy="108" r="8"  fill="white" fillOpacity="0.14" />
      <circle cx="272" cy="112" r="11" fill="white" fillOpacity="0.14" />
    </svg>
  )
}

const MAP: Record<string, () => JSX.Element> = {
  'Paris':           Paris,
  'Marseille':       Marseille,
  'Lyon':            Lyon,
  'Toulouse':        Toulouse,
  'Bordeaux':        Bordeaux,
  'Aix-en-Provence': Aix,
}

export function CitySkyline({ city }: { city: string }) {
  const Component = MAP[city]
  return Component ? <Component /> : null
}
