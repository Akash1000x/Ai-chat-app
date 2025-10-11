export type ModelsCategory = {
  id: string,
  name: string,
  models: Model[],
  slug: string
}

export type Model = {
  id: string,
  name: string,
  slug: string,
  isActive: boolean,
  isPremium: boolean,
  isDefault: boolean,
  categoryId: string
}