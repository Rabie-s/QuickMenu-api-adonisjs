import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
    vine.object({
        fullName: vine.string().trim(),
        email: vine.string().trim().email().unique(async (db, value) => {
            const user = await db
                .from('users')
                .where('email', value)
                .first()
            return !user
        })
            .normalizeEmail(),
        password: vine.string().trim().minLength(8),
        phoneNumber: vine.string().unique(async (db, value) => {
            const user = await db
              .from('users')
              .where('phone_number', value)
              .first()
            return !user
          })
    .trim()
    })
)

export const loginUserValidator = vine.compile(
    vine.object({
        email: vine.string().trim().normalizeEmail(),
        password: vine.string().trim().minLength(8),
    })
)