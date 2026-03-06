// ─────────────────────────────────────────────
//  Vessel Volume Calculator – calculation logic
// ─────────────────────────────────────────────

// ── Unit conversion: length → metres ──
const LENGTH_TO_M = { ft: 0.3048, in: 0.0254, m: 1, cm: 0.01, mm: 0.001 };

function toM3(vol, unit) {
  const f = LENGTH_TO_M[unit];
  return vol * f * f * f;
}

function m3ToGal(m3)  { return m3 * 264.172;  }
function m3ToFt3(m3)  { return m3 / 0.0283168; }

// ── Head depth (a) as a function of diameter and head type ──
function calcDishDepth(D, headType) {
  switch (headType) {
    case 'ellipsoidal':    return D / 4;
    case 'hemispherical':  return D / 2;
    case 'asme_fd': {
      // Standard ASME F&D: ICR = D, IKR = 0.06*D
      const ICR = D, IKR = 0.06 * D, R = D / 2;
      return ICR - Math.sqrt(Math.pow(ICR - IKR, 2) - Math.pow(R - IKR, 2));
    }
    case 'flat':
    default: return 0;
  }
}

// ── Head formula label ──
function headFormulaText(headType) {
  switch (headType) {
    case 'ellipsoidal':   return 'For 2:1 Elliptical Head, a = D / 4';
    case 'hemispherical': return 'For Hemispherical Head, a = D / 2';
    case 'asme_fd':       return 'For ASME F&D Head, a = ICR − √[(ICR−IKR)² − (R−IKR)²]  (ICR=D, IKR=0.06D)';
    case 'flat':          return 'For Flat Head, a = 0';
    default:              return '';
  }
}

// ── Total head volume (one head) ──
function headTotalVolume(D, a, headType) {
  const R = D / 2;
  switch (headType) {
    case 'ellipsoidal':   return Math.PI * R * R * a / 3 * 2; // = πR²*(D/4) * 2/3 ... derive properly below
    case 'hemispherical': return (2 / 3) * Math.PI * R * R * R;
    case 'asme_fd':       return toriHeadVolume(D, a);
    case 'flat':
    default: return 0;
  }
}

// Ellipsoidal head (oblate spheroid cap): V = (2/3)*π*R²*a  where a = dish depth
// Hemisphere: a = R, V = (2/3)*π*R³  ✓
// 2:1 SE: a = R/2, V = (2/3)*π*R²*(R/2) = (1/3)*π*R³ = π*D³/24  ✓
function ellipHeadVolume(D, a) {
  const R = D / 2;
  return (2 / 3) * Math.PI * R * R * a;
}

// Torispherical head volume (ASME F&D approximation via integration)
// Using the formula: V ≈ (2π/3)*a*(3*ICR*R - ICR*a - (ICR - IKR)*(3R - 2*IKR - a))
// For simplicity, use the reliable engineering approximation based on dish depth ratio to hemisphere
function toriHeadVolume(D, a) {
  // Scale hemisphere volume by depth ratio: V_tori = V_hemi * (a / (D/2))
  // but cap at actual hemi volume
  const R = D / 2;
  // More accurate: numerically integrate or use Perry's approximation
  // V ≈ π*a*(3*R² - a²) / 3  (spherical zone formula with radius = effective ICR)
  // For ASME F&D with ICR=D:
  const ICR = D;
  return Math.PI * a / 6 * (3 * ICR * ICR / 4 + a * a);
  // This is the formula for a spherical cap: V = π*h/6*(3a²+h²) where a=base radius, h=height
  // Here a = D/2 (base radius), h = dish depth
  // V = π*dish_depth/6 * (3*(D/2)² + dish_depth²)
}

// ── Filled cross-section area of a circle (diameter D, fill height h) ──
function filledCircleArea(D, h) {
  const R = D / 2;
  if (h <= 0) return 0;
  if (h >= D) return Math.PI * R * R;
  return R * R * Math.acos((R - h) / R) - (R - h) * Math.sqrt(2 * R * h - h * h);
}

