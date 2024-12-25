const grid = document.querySelector(".grid");
const tiles = Array.from(document.querySelectorAll(".tile")); 
const emptyTile = document.querySelector(".tile--empty");
const heading = document.querySelector(".heading");

// 按钮点击事件
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#overlay').style.display = 'none';
    document.querySelector('.puzzle-box').style.visibility = 'visible';
  });
});

// A key / value store of what areas to "unlock"
const areaKeys = {
    A: ["B", "D"],
    B: ["A", "C", "E"],
    C: ["B", "F"],
    D: ["A", "E", "G"],
    E: ["B", "D", "F", "H"],
    F: ["C", "E", "I"],
    G: ["D", "H"],
    H: ["E", "G", "I"],
    I: ["F", "H"],
  };
  
  // Add click listener to all tiles
  tiles.map((tile) => {
    tile.addEventListener("click", (event) => {
      // 获取当前点击的tile的区域和空白tile的区域
      const tileArea = tile.style.getPropertyValue("--area").trim();
      const emptyTileArea = emptyTile.style.getPropertyValue("--area").trim();
      
      // 检查点击的tile是否与空白tile相邻
      // if (areaKeys[emptyTileArea].includes(tileArea) || 1) {
        // 交换位置
        emptyTile.style.setProperty("--area", tileArea);
        tile.style.setProperty("--area", emptyTileArea);

        // 解锁相邻的tiles
        unlockTiles(tileArea);
      // }
    });
  });
  
  // Unlock or lock tiles based on empty tile position
  const unlockTiles = (currentTileArea) => {
    // Cycle through all the tiles and check which should be disabled and enabled
    tiles.map((tile) => {
      const tileArea = tile.style.getPropertyValue("--area");
  
      // Check if that areaKey has the tiles area in it's values
      // .trim() is needed because the animation lib formats the styles attribute
      if (areaKeys[currentTileArea.trim()].includes(tileArea.trim())) {
        tile.disabled = false;
      } else {
        tile.disabled = true;
      }
    });
  
    // Check if the tiles are in the right order
    isComplete(tiles);
  };
  
  // 华容道完成后的处理
    const isComplete = (tiles) => {
      const currentTilesString = tiles
        .map((tile) => tile.style.getPropertyValue("--area").trim())
        .toString();

      if (currentTilesString === Object.keys(areaKeys).toString()) {
        heading.children[1].innerHTML = "圣诞快乐!";
        heading.style = `
          animation: popIn .3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        // 显示视频
        document.querySelector('.puzzle').style.display = 'none';
        const videoContainer = document.querySelector('#video-container');
        videoContainer.style.display = 'block';
        
        // 播放视频
        const video = document.querySelector('#video1');
        if(video) {
          video.play();
        }
      }
    };
  
  // Inversion calculator
  const inversionCount = (array) => {
    // Using the reduce function to run through all items in the array
    // Each item in the array is checked against everything before it
    // This will return a new array with each intance of an item appearing before it's original predecessor
    return array.reduce((accumulator, current, index, array) => {
      return array
        .slice(index)
        .filter((item) => {
          return item < current;
        })
        .map((item) => {
          return [current, item];
        })
        .concat(accumulator);
    }, []).length;
  };
  
  // Randomise tiles
  const shuffledKeys = (keys) =>
    Object.keys(keys).sort(() => 0.5 - Math.random());
  
  setTimeout(() => {
    // Begin with our in order area keys
    let startingAreas = Object.keys(areaKeys);
  
    // Use the inversion function to check if the keys will be solveable or not shuffled
    // Shuffle the keys until they are solvable
    while (
      inversionCount(startingAreas) % 2 == 1 ||
      inversionCount(startingAreas) == 0
    ) {
      startingAreas = shuffledKeys(areaKeys);
    }
  
    // Apply shuffled areas
    tiles.map((tile, index) => {
      tile.style.setProperty("--area", startingAreas[index]);
    });
  
    // Unlock and lock tiles
    unlockTiles(emptyTile.style.getPropertyValue("--area"));
  }, 2000);