import { DnD } from "./dnd"



export class Note {
  data = JSON.parse(localStorage.getItem('data')) || []
  editNoteClass = 'card_edit'
  DnD = DnD
  // bg = '#ff0000'

  constructor(wrapElement = null) {
    this.wrapElement = document.querySelector('#wrapSector') || document.body
    // || document.body
    console.log(this.wrapElement)
    this.buttonElement = document.querySelector('#btn')
    // this.element = document.querySelector('#element')


    this.bgElement = document.querySelector('#bg')
    this.bg = this.bgElement.value
    console.log(this.bg)


    this._init()
  }

  _init() {
    this.buttonElement.addEventListener('click', this._handleClickButton.bind(this))

    document.addEventListener('dbclick', this._handleDobleClick.bind(this))

    window.addEventListener('beforeunload', this._handleBeforeunload.bind(this))

    document.addEventListener('click', this._handleClickButtonSubmit.bind(this))


    this._render()
  }

  _createNote() {
    const noteData = {
      id: new Date().getTime(),
      content: 'hy',
      bg: this.bg,
      position: {
        left: 'auto',
        top: 'auto',
      }
    }

    console.log(noteData)
    this.data.push(noteData)

  }


  _template(noteData) {
    const { id, content, position, bg } = noteData
    // console.log(noteData)
    const dndWrapElement = document.createElement('div')

    console.log(position)
    this._setPosition(position, dndWrapElement)

    dndWrapElement.classList.add('dnd')
    // this.wrapElement = new Dnd(dndWrapElement)
    new this.DnD(dndWrapElement)


    dndWrapElement.addEventListener('dnd:end', (event) => {
      const { position } = event.detail

      const index = this._getIndexSelectorNote(id)


      this.data[index].position = position
      // console.log(this.data[index].position)
      this._setPosition(position, dndWrapElement)
      // console.log(this.data)
    })
    dndWrapElement.addEventListener('click', this._handleClickClose.bind(this))


    //
    // const bg = this.bg.value
    //
    const template = `
    <div data-id="${id}" style="background: ${bg}; max-width: 16rem; box-shadow: 10px 5px 5px #000;"
        class="card text-white  mb-3"  >
        <div class="card-header">
          <h3>Записка</h3>
          <button class="btn btn-light card__close">❌</button>

        </div>
        <form class="card__form mt-2">
          <textarea class="w-100" rows="4">${content}</textarea>
          <button type="submit" class="btn btn-sm btn-success
          submit-form">
          Сохранить
          </button>
        </form>
    </div>
    `
    dndWrapElement.innerHTML = template
    // console.log(dndElement)
    return dndWrapElement

  }


  _getIndexSelectorNote(id) {
    let index = 0

    this.data.forEach((item, i) => {
      if (item.id == id) {
        index = i
      }
    })

    return index
  }

  _handleDobleClick(event) {
    const { target } = event
    const cardElement = target.closest('.card')

    if (cardElement) {
      cardElement.classList.add('.editNoteClass')

    }
  }


  _handleClickButton() {
    // console.log('gfgd')
    this._createNote()


    this._render()
    // this._createNote()
  }

  _handleBeforeunload() {
    localStorage.setItem('data', JSON.stringify(this.data))

    // console.log(this.data)
  }

  _handleClickButtonSubmit(event) {
    event.preventDefault()
    const { target } = event

    if (target.classList.value.includes('submit-form')) {
      const textareaElement = target.previousElementSibling
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectorNote(id)
      this.data[index].content = textareaElement.value


      this._handleBeforeunload()
      // this._render(this.data)
    }
  }


  _handleClickClose(event) {
    const { target } = event

    if (target.classList.value.includes('card__close')) {
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectorNote(id)
      this.data.splice(index, 1)


      this._handleBeforeunload()
      this._render(this.data)
    }
  }

  _setPosition({ left, top }, element) {
    element.style.left = left
    element.style.top = top
  }

  _render() {
    // const wrapElement = document.querySelector('wrapSector')
    // console.log(this.wrapElement)
    this.wrapElement.innerHTML = ''

    this.data.forEach((item) => {
      // console.log(item.position)
      // this._setPosition(item.position, this.wrapElement)

      const noteElement = this._template(item)
      this.wrapElement.append(noteElement)
    })

  }
}
