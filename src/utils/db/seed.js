import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()

async function main() {
    const payload = {
        id: 1,
        username: 'admin',
    };
    const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const chiqoOauth = await prisma.oAuthAccount.create({
        data: {
            email: 'fathoni105@gmail.com',
            provider: 'google',
            token: tokenJwt,
            employee: {
                connect: {
                    id: 62
                }
            }
        },
    })
    console.log({ chiqoOauth })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })