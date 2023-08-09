<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const editor = useEditor({
  content: '<p>Some content here!</p>',
  extensions: [
    StarterKit,
    Image,
  ],
  editorProps: {
    attributes: {
      class: 'prose text-base mx-auto focus:outline-none',
    },
    async handleDrop(view, event, slice, moved) {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
        const file = event.dataTransfer.files[0] // the dropped file
        const filesize = ((file.size / 1024) / 1024).toFixed(4) // get the filesize in MB
        if ((file.type === 'image/jpeg' || file.type === 'image/png') && filesize < 10) { // check valid image type under 10MB
          const _URL = window.URL || window.webkitURL
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            if (this.width > 5000 || this.height > 5000) {
              window.alert('Your images need to be less than 5000 pixels in height and width.') // display alert
            }
            else {
              try {
                // uploadImage(file)
                alert('Not implemented :()')
              }
              catch (err) {
                if (err)
                  window.alert('There was a problem uploading your image, please try again.')
              }
            }
          }
        }
        else {
          window.alert('Images need to be in jpg or png format and less than 10mb in size.')
        }
        return true // handled
      }
      return false // not handled use default behaviour
    },
  },
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
