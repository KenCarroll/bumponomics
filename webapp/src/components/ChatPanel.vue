<template>
  <div class="d-flex flex-column fill-height">
    <!-- Header -->
    <v-toolbar color="surface" density="compact" border="b">
      <v-icon color="primary" class="ml-3 mr-2">mdi-robot</v-icon>
      <div class="d-flex flex-column">
        <v-toolbar-title class="text-subtitle-2 font-weight-bold">Ask Bumponomics AI</v-toolbar-title>
        <div class="text-caption text-medium-emphasis" v-if="apiKey">
          Using: {{ modelName }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <!-- Settings Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-cog" size="small" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-subheader>Model Provider</v-list-subheader>
          <v-list-item 
            @click="setModel('gemini-1.5-flash')" 
            :active="modelName === 'gemini-1.5-flash'"
            color="primary"
          >
            <v-list-item-title>Gemini 1.5 Flash (Google)</v-list-item-title>
          </v-list-item>
          <v-list-item 
            @click="setModel('gemini-1.5-pro')" 
            :active="modelName === 'gemini-1.5-pro'"
            color="primary"
          >
            <v-list-item-title>Gemini 1.5 Pro (Google)</v-list-item-title>
          </v-list-item>
          <v-list-item 
            @click="setModel('gemini-pro')" 
            :active="modelName === 'gemini-pro'"
            color="primary"
          >
            <v-list-item-title>Gemini Pro Legacy (Google)</v-list-item-title>
          </v-list-item>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-item @click="clearKey">
            <v-list-item-title class="text-red">Reset API Key</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <!-- Emit close event -->
      <v-btn icon="mdi-close" size="small" @click="$emit('close')"></v-btn>
    </v-toolbar>

    <!-- Content Area -->
    <div class="d-flex flex-column flex-grow-1 overflow-hidden">
      <div class="flex-grow-1 overflow-y-auto pa-4 bg-background">
        
        <!-- State: No Key -->
        <div v-if="!apiKey" class="text-center mt-4">
          <v-icon size="48" color="primary" class="mb-4">mdi-key-variant</v-icon>
          <h3 class="text-h6 mb-2">Setup AI Chat</h3>
          <p class="text-body-2 mb-4 text-medium-emphasis">
            To chat with this book, please enter your free 
            <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-primary font-weight-bold">Gemini API Key</a>.
            <br><span class="text-caption">(It is saved locally on your device)</span>
          </p>
          
          <v-text-field
            v-model="keyInput"
            label="Paste API Key here"
            variant="outlined"
            density="compact"
            type="password"
            hide-details
            class="mb-3"
          ></v-text-field>
          
          <v-btn block color="primary" :disabled="!keyInput" @click="saveKey">
            Save Key
          </v-btn>
        </div>

        <!-- State: Chatting -->
        <div v-else>
          <div v-if="messages.length === 0" class="text-center mt-6 text-medium-emphasis">
            <p>Ask me anything about BUMPS!</p>
            <div class="d-flex flex-wrap justify-center gap-2 mt-4">
              <v-chip size="small" @click="ask('What is a BUMP?')">What is a BUMP?</v-chip>
              <v-chip size="small" @click="ask('Explain game theory')">Game Theory?</v-chip>
            </div>
          </div>

          <div v-for="(msg, i) in messages" :key="i" class="mb-4">
            <div :class="['d-flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
              <div 
                class="pa-3 rounded-lg text-body-2"
                :class="msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface-variant'"
                style="max-width: 85%;"
              >
                <div v-if="msg.role === 'ai'" class="text-caption text-primary font-weight-bold mb-1">
                  Bumponomics AI
                </div>
                {{ msg.text }}
              </div>
            </div>
          </div>

          <div v-if="loading" class="d-flex justify-start mb-4">
             <div class="pa-3 rounded-lg bg-surface-variant">
               <v-progress-circular indeterminate size="20" width="2"></v-progress-circular>
             </div>
          </div>
          
          <div ref="bottomRef"></div>
        </div>

      </div>

      <!-- Input Area -->
      <div class="pa-2 bg-surface border-t" v-if="apiKey">
        <v-text-field
          v-model="userInput"
          placeholder="Type a question..."
          variant="solo-filled"
          hide-details
          density="compact"
          @keyup.enter="send"
          :loading="loading"
          append-inner-icon="mdi-send"
          @click:append-inner="send"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useGemini } from '@/composables/useGemini'

defineEmits(['close'])

const keyInput = ref('')
const userInput = ref('')
const messages = ref([])
const bottomRef = ref(null)

const { apiKey, modelName, setKey, setModel, clearKey, debugKey, loading, sendMessage } = useGemini()

// --- Chat Logic ---
const saveKey = async () => {
  const newKey = keyInput.value.trim()
  setKey(newKey)
  await testConnection()
}

const testConnection = async () => {
  try {
    userInput.value = "Checking available models..."
    const models = await debugKey()
    
    const names = models.map(m => m.name.replace('models/', ''))
    const preferred = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
    
    const valid = preferred.find(p => names.includes(p)) || names.find(n => n.includes('gemini'))
    
    if (valid) {
      setModel(valid)
      messages.value.push({ role: 'ai', text: `✅ Key Works! Available models found. Auto-selected: ${valid}` })
    } else {
      messages.value.push({ role: 'ai', text: `⚠️ Key works, but no standard Gemini models found. Available: ${names.join(', ')}` })
    }
    userInput.value = ""
  } catch (e) {
    messages.value.push({ role: 'ai', text: `❌ Key Error: ${e.message}` })
  }
}

const send = async () => {
  if (!userInput.value.trim() || loading.value) return
  
  const text = userInput.value
  userInput.value = ''
  
  messages.value.push({ role: 'user', text })
  scrollToBottom()
  
  try {
    const response = await sendMessage(text, messages.value)
    messages.value.push({ role: 'ai', text: response })
  } catch (e) {
    messages.value.push({ role: 'ai', text: `Error: ${e.message || e.toString()}` })
  }
  
  scrollToBottom()
}

const ask = (text) => {
  userInput.value = text
  send()
}

const scrollToBottom = async () => {
  await nextTick()
  bottomRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>
