'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type PresetValues = Record<string, string | number | boolean>

export interface PresetItem {
  id: string
  name: string
  modelId: string
  values: PresetValues
  isFavorite?: boolean
  isDefault?: boolean
  createdAt: number
}

const DEMO_PRESETS: PresetItem[] = [
  {
    id: 'preset-demo-1',
    name: 'İskandinav Meşe Minimal',
    modelId: 'model-1',
    values: { width: 750, height: 850, depth: 800, material: 'Natural Oak', cushion: true, color: '#3a4d39' },
    isFavorite: true,
    isDefault: false,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'preset-demo-2',
    name: 'Yönetici Koyu Ceviz',
    modelId: 'model-1',
    values: { width: 850, height: 920, depth: 880, material: 'Dark Walnut', cushion: true, color: '#1c1917' },
    isFavorite: false,
    isDefault: false,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'preset-demo-3',
    name: '8 Kişilik Geniş Yemek Masası',
    modelId: 'model-2',
    values: { length: 2400, width: 1000, height: 750, top_thickness: 40, material: 'Solid White Oak' },
    isFavorite: true,
    isDefault: false,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'preset-demo-4',
    name: 'Spiral Kıvrımlı Porselen',
    modelId: 'model-3',
    values: { height: 420, base_radius: 120, waist_ratio: 0.7, twist: 180, color: '#0284c7', material: 'Glossy Porcelain' },
    isFavorite: true,
    isDefault: false,
    createdAt: Date.now() - 86400000 * 3,
  },
];

export async function getAllPresets(): Promise<PresetItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return DEMO_PRESETS

  const { data, error } = await supabase
    .from('presets')
    .select('id, name, model_id, values, is_favorite, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return DEMO_PRESETS
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    modelId: p.model_id,
    values: (p.values as PresetValues) || {},
    isFavorite: p.is_favorite ?? false,
    createdAt: new Date(p.created_at).getTime(),
  }))
}

export async function getPresets(modelId: string): Promise<PresetItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const fallbackForModel = DEMO_PRESETS.filter(p => p.modelId === modelId)
  if (!user) return fallbackForModel

  const { data, error } = await supabase
    .from('presets')
    .select('id, name, values, is_favorite, created_at')
    .eq('user_id', user.id)
    .eq('model_id', modelId)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return fallbackForModel
  }

  return (data || []).map((p: any) => ({
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
