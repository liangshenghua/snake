// 食物
class Foot {
  element; // 食物的节点

  constructor() {
    this.element = document.getElementById('food')
    console.log(this.element)
  }

  get X () {  // 获取食物的x坐标
    return this.element.offsetLeft
  }

  get Y () { // 获取食物的 Y轴坐标
    return this.element.offsetTop
  }

  change () {
    let top = Math.floor(Math.random() * (14 - 0 + 1) + 0) * 33
    let left = Math.floor(Math.random() * (16 - 0 + 1) + 0) * 33
    this.element.style.top = top + 'px'
    this.element.style.left = left + 'px'
  }

}

class Snake {
  headerElement; // 蛇头部的容器
  snakeElement; // 蛇的容器
  bodies; // 蛇的所有容器
  constructor() {
    this.headerElement = document.querySelector('#snake > div')
    this.snakeElement = document.getElementById('snake')
    this.bodies = this.snakeElement.getElementsByTagName('div')
  }

  get X () {
    return this.headerElement.offsetLeft
  }

  get Y () {
    return this.headerElement.offsetTop
  }

  set X (value) {
    if (value === this.X) { return }
    if (value < 0 || value > 528) {
      throw new Error('撞墙了')
    }
    // 修改x时，是在修改水平坐标，蛇在左右移动，蛇在向左移动时，不能向右掉头，反之亦然
    if (this.bodies[1] && this.bodies[1].offsetLeft === value) {
      // console.log('水平方向发生了掉头');
      // 如果发生了掉头，让蛇向反方向继续移动
      if (value > this.X) {
        // 如果新值value大于旧值X，则说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
        value = this.X - 33;
      } else {
        // 向左走
        value = this.X + 33;
      }
    }
    this.moveBody()
    this.headerElement.style.left = value + 'px'
    this.checkHeadBody()
  }

  set Y (value) {
    if (value === this.Y) { return }
    if (value < 0 || value > 462) {
      throw new Error('撞墙了')
    }
    // 修改y时，是在修改垂直坐标，蛇在上下移动，蛇在向上移动时，不能向下掉头，反之亦然
    if (this.bodies[1] && this.bodies[1].offsetTop === value) {
      if (value > this.Y) {
        value = this.Y - 33;
      } else {
        value = this.Y + 33;
      }
    }
    this.moveBody()
    this.headerElement.style.top = value + 'px'
    this.checkHeadBody()
  }

  addBody () {
    this.snakeElement.insertAdjacentHTML("beforeend", "<div class='snake-item'></div>");
  }
  // 添加一个蛇身体移动的方法
  moveBody () {
    /*
    *   将后边的身体设置为前边身体的位置
    *       举例子：
    *           第4节 = 第3节的位置
    *           第3节 = 第2节的位置
    *           第2节 = 蛇头的位置
    */
    // 遍历获取所有的身体
    for (let i = this.bodies.length - 1; i > 0; i--) {
      // 获取前边身体的位置
      let X = this.bodies[i - 1].offsetLeft;
      let Y = this.bodies[i - 1].offsetTop;

      // 将值设置到当前身体上
      this.bodies[i].style.left = X + 'px';
      this.bodies[i].style.top = Y + 'px';
    }
  }
  // 检查蛇头是否撞到身体的方法
  checkHeadBody () {
    // 获取所有的身体，检查其是否和蛇头的坐标发生重叠
    for (let i = 1; i < this.bodies.length; i++) {
      let bd = this.bodies[i]
      if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
        // 进入判断说明蛇头撞到了身体，游戏结束
        throw new Error('撞到自己了！');
      }
    }
  }
}

class Control {
  snake;
  food;
  direction;
  live = true; // 是否存活
  constructor() {
    this.snake = new Snake()
    this.food = new Foot()
    this.init()
  }

  init () {
    this.food.change()
    document.addEventListener('keydown', this.keydownHandler.bind(this))
    this.run()
  }
  // 监听按下的键
  keydownHandler (event) {
    this.direction = event.keyCode
  }
  // 蛇移动的方法
  run () {
    // 现在蛇的坐标
    let X = this.snake.X
    let Y = this.snake.Y
    switch (this.direction) {
      case 37:
        X -= 33
        break;
      case 38:
        Y -= 33
        break;
      case 39:
        X += 33
        break;
      case 40:
        Y += 33
        break;
    }
    // 食物是否被吃到
    this.checkEat(X, Y)
    try {
      this.snake.X = X
      this.snake.Y = Y
    } catch (error) {
      alert(error.message)
      this.live = false
    }


    this.live && setTimeout(this.run.bind(this), 200)
  }
  // 判断食物是否被吃到
  checkEat (X, Y) {
    if (X === this.food.X && Y === this.food.Y) {
      this.food.change()
      this.snake.addBody()
    }
  }
}

const d = new Control()
