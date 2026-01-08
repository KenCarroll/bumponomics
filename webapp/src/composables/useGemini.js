import { ref } from 'vue'
import { GoogleGenerativeAI } from "@google/generative-ai"
import contentTree from '@/content.json'

// Shared state for API key
const apiKey = ref(localStorage.getItem('gemini_api_key') || '')
const modelName = ref(localStorage.getItem('gemini_model_name') || 'gemini-1.5-flash')

// Helper to extract all text from the content tree
const getAllText = (nodes) => {
  let text = ""
  for (const node of nodes) {
    if (node.type === 'file' && node.content) {
      text += `--- DOCUMENT: ${node.title} (${node.path}) ---\n${node.content}\n\n`
    }
    if (node.children) {
      text += getAllText(node.children)
    }
  }
  return text
}

// Prepare context once (it's static)
const fullBookContext = getAllText(contentTree)

export function useGemini() {
  const loading = ref(false)
  const error = ref(null)
  
  const setKey = (key) => {
    apiKey.value = key
    localStorage.setItem('gemini_api_key', key)
  }
  
  const setModel = (name) => {
    modelName.value = name
    localStorage.setItem('gemini_model_name', name)
  }
  
  const clearKey = () => {
    apiKey.value = ''
    localStorage.removeItem('gemini_api_key')
  }
  
  const sendMessage = async (userQuery, history = []) => {
    if (!apiKey.value) {
      throw new Error("API Key is missing")
    }

    loading.value = true
    error.value = null
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey.value)
      const model = genAI.getGenerativeModel({ model: modelName.value })
      
      const systemPrompt = `
You are an expert AI assistant for the book "BUMPS: The Mechanics of Problems".
Your goal is to answer user questions based ONLY on the provided book content.
If the answer is not in the context, say "I couldn't find that in the book."
Be helpful, philosophical, and adopt the tone of the book (pragmatic but deep).

BOOK CONTENT:
${fullBookContext}
`
      // Construct chat with history
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am ready to answer questions about BUMPS." }],
          },
          ...history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          }))
        ],
      })

      const result = await chat.sendMessage(userQuery)
      const response = result.response.text()
      
      return response
    } catch (e) {
      console.error("Gemini Error:", e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const debugKey = async () => {
    if (!apiKey.value) throw new Error("No API Key")
    
    // Direct fetch to list models to see what is enabled
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.value}`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || "Failed to list models")
      }
      const data = await response.json()
      return data.models || []
    } catch (e) {
      throw new Error(`Connection Check Failed: ${e.message}`)
    }
  }

  return {
    apiKey,
    modelName,
    loading,
    error,
    setKey,
    setModel,
    clearKey,
    debugKey,
    sendMessage
  }
}
