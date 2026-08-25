import {
  ORG_PLACE,
  renderDeckVisual,
  type DeckVisualConfig,
  type DeckVisualScene,
  type NodeFrame,
} from "@/lib/deck-visual"
import { flowChartLayout } from "@/lib/flow-chart"
import { orgChartLayout } from "@/lib/org-chart"

type InkKey = "primary" | "secondary" | "muted"

function InkLayer({
  scene,
  ink,
}: {
  scene: DeckVisualScene
  ink: InkKey
}) {
  const paths = scene.paths.filter((path) => path.ink === ink)
  if (paths.length === 0) return null
  const offset = scene.offsets[ink]
  // Regel 10: flere linjer, dimmere bilde — bare hovedblekket betaler.
  const refresh = ink === "primary" ? scene.refresh : 1

  return (
    <g
      transform={`translate(${offset.x} ${offset.y})`}
      fill="none"
      stroke={scene.palette[ink]}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ mixBlendMode: scene.blend }}
    >
      {scene.overdrawOffsets.map((pass, passIndex) => (
        <g
          key={passIndex}
          transform={`translate(${pass.x} ${pass.y})`}
          opacity={passIndex === 0 ? 1 : 0.55}
        >
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              strokeWidth={path.weight}
              strokeDasharray={path.dash}
              opacity={path.opacity * refresh}
            />
          ))}
        </g>
      ))}
    </g>
  )
}

/**
 * Regel 9: tegningen lager ikke lesbar tekst. Navnene i org-kartet settes med
 * dekkets egne skrifter, oppå blekket — ikke tegnet av pennen.
 */
