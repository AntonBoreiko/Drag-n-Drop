import { DnD } from './dnd'

class Note {
  data = JSON.parse(localStorage.getItem('data')) || []
  editNoteClass = 'card_edit'
  DnD = DnD

  constructor(wrapSector = null, buttonSelector = null) {
    this.wrapElement = document.querySelector(wrapSector) || document.body
    this.buttonElement = document.querySelector(buttonSelector)
    this.bg = document.querySelector('#color')

    this._init()
  }

  _init() {
    this.buttonElement.addEventListener('click', this._handleClickButtonCreateNote.bind(this))
    document.addEventListener('dblclick', this._handleDoubleClick.bind(this))
    document.addEventListener('click', this._handleClickButtonSubmit.bind(this))
    window.addEventListener('beforeunload', this._handleBeforeUnload.bind(this))

    this.render()
  }


  _handleBeforeUnload() {
    localStorage.setItem('data', JSON.stringify(this.data))
  }

  _handleClickButtonCreateNote() {
    this._createNote()
    this.render()
  }

  _handleDoubleClick(event) {
    const { target } = event
    const cardElement = target.closest('.card')

    if (cardElement) {
      cardElement.classList.add(this.editNoteClass)
    }
  }

  _handleClickButtonSubmit(event) {
    // event.preventDefault()
    const { target } = event

    if (target.classList.value.includes('submit-form')) {
      const textareaElement = target.previousElementSibling
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectedNote(id)
      this.data[index].content = textareaElement.value

      this.render()
    }
  }


  _handleClickClose(event) {
    const { target } = event

    if (target.classList.value.includes('card__close')) {
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectedNote(id)
      this.data.splice(index, 1)

      this.render()
    }
  }


  _createNote() {
    const noteData = {
      id: new Date().getTime(),
      content: 'двойной клик',
      color: color.value,
      position: {
        left: 'auto',
        top: 'auto'
      }
    }

    this.data.push(noteData)
  }


  _buildNoteElement(noteData) {
    const { id, content, position, color } = noteData
    const dndWrapElement = document.createElement('div')

    this._setPosition(position, dndWrapElement) // 1. устанавливаем позицию
    dndWrapElement.classList.add('dnd')
    new this.DnD(dndWrapElement) // 2. передаем элемент с его сохраненной позицией

    dndWrapElement.addEventListener('dnd:end', (event) => {
      const { position } = event.detail
      const index = this._getIndexSelectedNote(id)

      this.data[index].position = position
      this._setPosition(position, dndWrapElement)
    })

    dndWrapElement.addEventListener('click', this._handleClickClose.bind(this))

    const template = `
      <div data-id="${id}" class="card border-primary mb-3" style="max-width: 18rem; background-color: ${color}; cursor:pointer;">
      <button type="button" class="card__close btn-warning">❌</button>
        <h5 class="card-header">Записка</h5>
        <form class="card__form mt-2">
          <textarea class="w-100" rows="3">${content}</textarea>
          <button type="submit" class="btn btn-sm btn-success submit-form">Save</button>
        </form>
        <div class="card__content">${content}</div>
    </div>
    `
    dndWrapElement.innerHTML = template

    return dndWrapElement
  }

  _getIndexSelectedNote(id) {
    let index = 0

    this.data.forEach((item, i) => {
      if (item.id == id) {
        index = i
      }
    })

    return index
  }

  _setPosition({ left, top }, element) {
    element.style.left = left
    element.style.top = top
  }

  render() {
    this.wrapElement.innerHTML = ''

    this.data.forEach((item) => {
      const noteElement = this._buildNoteElement(item)
      this.wrapElement.append(noteElement)
    })
  }
}

export { Note }
