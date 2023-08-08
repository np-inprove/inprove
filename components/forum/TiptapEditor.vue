<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Some content here!</p>',
  extensions: [
    StarterKit,
  ],
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
