"use server"
import { getEnvVariable } from '@/app/lib/config';
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
// import { RecipeBook } from '@/app/lib/recipes'
import { createSession, deleteSession } from '@/app/lib/session'
import { SignupFormSchema } from '@/app/lib/definitions'
import Link from 'next/link'
const RECIPE_BOOK_API = getEnvVariable('NEXT_PUBLIC_RECIPEBOOK_API');