function OrgLabels({ scene, config }: { scene: DeckVisualScene; config: DeckVisualConfig }) {
  const layout = orgChartLayout(config)
  const ink = scene.palette.primary
  const rust = scene.palette.secondary

  return (
    <g style={{ mixBlendMode: scene.blend }}>
      {layout.boxes.map((box) => {
        const cx = box.x + box.w / 2
        const cy = box.y + box.h / 2

        if (box.size === "chip" || box.size === "daemon") {
          return (
            <g key={box.id}>
              <text
                className="font-mono"
                x={cx}
                y={cy + (box.role ? -1 : 2.6)}
                textAnchor="middle"
                fontSize="7.4"
                letterSpacing="0.05em"
                fill={ink}
                opacity="0.82"
              >
                {box.name}
              </text>
              {box.role ? (
                <text
                  className="font-mono"
                  x={cx}
                  y={cy + 9}
                  textAnchor="middle"
                  fontSize="5.8"
                  letterSpacing="0.16em"
                  fill={rust}
                >
                  {box.role.toUpperCase()}
                </text>
              ) : null}
            </g>
          )
        }

        if (box.size === "unit") {
          return (
            <g key={box.id}>
              <text
                className="font-mono"
                x={box.x + 13}
                y={box.y + 18}
                fontSize="6.2"
                letterSpacing="0.16em"
                fill={rust}
              >
                {box.role.toUpperCase()}
              </text>
              <text
                className="font-serif"
                x={box.x + 13}
                y={box.y + 39}
                fontSize="13"
                fontWeight="600"
                letterSpacing="-0.015em"
                fill={ink}
              >
                {box.name}
              </text>
            </g>
          )
        }

        // Teamet, Viktor og hjernen: navn midtstilt, rolle under.
        const big = box.size === "hub"
        return (
          <g key={box.id}>
            <text
              className="font-serif"
              x={cx}
              y={cy - (big ? 1 : 0)}
              textAnchor="middle"
              fontSize={big ? "17" : box.size === "brain" ? "14" : "12.5"}
              fontWeight="600"
              letterSpacing="-0.015em"
              fill={ink}
            >
              {box.name}
            </text>
            <text
              className="font-mono"
              x={cx}
              y={cy + (big ? 14 : 12)}
              textAnchor="middle"
              fontSize="6.2"
              letterSpacing="0.16em"
              fill={rust}
            >
              {box.role.toUpperCase()}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function FlowLabels({ scene, config }: { scene: DeckVisualScene; config: DeckVisualConfig }) {
  const layout = flowChartLayout(config)
  const ink = scene.palette.primary
  const rust = scene.palette.secondary

  return (
    <g style={{ mixBlendMode: scene.blend }}>
      {layout.boxes.map((box) => (
        <g key={box.id}>
          <text
            className="font-mono"
            x={box.x + 15}
            y={box.y + 22}
            fontSize="7"
            letterSpacing="0.16em"
            fill={rust}
          >
            {box.step}
          </text>
          <text
            className="font-serif"
            x={box.x + 15}
            y={box.y + 52}
            fontSize="16.5"
            fontWeight="600"
            letterSpacing="-0.02em"
            fill={ink}
          >
            {box.title}
          </text>
          {box.note.map((line, index) => (
            <text
              key={line}
              className="font-serif"
              x={box.x + 15}
              y={box.y + 78 + index * 13}
              fontSize="9.4"
              fill={ink}
              opacity="0.8"
            >
              {line}
            </text>
          ))}
        </g>
      ))}
      <text
        className="font-mono"
        x={layout.loopLabel.x}
        y={layout.loopLabel.y - 13}
        textAnchor="middle"
        fontSize="7"
        letterSpacing="0.16em"
        fill={rust}
      >
        DERFOR GIDDER VI Å SKRIVE INN
      </text>
    </g>
  )
}

/**
 * Varm vektor. Ren funksjon av configen — samme config gir samme bilde.
 * Se `plans/visual-language-vektor.md` for reglene tegningen adlyder.
 */
export function DeckVisual({
  config,
  className,
  idPrefix,
  preserveAspectRatio = "xMidYMid slice",
  showGround = true,
  nodeFrame,
  omitCeoBox,
  nodeLabel,
}: {
  config: DeckVisualConfig
  className?: string
  idPrefix?: string
  preserveAspectRatio?: string
  /** Slå av når tegningen skal ligge oppå en flate som allerede har papiret. */
  showGround?: boolean
  /** Kun modus «node»: boksens posisjon og form, klar til å interpoleres. */
  nodeFrame?: NodeFrame
  /** Kun modus «organisasjon»: la den morphende noden tegne CEO-boksen. */
  omitCeoBox?: boolean
  nodeLabel?: { role: string; name: string }
}) {
  const scene = renderDeckVisual(config, { nodeFrame, omitCeoBox })
  const uid = idPrefix ?? `dv-${config.mode}-${config.seed}`
  const primary = scene.paths.filter((path) => path.ink === "primary")

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      style={{
        isolation: "isolate",
        backgroundColor: showGround ? scene.palette.ground : undefined,
      }}
    >
      <defs>
        {/* Regel 7: halation — lys som sprer seg i glasset, blekk som trekker
            inn i papirfiberet. Bredt og svakt, aldri en hard neonkant. */}
        <filter
          id={`${uid}-halo`}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={1.4 + config.halo * 8} />
        </filter>
      </defs>

      {showGround ? (
        <rect width={scene.width} height={scene.height} fill={scene.palette.ground} />
      ) : null}

      {/* Hele kartet plasseres som én enhet. Ligger gløden utenfor, spøker den
          i full størrelse bak tegningen. */}
      <g
        transform={
          config.mode === "organisasjon" || config.mode === "flyt"
            ? `translate(${ORG_PLACE.x} ${ORG_PLACE.y}) scale(${ORG_PLACE.scale})`
            : undefined
        }
      >
      {scene.hatch.length > 0 ? (
        <g
          transform={`translate(${scene.offsets.muted.x} ${scene.offsets.muted.y})`}
          fill="none"
          stroke={scene.palette.muted}
          strokeLinecap="round"
          style={{ mixBlendMode: scene.blend }}
        >
          {scene.hatch.map((path) => (
            <path
              key={path.id}
              d={path.d}
              strokeWidth={path.weight}
              opacity={path.opacity}
            />
          ))}
        </g>
      ) : null}

      {config.halo > 0.02 ? (
        <g
          fill="none"
          stroke={scene.glowInk}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${uid}-halo)`}
          opacity={config.halo * (scene.blend === "screen" ? 0.85 : 0.4)}
          style={{ mixBlendMode: scene.blend }}
        >
          {primary.map((path) => (
            <path
              key={`${path.id}-halo`}
              d={path.d}
              strokeWidth={path.weight * (2 + config.halo * 3.4)}
              opacity={path.opacity}
            />
          ))}
        </g>
      ) : null}

      <InkLayer scene={scene} ink="muted" />
      <InkLayer scene={scene} ink="secondary" />
      <InkLayer scene={scene} ink="primary" />

      {/* Regel 3: strålen dveler i hjørnet, pennen pøler i hjørnet. */}
      {config.bloom > 0.02 ? (
        <g fill={scene.palette.primary} style={{ mixBlendMode: scene.blend }}>
          {scene.nodes.map((node, index) => (
            <circle
              key={index}
              cx={node.x}
              cy={node.y}
              r={node.r}
              opacity={node.opacity * scene.refresh}
            />
          ))}
        </g>
      ) : null}

      {config.mode === "organisasjon" ? (
        <OrgLabels scene={scene} config={config} />
      ) : null}
      {config.mode === "flyt" ? <FlowLabels scene={scene} config={config} /> : null}
      </g>

      {nodeFrame && nodeLabel && nodeFrame.label > 0.01 ? (
        <g
          opacity={nodeFrame.label}
          style={{ mixBlendMode: scene.blend }}
          transform={`translate(${nodeFrame.x + 26} ${nodeFrame.y + nodeFrame.h / 2})`}
        >
          <text
            className="font-mono"
            y="-14"
            fontSize="10.5"
            letterSpacing="0.16em"
            fill={scene.palette.secondary}
          >
            {nodeLabel.role.toUpperCase()}
          </text>
          <text
            className="font-serif"
            y="22"
            fontSize="26"
            fontWeight="600"
            letterSpacing="-0.02em"
            fill={scene.palette.primary}
          >
            {nodeLabel.name}
          </text>
        </g>
      ) : null}

      {scene.fibres.length > 0 ? (
        <g
          fill="none"
          stroke={scene.palette.primary}
          strokeWidth="0.7"
          strokeLinecap="round"
          style={{ mixBlendMode: scene.blend }}
        >
          {scene.fibres.map((fibre, index) => (
            <path key={index} d={fibre.d} opacity={fibre.opacity} />
          ))}
        </g>
      ) : null}
    </svg>
  )
}
