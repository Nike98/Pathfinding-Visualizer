export function dijkstra(grid, startNode, finishNode, diagonal) {
  startNode.distance = 0;
  const visitedNodesInOrder = [];
  const allNodes = getAllNodes(grid);
  let iterations = allNodes.length;

  while (iterations--) {
    // Get the Node with the Minimum distance and which is not visited
    const closestNode = getClosestUnvisitedNode(allNodes);

    if (closestNode === null) return visitedNodesInOrder;

    // If this closest Node distance is Infinity then we will be trapped
    // so we stop and return the Nodes visited till now.abs
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    // Push this closestNode in the visited nodes array and make it visited as True.
    visitedNodesInOrder.push(closestNode);
    closestNode.isVisited = true;

    // Update the distance of the neighbors of the closestNode
    const side_node_x = [0, 0, 1, -1];
    const side_node_y = [1, -1, 0, 0];

    for (let i = 0; i < 4; ++i) {
      const { col, row } = closestNode;
      const new_x = row + side_node_x[i];
      const new_y = col + side_node_y[i];

      if (
        !(
          new_x >= 0 &&
          new_y >= 0 &&
          new_x < grid.length &&
          new_y < grid[0].length
        )
      )
        continue;

      const neighbor = grid[new_x][new_y];

      if (neighbor.isVisited == true || neighbor.isWall == true) continue;
      if (closestNode.distance + 1 < neighbor.distance) {
        let edge_wt = 1;
        if (neighbor.isWeight) edge_wt *= 10;
        neighbor.distance = closestNode.distance + edge_wt;
        neighbor.previousNode = closestNode;
      }
    }
    if (diagonal === true) {
      const diagonal_nodes_x = [1, 1, -1, -1];
      const diagonal_nodes_y = [1, -1, 1, -1];

      for (let i = 0; i < 4; ++i) {
        const { col, row } = closestNode;
        const new_x = row + diagonal_nodes_x[i];
        const new_y = col + diagonal_nodes_y[i];

        if (
          !(
            new_x >= 0 &&
            new_y >= 0 &&
            new_x < grid.length &&
            new_y < grid[0].length
          )
        )
          continue;

        const neighbor = grid[new_x][new_y];

        if (neighbor.isVisited == true || neighbor.isWall == true) continue;
        if (closestNode.distance + 1.2 < neighbor.distance) {
          let edge_wt = 1.2;
          if (neighbor.isWeight) edge_wt *= 10;
          neighbor.distance = closestNode.distance + edge_wt;
          neighbor.previousNode = closestNode;
        }
      }
    }
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) node.push(node);
  }
  return nodes;
}

function getClosestUnvisitedNode(allNodes) {
  let closestNode = null;
  let minDistance = Infinity;

  for (const node of allNodes) {
    if (node.isVisited == true || node.isWall == true) continue;
    if (node.distance < minDistance) {
      closestNode = node;
      minDistance = node.distance;
    }
  }
  console.log(closestNode);
  return closestNode;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the pathfinding algorithm is called above.
// This method is same for any algorithm.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
