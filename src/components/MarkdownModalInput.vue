<template>
  <div>
    <!-- Input with pencil icon -->
    <div class="container shadow-sm rounded-3 py-3 my-4 hover-shadow transition-shadow">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="d-flex align-items-center gap-2">
            <input
              class="form-control shadow-sm rounded-pill px-3"
              :class="[parsedStats[statTypeEnum.Design], validationClass]"
              :placeholder="parsedStats[statTypeEnum.Placeholder]"
              :required="parsedStats[statTypeEnum.Required] || false"
              :disabled="parsedStats[statTypeEnum.Disabled] || false"
              :value="firstLine"
              readonly
              @click="openModal"
              style="flex: 1 1 auto; min-width: 0; cursor: pointer; transition: box-shadow 0.3s;"
            />
            <i
              class="bi bi-pencil-square text-primary"
              @click="openModal"
              style="cursor: pointer; transition: transform 0.2s;"
              @mouseenter="iconHover = true"
              @mouseleave="iconHover = false"
              :style="{ transform: iconHover ? 'scale(1.2)' : 'scale(1)' }"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div
        v-if="showModal"
        class="modal fade show d-block"
        tabindex="-1"
        role="dialog"
        @click.self="closeModal"
        style="animation: fadeIn 0.3s;"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div class="modal-content shadow-lg rounded-4">
            <div class="modal-header">
              <h5 class="modal-title">Markdown Editor</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <!-- Language Tabs -->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item" v-for="lang in languages" :key="lang">
                  <button
                    class="nav-link"
                    :class="{ active: currentLang === lang }"
                    @click="currentLang = lang"
                  >
                    {{ lang.toUpperCase() }}
                  </button>
                </li>
              </ul>

              <div class="row g-3">
                <div class="col-6 d-flex flex-column">
                  <!-- Toolbar -->
                  <div class="mb-3 d-flex flex-nowrap gap-2 align-items-center">
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('bold')">
                      <i class="fas fa-bold"></i> Bold
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('italic')">
                      <i class="fas fa-italic"></i> Italic
                    </button>
                    <div class="input-group input-group-sm" style="width: inherit;">
                      <button
                        class="btn btn-outline-primary dropdown-toggle fancy-button"
                        type="button"
                        id="headingDropdown"
                        data-bs-toggle="dropdown"
                      >
                        <i class="fas fa-heading"></i> {{ selectedHeading !== null ? `H${selectedHeading}` : '' }}
                      </button>
                      <ul class="dropdown-menu">
                        <li v-for="level in [1,2,3,4]" :key="level">
                          <a class="dropdown-item" href="#" @click.prevent="selectedHeading = level">H{{ level }}</a>
                        </li>
                      </ul>
                      <button
                        class="btn btn-outline-primary fancy-button"
                        type="button"
                        @click="applySelectedHeading"
                        :disabled="selectedHeading === null"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                    </div>
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('code')">
                      <i class="fas fa-code"></i> Code
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('link')">
                      <i class="fas fa-link"></i> Link
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('list')">
                      <i class="fas fa-list-ul"></i> List
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm fancy-button" @click="applyFormat('quote')">
                      <i class="fas fa-quote-right"></i> Quote
                    </button>
                  </div>

                  <!-- Textarea -->
                  <label for="markdownInput" class="form-label">Markdown Input</label>
                  <textarea
                    id="markdownInput"
                    ref="textarea"
                    v-model="markdownByLang[currentLang]"
                    class="form-control flex-grow-1 fancy-textarea"
                    rows="12"
                    style="resize: none; font-family: monospace;"
                  ></textarea>
                </div>

                <!-- Preview -->
                <div class="col-6 border-start overflow-auto preview-area" style="max-height: 500px;">
                  <label class="form-label">Preview</label>
                  <div class="p-3 bg-light rounded fade-preview" v-html="renderedMarkdown" :key="currentLang"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
              <button type="button" class="btn btn-primary fancy-save-btn" @click="saveAndClose">Save</button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ObjectTemplate, StatTypeEnum, RegionType } from '@cybertale/interface'
import MarkdownIt from 'markdown-it'

