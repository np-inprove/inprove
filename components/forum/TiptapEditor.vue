<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'

import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import FloatingMenu from '@tiptap/extension-floating-menu'

interface Props {
  editable?: boolean
  placeholder?: string
  class?: string
  disableProse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
})

const { $cn } = useNuxtApp()

const model = defineModel<string>({ required: false })

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Link,
    FloatingMenu,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  editable: props.editable,
  content: model.value,
  onUpdate() {
    model.value = editor.value?.getHTML()
  },
  editorProps: {
    attributes: {
      class: $cn(
        {
          'prose text-base': !props.disableProse,
        },
        'focus:outline-none',
        props.class,
      ),
    },
  },
})

watch(model, (value) => {
  const isSame = editor.value?.getHTML() === value

  if (isSame)
    return

  // TODO value may be null but is never null
  editor.value?.commands.setContent(value!, false)
})
</script>

<template>
  <div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
