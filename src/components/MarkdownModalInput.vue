<template>
  <div>
    <!-- Constrain initial bar width inside Bootstrap container -->
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
                <div class="col-6">
                  <label class="form-label">Markdown Input</label>
                  <textarea
                    v-model="markdown"
                    class="form-control"
                    rows="20"
                    style="resize: vertical"
                    placeholder="Write your markdown here..."
                  />
                </div>
                <div class="col-6 border-start overflow-auto preview-area" style="max-height: 500px;">
                  <label class="form-label">Preview</label>
                  <div class="p-3 fade-preview" v-html="renderedMarkdown" :key="markdown"></div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">Close</button>
              <button class="btn btn-primary" @click="saveAndClose">Save</button>
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
  markdown = ''
  parsedStats: Record<number, any> = {}
  md = new MarkdownIt()
  iconHover = false

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
}
</script>

<style scoped>
.modal-dialog{
  margin-top: 0.25%;
}
.modal{
  overflow: hidden;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

textarea.form-control {
  font-family: monospace;
  border-radius: 0.5rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

textarea.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.modal-content {
  border-radius: 1rem;
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.15);
}

.preview-area {
  background: #f8f9fa;
  border-left: 1px solid #dee2e6 !important;
  border-radius: 0 0.5rem 0.5rem 0;
}

.fade-preview {
  transition: opacity 0.3s;
}

.container.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

.modal-footer .btn-primary {
  box-shadow: 0 0.5rem 1rem rgba(0, 123, 255, 0.2);
  transition: transform 0.2s;
}

.modal-footer .btn-primary:hover {
  transform: translateY(-2px);
}
</style>
