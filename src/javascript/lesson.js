
export class Note {
  data = JSON.parse(localStorage.getItem('data')) || []
  editNoteClass = 'card_edit'
  DnD = DnD
  bg = '#ff0000'

  constructor(wrapSector = null, buttonSelector = null,) {
    this.wrapElememt = document.querySelector('wrapSector') ||
      document.body
    this.buttonElement = document.querySelector('#btn')
    // this.element = document.querySelector('#element')


    this.bgElement = document.querySelector('#bg')
    this.bg = this.bgElement.value


    this._init()
  }

  _init() {
    this.buttonElement.addEventListener('click', this._handleClickButton.bind(this))

    document.addEventListener('dbclick', this._handleDobleClick.bind(this))
    // this._render()
    window.addEventListener('beforeunload', this._handleBeforeunload.bind(this))

    document.addEventListener('click', this._handleClickButtonSubmit.bind(this))
    // localStorage.setItem('data', JSON.stringify(this.data))
    // console.log(this.data)
    this._render(this.data)
  }







  _createNote() {
    const noteData = {
      // id: Date.now(),
      id: new Date().getTime(),
      content: 'hy',
      bg: this.bg,
      position: {
        left: 'auto',
        top: 'auto'
      }
    }
    // console.log(noteData)
    // console.log(this.data)
    this.data.push(noteData)

    // localStorage.setItem('data', JSON.stringify(noteData))
  }


  _template(noteData) {
    const { id, content, position, bg } = noteData
    const dndWrapElement = document.createElement('div')


    this._setPosition(position, dndWrapElement)

    dndWrapElement.classList.add('dnd')
    new this.Dnd(dndWrapElement)


    dndWrapElement.addEventListener('dnd:end', (event) => {
      const { position } = event.detail
      const index = this._getIndexSelectedNote(id)


      this.data[index].position = position
      this._setPosition(position, dndWrapElement)
      console.log(this.data)
    })
    dndWrapElement.addEventListener('click', this._handleCloskClose.bind(this))


    //
    // const bg = this.bgElement.value
    //
    const template = `
    <div data-id="${id}" style="background: ${bg}; max-width: 16rem; box-shadow: 10px 5px 5px #000;" class="card text-white  mb-3"  >
        <div class="card-header">
          <h3>Записка</h3>
          <button class="btn btn-light">❌</button>
        </div>
        <form class="card_form mt-2">
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
  }

  _handleClickButtonSubmit(event) {
    event.preventDefault()
    const { target } = event

    if (target.classList.value.includes('submit-form')) {
      const textareaElement = target.previousElementSibling
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectedNote(id)
      this.data[index].content = textareaElement.value

      this._render()
    }
  }


  _handleClickClose(event) {
    const { target } = event

    if (target.classList.value.includes('card-close')) {
      const cardElement = target.closest('.card')

      const { id } = cardElement.dataset
      const index = this._getIndexSelectorNote(id)
      this.data.splice(index, 1)

      this._render()
    }
  }

  _setPosition({ left, top }, element) {
    element.style.left = left
    element.style.top = top

  }

  _render() {
    this.wrapElememt.innerHTML = ''
    // this._createNote()
    // const dndElement = this._template()
    // const el = this.element

    this.data.forEach((item) => {
      console.log(item)
      const noteElement = this._template(item)
      this.wrapElememt.append(noteElement)
    })
    // document.innerHTML += dndElement


    // this.element.innerHTML = template
  }
}
