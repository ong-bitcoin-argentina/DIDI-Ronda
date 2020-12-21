export const isActive = round =>
  round.start &&
  round.shifts.find(shift => ["pending", "current"].includes(shift.status));

export const isFinished = round =>
  !round.shifts.find(shift => ["pending", "current"].includes(shift.status));
