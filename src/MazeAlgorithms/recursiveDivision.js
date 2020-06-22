export function recursiveDivision(grid) {}

function recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, startY, endY) {
  const HEIGHT = endX - startX + 1;
  const WIDTH = endY - startY + 1;

  // Base  case
  if (HEIGHT <= 2 || WIDTH <= 2) return;

  // Corner Case
  if (
    startX < 0 ||
    startY < 0 ||
    endX >= grid.length ||
    endY >= grid[0].length ||
    startX > endX ||
    startY > endY
  )
    return;

  // Choose Orientation
  const orientation = getOrientation(HEIGHT, WIDTH);

  // Generate the wall and divide the grid and call recursively
  if (orientation === "Horizontal") {
    const wallX = getRandomInteger(startX + 1, endX - 1);
    const skipY = getRandomInteger(startY, endY);

    for (let wallY = startY; wallY <= endY; ++wallY) {
      if (wallY === skipY) continue;
      const node = grid[wallX][wallY];
      node.isWall = true;
      visitedNodesInOrder.push(node);
    }

    recursiveDivisionUtil(grid, visitedNodesInOrder, startX, wallX - 1, startY, endY); // Above
    recursiveDivisionUtil(grid, visitedNodesInOrder, wallX + 1, endX, startY, endY);   // Below
  } 
  else if (orientation === "Vertical") {
    const wallY = getRandomInteger(startY + 1, endY - 1);
    const skipX = getRandomInteger(startX, endX);

    for (let wallX = startX; wallX <= endX; ++wallX) {
      if (wallX === skipX) continue;
      const node = grid[wallX][wallY];
      node.isWall = true;
      visitedNodesInOrder.push(node);
    }

    recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, startY, wallY - 1);   // Left
    recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, wallY + 1, endY);     // Right
  }
}

const getOrientation = (HEIGHT, WIDTH) => {
  let orientation = null;

  if (HEIGHT > WIDTH) orientation = "Horizontal";
  else if (WIDTH > HEIGHT) orientation = "Vertical";
  else {
    const i = getRandomInteger(1, 2);
    if (i === 1) orientation = "Horizontal";
    else orientation = "Vertical";
  }
  return orientation;
};

const getRandomInteger = (min, max) => {
  max = max + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};
