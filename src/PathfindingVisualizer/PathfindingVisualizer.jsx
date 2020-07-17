import React, { component } from "react";
import Node from "./Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../PathfindingAlgorithms/dijkstra";
import { bfs } from "../PathfindingAlgorithms/bfs";
import { dfs } from "../PathfindingAlgorithms/dfs";
import { astar } from "../PathfindingAlgorithms/astar";
import { dfsMaze } from "../MazeAlgorithms/dfsMaze";
import { recursiveDivision } from "../MazeAlgorithms/recursiveDivision";

import "./PathfindingVisualizer.css";
import { Component } from "react";

const getRandomInteger = (min, max) => {
  max = max + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

// Parameters
var TIME_INTERVAL = 25;
var HEIGHT = 20;
var WIDTH = 50;
var START_NODE_ROW = -1;
var START_NODE_COL = -1;
var FINISH_NODE_ROW = -1;
var FINISH_NODE_COL = -1;
var stopAnimating = false;
var pause = false;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isPlaceStart: false,
      isPlaceEnd: false,
      isPlaceWeight: false,
      isPlaceWall: false,
      startPresent: false,
      endPresent: false,
      isMousePressed: false,
    };
  }

  componentDidMount() {
    stopAnimating = false;
    pause = false;
    const grid = getInitialGrid();
    this.setState({ grid: grid });

    document
      .getElementById("stopAnimating")
      .addEventListener("click", function () {
        stopAnimating = true;
      });
    document
      .getElementById("pauseAnimating")
      .addEventListener("click", function () {
        pause = true;
      });
    document
      .getElementById("playAnimating")
      .addEventListener("click", function () {
        pause = false;
      });
  }

  placeStartNode() {
    this.setState({ isPlaceStart: true });
  }

  placeEndNode() {
    this.setState({ isPlaceEnd: true });
  }

  placeWallNode() {
    this.setState({ isPlaceWall: true });
  }

  placeWeightNode() {
    this.setState({ isPlaceWeight: true });
  }

  handleMouseClick(row, col) {
    console.log("A cell is clicked");

    const {
      isPlaceStart,
      isPlaceEnd,
      endPresent,
      startPresent,
      isMousePressed,
      isPlaceWeight,
      isPlaceWall,
    } = this.state;
    let newGrid = null;

    if (isMousePressed) {
      console.log("Back to normal state");
      this.setState({
        isMousePressed: false,
        isPlaceWall: false,
        isPlaceWeight: false,
      });
      return;
    } else if (isPlaceWall) {
      console.log("Placing wall node");
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ isMousePressed: true });
    } else if (isPlaceWeight) {
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ isMousePressed: true });
    } else if (isPlaceStart) {
      const isSameNode = row == START_NODE_ROW && col == START_NODE_COL;

      if (!isSameNode && startPresent) {
        console.log("Start Node already present");
        return;
      }

      newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
      START_NODE_ROW = row;
      START_NODE_COL = col;

      if (isSameNode) this.setState({ startPresent: false });
      else this.setState({ startPresent: true });
    } else if (isPlaceEnd) {
      const isSameNode = row == FINISH_NODE_ROW && col == FINISH_NODE_COL;
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;

      if (isSameNode) this.setState({ endPresent: false });
      else this.setState({ endPresent: true });
    }

    if (newGrid == null) {
      console.log("Error in handling Mouse click");
      return;
    }
    this.setState({ grid: newGrid, isPlaceStart: false, isPlaceEnd: false });
  }

  handleMouseEnter(row, col) {
    const {
      isPlaceStart,
      isPlaceEnd,
      isMousePressed,
      isPlaceWeight,
      isPlaceWall,
      startPresent,
      endPresent,
    } = this.state;

    if (isPlaceEnd || isPlaceStart) {
      console.log("Placing start or end node. Can't drag");
      return;
    }

    if (!isMousePressed) {
      console.log("Mouse is not being dragged");
      return;
    }

    if (startPresent && row == START_NODE_ROW && col == START_NODE_COL) {
      console.log("Start present on that cell. Can't place wall");
      return;
    }

    if (endPresent && row == FINISH_NODE_ROW && col == FINISH_NODE_COL) {
      console.log("End present on that wall. Can't place wall");
      return;
    }

    let newGrid = null;

    if (isPlaceWall) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else if (isPlaceWeight) {
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  clearBoard() {
    const grid = getInitialGrid();

    for (let row = 0; row < grid.length; ++row) {
      for (let col = 0; col < grid[0].length; ++col)
        document.getElementById(`node-${row}-${col}`).className = "node";
    }

    this.setState({
      grid: grid,
      isPlaceStart: false,
      isPlaceEnd: false,
      isPlaceWeight: false,
      isPlaceWall: false,
      startPresent: false,
      endPresent: false,
      isMousePressed: false,
    });

    this.enableExceptClearboard();
    START_NODE_ROW = -1;
    START_NODE_COL = -1;
    FINISH_NODE_ROW = -1;
    FINISH_NODE_COL = -1;
    stopAnimating = false;
    pause = false;
  }

  disableExceptClearboard() {
    // Disable Start and End node when the algorithm starts working
    const startNode = document.getElementById("start_node");
    startNode.disabled = true;
    startNode.style.background = "white";

    const endNode = document.getElementById("end_node");
    endNode.disabled = true;
    endNode.style.background = "white";

    // Disable all algorithm buttons
    document.getElementsByClassName("dropdown-btn")[0].style.background =
      "white";

    const visualizeButtons = document.getElementsByClassName("visualize");
    for (const button of visualizeButtons) button.disabled = true;

    // Disable internal algorithm buttons
    document.getElementById("bfs_d").disabled = true;
    document.getElementById("bfs_nd").disabled = true;
    document.getElementById("dfs_d").disabled = true;
    document.getElementById("dfs_nd").disabled = true;
    document.getElementById("dijkstra_d").disabled = true;
    document.getElementById("dijkstra_nd").disabled = true;
    document.getElementById("astar_d").disabled = true;
    document.getElementById("astar_nd").disabled = true;

    // Disable clear button
    document.getElementById("clear").disabled = true;
  }

  enableExceptClearboard() {
    // Enable Start and End node
    const startNode = document.getElementById("start_node");
    startNode.disabled = false;
    startNode.style.background = "#111";

    const endNode = document.getElementById("end_node");
    endNode.disabled = false;
    endNode.style.background = "#111";

    // Enable all algorithm buttons
    document.getElementsByClassName("dropdown-btn")[0].style.background =
      "#111";
    const visualizeButtons = document.getElementsByClassName("visualize");
    for (const button of visualizeButtons) button.disabled = false;

    // Disable internal algorithm button
    document.getElementById("bfs_d").disabled = false;
    document.getElementById("bfs_nd").disabled = false;
    document.getElementById("dfs_d").disabled = false;
    document.getElementById("dfs_nd").disabled = false;
    document.getElementById("dijkstra_d").disabled = false;
    document.getElementById("dijkstra_nd").disabled = false;
    document.getElementById("astar_d").disabled = false;
    document.getElementById("astar_nd").disabled = false;

    // Enable clear button
    document.getElementById("clear").disabled = false;
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <div className="sidenav">
          <button id="start_node" onClick={() => this.placeStartNode()}>
            Start Node
          </button>
          <button id="end_node" onClick={() => this.placeEndNode()}>
            End Node
          </button>
          <button
            id="wall_node"
            onClick={() => this.placeWallNode()}
            title="Click on any cell and then keep moving to create walls. Click again to stop"
          >
            Wall Node
          </button>
          <button
            id="weight_node"
            onClick={() => this.placeWeightNode()}
            title="Click on any cell and then keep moving to create weights. Click again to stop"
          >
            Weight Node
          </button>

          {/* Drop down of Pathfinding algorithm BEGIN */}
          <button
            className="dropdown-btn"
            onClick={() => this.handleAlgorithmsDropdown(0)}
          >
            Pathfinding Algorithms<i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-container" id="dropdown-container">
            {/* BFS */}
            <button
              className="visualize"
              onClick={() => this.handleAlgorithmsDropdown("bfs")}
            >
              Visualize BFS Algorithm
            </button>
            <button id="bfs_d" onClick={() => this.visualizeBFS(true)}>
              Diagonal Movement Allowed
            </button>
            <button id="bfs_nd" onClick={() => this.visualizeBFS(false)}>
              No Diagonal Movement Allowed
            </button>

            {/* DFS */}
            <button
              className="visualize"
              onClick={() => this.handleAlgorithmsDropdown("dfs")}
            >
              Visualize DFS Algorithm
            </button>
            <button id="dfs_d" onClick={() => this.visualizeDFS(true)}>
              Diagonal Movement Allowed
            </button>
            <button id="dfs_nd" onClick={() => this.visualizeDFS(false)}>
              No Diagonal Movement Allowed
            </button>

            {/* Dijkstra */}
            <button
              className="visualize"
              onClick={() => this.handleAlgorithmsDropdown("dijkstra")}
            >
              Visualize Dijkstra's Algorithm
            </button>
            <button
              id="dijkstra_d"
              onClick={() => this.visualizeDijkstra(true)}
            >
              Diagonal Movement Allowed
            </button>
            <button
              id="dijkstra_nd"
              onClick={() => this.visualizeDijkstra(false)}
            >
              No Diagonal Movement Allowed
            </button>

            {/* A* Search */}
            <button
              className="visualize"
              onClick={() => this.handleAlgorithmsDropdown("astar")}
            >
              Visualize A* Search Algorithm
            </button>
            <button id="astar_d" onClick={() => this.visualizeAStar(true)}>
              Diagonal Movement Allowed
            </button>
            <button id="astar_nd" onClick={() => this.visualizeAStar(false)}>
              No Diagonal Movement Allowed
            </button>
          </div>
          {/* Dropdown of Pathfinding algorithms END */}

          {/* Dropdown of Maze Algorithms BEGIN */}
          <button
            className="dropdown-btn"
            onClick={() => this.handleAlgorithmsDropdown(1)}
          >
            Maze Algorithms<i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-container" id="dropdown-container">
            {/* Randomized DFs */}
            <button
              className="visualize"
              onClick={() => this.visualizeDFSMaze()}
            >
              Visualize Randomized DFS Algorithm
            </button>

            {/* Recursive Division */}
            <button
              className="visualize"
              onClick={() => this.visualizeRecursiveDivision()}
            >
              Visualize Recursive Division Algorithm
            </button>
          </div>
          {/* Dropdown of Maze Algorithm END */}

          <button id="clear" onClick={() => this.clearBoard()}>
            Clear Board
          </button>
          <button id="prevGrid" onClick={() => this.getPrevBoard()}>
            Use Previous Board
          </button>
          <button id="stopAnimating">Stop Animation</button>
          <button id="pauseAnimating">Pause Animation</button>
          <button id="playAnimating">Play Animation</button>
        </div>

        <div className="main info">
          Adding WALL on cell makes it <strong>impenetrable</strong> <br />
          Adding WEIGHT on cell <strong>increases</strong> the cost to pass
          through it. Here the cost is multiplied 10 times.
        </div>

        <div className="grid main">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isEnd, isStart, isWall, isWeight } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isEnd={isEnd}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
                      onMouseClick={(row, col) =>
                        this.handleMouseClick(row, col)
                      }
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  getPrevBoard() {
    const grid = this.refreshBoardForPathFinding(this.state.grid);

    for (const row of grid) {
      for (const node of row) {
        let flag = false;

        if (node.isStart === true) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
          flag = true;
        }

        if (node.isEnd === true) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
          flag = true;
        }

        if (node.isWall === true) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall";
          flag = true;
        }

        if (node.isWeight === true) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weight";
          flag = true;
        }

        // Rest other nodes which were visualized as visited & shortest path nodes
        if (flag === false) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
      }
    }

    this.setState({ grid });
    this.enableExceptClearboard();
  }

  handleAlgorithmsDropdown(index) {
    let algorithmsContainer = document.getElementsByClassName(
      "dropdown-container"
    )[index].style;

    if (algorithmsContainer.display === "block")
      algorithmsContainer.display = "none";
    else algorithmsContainer.display = "block";
  }

  visualizeDijkstra(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("Start Node is not selected");
      return;
    }

    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("End Node is not selected");
    }

    document.getElementsByClassName("info")[0].innerHTML =
      "Dijkstra Algorithm is <strong>weighted</strong> algorithm and <strong>guarantees</strong> shortest path";
    this.disableExceptClearboard();

    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathFinding(grid);
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  visualizeBFS(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("Start node isn't selected");
      return;
    }

    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1)
      alert("End Node isn't selected");

    document.getElementsByClassName("info")[0].innerHTML =
      "Breadth First Search Algorithm is <strong>unweighted</strong> algorithm and <strong>guarantees</strong> Shortest Path";
    this.disableExceptClearboard();

    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathFinding(grid);
    const visitedNodesInOrder = bfs(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      getNodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  visualizeDFS(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("Start node isn't selected");
      return;
    }

    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1)
      alert("End Node isn't selected");

    document.getElementsByClassName("info")[0].innerHTML =
      "Depth First Search Algorithm is <strong>unweighted</strong> algorithm and <strong>doesn't</strong> guarantee Shortest Path";
    this.disableExceptClearboard();

    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathFinding(grid);
    const visitedNodesInOrder = dfs(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      getNodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  handleEachAlgorithmDropdown(algo) {
    let diagonal = document.getElementById(algo + "_d").style;
    let noDiagonal = document.getElementById(algo + "_nd").style;

    if (diagonal.display === "block") diagonal.display = "none";
    else diagonal.display = "block";

    if (noDiagonal.display === "block") noDiagonal.display = "none";
    else noDiagonal.display = "block";
  }

  visualizeAStar(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("Start Node isn't selected");
      return;
    }

    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1)
      alert("End Node isn't selected");

    document.getElementsByClassName("info")[0].innerHTML =
      "A* Search Algorithm is <strong>weighted</strong> algorithm and <strong>guarantees</strong> shortest path <br /> <strong>Faster</strong> than Dijkstra's since it uses <strong>Heuristics</strong>";
    this.disableExceptClearboard();

    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathFinding(grid);
    const visitedNodesInOrder = astar(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      getNodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  animateVisitedNodes(
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    startNode,
    finishNode
  ) {
    let i = 1;
    let animatingShortestPath = this.animateShortestPath;
    let enableExceptClearboard = this.enableExceptClearboard;

    function animate() {
      if (stopAnimating) {
        enableExceptClearboard();
        return;
      }

      if (i == visitedNodesInOrder.length - 1) {
        console.log("animating shortest path");
        animatingShortestPath(nodesInShortestPathOrder, enableExceptClearboard);
        document.getElementById("clear").disabled = false;
        return;
      }

      const node = visitedNodesInOrder[i];
      if (
        !(node.row === START_NODE_ROW && node.col === START_NODE_COL) ||
        (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL)
      ) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }
      i++;
      requestAnimationFrame(animate);
    }
    animate();
  }

  animateShortestPath(nodesInShortestPathOrder, enableExceptClearboard) {
    const firstNodeInShortestPath = nodesInShortestPathOrder[0];
    if (
      !(
        firstNodeInShortestPath.row === START_NODE_ROW &&
        firstNodeInShortestPath.col === START_NODE_COL
      )
    ) {
      alert("No Shortest Path");
      return;
    }

    const node = nodesInShortestPathOrder[0];
    document.getElementById(`node-${node.row}-${node.col}`).className =
      "node node-shortest-path node-start";

    let i = 1;
    function animate() {
      if (stopAnimating) {
        enableExceptClearboard();
        return;
      }

      const node = nodesInShortestPathOrder[i];
      if (i == nodesInShortestPathOrder.length - 1) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path node-finish";
        return;
      } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }
      i++;
      requestAnimationFrame(animate);
    }
    animate();
  }

  visualizeDFSMaze() {
    let { grid } = this.state;
    grid = this.refreshBoardForMaze(grid);
    let start_x = getRandomInteger(0, HEIGHT);
    let start_y = getRandomInteger(0, WIDTH);

    while (start_x % 2 != 0) {
      start_x = getRandomInteger(0, HEIGHT);
    }

    while (start_y % 2 != 0) {
      start_y = getRandomInteger(0, WIDTH);
    }

    const visitedNodesInOrder = dfsMaze(grid, start_x, start_y);
    this.animateMaze(visitedNodesInOrder);
  }

  visualizeRecursiveDivision() {
    let { grid } = this.state;
    const visitedNodesInOrder = recursiveDivision(grid);
    this.animateMaze(visitedNodesInOrder);
  }

  refreshBoardForPathFinding(curGrid) {
    // Defaults visited & distance of each node.
    // Need this before running pathfinding algorithms.
    const grid = curGrid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
      }
    }
    return grid;
  }

  refreshBoardForMaze(currGrid) {
    let grid = currGrid.slice();

    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.isWall = false;
      }
    }
    return grid;
  }

  animateMaze(visitedNodesInOrder) {
    let i = 1;
    let enableExceptClearboard = this.enableExceptClearboard;

    function animate() {
      if (stopAnimating) {
        enableExceptClearboard();
        return;
      }
      const node = visitedNodesInOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-wall";
      i++;
      requestAnimationFrame(animate);
    }
    animate();
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row <= HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col <= WIDTH; col++)
      currentRow.psuh(createNode(col, row));
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isEnd: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeight: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isWall=True which makes its className='node-wall' whose color is specified in te styling
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isStart=True which makes its className='node-start' whose color is specified in te styling
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithEndToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isEnd=True which makes its className='node-end' whose color is specified in the styling
  const newNode = {
    ...node,
    isEnd: !node.isEnd,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWeight: !node.isWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
