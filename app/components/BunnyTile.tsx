    export default function BunnyTile() {
  return (
    <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/background/bunny-tile.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "150px",
          opacity: 0.4,
        }}
      />
    ); }