@Options({
  props: {
    object: ObjectTemplate
  }
})
export default class MarkdownModalInput extends Vue {
  object!: ObjectTemplate
  statTypeEnum = StatTypeEnum
  regionType = RegionType
  showModal = false
  parsedStats: Record<number, any> = {}
  iconHover = false
  selectedHeading: number | null = 1
  currentLang = 'hr'
  languages = ['hr', 'en', 'de', 'it', 'sl']
  markdownByLang: Record<string, string> = {}
  md = new MarkdownIt()

  created () {
    Object.entries(this.object.Stats).forEach(([key, stat]) => {
      try {
        this.parsedStats[+key] = JSON.parse(stat.Data)
      } catch {
        this.parsedStats[+key] = stat.Data
      }
    })
    const val = this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)
    if (typeof val === 'object') {
      this.markdownByLang = { ...val }
    } else {
      this.languages.forEach(lang => {
        this.markdownByLang[lang] = lang === 'hr' ? val : ''
      })
    }
  }

  get markdown (): string {
    return this.markdownByLang[this.currentLang] || ''
  }

  set markdown (val: string) {
    this.markdownByLang[this.currentLang] = val
  }

  get firstLine (): string {
    const val = this.markdownByLang[this.currentLang] || ''
    return val.split('\n').find(line => line.trim() !== '') || ''
  }

  get renderedMarkdown (): string {
    return this.md.render(this.markdown || '')
  }

  openModal () {
    this.showModal = true
  }

  closeModal () {
    this.showModal = false
  }

  saveAndClose () {
    this.regionType.RegionTypes[this.object.Region]
      .ObjectTypes[this.object.ObjectEnum]
      .ChooseSubType(this.object, { ...this.markdownByLang })
    this.closeModal()
  }

  getValue (statEnum: number, indexStatTypeEnum = StatTypeEnum.Option): any {
    if (this.object.Stats[statEnum]) {
      const stat = this.object.Stats[statEnum].Data
      if (this.object.Stats[indexStatTypeEnum] && this.isJSON(stat)) {
        const data = JSON.parse(stat)
        return data[Number(this.object.Stats[indexStatTypeEnum].Data)]
      }
      return stat
    }
    return ''
  }

  isJSON (str: string): boolean {
    try {
      const parsed = JSON.parse(str)
      return typeof parsed === 'object'
    } catch {
      return false
    }
  }

  get validationClass (): string {
    const valid = this.parsedStats[this.statTypeEnum.IsValid]
    const err = this.parsedStats[this.statTypeEnum.ErrorMessage]
    if (valid === undefined || valid === '') return ''
    return valid ? 'is-valid' : (err ? 'is-invalid' : '')
  }

  applyFormat (type: string) {
    const textarea = this.$refs.textarea as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = this.markdown.substring(start, end)
    let formatted = ''

    switch (type) {
      case 'bold': formatted = `**${selectedText || 'bold text'}**`; break
      case 'italic': formatted = `*${selectedText || 'italic text'}*`; break
      case 'code': formatted = `\`${selectedText || 'code'}\``; break
      case 'link': formatted = `[${selectedText || 'link text'}](https://)`; break
      case 'list':
        formatted = selectedText
          ? selectedText.split('\n').map(line => `- ${line}`).join('\n')
          : '- list item'
        break
      case 'quote':
        formatted = selectedText
          ? selectedText.split('\n').map(line => `> ${line}`).join('\n')
          : '> quote'
        break
    }

    this.markdown = this.markdown.substring(0, start) + formatted + this.markdown.substring(end)
    this.$nextTick(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + formatted.length
    })
  }

  applySelectedHeading () {
    if (this.selectedHeading !== null) {
      this.applyHeading(this.selectedHeading)
      this.selectedHeading = 1
    }
  }

  applyHeading (level: number) {
    const textarea = this.$refs.textarea as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = this.markdown.substring(start, end)
    const prefix = '#'.repeat(level) + ' '
    const formatted = prefix + (selectedText || `Heading ${level}`)

    this.markdown = this.markdown.substring(0, start) + formatted + this.markdown.substring(end)
    this.$nextTick(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + formatted.length
    })
  }
}
</script>
