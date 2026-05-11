export type PieceCoord = { x: number; y: number };
export type FormationData = {
  formation_a: Record<string, PieceCoord>;
  formation_b: Record<string, PieceCoord>;
};

export function loadFormation(data: FormationData) {
  const pieces = Object.keys(data.formation_a);
  return pieces.map((key) => ({
    id: key,
    a: data.formation_a[key],
    b: data.formation_b[key],
  }));
}

export function interpolatePosition(
  a: PieceCoord,
  b: PieceCoord,
  progress: number
): PieceCoord {
  return {
    x: a.x + (b.x - a.x) * progress,
    y: a.y + (b.y - a.y) * progress,
  };
}
