# Project Export

## Project Statistics

- Total files: 14

## Folder Structure

```
components
  TodoList.tsx
lib
  initSupabase.ts
  schema.ts
pages
  api
    hello.ts
  index.tsx
  _app.tsx
  _document.tsx
supabase
  .gitignore
  config.toml
  migrations
    20230712094349_init.sql
tsconfig.json
tailwind.config.js
.env.example

```

### components\TodoList.tsx

```tsx
import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

type Todos = Database['public']['Tables']['todos']['Row']

export default function TodoList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<Todos[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

  const user = session.user

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos, error } = await supabase.from('todos').select('*').order('id', { ascending: true })

      if (error) console.log('error', error)
      else setTodos(todos)
    }

    fetchTodos()
  }, [supabase])

  const addTodo = async (taskText: string) => {
    let task = taskText.trim()
    if (task.length) {
      const { data: todo, error } = await supabase.from('todos').insert({ task, user_id: user.id }).select().single()

      if (error) {
        setErrorText(error.message)
      } else {
        setTodos([...todos, todo])
        setNewTaskText('')
      }
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await supabase.from('todos').delete().eq('id', id).throwOnError()
      setTodos(todos.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12'>MoiMoi.std</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTodo(newTaskText)
        }}
        className='flex gap-2 my-2'
      >
        <input
          className='w-full p-2 rounded'
          type='text'
          placeholder='make coffee'
          value={newTaskText}
          onChange={(e) => {
            setErrorText('')
            setNewTaskText(e.target.value)
          }}
        />
        <button className='btn-black' type='submit'>
          Add
        </button>
      </form>
      {!!errorText && <Alert text={errorText} />}
      <div className='overflow-hidden bg-white rounded-md shadow'>
        <ul>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const Todo = ({ todo, onDelete }: { todo: Todos; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>()
  const [isCompleted, setIsCompleted] = useState(todo.is_complete)

  const toggle = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .update({ is_complete: !isCompleted })
        .eq('id', todo.id)
        .throwOnError()
        .select()
        .single()

      if (data) setIsCompleted(data.is_complete)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <li className='block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-200 focus:outline-none focus:bg-200'>
      <div className='flex items-center px-4 py-4 sm:px-6'>
        <div className='flex items-center flex-1 min-w-0'>
          <div className='text-sm font-medium leading-5 truncate'>{todo.task}</div>
        </div>
        <div>
          <input
            className='cursor-pointer'
            onChange={(e) => toggle()}
            type='checkbox'
            checked={isCompleted ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className='w-4 h-4 ml-2 border-2 rounded hover:border-black'
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

const Alert = ({ text }: { text: string }) => (
  <div className='p-4 my-3 bg-red-100 rounded-md'>
    <div className='text-sm leading-5 text-red-700'>{text}</div>
  </div>
)

```

### components\TodoList.tsx

```tsx
import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

type Todos = Database['public']['Tables']['todos']['Row']

export default function TodoList({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<Todos[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

  const user = session.user

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos, error } = await supabase.from('todos').select('*').order('id', { ascending: true })

      if (error) console.log('error', error)
      else setTodos(todos)
    }

    fetchTodos()
  }, [supabase])

  const addTodo = async (taskText: string) => {
    let task = taskText.trim()
    if (task.length) {
      const { data: todo, error } = await supabase.from('todos').insert({ task, user_id: user.id }).select().single()

      if (error) {
        setErrorText(error.message)
      } else {
        setTodos([...todos, todo])
        setNewTaskText('')
      }
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await supabase.from('todos').delete().eq('id', id).throwOnError()
      setTodos(todos.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className='w-full'>
      <h1 className='mb-12'>MoiMoi.std</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTodo(newTaskText)
        }}
        className='flex gap-2 my-2'
      >
        <input
          className='w-full p-2 rounded'
          type='text'
          placeholder='make coffee'
          value={newTaskText}
          onChange={(e) => {
            setErrorText('')
            setNewTaskText(e.target.value)
          }}
        />
        <button className='btn-black' type='submit'>
          Add
        </button>
      </form>
      {!!errorText && <Alert text={errorText} />}
      <div className='overflow-hidden bg-white rounded-md shadow'>
        <ul>
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const Todo = ({ todo, onDelete }: { todo: Todos; onDelete: () => void }) => {
  const supabase = useSupabaseClient<Database>()
  const [isCompleted, setIsCompleted] = useState(todo.is_complete)

  const toggle = async () => {
    try {
      const { data } = await supabase
        .from('todos')
        .update({ is_complete: !isCompleted })
        .eq('id', todo.id)
        .throwOnError()
        .select()
        .single()

      if (data) setIsCompleted(data.is_complete)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <li className='block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-200 focus:outline-none focus:bg-200'>
      <div className='flex items-center px-4 py-4 sm:px-6'>
        <div className='flex items-center flex-1 min-w-0'>
          <div className='text-sm font-medium leading-5 truncate'>{todo.task}</div>
        </div>
        <div>
          <input
            className='cursor-pointer'
            onChange={(e) => toggle()}
            type='checkbox'
            checked={isCompleted ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className='w-4 h-4 ml-2 border-2 rounded hover:border-black'
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

const Alert = ({ text }: { text: string }) => (
  <div className='p-4 my-3 bg-red-100 rounded-md'>
    <div className='text-sm leading-5 text-red-700'>{text}</div>
  </div>
)

```

### lib\initSupabase.ts

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
)

```

### lib\schema.ts

```ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

```

### pages\api\hello.ts

```ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' })
}

```

### pages\index.tsx

```tsx
import Head from 'next/head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import TodoList from '@/components/TodoList'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='w-full h-full bg-200'>
        {!session ? (
          <div className='flex items-center justify-center min-w-full min-h-screen'>
            <div className='flex items-center justify-center w-full h-full p-4'>
              <div className='flex flex-col w-full h-full max-w-sm p-5 text-base bg-white shadow sm:h-auto sm:w-2/5'>
                <span className='pb-2 mx-4 mb-1 font-sans text-4xl text-center border-b align-center'>Login</span>
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme='dark' />
              </div>
            </div>
          </div>
        ) : (
          <div
            className='flex flex-col items-center justify-center w-full h-full p-4'
            style={{ minWidth: 250, maxWidth: 600, margin: 'auto' }}
          >
            <TodoList session={session} />
            <button
              className='w-full mt-12 btn-black'
              onClick={async () => {
                const { error } = await supabase.auth.signOut()
                if (error) console.log('Error logging out:', error.message)
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  )
}

```

### pages\_app.tsx

```tsx
import { supabase } from '@/lib/initSupabase'
import '@/styles/app.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

```

### pages\_document.tsx

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

```

### supabase\.gitignore

```gitignore
# Supabase
.branches
.temp
.env

```

### supabase\config.toml

*(Unsupported file type)*

### supabase\migrations\20230712094349_init.sql

```sql
create table todos (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  task text check (char_length(task) > 3),
  is_complete boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table todos enable row level security;
create policy "Individuals can create todos." on todos for
    insert with check (auth.uid() = user_id);
create policy "Individuals can view their own todos. " on todos for
    select using (auth.uid() = user_id);
create policy "Individuals can update their own todos." on todos for
    update using (auth.uid() = user_id);
create policy "Individuals can delete their own todos." on todos for
    delete using (auth.uid() = user_id);
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333'
      }
    }
  },
  variants: {},
  plugins: []
}

```

### .env.example

*(Unsupported file type)*
