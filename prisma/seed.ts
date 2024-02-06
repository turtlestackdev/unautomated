import {db} from '@/database/client'

async function main() {
    await db.transaction().execute(async (trx) => {
        const user = await trx.insertInto('users').values({
            email: "user@example.org",
            name: "John Doe",
            phone: "+1 (555) 555-5555",
            pronouns: "he/him",
        })
            .returningAll()
            .executeTakeFirstOrThrow();

        await trx.insertInto('user_links').values([
            {
                user_id: user.id,
                url: "https://www.linkedin.com/in/johndoe/",
                type: 'LinkedIn'
            },
            {
                user_id: user.id,
                url: "https://github.com/johndoe",
                type: 'GitHub'
            },
            {
                user_id: user.id,
                url: "https://johndoe.com",
                type: 'Portfolio'
            }
        ]).execute()
    });


}