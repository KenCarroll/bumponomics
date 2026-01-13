import { describe, it, expect, beforeEach } from 'vitest'
import { useLayout } from '../useLayout'

describe('useLayout', () => {
  let layout

  beforeEach(() => {
    // Re-initialize for each test if state was not global (it is global in the file, so we must be careful or reset it if possible)
    // Since state is defined outside function in useLayout.js, it is a singleton state.
    // We should be aware tests might affect each other.
    layout = useLayout()
    layout.closeRightDrawer() // Reset state
  })

  it('starts with closed drawer', () => {
    expect(layout.rightDrawerOpen.value).toBe(false)
  })

  it('opens drawer when toggling a tab', () => {
    layout.toggleRightDrawer('chat')
    expect(layout.rightDrawerOpen.value).toBe(true)
    expect(layout.rightTab.value).toBe('chat')
  })

  it('closes drawer when toggling the same tab', () => {
    layout.toggleRightDrawer('chat') // open
    expect(layout.rightDrawerOpen.value).toBe(true)
    
    layout.toggleRightDrawer('chat') // close
    expect(layout.rightDrawerOpen.value).toBe(false)
  })

  it('switches tab without closing if different tab is clicked', () => {
    layout.toggleRightDrawer('chat')
    expect(layout.rightTab.value).toBe('chat')
    
    layout.toggleRightDrawer('comments')
    expect(layout.rightDrawerOpen.value).toBe(true)
    expect(layout.rightTab.value).toBe('comments')
  })

  it('closes drawer explicitly', () => {
    layout.toggleRightDrawer('chat')
    expect(layout.rightDrawerOpen.value).toBe(true)
    
    layout.closeRightDrawer()
    expect(layout.rightDrawerOpen.value).toBe(false)
  })
})
