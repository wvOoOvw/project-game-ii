import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class UI {
  constructor(props = {}) {
    this.x = props.x || 0
    this.y = props.y || 0
    this.width = props.width || 0
    this.height = props.height || 0

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }
}

class Click {
  constructor(props) {
    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }
  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }
  eventMove(e) {
    this.touchTimeout = false
  }

  addEventListener(option) {
    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

export { UI, Click }