// ── Horizontal head partial fill (single head) ──
// Fill level h measured from bottom of vessel (0 to D)
function headFilledHoriz(D, a, headType, h) {
  if (h <= 0) return 0;
  if (h >= D) return headTotalVolumeUnified(D, a, headType);
  const R = D / 2;
  const t = h - R;  // signed distance from centre

  switch (headType) {
    case 'hemispherical':
      // V = (π/2)*[R²*t - t³/3 + 2R³/3]
      return (Math.PI / 2) * (R * R * t - (t * t * t) / 3 + (2 * R * R * R) / 3);

    case 'ellipsoidal': {
      // Oblate spheroid (semi-axes R,R,a): V = (π*a/R) * (π/2)*[...] / π  = (a/R)*(π/2)*[...]
      // Integral of half-ellipse cross-sections: factor = a/R compared to hemisphere
      const factor = a / R;
      return factor * (Math.PI / 2) * (R * R * t - (t * t * t) / 3 + (2 * R * R * R) / 3);
    }

    case 'asme_fd': {
      // Approximate: scale hemisphere fill by volume ratio
      const V_tori_full = headTotalVolumeUnified(D, a, headType);
      const V_hemi_full = (2 / 3) * Math.PI * R * R * R;
      const k = V_tori_full / V_hemi_full;
      const vHemi = (Math.PI / 2) * (R * R * t - (t * t * t) / 3 + (2 * R * R * R) / 3);
      return k * vHemi;
    }

    case 'flat':
    default: return 0;
  }
}

// ── Vertical head partial fill (single head, fill from bottom of head) ──
// H measured from bottom of head (0 to a)
function headFilledVert(D, a, headType, H) {
  if (a <= 0 || H <= 0) return 0;
  if (H >= a) return headTotalVolumeUnified(D, a, headType);
  const R = D / 2;
  // Oblate spheroid or spherical zone: cross-section radius at height h from bottom
  // r²(h) = R² * (2h/a - h²/a²)  [derived from oblate spheroid equation]
  // V = π*R² * ∫₀ᴴ (2h/a - h²/a²) dh = π*R² * [h²/a - h³/(3a²)]
  return Math.PI * R * R * (H * H / a - (H * H * H) / (3 * a * a));
}

// Unified head total volume using a (the dish depth)
function headTotalVolumeUnified(D, a, headType) {
  const R = D / 2;
  switch (headType) {
    case 'ellipsoidal':   return (2 / 3) * Math.PI * R * R * a;
    case 'hemispherical': return (2 / 3) * Math.PI * R * R * R;
    case 'asme_fd':       return Math.PI * a / 6 * (3 * R * R + a * a);
    case 'flat':
    default: return 0;
  }
}

// ── Horizontal vessel calculation ──
function calcHorizontal(D, L, a, headType, H_L) {
  const R = D / 2;
  const V_shell_total  = Math.PI * R * R * L;
  const V_head_total   = headTotalVolumeUnified(D, a, headType);
  const V_total        = V_shell_total + 2 * V_head_total;

  const A_filled       = filledCircleArea(D, H_L);
  const V_shell_filled = A_filled * L;
  const V_head_filled  = headFilledHoriz(D, a, headType, H_L);
  const V_filled       = V_shell_filled + 2 * V_head_filled;

  return { V_total, V_filled, totalHeight: D };
}

// ── Vertical vessel calculation ──
function calcVertical(D, L, a, headType, H_L) {
  const R = D / 2;
  const V_head_total = headTotalVolumeUnified(D, a, headType);
  const V_shell_total = Math.PI * R * R * L;
  const V_total = V_shell_total + 2 * V_head_total;
  const totalHeight = 2 * a + L;

  const H_clamped = Math.min(Math.max(H_L, 0), totalHeight);
  let V_filled;

  if (H_clamped <= a) {
    V_filled = headFilledVert(D, a, headType, H_clamped);
  } else if (H_clamped <= a + L) {
    V_filled = V_head_total + Math.PI * R * R * (H_clamped - a);
  } else {
    const H_top = H_clamped - a - L;
    V_filled = V_head_total + Math.PI * R * R * L + headFilledVert(D, a, headType, H_top);
  }

  return { V_total, V_filled, totalHeight };
}

// ── Volume at a given level fraction (0–1) – used for calibration table ──
function volumeAtFraction(frac, D, L, a, headType, orientation, totalHeight) {
  const H = frac * totalHeight;
  if (orientation === 'horizontal') {
    return calcHorizontal(D, L, a, headType, H).V_filled;
  } else {
    return calcVertical(D, L, a, headType, H).V_filled;
  }
}

// ═══════════════════════════════════════════
//  DOM interaction
// ═══════════════════════════════════════════

