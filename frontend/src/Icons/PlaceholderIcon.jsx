export default function PlaceholderIcon({ size, text }) {
  const loaderStyle = {
    display: 'flex',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  }
  return (
    <div style={loaderStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" height={size} width={size}>
        <rect x="2" y="2" width="96" height="96" style={{ fill: '#dedede', stroke: '#555555', strokeWidth: 'none' }} />
        <text
          x="50%"
          y="50%"
          fontSize="15"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="#555555"
        >
          {text}
        </text>
      </svg>
    </div>
  )
}
