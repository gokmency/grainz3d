'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type PresetValues = Record<string, string | number | boolean>

export async function getAllPresets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('presets')
    .select('id, name, model_id, values, is_favorite, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all presets:', error)
    return []
  }

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    modelId: p.model_id,
    values: (p.values as PresetValues) || {},
    isFavorite: p.is_favorite ?? false,
    createdAt: new Date(p.created_at).getTime(),
  }))
}

export async function getPresets(modelId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('presets')
    .select('id, name, values, is_favorite, created_at')
    .eq('user_id', user.id)
    .eq('model_id', modelId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching presets:', error)
    return []
  }

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    values: (p.values as PresetValues) || {},
    isFavorite: p.is_favorite ?? false,
    isDefault: false,
    createdAt: new Date(p.created_at).getTime(),
  }))
}

export async function createPreset(
  modelId: string,
  name: string,
  values: PresetValues
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('presets')
    .insert({
      user_id: user.id,
      model_id: modelId,
      name,
      values,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating preset:', error)
    return { error: error.message }
  }

  revalidatePath('/configurator')
  revalidatePath('/dashboard')
  return { id: data.id }
}

export async function updatePreset(
  presetId: string,
  updates: { name?: string; values?: PresetValues; isFavorite?: boolean }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.values !== undefined) updateData.values = updates.values
  if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite

  const { error } = await supabase
    .from('presets')
    .update(updateData)
    .eq('id', presetId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating preset:', error)
    return { error: error.message }
  }

  revalidatePath('/configurator')
  revalidatePath('/dashboard')
  return {}
}

export async function deletePreset(presetId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', presetId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting preset:', error)
    return { error: error.message }
  }

  revalidatePath('/configurator')
  revalidatePath('/dashboard')
  return {}
}

export async function togglePresetFavorite(presetId: string, isFavorite: boolean) {
  return updatePreset(presetId, { isFavorite })
}