const elOrientation  = document.getElementById('orientation');
const elHeadType     = document.getElementById('headType');
const elDiameter     = document.getElementById('diameter');
const elShellLength  = document.getElementById('shellLength');
const elDishDepth    = document.getElementById('dishDepth');
const elLiquidLevel  = document.getElementById('liquidLevel');
const elGlobalUnits  = document.getElementById('globalUnits');
const elHeadFormula  = document.getElementById('headFormulaBox');
const elCalibBody    = document.getElementById('calibBody');
const elCalibUnitHdr = document.getElementById('calib-unit-hdr');
const elResults      = document.getElementById('results');
const elNoResults    = document.getElementById('no-results');
const elError        = document.getElementById('calcError');

// Badge spans
const badges = {
  D: document.getElementById('badge-D'),
  L: document.getElementById('badge-L'),
  a: document.getElementById('badge-a'),
  H: document.getElementById('badge-H'),
};

// ── Update unit badges when global unit changes ──
function syncUnitBadges() {
  const u = elGlobalUnits.value;
  Object.values(badges).forEach(b => { b.textContent = u; });
  elCalibUnitHdr.textContent = u;
  document.getElementById('res-height-unit').textContent = u;
}

// ── Auto-fill dish depth when head type or diameter changes ──
function autofillDishDepth() {
  const D = parseFloat(elDiameter.value);
  if (!isNaN(D) && D > 0) {
    const a = calcDishDepth(D, elHeadType.value);
    elDishDepth.value = parseFloat(a.toPrecision(5));
  }
  elHeadFormula.textContent = headFormulaText(elHeadType.value);
}

// ── Main calculation and render ──
function calculate() {
  const orientation = elOrientation.value;
  const headType    = elHeadType.value;
  const units       = elGlobalUnits.value;

  const D   = parseFloat(elDiameter.value);
  const L   = parseFloat(elShellLength.value);
  const a   = parseFloat(elDishDepth.value);
  const H_L = parseFloat(elLiquidLevel.value);

  elError.textContent = '';

  // Validate basic geometry
  if (isNaN(D) || D <= 0 || isNaN(L) || L <= 0) {
    showNoResults();
    if ((!isNaN(D) && D > 0) || (!isNaN(L) && L > 0)) {
      elError.textContent = 'Please enter valid positive values for Diameter and Length.';
    }
    return;
  }

  // a can be 0 for flat heads; NaN means not entered yet
  const aVal = isNaN(a) ? calcDishDepth(D, headType) : a;

  const maxLevel = orientation === 'horizontal' ? D : (2 * aVal + L);

  if (!isNaN(H_L) && H_L > maxLevel) {
    elError.textContent = `Level H (${H_L.toPrecision(4)} ${units}) exceeds maximum vessel dimension (${maxLevel.toPrecision(4)} ${units}).`;
    showNoResults();
    return;
  }

  // Compute result
  const fn = orientation === 'horizontal' ? calcHorizontal : calcVertical;
  const r  = fn(D, L, aVal, headType, isNaN(H_L) ? 0 : H_L);

  const { V_total, V_filled, totalHeight } = r;
  const pct = V_total > 0 ? (V_filled / V_total * 100) : 0;

  // Convert volumes to m³ then to display units
  const Vt_m3 = toM3(V_total,  units);
  const Vf_m3 = toM3(V_filled, units);

  document.getElementById('res-filled-gal').textContent = m3ToGal(Vf_m3).toPrecision(5);
  document.getElementById('res-total-gal').textContent  = m3ToGal(Vt_m3).toPrecision(5);
  document.getElementById('res-filled-m3').textContent  = Vf_m3.toPrecision(5);
  document.getElementById('res-total-m3').textContent   = Vt_m3.toPrecision(5);
  document.getElementById('res-filled-ft3').textContent = m3ToFt3(Vf_m3).toPrecision(5);
  document.getElementById('res-total-ft3').textContent  = m3ToFt3(Vt_m3).toPrecision(5);
  document.getElementById('res-pct').textContent        = pct.toFixed(2) + ' %';

  const heightRow = document.getElementById('total-height-row');
  if (orientation === 'vertical') {
    heightRow.style.display = '';
    document.getElementById('res-total-height').textContent = totalHeight.toPrecision(5) + ' ' + units;
  } else {
    heightRow.style.display = 'none';
  }

  elResults.style.display  = '';
  elNoResults.style.display = 'none';

  // Build calibration table
  buildCalibTable(D, L, aVal, headType, orientation, totalHeight, units, isNaN(H_L) ? 0 : H_L);

  // Draw vessel SVG
  drawVesselSVG(orientation, headType, D, L, aVal, isNaN(H_L) ? 0 : H_L, totalHeight, pct);
}

