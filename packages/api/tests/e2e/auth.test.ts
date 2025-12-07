import { faker } from "@faker-js/faker"
import { describe, expect, it } from "vitest"
import { auth } from "../../src/lib/auth"

describe("Auth feature integration", () => {
  const email = faker.internet.email()
  const password = faker.internet.password()

  it("create a new user", async () => {
    const res = await auth.api.signUpEmail({
      body: {
        name: faker.person.fullName(),
        email,
        password,
      },
    })
    expect(res.user.id).toBeDefined()
  })

  it("login with the new user", async () => {
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })
    expect(res.token).toBeDefined()
  })

  it("logout the user", async () => {
    const res = await auth.api.signOut({
      headers: {},
    })
    expect(res.success).toBe(true)
  })
})
