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
              <div class="row g-3">
                <div class="col-6 d-flex flex-column">
                  <!-- Toolbar -->
                  <!-- Toolbar -->
                  <div class="mb-3 d-flex flex-nowrap gap-2 align-items-center">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('bold')"
                      title="Bold"
                    >
                      <i class="fas fa-bold"></i> Bold
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('italic')"
                      title="Italic"
                    >
                      <i class="fas fa-italic"></i> Italic
                    </button>

                    <div class="input-group input-group-sm" style="width: inherit;">
                      <button
                        class="btn btn-outline-primary dropdown-toggle fancy-button"
                        type="button"
                        id="headingDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
                      >
                        <i class="fas fa-heading"></i> {{ selectedHeading !== null ? `H${selectedHeading}` : '' }}
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="headingDropdown" style="min-width: auto;">
                        <li><a class="dropdown-item" href="#" @click.prevent="selectedHeading = HeadingLevel.H1">H1</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="selectedHeading = HeadingLevel.H2">H2</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="selectedHeading = HeadingLevel.H3">H3</a></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="selectedHeading = HeadingLevel.H4">H4</a></li>
                      </ul>
                      <button
                        class="btn btn-outline-primary fancy-button"
                        type="button"
                        @click="applySelectedHeading"
                        :disabled="selectedHeading === null"
                        style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                    </div>

                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('code')"
                      title="Code"
                    >
                      <i class="fas fa-code"></i> Code
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('link')"
                      title="Link"
                    >
                      <i class="fas fa-link"></i> Link
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('list')"
                      title="List"
                    >
                      <i class="fas fa-list-ul"></i> List
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fancy-button"
                      @click="applyFormat('quote')"
                      title="Quote"
                    >
                      <i class="fas fa-quote-right"></i> Quote
                    </button>
                  </div>

                  <!-- Textarea -->
                  <label for="markdownInput" class="form-label">Markdown Input</label>
                  <textarea
                    id="markdownInput"
                    ref="textarea"
                    v-model="markdown"
                    class="form-control flex-grow-1 fancy-textarea"
                    rows="12"
                    style="resize: none; font-family: monospace;"
                    placeholder="Write your markdown here..."
                  ></textarea>
                </div>

                <!-- Preview -->
                <div class="col-6 border-start overflow-auto preview-area" style="max-height: 500px;">
                  <label class="form-label">Preview</label>
                  <div class="p-3 bg-light rounded fade-preview" v-html="renderedMarkdown" :key="markdown"></div>
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

enum HeadingLevel {
  H1 = 1,
  H2,
  H3,
  H4
}

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
  markdown = ''
  parsedStats: Record<number, any> = {}
  md = new MarkdownIt()
  iconHover = false
  selectedHeading: HeadingLevel | null = HeadingLevel.H1

  created () {
    Object.entries(this.object.Stats).forEach(([key, stat]) => {
      try {
        this.parsedStats[+key] = JSON.parse(stat.Data)
      } catch {
        this.parsedStats[+key] = stat.Data
      }
    })
    this.markdown = this.getValue(StatTypeEnum.Value, StatTypeEnum.ValueIndices)
  }

  get firstLine (): string {
    if (!this.markdown) return ''
    return this.markdown.split('\n').find(line => line.trim() !== '') || ''
  }

  get renderedMarkdown (): string {
    return this.md.render(this.markdown || '')
  }

  get HeadingLevel () {
    return HeadingLevel
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
      .ChooseSubType(this.object, this.markdown)
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
      return Array.isArray(parsed)
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

  applySelectedHeading () {
    if (this.selectedHeading !== null) {
      this.applyHeading(this.selectedHeading)
      this.selectedHeading = HeadingLevel.H1
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fancy-button {
  border-radius: 2rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.fancy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.fancy-select {
  border-radius: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.fancy-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.fancy-textarea {
  min-height: 300px;
  max-height: 500px;
  border-radius: 1rem;
  padding: 1rem;
  background: #f9f9fb;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.fancy-textarea:focus {
  background: #fff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.1);
}

.modal-content {
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header, .modal-footer {
  border: none;
}

.modal-footer .btn-primary.fancy-save-btn {
  border-radius: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.3);
}

.modal-footer .btn-primary.fancy-save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.preview-area {
  border-left: 1px solid #dee2e6 !important;
}

.fade-preview {
  transition: opacity 0.3s;
}

.container.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.fancy-heading-select {
  border: 1px solid #0d6efd;
  color: #0d6efd;
  border-radius: 2rem;
  background: transparent;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  height: calc(1.5em + 0.75rem + 2px);
  transition: all 0.2s ease;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%230d6efd' d='M6 8L0 0h12L6 8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 12px 8px;
}

.fancy-heading-select:focus {
  border-color: #0a58ca;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.fancy-heading-select option {
  color: #000;
}

</style>
