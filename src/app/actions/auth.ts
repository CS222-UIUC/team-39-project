"use server"
import { SignupFormSchema } from '@/app/lib/definitions'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

// https://nextjs.org/docs/app/building-your-application/authentication#2-validate-form-fields-on-the-server
export async function signup(formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // 2. Prepare data for insertion into database
  const { username, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10) // hash(password, salt)
  
  // 3. Insert the user into the database or call an Auth Library's API
//  if (false) {}
//  const credential = check_user_pwd(username, hashedPassword)
//  if (credential == "no user") {
//    create_user(username, hashedPassword)
//  }
//  else if (credential == "wrong password") {
//    alert("Wrong password")
//  }
//  else {
//    alert("Welcome back, " + username)
//  }
 
  // 4. Create user session
  console.log(username, password)
  await createSession(username)
  console.log(username, password)
  // 5. Redirect user
  redirect('/')
  console.log(username, password)
}
 
export async function logout() {
  deleteSession()
  redirect('/login')
}