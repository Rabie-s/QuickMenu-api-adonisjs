import vine from '@vinejs/vine'

export const createMenuItemValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        price:vine.number(),
        description:vine.string().trim(),
        image:vine.file().optional(),
    })
)

export const updateMenuItemValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        price:vine.number(),
        description:vine.string().trim(),
        image:vine.file().optional(),
        is_available:vine.boolean(),
    })
)