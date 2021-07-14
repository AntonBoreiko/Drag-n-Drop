export class DnD {
  position = {
    left: 'auto',
    top: 'auto'
  }

  shifts = {
    x: 0,
    y: 0
  }

  constructor(element) {
    this.element = element

    this._init()
  }

  _init() {
    this.handleMouseDown = this._handleMouseDown.bind(this)
    this.handleMouseMove = this._handleMouseMove.bind(this)
    this.handleMouseUp = this._handleMouseUp.bind(this)

    this.element.classList.add('position-absolute')

    this.element.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  _handleMouseDown({ clientX, clientY }) {
    document.addEventListener('mousemove', this.handleMouseMove)
    this._calcShifts(clientX, clientY)
    this._setPosition(clientX, clientY)
  }

  _handleMouseMove({ clientX, clientY }) {
    this._setPosition(clientX, clientY)
  }

  _handleMouseUp({ clientX, clientY }) {
    document.removeEventListener('mousemove', this.handleMouseMove)
    this._setPosition(clientX, clientY)

    const event = new CustomEvent('dnd:end', {
      detail: { position: this.position }
    })

    this.element.dispatchEvent(event)
  }

  _calcShifts(x, y) {
    const rect = this.element.getBoundingClientRect()

    this.shifts.x = x - rect.left
    this.shifts.y = y - rect.top
  }

  _setPosition(left, top) {
    this.position.left = left - this.shifts.x
    this.position.top = top - this.shifts.y

    this.element.style.left = this.position.left + 'px'
    this.element.style.top = this.position.top + 'px'
  }
}
