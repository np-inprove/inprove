<script setup lang="ts">
import { generateHTML, generateJSON } from '@tiptap/html'

import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import FloatingMenu from '@tiptap/extension-floating-menu'

interface Props {
  placeholder?: string
  class?: string
  disableProse?: boolean
  content?: string
}

const props = defineProps<Props>()

const extensions = [
  StarterKit,
  Image,
  Link,
  FloatingMenu,
  Placeholder.configure({
    placeholder: props.placeholder,
  }),
]
const json = generateJSON(props.content ?? '', extensions)
const html = generateHTML(json, extensions)
</script>

<template>
  <div text-base prose focus:outline-none v-html="html" />
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
