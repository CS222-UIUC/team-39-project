// from https://react.dev/learn
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import RecipeBookActions from '@/app/components/RecipeBookActions'
import { getRecipeBookList } from '@/app/lib/recipes';
import { logout } from '@/app/actions/auth'
 
export default async function Page() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)
   
    if (!session || !payload) {
        redirect('/login')
    }
    console.log('Fetching books for', payload.username);
    const recipeBooks = await getRecipeBookList(payload.username);

    return (
        <div>
            <h1>Welcome back, {payload.username}!</h1>
            <RecipeBookActions
             initialRecipeBooks={recipeBooks} 
             username={payload.username}/>
            <form action={logout}>
                <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded">
                    Logout
                </button>
            </form>
        </div>
    );
}

/*
TODO:
https://naver.github.io/egjs-flicking/demos

export default () => {
    return <>
      <Flicking>
        <div className="flicking-panel">1</div>
        <div className="flicking-panel nested-wide">
          <Flicking bounce="0" bound={true} nested={true}>
            <div className="flicking-panel">2.1</div>
            <div className="flicking-panel">2.2</div>
            <div className="flicking-panel">2.3</div>
          </Flicking>
        </div>
        <div className="flicking-panel nested-wide vertical">
          <Flicking bounce="0" bound={true} horizontal={false}>
            <div className="flicking-panel">3.1</div>
            <div className="flicking-panel">3.2</div>
            <div className="flicking-panel">3.3</div>
          </Flicking>
        </div>
        <div className="flicking-panel">4</div>
      </Flicking>
    </>
  };
*/