function showNoResults() {
  elResults.style.display   = 'none';
  elNoResults.style.display = '';
  clearCalibTable();
  resetSVG();
}

// ── Calibration table (10% increments) ──
function buildCalibTable(D, L, a, headType, orientation, totalHeight, units, H_L) {
  const currentPct = totalHeight > 0 ? (H_L / totalHeight * 100) : 0;
  let rows = '';

  for (let i = 1; i <= 10; i++) {
    const pct  = i * 10;
    const H    = pct / 100 * totalHeight;
    const Vf   = volumeAtFraction(pct / 100, D, L, a, headType, orientation, totalHeight);
    const Vf_gal = m3ToGal(toM3(Vf, units));
    const highlight = (currentPct >= (i - 1) * 10 && currentPct < i * 10 + 0.001) ? ' class="calib-active"' : '';
    rows += `<tr${highlight}>
      <td>${pct}</td>
      <td>${H.toPrecision(4)}</td>
      <td>${Vf_gal.toPrecision(5)}</td>
    </tr>`;
  }

  elCalibBody.innerHTML = rows;
}

function clearCalibTable() {
  elCalibBody.innerHTML = '<tr><td colspan="3" class="calib-empty">Enter vessel dimensions to generate table.</td></tr>';
}

// ── SVG vessel diagram ──
function drawVesselSVG(orientation, headType, D, L, a, H_L, totalHeight, pctFull) {
  const svg = document.getElementById('vesselDiagram');
  const W = 220, H_svg = 150;

  if (orientation === 'horizontal') {
    drawHorizontalSVG(svg, W, H_svg, D, L, a, H_L, pctFull);
  } else {
    drawVerticalSVG(svg, W, H_svg, D, L, a, H_L, totalHeight, pctFull);
  }
}

function drawHorizontalSVG(svg, W, H_svg, D, L, a, H_L, pctFull) {
  // Scale: vessel rendered as rectangle + two ellipse ends
  const margin = 10;
  // Available drawing area
  const drawW = W - 2 * margin;
  const drawH = H_svg - 2 * margin;

  // Scale vessel to fit
  const totalLengthUnits = L + 2 * a;  // total length in user units
  const scale = Math.min(drawW / totalLengthUnits, drawH / D);

  const vW = totalLengthUnits * scale;
  const vH = D * scale;
  const aScaled = a * scale;

  // Centre in SVG
  const x0 = (W - vW) / 2;
  const y0 = (H_svg - vH) / 2;

  // Fill height in pixels
  const fillPx = Math.min(pctFull / 100, 1) * vH;
  const fillY  = y0 + vH - fillPx;

  // Shell rect bounds (between the two heads)
  const shellX = x0 + aScaled;
  const shellW = L * scale;

  // clipPath id
  const clipId = 'hclip';

  // Build SVG content:
  // 1) defs with clipPath = vessel outline
  // 2) green fill rect clipped
  // 3) vessel outline stroked

  // Vessel path: left semi-ellipse + top line + right semi-ellipse + bottom line
  // Left semi-ellipse: centre at (x0+aScaled, y0+vH/2), rx=aScaled, ry=vH/2, left half
  // Right semi-ellipse: centre at (x0+aScaled+shellW, y0+vH/2)
  const cx_l = x0 + aScaled;
  const cx_r = x0 + aScaled + shellW;
  const cy   = y0 + vH / 2;
  const ry   = vH / 2;
  const rx   = Math.max(aScaled, 4);

  // Path for vessel outline (clockwise from top-left of shell)
  const vesselPath = `
    M ${cx_l} ${y0}
    L ${cx_r} ${y0}
    A ${rx} ${ry} 0 0 1 ${cx_r} ${y0 + vH}
    L ${cx_l} ${y0 + vH}
    A ${rx} ${ry} 0 0 1 ${cx_l} ${y0}
    Z
  `;

  svg.innerHTML = `
    <defs>
      <clipPath id="${clipId}">
        <path d="${vesselPath}"/>
      </clipPath>
    </defs>
    <!-- fill -->
    <rect x="${x0}" y="${fillY}" width="${vW}" height="${fillPx}"
          fill="#4caf80" fill-opacity="0.75" clip-path="url(#${clipId})"/>
    <!-- fill/liquid line -->
    ${fillPx > 0 && fillPx < vH ? `<line x1="${x0}" y1="${fillY}" x2="${x0 + vW}" y2="${fillY}"
          stroke="#2e7d52" stroke-width="1.5" clip-path="url(#${clipId})"/>` : ''}
    <!-- vessel outline -->
    <path d="${vesselPath}" fill="none" stroke="#333" stroke-width="2"/>
    <!-- level label -->
    <text x="${W / 2}" y="${H_svg - 2}" text-anchor="middle"
          fill="#555" font-size="10">${pctFull.toFixed(1)}% full</text>
  `;
}

function drawVerticalSVG(svg, W, H_svg, D, L, a, H_L, totalHeight, pctFull) {
  const margin = 14;
  const drawW  = W - 2 * margin;
  const drawH  = H_svg - 2 * margin - 14; // leave room for label

  const scale = Math.min(drawW / D, drawH / totalHeight);
  const vW  = D * scale;
  const vH  = totalHeight * scale;
  const aScaled = a * scale;

  const x0 = (W - vW) / 2;
  const y0 = margin;

  const shellY = y0 + aScaled;
  const shellH = L * scale;

  const fillPx = Math.min(pctFull / 100, 1) * vH;
  const fillY  = y0 + vH - fillPx;

  const cx = x0 + vW / 2;
  const rx = vW / 2;
  const ry_top = Math.max(aScaled, 4);
  const ry_bot = ry_top;

  // Vessel path (clockwise): top ellipse arc + right line + bottom ellipse arc + left line
  const cx_tl = x0;
  const cx_tr = x0 + vW;
  const cy_top = y0 + aScaled;
  const cy_bot = y0 + aScaled + shellH;

  const vesselPath = `
    M ${x0} ${cy_top}
    A ${rx} ${ry_top} 0 0 1 ${x0 + vW} ${cy_top}
    L ${x0 + vW} ${cy_bot}
    A ${rx} ${ry_bot} 0 0 1 ${x0} ${cy_bot}
    Z
  `;

  const clipId = 'vclip';

  svg.innerHTML = `
    <defs>
      <clipPath id="${clipId}">
        <path d="${vesselPath}"/>
      </clipPath>
    </defs>
    <!-- fill -->
    <rect x="${x0}" y="${fillY}" width="${vW}" height="${fillPx}"
          fill="#4caf80" fill-opacity="0.75" clip-path="url(#${clipId})"/>
    <!-- liquid line -->
    ${fillPx > 0 && fillPx < vH ? `<line x1="${x0}" y1="${fillY}" x2="${x0 + vW}" y2="${fillY}"
          stroke="#2e7d52" stroke-width="1.5" clip-path="url(#${clipId})"/>` : ''}
    <!-- vessel outline -->
    <path d="${vesselPath}" fill="none" stroke="#333" stroke-width="2"/>
    <!-- label -->
    <text x="${W / 2}" y="${H_svg - 2}" text-anchor="middle"
          fill="#555" font-size="10">${pctFull.toFixed(1)}% full</text>
  `;
}

function resetSVG() {
  const svg = document.getElementById('vesselDiagram');
  svg.innerHTML = '<text x="110" y="80" text-anchor="middle" fill="#aaa" font-size="12">Enter data to render diagram</text>';
}

// ═══════════════════════════════════════════
//  Event wiring
// ═══════════════════════════════════════════

// Live calculate on any input change
[elDiameter, elShellLength, elDishDepth, elLiquidLevel].forEach(el => {
  el.addEventListener('input', calculate);
  el.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
});

elOrientation.addEventListener('change', () => { autofillDishDepth(); calculate(); });
elHeadType.addEventListener('change',    () => { autofillDishDepth(); calculate(); });
elGlobalUnits.addEventListener('change', () => { syncUnitBadges(); calculate(); });

// Re-autofill dish depth when diameter changes
elDiameter.addEventListener('input', autofillDishDepth);

// ── Initialise ──
syncUnitBadges();
elHeadFormula.textContent = headFormulaText(elHeadType.value);
